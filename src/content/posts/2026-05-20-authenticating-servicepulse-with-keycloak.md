---
id: 20260520
author: Dennis van der Stelt
title: 'Authenticating ServicePulse with Keycloak, Part 1: setting the stage'
description: ServiceControl 6.13 lets ServicePulse sit behind any OpenID Connect identity provider. This series wires it to Keycloak in Docker, end to end, on a home server.
pubDate: '2026-05-20T02:00:00'
image: /images/2026/authenticating-servicepulse-with-keycloak/header01.webp
topic: servicepulse-oidc
tags:
  - oidc
  - keycloak
  - servicepulse
  - servicecontrol
  - docker
---

For most of ServicePulse's life, keeping people out was something you did outside ServicePulse. The documented option was a reverse proxy doing Windows Authentication against Active Directory. The undocumented options were everything else a reverse proxy can do: basic auth, an OAuth2 forward-auth proxy, client certificates, an IP allowlist, a VPN. They all worked, and they all shared one trait: the ServiceControl API behind the proxy was unauthenticated and trusted whoever reached it. The trust boundary lived at the edge of the network.

ServiceControl 6.13 moves that boundary inwards. ServicePulse now speaks OpenID Connect, the API validates a <abbr data-tooltip="JSON Web Token: a short, signed string the identity provider issues after login. The application validates the signature and the claims inside (issuer, audience, expiration) without calling back to the provider.">JWT</abbr> on every request, and any OIDC identity provider can sit between the browser and the dashboard. The reverse proxy is still there terminating TLS, but it stops being the only line of defence.

This is the first post in a short series that wires up that flow end to end. By the time we're done, opening ServicePulse in a browser will bounce the user to a Keycloak login page, and a successful login will land them back inside ServicePulse with a JWT attached to every API call. Everything runs in Docker. The reverse proxy in front of it handles TLS. The setup happens to live on my home server, but nothing in the recipe depends on that.

## What the series builds

The series covers two identity providers, with this post as the shared overview. Pick the path that fits.

- Part 1 (this one): the architecture, a brief OIDC primer, the prerequisites, and one RabbitMQ housekeeping step.
- Parts 2-4: the **Keycloak** path. A Keycloak <abbr data-tooltip="A Keycloak realm is an isolated workspace for users, roles, and client applications. Each realm has its own users and configuration; nothing crosses between realms unless you configure it to.">realm</abbr> with a client scope and the audience mapper that catches every first-time setup, then ServiceControl wired in, then a troubleshooting catalogue and a list of what the POC deliberately leaves out for production.
- Parts 5-6: the **Duende IdentityServer** path. A minimal ASP.NET Core app hosting Duende, configured for the same `servicecontrol-api` audience as the Keycloak path, then ServiceControl wired into it. Same four env vars on the ServiceControl side as Part 3, repointed.

Parts 2-4 and Parts 5-6 are independent. Read either subset; this post is the only shared prerequisite.

Companion code lives at [samples/2026/authenticating-servicepulse-with-keycloak](https://github.com/dvdstelt/weblog/tree/main/samples/2026/authenticating-servicepulse-with-keycloak) and [samples/2026/authenticating-servicepulse-with-duende](https://github.com/dvdstelt/weblog/tree/main/samples/2026/authenticating-servicepulse-with-duende), one folder per path. Each ships a self-contained compose file you can clone, edit `.env`, and bring up.

## The shape of the thing

![Architecture: the browser talks HTTPS to a reverse proxy, which forwards HTTP to Keycloak and to ServiceControl; ServiceControl hosts the integrated ServicePulse and talks to an audit instance, RavenDB, and the existing RabbitMQ container.](/images/2026/authenticating-servicepulse-with-keycloak/architecture.svg)

Two HTTPS hostnames terminate at the reverse proxy. One forwards to Keycloak, one forwards to ServiceControl. TLS stops at the proxy and plain HTTP carries on inside the docker network, because nothing else has any business decrypting traffic and the proxy is already doing that work. ServicePulse used to ship as a separate container; in 6.13 it's hosted directly by ServiceControl, so the same hostname that fronts the API serves the dashboard.

The new containers sit on a private bridge network, `auth-net`. ServiceControl and the audit instance also attach to whatever network the existing RabbitMQ container is on, because that's the cheapest way to give them name-based connectivity without exposing ports on the host.

## OIDC in 90 seconds

OpenID Connect is a thin login layer on top of OAuth 2.0. For the purposes of this series, three terms carry the weight.

The *authority* is the URL of the identity provider's realm. For Keycloak running at `kc.<yourdomain>`, the authority is `https://kc.<yourdomain>/realms/particular`. Hit that URL with `/.well-known/openid-configuration` appended and Keycloak returns a JSON document listing every endpoint a client needs. ServiceControl reads that document at startup to learn where to validate tokens; ServicePulse reads it in the browser to learn where to send the user for the login form.

The *audience* is the value of the `aud` claim inside an access token. It says who the token is meant for. ServiceControl checks every incoming token against a fixed audience value, we'll use `servicecontrol-api`, and rejects anything that doesn't match. The audience is set by the identity provider when the token is issued; getting Keycloak to put the right value there is the single most-skipped step in setting this up, and Part 2 spends real time on it.

*PKCE*, Proof Key for Code Exchange, is how a single-page app that can't keep a client secret still pulls off the OAuth authorization code flow safely. Before the browser sends the user to the login page, it generates a random secret, hashes it, and includes the hash in the redirect. When the browser comes back with a code and exchanges it for a token, it has to present the original secret. An attacker who intercepts the code can't redeem it without the secret they never saw. ServicePulse handles this end of it automatically. We configure the client in Keycloak to require it.

## What you need before Part 2

A box that can run Docker, with enough memory for Keycloak, RavenDB, ServiceControl, and an audit instance to coexist. Two gigabytes is tight but works for a POC.

A reverse proxy in front that terminates TLS and forwards the `X-Forwarded-*` headers. The series uses Nginx Proxy Manager because I happen to run it on the same host, but Traefik, Caddy, or stock nginx are equally fine. Anything that hands the upstream the original protocol and host via standard forwarded headers is enough.

Two DNS records pointed at the host, one per service. The forward host and port columns are what the reverse proxy needs to know about each container; the values come straight out of `docker-compose.yml`:

| Domain                | Forward host    | Port    |
| --------------------- | --------------- | ------- |
| `kc.<yourdomain>`   | `<host-ip>`     | `8080`  |
| `sc.<yourdomain>`   | `<host-ip>`     | `33333` |

`<host-ip>` is the Docker host's LAN address, whatever your reverse proxy uses to talk to other services on the same host. The compose file publishes both ports on that host, so any proxy on the LAN can forward to them by IP, regardless of which docker network the proxy runs on. Readers with a more involved topology (the proxy in front of a load balancer, the proxy living on a separate machine, container-name resolution preferred) will know which knob to turn; this baseline keeps the stack independent of the proxy's setup.

The DNS records don't have to be public. On my setup they only resolve from inside Tailscale; the rest of the world can't reach the server at all. Replace Tailscale with public DNS plus a publicly reachable proxy and the recipe is unchanged.

A RabbitMQ instance, already up and running on the same Docker host, with its AMQP port exposed (the default `5672`). The series assumes you've already got one in place; we don't bring up a new RabbitMQ container here. ServiceControl will reach it through `host.docker.internal` rather than by joining its docker network, so the existing RabbitMQ compose file stays untouched. We'll dedicate a vhost and a user to this stack so it can't step on whatever else RabbitMQ is doing.

A Particular Software license, optional but recommended. ServiceControl starts and serves requests without one, but most of its functionality is limited until a license is in place. A free trial license unlocks everything for the duration of the trial and is what this series assumes. The compose file accepts the license either as an env var or as a mounted file.

## A clean slot in RabbitMQ

ServiceControl uses RabbitMQ to read error and audit messages from its source queues, plus a handful of internal queues for retry orchestration. Letting it share a vhost with an existing application is technically possible, but the queue names start with `error` and `audit` and that's exactly the kind of collision that takes thirty minutes to diagnose. Give it its own vhost.

On the RabbitMQ container, with management plugin enabled:

```bash
# Create a vhost for the POC
docker exec <your-rabbit-container> rabbitmqctl add_vhost auth-poc

# Create a user the new ServiceControl will use
docker exec <your-rabbit-container> rabbitmqctl add_user auth-poc 'a-real-password-please'

# Grant it full access inside the vhost only
docker exec <your-rabbit-container> rabbitmqctl set_permissions -p auth-poc auth-poc '.*' '.*' '.*'

# Allow it to call RabbitMQ's management API. ServiceControl 6.14+
# verifies broker capabilities through that API on startup; without
# the tag, the call returns 401 and SC exits.
docker exec <your-rabbit-container> rabbitmqctl set_user_tags auth-poc administrator
```

The user `auth-poc` can read and write everything inside `auth-poc`, and nothing outside it. The `administrator` tag is the extra bit that grants management-API access — RabbitMQ keeps that permission separate from AMQP permissions, so a user with full vhost rights but no tag will still be rejected by the management endpoints. `monitoring` works too if you want a read-only tag for production; for the POC `administrator` keeps the troubleshooting story simple. When `.env.example` later asks for a RabbitMQ connection string, this is what feeds into it.

The connection string itself uses `host.docker.internal` rather than the RabbitMQ container's name. The ServiceControl and audit services in [docker-compose.yml](https://github.com/dvdstelt/weblog/blob/main/samples/2026/authenticating-servicepulse-with-keycloak/docker-compose.yml) carry an `extra_hosts: ["host.docker.internal:host-gateway"]` entry, which maps the magic hostname to the Docker host gateway from inside the container on Linux, matching Docker Desktop's default on macOS and Windows. The trade-off: traffic crosses the host's loopback rather than staying on a private bridge, which is fine on a single-host POC and worth revisiting in production.

That's all the preparation. In Part 2 we bring up Keycloak on its own, set up the realm, and walk through the client scope and audience mapper that make every subsequent step actually work.

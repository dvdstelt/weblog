---
id: 20260523
author: Dennis van der Stelt
title: 'Authenticating ServicePulse with Keycloak, Part 4: when OIDC goes wrong, and what the POC leaves out'
description: The error messages every first-time setup hits, what each one actually means, the fix, and the list of things that need to change before this configuration leaves the lab.
pubDate: '2026-05-23T01:00:00'
image: /images/2026/authenticating-servicepulse-with-keycloak/header04.webp
topic: keycloak-oidc
tags:
  - oidc
  - keycloak
  - servicecontrol
  - troubleshooting
  - production
---

Three posts in, the setup works end to end. The browser hits ServicePulse, gets redirected to Keycloak, logs in, and lands back in the dashboard with a <abbr data-tooltip="JSON Web Token: a short, signed string the identity provider issues after login. The application validates the signature and the claims inside (issuer, audience, expiration) without calling back to the provider.">JWT</abbr> attached to every API call. That's the happy path. The first time anyone does this, the happy path takes a while to find. This is the post that catalogues the wrong turns: the four error messages that come up most often, what each one actually means, and how to get past it. The second half lists what this configuration deliberately is not ready to do in production, because a POC that handles authentication is still a POC.

If you arrived here straight from a search engine, the previous three posts cover the setup itself: [the plan](/2026/05/20/authenticating-servicepulse-with-keycloak/), [the Keycloak side](/2026/05/21/keycloak-realm-scope-and-audience-mapper/), and [plugging ServiceControl in](/2026/05/22/plugging-servicecontrol-into-keycloak/).

## "Invalid audience" on every API call

The ServiceControl log shows `Bearer token validation failed: invalid audience`. ServicePulse loads, redirects to Keycloak, logs the user in, comes back, and then every XHR call returns `401`. The dashboard sits there showing nothing.

This is almost always the <abbr data-tooltip="The 'aud' field inside a JWT, naming who the token is meant for. ServiceControl rejects any token whose audience isn't what it expects.">audience</abbr> mapper from [Part 2](/2026/05/21/keycloak-realm-scope-and-audience-mapper/#the-audience-mapper). Either it's missing, or its *Add to access token* toggle is off, or the *Included Custom Audience* value isn't an exact match for `SERVICECONTROL_AUTHENTICATION_AUDIENCE`. The fastest way to see what Keycloak is actually issuing: in the admin console, Clients → `servicepulse` → Client scopes → Evaluate, pick the test user, then click *Generated access token* on the right. The `aud` claim is in the JSON Keycloak shows. It's typically an array, and `servicecontrol-api` needs to be one of the entries. If the array is missing `servicecontrol-api` or `aud` reads only `servicepulse`, the mapper isn't writing to the access token. If it reads the right value, the env var on ServiceControl is the place to check, including whitespace.

A subtler cause: the `servicecontrol-api` scope is attached to the client as *Optional* instead of *Default*. ServicePulse does request the scope by name, so this technically works, but every change in how the SPA sends its authorization request becomes a place this can quietly break. Move it to Default on the client's *Client scopes* tab and the problem stops being a problem.

## Every redirect ends up at localhost

The browser opens ServicePulse, gets redirected, and lands on `http://localhost:8080/realms/particular/...` with a connection-refused error. Or worse, the redirect works, the login form appears, and the *next* hop after login goes to localhost.

Keycloak is generating absolute URLs against the hostname it sees from its own perspective, not the one the browser sees. The `KC_HOSTNAME` environment variable isn't taking effect, usually because `KC_HOSTNAME_STRICT_HTTPS` is off and Keycloak is falling back to inspecting the request, or because the reverse proxy isn't forwarding `X-Forwarded-Proto` and `X-Forwarded-Host`.

Two places to look. In the running Keycloak container, `docker exec auth-keycloak env | grep KC_` should show `KC_HOSTNAME` and `KC_PROXY_HEADERS=xforwarded`. In the reverse proxy, confirm both forwarded headers are being added. With Nginx Proxy Manager, that's automatic. With stock nginx, the `proxy_set_header X-Forwarded-Proto $scheme;` and `proxy_set_header X-Forwarded-Host $host;` directives are not optional.

Verifying the result is direct: visit `https://kc.<yourdomain>/realms/particular/.well-known/openid-configuration` in a browser. The `issuer` field in the response should read `https://kc.<yourdomain>/realms/particular`. If it says `http://localhost:8080/...`, none of the rest will work.

## The proxy returns 502, no logs in ServiceControl

The browser sees `502 Bad Gateway`. Nothing reaches ServiceControl; its log is silent. The reverse proxy log shows `connect() failed (113: No route to host)` or `host not found in upstream`.

The proxy can't reach the host IP and port the proxy host is configured to forward to. Three things to check, in order:

The compose file publishes `8080` (Keycloak) and `33333` (ServiceControl) on the Docker host. Confirm those are actually listening from a shell on the host:

```bash
ss -tlnp | grep -E '8080|33333'
```

If they aren't there, the stack didn't come up; check `docker compose ps`. If they are, hit them locally: `curl -I http://localhost:33333/api/configuration` should return a `200`. If that works, the stack is fine and the proxy is the problem.

From inside the proxy container, the host IP that the proxy host is configured against has to be reachable. If your proxy is itself in Docker, `<host-ip>` is your LAN-facing address; not `127.0.0.1` (that points at the proxy container's own loopback), not `host.docker.internal` unless the proxy has `extra_hosts: ["host.docker.internal:host-gateway"]`. Test from inside the proxy:

```bash
docker exec <your-proxy-container> curl -I http://<host-ip>:33333/api/configuration
```

A `200` here and a `502` from the browser usually means the proxy host configuration in the UI doesn't match what works on the command line.

## ServiceControl exits with a 401 from RabbitMQ's management API

OIDC is set up correctly, the discovery document loads, and then the container crashes with:

```text
System.InvalidOperationException: There was a problem accessing the RabbitMQ
management API while initializing the transport.
 ---> System.Net.Http.HttpRequestException: Response status code does not
       indicate success: 401 (Unauthorized).
```

The stack trace points at `NServiceBus.Transport.RabbitMQ.ManagementApi.ManagementClient`. ServiceControl 6.14+ talks to RabbitMQ's management API on port `15672` at startup to verify broker capabilities. RabbitMQ keeps that permission separate from AMQP permissions: a user can have full vhost rights (`set_permissions`) and still get rejected by management endpoints. The fix is the user tag:

```bash
docker exec <your-rabbit-container> rabbitmqctl set_user_tags auth-poc administrator
```

`administrator` grants everything, which is fine for the POC. In production use `monitoring` for a read-only tag, or `management` for the limited UI/API role. Whichever you pick, RabbitMQ applies the tag immediately, no restart needed; just rerun `docker compose up -d auth-servicecontrol`.

## ServicePulse crashes on load with "Unexpected token ... is not valid JSON"

The backend is healthy, the browser reaches `https://sc.<yourdomain>`, the dashboard tries to load, and the browser console shows:

```text
Failed to authenticate on app load:
SyntaxError: Unexpected token 'o', "openid pro"... is not valid JSON
    at JSON.parse (<anonymous>)
    at u (AuthStore.ts:49:27)
```

`SERVICECONTROL_AUTHENTICATION_SERVICEPULSE_APISCOPES` is being parsed as space-separated text when ServicePulse expects a JSON-encoded array. ServiceControl passes the value through to the browser verbatim via `/api/configuration`, and ServicePulse calls `JSON.parse` on it. The value has to be JSON. In `.env`:

```env
OIDC_SERVICEPULSE_APISCOPES=["openid","profile","email","servicecontrol-api"]
```

And in `docker-compose.yml` the env var line needs single quotes around the substitution so YAML doesn't reinterpret the brackets as a flow sequence:

```yaml
SERVICECONTROL_AUTHENTICATION_SERVICEPULSE_APISCOPES: '${OIDC_SERVICEPULSE_APISCOPES}'
```

Restart `auth-servicecontrol`, reload the browser, and the redirect to Keycloak should appear in place of the JSON parse error.

## Console fills with `localhost:33633` connection-refused errors after login

You're in, ServicePulse loads, the dashboard renders, but the browser console scrolls a wall of:

```text
GET http://localhost:33633/ net::ERR_CONNECTION_REFUSED
GET http://localhost:33633/monitored-endpoints/disconnected net::ERR_CONNECTION_REFUSED
```

ServicePulse polls a ServiceControl Monitoring instance on `33633` by default, and there isn't one in this stack. The integrated ServicePulse reads the same env vars as the standalone container, so it honours the `MONITORING_URL` value if set. The setting accepts a special sentinel: `MONITORING_URL=!` tells ServicePulse to drop monitoring entirely and stop polling. In `docker-compose.yml` on the `auth-servicecontrol` service:

```yaml
environment:
  MONITORING_URL: "!"
```

Restart the container and the noise goes away. The monitoring tiles disappear from the dashboard as well, which is the right answer when no Monitoring instance is running. If you later add a `particular/servicecontrol-monitoring` container to the stack, swap `!` for its URL (`http://auth-servicecontrol-monitoring:33633/` if it joins `auth-net`) and the tiles come back.

## ServiceControl won't start, exits with discovery error

ServiceControl exits within seconds of starting. The log ends with something like `Unable to retrieve OIDC configuration from https://kc.<yourdomain>/.well-known/openid-configuration` or `The remote certificate is invalid according to the validation procedure`.

ServiceControl fetches the discovery document on startup and refuses to run if it can't. Two common reasons:

The first is the obvious one: Keycloak isn't reachable yet. `docker compose ps` should show `auth-keycloak` as `running` and the health check (if any) green. If it's still starting, ServiceControl's `depends_on` doesn't wait for it; the simplest workaround is to bring Keycloak up alone first, wait for it to settle, then bring the rest up.

The second is TLS. ServiceControl's authority is `https://...`, and the certificate the reverse proxy presents has to be one ServiceControl trusts. On a private domain with a self-signed certificate, ServiceControl rejects the cert and the discovery fetch fails. Three options: use a real public certificate (Let's Encrypt is free and works on private DNS as long as you can answer the DNS-01 challenge), mount the CA root into the ServiceControl container's trust store, or, for the POC only, set the authority URL to the internal container hostname over HTTP. The third option compromises HTTPS metadata enforcement and isn't suitable beyond a POC.

## What this POC leaves out

Everything above gets a setup to *working*. None of it gets it to *production*. Before this configuration lives anywhere other than a home lab, a short list of things has to change.

Keycloak is running `start-dev` against an embedded H2 database. That's explicit dev mode; Keycloak refuses to start in production mode without TLS, a hostname, and an external database. Switching to production mode means swapping H2 for PostgreSQL (or MySQL or Oracle), pinning a Keycloak version rather than tracking minor releases, and reviewing every `KC_*` environment variable against [Keycloak's all-config reference](https://www.keycloak.org/server/all-config). The compose file in the sample repo intentionally stops short of this so the POC stays small.

Secrets are in environment variables. The Particular Software license, the Keycloak admin password, the RabbitMQ password, all sit in `.env`. That file should never be checked in (the sample repo's `.gitignore` excludes it), and on a real host it should live in something that handles rotation: Docker secrets, Vault, the orchestrator's secret store, anything other than a checked-in `.env`.

ServiceControl authorization is all-or-nothing today. A valid token gets full access to every API endpoint. There's no read-only role, no per-instance partitioning, no group-based access control. Anyone in the <abbr data-tooltip="A Keycloak realm is an isolated workspace for users, roles, and client applications. Each realm has its own users and configuration; nothing crosses between realms unless you configure it to.">realm</abbr> who can log in can drain queues, retry messages, and see the message graph. Fine-grained authorization is on the roadmap; until then, this is a place to be careful about who has accounts in the realm.

The RavenDB instance has no backups configured, and the H2 file behind Keycloak isn't backed up either. Both stores hold operational data that gets re-derivable in theory and painful to lose in practice. RavenDB has [a documented backup workflow](https://ravendb.net/docs/article-page/latest/csharp/server/ongoing-tasks/backup-overview); even a nightly `docker exec` running a snapshot to a mounted volume is a long way ahead of nothing.

RabbitMQ traffic between ServiceControl and the existing RabbitMQ container is plain AMQP. That's acceptable on a private docker network and unacceptable across any network you don't control. Production setups use AMQPS with mutual TLS, or terminate AMQP behind a connection mesh that handles transport security separately.

Finally, the images in the compose file are pinned to major-version tags (Particular's `:6`, Keycloak's `:26`). That's the middle path for a tutorial: fresh enough that the sample doesn't go stale in six months, loose enough that a minor or patch upgrade can still slip in a breaking change. In a real deployment, pin the exact version (or the image digest) and update intentionally.

Once those gaps are closed, the same architecture that's been running this series carries over unchanged. The four env vars from [Part 3](/2026/05/22/plugging-servicecontrol-into-keycloak/#what-servicecontrol-needs-to-know) are the same four. The audience mapper from [Part 2](/2026/05/21/keycloak-realm-scope-and-audience-mapper/#the-audience-mapper) is the same mapper. Everything else is the kind of hardening that's worth doing once and not thinking about again.

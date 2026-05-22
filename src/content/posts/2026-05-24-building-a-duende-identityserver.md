---
id: 20260524
author: Dennis van der Stelt
title: 'Authenticating ServicePulse with Duende IdentityServer: building the server'
description: A minimal ASP.NET Core app embedding Duende IdentityServer, configured for the same servicecontrol-api audience the Keycloak path uses. Same SPA flow, different IdP, more code.
pubDate: '2026-05-24T01:00:00'
image: /images/2026/authenticating-servicepulse-with-duende/header01.webp
topic: servicepulse-oidc
tags:
  - oidc
  - duende
  - identityserver
  - dotnet
  - docker
---

[Part 1](/2026/05/20/authenticating-servicepulse-with-keycloak/) of this series laid out the architecture and the <abbr data-tooltip="OpenID Connect: an authentication layer built on top of OAuth 2.0. The identity provider issues signed tokens that applications validate on every request.">OIDC</abbr> primer; Parts 2 to 4 walked the <abbr data-tooltip="An open-source identity provider that runs as its own server with an admin console and a database for users, clients, and configuration. The series' first IdP option, covered in Parts 2-4.">Keycloak</abbr> path. This post starts a second walkthrough of the same problem, with a different identity provider: Duende IdentityServer. If you arrived here from a search engine, Part 1 is the only prerequisite; the four ServiceControl env vars on the SPA side are the same, and so is the <abbr data-tooltip="The 'aud' field inside a JWT, naming who the token is meant for. ServiceControl rejects any token whose audience isn't what it expects.">audience-claim</abbr> concept that's at the heart of every "invalid audience" 401.

The big shift versus Keycloak is what the <abbr data-tooltip="Identity provider. The service that authenticates users and issues access tokens; in this series, either Keycloak or Duende IdentityServer.">IdP</abbr> *is*. Keycloak is a turnkey server with an admin console; you point a container at a database and click through a realm. Duende IdentityServer is a NuGet library that you embed in an ASP.NET Core app you write yourself. There's no container Duende ships and runs for you, no admin UI out of the box, no managed user store. You get a small set of building blocks and you build the server. The trade is more control and more code in exchange for the UI convenience.

License-wise, Duende is free for development, test, and personal projects, and paid for production deployments. For everything in this series the free dev licence covers it. Production tiers start at $1,500/year; see [Duende's pricing](https://duendesoftware.com/products/identityserver) for the breakdown.

## A small ASP.NET Core app

The starting point is the `dotnet new isinmem` template, part of `Duende.IdentityServer.Templates`. It scaffolds a Razor Pages-based ASP.NET Core project with in-memory client and scope configuration, a basic login/consent/logout UI, and a `TestUsers` list. We've checked the result into the sample folder so you can clone the repo and follow along; the structure under [samples/2026/authenticating-servicepulse-with-duende/IdentityServer/](https://github.com/dvdstelt/weblog/tree/main/samples/2026/authenticating-servicepulse-with-duende/IdentityServer) is what the template gives you, plus the customisations described below.

The project file pins .NET 10 and pulls in two packages, the IdentityServer library and Serilog:

```xml file="samples/2026/authenticating-servicepulse-with-duende/IdentityServer/IdentityServer.csproj"
```

`Duende.IdentityModel` is referenced explicitly to keep its version aligned with what `Duende.IdentityServer` 7.4 transitively expects. Serilog ships with the template; it's nice to have but not load-bearing.

## The configuration that matters

Two things in `Config.cs` carry the weight of this whole post.

The first is the `ApiResource`. This is the Duende equivalent of Keycloak's audience mapper from [Part 2](/2026/05/21/keycloak-realm-scope-and-audience-mapper/#the-audience-mapper). When a client requests an `ApiScope` that belongs to an `ApiResource`, the access token Duende issues carries the resource's name in its `aud` claim:

```csharp file="samples/2026/authenticating-servicepulse-with-duende/IdentityServer/Config.cs" region="ApiResources"
```

`Scopes = { "servicecontrol-api" }` ties the scope (also called `servicecontrol-api` in our `ApiScopes` collection) to this resource. From the ServiceControl-side env vars, `SERVICECONTROL_AUTHENTICATION_AUDIENCE` will be set to the same string. If the resource name and the audience env var don't match exactly, ServiceControl rejects every token with `invalid audience`, the same failure mode as the Keycloak mapper getting the value wrong.

The second is the `servicepulse` client. Same shape as the Keycloak client from Part 2: public (no secret), authorization code with PKCE, redirect URIs pointed at ServicePulse:

```csharp file="samples/2026/authenticating-servicepulse-with-duende/IdentityServer/Config.cs" region="Clients"
```

`RedirectUris`, `PostLogoutRedirectUris`, and `AllowedCorsOrigins` all read their value from configuration (set via `SERVICEPULSE_URL` in the compose `.env`) instead of being hard-coded. `RequirePkce = true` enforces <abbr data-tooltip="Proof Key for Code Exchange: a way for a public client like a single-page app to use the OAuth authorization code flow safely, since it can't keep a client secret.">PKCE</abbr> on every authorization request; PKCE is the default in Duende for code-flow clients but it's worth stating explicitly so the code reads as a checklist.

The full `Config.cs` also defines the `IdentityResource`s (`openid`, `profile`, `email`) and the `ApiScope` (`servicecontrol-api`) the client requests. Both are short and uninteresting; the file in the repo has them.

## Behind a reverse proxy

The same problem as Keycloak's `KC_HOSTNAME`: the browser hits `https://is.<yourdomain>/`, but inside the container the request looks like `http://auth-identityserver:8080/`. Without help, Duende builds its discovery document, redirect URLs, and issuer claim against the internal hostname, and the whole flow breaks.

ASP.NET Core has built-in middleware for exactly this. Forwarded headers, configured to honour the `X-Forwarded-Proto` and `X-Forwarded-Host` that the reverse proxy adds, make every downstream component see the request URL as the browser sent it:

```csharp file="samples/2026/authenticating-servicepulse-with-duende/IdentityServer/HostingExtensions.cs" region="ForwardedHeaders"
```

The empty `KnownIPNetworks` and `KnownProxies` mean "trust any proxy". Fine for the POC; in production, narrow this to the IP range your reverse proxy actually sits on.

## A Dockerfile

Standard multi-stage build against the official .NET 10 SDK and ASP.NET runtime images:

```dockerfile file="samples/2026/authenticating-servicepulse-with-duende/IdentityServer/Dockerfile"
```

The resulting image is around 230 MB. The chiseled and distroless variants of `mcr.microsoft.com/dotnet/aspnet:10.0` shave that further if image size matters; for a POC, the default works.

A `.dockerignore` next to the Dockerfile excludes `bin/` and `obj/` from the build context. Without it, the `COPY . .` step overwrites the freshly-restored `/src/obj/` with the host's stale `obj/`, whose `project.assets.json` references absolute paths into your host's NuGet cache. The subsequent `dotnet publish --no-restore` then fails with `NETSDK1064: Package … was not found`. The file lives in the sample folder alongside the Dockerfile.

## Building the image, and getting it onto the server

Unlike the Keycloak path where every container image came from Docker Hub, the IdentityServer image doesn't exist anywhere yet; it has to be built from the Dockerfile above. Build it on your dev machine, then get the resulting image to the server.

The sample splits this across two files. `docker-compose.yml` declares `image: auth-identityserver:latest` on the service (no `build:`), so it works on any machine where that tag is already in the local registry. `docker-compose.override.yml` adds a `build:` directive pointing at `./IdentityServer`; compose merges it automatically when both files sit next to each other. The override only matters where the source exists, which is your dev machine.

**If your dev machine and the host running the stack are the same**, the simplest path is to let `docker compose` handle it. Both files are present, the override adds the build step:

```bash
docker compose up -d --build auth-identityserver
```

Drop the `--build` flag once it's built; subsequent `up` calls reuse the image.

**If the source lives on your dev machine and the stack runs on a separate server** (common for a home lab), two realistic options:

1. **Build locally, ship the image over SSH.** No source on the server, no .NET SDK image pulled there either. From the IdentityServer folder on your dev machine:

   ```bash
   SERVER=<your-server>
   docker build -t auth-identityserver:latest .
   docker save auth-identityserver:latest -o auth-identityserver.tar
   scp auth-identityserver.tar "$SERVER":/tmp/
   ssh "$SERVER" '
     docker load -i /tmp/auth-identityserver.tar
     if ! docker image inspect auth-identityserver:latest >/dev/null 2>&1; then
       # Podman: retag from the localhost/-prefixed name to the bare one,
       # then remove the redundant localhost/ tag so it doesn'"'"'t clutter
       # docker images. No-op on plain Docker (the if branch never runs).
       docker tag localhost/auth-identityserver:latest auth-identityserver:latest
       docker rmi localhost/auth-identityserver:latest
     fi
     rm /tmp/auth-identityserver.tar
   '
   rm auth-identityserver.tar
   docker rmi auth-identityserver:latest
   ```

   `SERVER` at the top is the one knob to change. The two `rm` lines drop the tarball from both ends (the server copy inside the `ssh` invocation, the local copy on the line below). The final `docker rmi` removes the local image too: the build machine doesn't need to run the container, only to ship it, so the image is dead weight after the load on the server succeeded. Re-running the recipe rebuilds from cache and produces a fresh `:latest` tag.

   The conditional block in the `ssh` invocation is there for servers running Podman behind a `docker` shim (common on Fedora / RHEL / Rocky). Podman prepends `localhost/` to loaded images that lack a registry prefix, so `docker load` ends up producing `localhost/auth-identityserver:latest` instead of the bare tag compose looks for. The `if` branch retags it to the bare name and then `docker rmi`'s the original `localhost/` tag so it doesn't clutter `docker images`. On plain Docker the `inspect` succeeds, the `if` branch never enters, and both lines are no-ops.

   On the server side, the image stays in `docker images` until `docker compose up -d auth-identityserver` consumes it. After that the container holds the reference, and you can `ssh "$SERVER" 'docker rmi auth-identityserver:latest'` to drop the standalone tag if you want (the running container keeps the underlying layers; the next ship replaces the tag).

   Saving to a file first, then `scp`-ing it, then loading is the path I'd recommend now. The shorter one-liner `docker save … | ssh <your-server> 'docker load'` works too in theory, but I've hit `unrecognized image format` with it more than once: any line that a remote login shell prints to stdout (a `.bashrc` echo, a motd hook, a version-check banner) ends up prepended to the binary stream that `docker load` is trying to parse, and the load fails. The two-step file approach sidesteps that entirely. If wire transfer matters, add `-C` to `scp`/`ssh` for SSH-level compression, or pre-gzip the tar; on a LAN it's not worth the complexity.

   On the server, copy `docker-compose.yml` and `.env` over (skip `docker-compose.override.yml`, which is the dev-only build half) and run `docker compose up -d auth-identityserver`. Compose finds `auth-identityserver:latest` in the local registry from the `docker load` above and skips both the build and the pull.

2. **Push to a container registry.** Tag the image with a registry-prefixed name (`ghcr.io/<your-username>/auth-identityserver:latest` for GitHub Container Registry, free for public images), `docker push`, then on the server set `image: ghcr.io/<your-username>/auth-identityserver:latest` in the compose file and `docker compose pull && docker compose up -d`. One-time setup of a personal access token; after that, a clean pull-on-the-server cycle that scales to multiple hosts and slots into CI later.

For my own home-lab setup, option 1 (save, scp, load) is what I use. The rebuild cycle after a `Config.cs` change is four lines on the dev machine, the new image lands on the server in seconds, `docker compose up -d auth-identityserver` picks it up.

## Bring it up

The [docker-compose.yml](https://github.com/dvdstelt/weblog/blob/main/samples/2026/authenticating-servicepulse-with-duende/docker-compose.yml) brings the IdentityServer up alongside ServiceControl, audit, and RavenDB, the same containers as the Keycloak compose, repointed at Duende. To start with just the identity server (the order from Part 2 still applies: IdP before everything that talks to it):

```bash
docker compose up -d auth-identityserver
docker compose logs -f auth-identityserver
```

Once the logs settle on `Now listening on: http://[::]:8080`, the discovery document should be reachable at `https://is.<yourdomain>/.well-known/openid-configuration`. Open it in a browser and check the `issuer` field:

```json
{
  "issuer": "https://is.<yourdomain>",
  "authorization_endpoint": "https://is.<yourdomain>/connect/authorize",
  "token_endpoint": "https://is.<yourdomain>/connect/token",
  …
}
```

If `issuer` reads `http://auth-identityserver:8080` instead of the public URL, the forwarded-headers middleware isn't doing its job: either the env var isn't set, the middleware isn't ordered before everything else in the pipeline, or the reverse proxy isn't adding the headers. Same diagnosis as Keycloak Part 4's "every redirect ends up at localhost", different stack.

The `TestUsers` list in the sample defines `arya/arya` (Arya Stark) and `jon/jon` (Jon Snow). Both work as login credentials when ServicePulse redirects here in the next post.

## What this leaves out

All three of Duende's stores, configuration, operational, signing keys, are in-memory. Restarting the container regenerates the signing keys, which invalidates every token issued before the restart. For a POC, that just means logging in again. For anything beyond, the EF Core integration moves all three to a real database; that's the equivalent of moving Keycloak from H2 to PostgreSQL.

There's no admin UI. Adding clients or scopes means editing `Config.cs` and rebuilding the image. The Duende AdminUI product (separate licence) adds runtime configuration; for most setups, source-controlled `Config.cs` is what you want anyway.

[Part 6](/2026/05/24/plugging-servicecontrol-into-duende/) wires ServiceControl into this new identity server. As advertised, it's mostly the four env vars from [Part 3](/2026/05/22/plugging-servicecontrol-into-keycloak/#what-servicecontrol-needs-to-know), repointed.

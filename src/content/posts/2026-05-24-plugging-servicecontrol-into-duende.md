---
id: 20260524
author: Dennis van der Stelt
title: 'Authenticating ServicePulse with Duende IdentityServer: plugging ServiceControl in'
description: The four ServiceControl env vars from Part 3, repointed at Duende. Same login flow, same audience validation, different IdP.
pubDate: '2026-05-24T02:00:00'
image: /images/2026/authenticating-servicepulse-with-duende/header02.webp
topic: servicepulse-oidc
tags:
  - servicecontrol
  - servicepulse
  - duende
  - identityserver
  - oidc
---

[Part 5](/2026/05/24/building-a-duende-identityserver/) ended with a Duende IdentityServer running at `https://is.<yourdomain>/`, its discovery document reporting the right issuer, and `arya/arya` ready as a login. This post finishes the loop: ServiceControl pointed at Duende, browser hits ServicePulse, login flow, token, dashboard.

The framing from [Part 3](/2026/05/22/plugging-servicecontrol-into-keycloak/#what-servicecontrol-needs-to-know) of the <abbr data-tooltip="An open-source identity provider that runs as its own server with an admin console and a database for users, clients, and configuration. The series' first IdP option, covered in Parts 2-4.">Keycloak</abbr> path was that ServiceControl distinguishes one identity provider from another via four values: authority, <abbr data-tooltip="The 'aud' field inside a JWT, naming who the token is meant for. ServiceControl rejects any token whose audience isn't what it expects.">audience</abbr>, client ID, and scopes. That framing is now load-bearing; those four values are the only thing that changes here.

## The four env vars, repointed

The `auth-servicecontrol` block in [docker-compose.yml](https://github.com/dvdstelt/weblog/blob/main/samples/2026/authenticating-servicepulse-with-duende/docker-compose.yml) is identical to the Keycloak compose for everything except those four values. The auth env vars now read:

```yaml file="samples/2026/authenticating-servicepulse-with-duende/docker-compose.yml" region="ServiceControlAuthEnv"
```

Walking the four <abbr data-tooltip="Identity provider. The service that authenticates users and issues access tokens; in this series, either Keycloak or Duende IdentityServer.">IdP</abbr>-specific values:

- `SERVICECONTROL_AUTHENTICATION_AUTHORITY` is `https://is.<yourdomain>`, Duende's root URL, not `…/realms/<name>` as with Keycloak. Duende serves its discovery document at the root, not under a per-<abbr data-tooltip="A Keycloak realm is an isolated workspace for users, roles, and client applications. Each realm has its own users and configuration; nothing crosses between realms unless you configure it to.">realm</abbr> path, because realms aren't a Duende concept. One IdP instance, one issuer.
- `SERVICECONTROL_AUTHENTICATION_AUDIENCE` stays `servicecontrol-api`. That's the `ApiResource` name from `Config.cs` in Part 5, and it's what Duende writes into the `aud` claim of every access token carrying the `servicecontrol-api` scope.
- `SERVICECONTROL_AUTHENTICATION_SERVICEPULSE_CLIENTID` stays `servicepulse`. The Client ID in `Config.cs` matches what ServiceControl hands the browser at `/api/configuration`, same as the Keycloak client.
- `SERVICECONTROL_AUTHENTICATION_SERVICEPULSE_APISCOPES` stays `["openid","profile","email","servicecontrol-api"]`, the same JSON-encoded array as before. ServicePulse asks Duende for these at login time; Duende's `IdentityResources` and `ApiScopes` cover them.

The five `VALIDATE*` flags and `REQUIREHTTPSMETADATA` carry over without thinking. That's the same <abbr data-tooltip="JSON Web Token: a short, signed string the identity provider issues after login. The application validates the signature and the claims inside (issuer, audience, expiration) without calling back to the provider.">JWT</abbr> validation policy you'd want against any <abbr data-tooltip="OpenID Connect: an authentication layer built on top of OAuth 2.0. The identity provider issues signed tokens that applications validate on every request.">OIDC</abbr> provider; nothing IdP-specific about it.

## The audit twin and forwarded headers

Both still apply, both unchanged. `auth-servicecontrol-audit` gets the same auth env vars with the `SERVICECONTROL_AUDIT_` prefix instead of `SERVICECONTROL_`. The `FORWARDEDHEADERS_*` pair makes ServiceControl trust the `X-Forwarded-*` headers your reverse proxy adds. Both blocks are in the compose file and behave exactly as Part 3 of the Keycloak series described.

## Bring it up

With Duende already running from Part 5, start the rest:

```bash
docker compose up -d auth-ravendb auth-servicecontrol auth-servicecontrol-audit
docker compose logs -f auth-servicecontrol
```

ServiceControl's startup fetches `https://is.<yourdomain>/.well-known/openid-configuration`, reads the signing keys, and logs the authentication settings. The line to look for matches Part 3:

```text
Authentication settings: Enabled=True,
  Authority=https://is.<yourdomain>,
  Audience=servicecontrol-api,
  …
  ServicePulseClientId=servicepulse,
  ServicePulseAuthority=https://is.<yourdomain>,
  ServicePulseApiScopes=openid profile email servicecontrol-api
```

If the discovery fetch fails ServiceControl exits; that's the same failure mode as Keycloak Part 4's "ServiceControl won't start, exits with discovery error", and the same two causes, IdP not reachable yet, or TLS not trusted, apply.

## The login flow

Open `https://sc.<yourdomain>` in a browser. ServicePulse loads, calls `/api/configuration`, redirects the browser to Duende:

```text
https://is.<yourdomain>/connect/authorize?
  client_id=servicepulse&
  redirect_uri=https%3A%2F%2Fsc.<yourdomain>%2F&
  response_type=code&
  scope=openid+profile+email+servicecontrol-api&
  code_challenge=…&
  code_challenge_method=S256&
  …
```

Duende's login page appears, the one from the `Pages/Account/Login` Razor pages in the project, with `arya/arya` as one of the test users. Log in, consent if the page asks (it asks once per scope set per user; you can grant once and remember), and the browser returns to `https://sc.<yourdomain>/?code=…`. ServicePulse exchanges the code, presents the <abbr data-tooltip="Proof Key for Code Exchange: a way for a public client like a single-page app to use the OAuth authorization code flow safely, since it can't keep a client secret.">PKCE</abbr> verifier, and gets back an access token. The dashboard renders.

From here every API call carries `Authorization: Bearer <token>` and ServiceControl validates the same way it did with Keycloak tokens. The validation doesn't care which IdP issued the token, only that the issuer, audience, signature, and lifetime check out.

## What carries over from Part 4

Most of [the troubleshooting catalogue](/2026/05/23/oidc-troubleshooting-and-what-the-poc-leaves-out/) generalises. The errors and fixes are the same:

- **Invalid audience** still means the `aud` claim and the `AUDIENCE` env var don't agree. With Duende the value comes from the `ApiResource` name in `Config.cs` instead of the audience-mapper UI in Keycloak; otherwise identical.
- **Every redirect ends up at localhost** still means the issuer URL is wrong. With Duende, check that the `ASPNETCORE_FORWARDEDHEADERS_ENABLED` env var is set and `UseForwardedHeaders()` runs before `UseIdentityServer()` in the pipeline.
- **502 from the proxy** still means the proxy can't reach the host IP and port. Port `8080` is now the IdentityServer container; the diagnostic from Part 4 (`ss -tlnp | grep 8080`) is unchanged.
- **RabbitMQ management-API 401** is identical: the `auth-poc` user still needs the `administrator` (or `monitoring`) tag, regardless of which IdP fronts ServiceControl.
- **ServicePulse "Unexpected token is not valid JSON"** is identical: the `APISCOPES` env var still needs the JSON-array shape.
- **`MONITORING_URL=!`** still hides the monitoring tiles since this compose doesn't ship a monitoring instance.

One thing worth knowing that's really a ServicePulse behaviour rather than a Duende one: **the top-right username display reads from `preferred_username` and nothing else.** If the ID token doesn't carry that exact claim, ServicePulse falls back to the literal "User"; it doesn't try `name`, `email`, or `sub`. Keycloak emits `preferred_username` automatically from a user's `username` field, so the Keycloak path "just works". Duende's `TestUser` exposes a `Username` property for login matching but doesn't project it as a token claim, so you have to add `JwtClaimTypes.PreferredUserName` to each test user explicitly. `Pages/TestUsers.cs` in the sample does this for both `arya` and `jon`. The same applies to whatever real user store you eventually plug in: emit `preferred_username` from somewhere on each user, or the UI shows "User".

Another at first login: **`invalid_scope` for `offline_access`.** ServicePulse's `oidc-client-ts` always appends `offline_access` to the requested scopes; it's the standard OIDC scope for "issue me a refresh token too". A Duende client has to opt in to receiving that scope in its authorize requests via `AllowOfflineAccess = true`; without that flag, Duende rejects the request with `invalid_scope`. The sample's `Config.cs` sets it accordingly, which lets the server issue a refresh token when one is asked for. ServicePulse then decides whether to actually use it. If you removed the flag and see `Sorry, there was an error : invalid_scope` on the Duende login page, that's the cause.

One more Duende-specific gotcha worth flagging is **signing-key regeneration on container restart**. Duende generates a new JWT signing key on startup unless you persist it. After a restart, any token already issued is unsigned by the new key set and gets rejected; the symptom is "I was logged in five minutes ago and now every XHR returns 401". Fix is to log in again. The permanent fix is the EF integration, which persists keys in the operational store; that's the same "what this leaves out" trade-off as in-memory configuration from Part 5.

The other Duende-vs-Keycloak gap: there's no equivalent to Keycloak's *Client scopes → Evaluate* tab from Part 2. To preview what Duende would issue for a given user, the closest thing is calling the token endpoint manually (with `curl` or the `Duende.IdentityModel` library) or trusting the configuration in `Config.cs` and decoding a token that came out of a real login at [jwt.io](https://jwt.io). Less convenient; the same `aud`/`iss`/`scope` claims to look at.

Two posts to wire a different IdP. The ServiceControl side stayed the same; the work was all on the Duende side, building the server in Part 5, configuring it for the same audience. The four env vars worked as advertised.

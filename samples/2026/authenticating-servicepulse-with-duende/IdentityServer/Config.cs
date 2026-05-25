using Duende.IdentityServer.Models;

namespace IdentityServer;

public static class Config
{
    // Standard OIDC identity scopes ServicePulse asks for: openid (subject),
    // profile (name/etc.), email.
    public static IEnumerable<IdentityResource> IdentityResources =>
    [
        new IdentityResources.OpenId(),
        new IdentityResources.Profile(),
        new IdentityResources.Email(),
    ];

    // The scope ServicePulse adds to its authorization request to signal
    // "I want a token usable against the ServiceControl API". The name
    // has to match SERVICECONTROL_AUTHENTICATION_AUDIENCE and the
    // servicecontrol-api entry in SERVICEPULSE_APISCOPES on the
    // ServiceControl container.
    public static IEnumerable<ApiScope> ApiScopes =>
    [
        new ApiScope("servicecontrol-api", "ServiceControl API"),
    ];

    // The ApiResource is what makes the access token carry
    // aud=servicecontrol-api. When a client requests the servicecontrol-api
    // scope above and that scope belongs to this resource, Duende emits
    // the resource name in the token's `aud` claim. That's the moral
    // equivalent of Keycloak's audience mapper from Part 2 of the series.
    #region ApiResources
    public static IEnumerable<ApiResource> ApiResources =>
    [
        new ApiResource("servicecontrol-api", "ServiceControl API")
        {
            Scopes = { "servicecontrol-api" },
        },
    ];
    #endregion

    // ServicePulse is a single-page app served by ServiceControl. It can't
    // keep a client secret, so it's a public client using the authorization
    // code flow with PKCE, same shape as the Keycloak `servicepulse` client
    // in Part 2 of the series.
    #region Clients
    public static IEnumerable<Client> Clients(IConfiguration config)
    {
        // Trim any trailing slash: AllowedCorsOrigins requires a bare origin
        // (scheme://host[:port], no path, no slash), so accepting either
        // form of SERVICEPULSE_URL avoids a confusing CORS failure where
        // the browser's Origin header doesn't match a slash-suffixed entry.
        var servicePulseUrl = (config["ServicePulseUrl"]
            ?? throw new InvalidOperationException(
                "ServicePulseUrl is not configured. Set it via the SERVICEPULSE_URL env var."))
            .TrimEnd('/');

        return
        [
            new Client
            {
                ClientId = "servicepulse",
                ClientName = "ServicePulse",

                AllowedGrantTypes = GrantTypes.Code,
                RequireClientSecret = false,  // public client
                RequirePkce = true,           // PKCE is mandatory

                // The browser comes back here after Duende issues the auth
                // code. ServicePulse picks the URL up from /api/configuration
                // on ServiceControl; this list has to allow it.
                RedirectUris =
                {
                    $"{servicePulseUrl}/",
                    servicePulseUrl,
                },
                PostLogoutRedirectUris = { $"{servicePulseUrl}/" },
                AllowedCorsOrigins = { servicePulseUrl },

                AllowedScopes =
                {
                    "openid",
                    "profile",
                    "email",
                    "servicecontrol-api",
                    "offline_access",
                },

                // ServicePulse's oidc-client-ts always appends offline_access
                // to the requested scopes. Duende rejects the request with
                // invalid_scope unless the client opts in. Keycloak silently
                // accepts the scope and decides at issuance time, which is
                // why the Keycloak path doesn't surface this; Duende is
                // stricter. Enabling it lets Duende issue refresh tokens
                // when asked; ServicePulse decides whether to use them.
                AllowOfflineAccess = true,
            },
        ];
    }
    #endregion
}

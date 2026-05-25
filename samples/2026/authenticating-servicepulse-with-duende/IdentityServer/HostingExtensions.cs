using IdentityServer;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;

namespace IdentityServer;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        // The reverse proxy in front of Duende terminates TLS and forwards
        // plain HTTP. UseForwardedHeaders rewrites the request's scheme and
        // host using the X-Forwarded-* headers the proxy adds, so Duende
        // builds discovery URLs and redirect targets against the public
        // hostname (is.<yourdomain>) instead of the container's internal one.
        #region ForwardedHeaders
        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor
                | ForwardedHeaders.XForwardedProto
                | ForwardedHeaders.XForwardedHost;
            // Trust any proxy on the docker network for the POC. In
            // production, narrow this to the proxy's known IPs.
            options.KnownIPNetworks.Clear();
            options.KnownProxies.Clear();
        });
        #endregion

        var isBuilder = builder.Services.AddIdentityServer(options =>
        {
            options.Events.RaiseErrorEvents = true;
            options.Events.RaiseInformationEvents = true;
            options.Events.RaiseFailureEvents = true;
            options.Events.RaiseSuccessEvents = true;
        })
            .AddTestUsers(TestUsers.Users);

        // In-memory configuration. Production deployments move clients,
        // scopes, resources, and keys to EF + a real database; see Part 4
        // of the series for the production-hardening list.
        isBuilder.AddInMemoryIdentityResources(Config.IdentityResources);
        isBuilder.AddInMemoryApiScopes(Config.ApiScopes);
        isBuilder.AddInMemoryApiResources(Config.ApiResources);
        isBuilder.AddInMemoryClients(Config.Clients(builder.Configuration));

        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseForwardedHeaders();
        app.UseSerilogRequestLogging();

        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseIdentityServer();
        app.UseAuthorization();

        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }
}

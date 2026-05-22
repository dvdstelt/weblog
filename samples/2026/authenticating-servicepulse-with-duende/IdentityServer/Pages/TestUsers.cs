// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.

using Duende.IdentityModel;
using System.Security.Claims;
using System.Text.Json;
using Duende.IdentityServer;
using Duende.IdentityServer.Test;

namespace IdentityServer;

public static class TestUsers
{
    public static List<TestUser> Users
    {
        get
        {
            var address = new
            {
                street_address = "One Hacker Way",
                locality = "Heidelberg",
                postal_code = "69118",
                country = "Germany"
            };
                
            return new List<TestUser>
            {
                new TestUser
                {
                    SubjectId = "1",
                    Username = "arya",
                    Password = "arya",
                    Claims =
                    {
                        // PreferredUserName is what ServicePulse reads for the
                        // top-right username. Without it the UI falls back to
                        // the literal "User". Keycloak emits this claim
                        // automatically from its `username` field; Duende
                        // doesn't project TestUser.Username, so it has to be
                        // listed here explicitly.
                        new Claim(JwtClaimTypes.PreferredUserName, "arya"),
                        new Claim(JwtClaimTypes.Name, "Arya Stark"),
                        new Claim(JwtClaimTypes.GivenName, "Arya"),
                        new Claim(JwtClaimTypes.FamilyName, "Stark"),
                        new Claim(JwtClaimTypes.Email, "AryaStark@email.com"),
                        new Claim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                        new Claim(JwtClaimTypes.WebSite, "http://arya.com"),
                        new Claim(JwtClaimTypes.Address, JsonSerializer.Serialize(address), IdentityServerConstants.ClaimValueTypes.Json)
                    }
                },
                new TestUser
                {
                    SubjectId = "2",
                    Username = "jon",
                    Password = "jon",
                    Claims =
                    {
                        new Claim(JwtClaimTypes.PreferredUserName, "jon"),
                        new Claim(JwtClaimTypes.Name, "Jon Snow"),
                        new Claim(JwtClaimTypes.GivenName, "Jon"),
                        new Claim(JwtClaimTypes.FamilyName, "Snow"),
                        new Claim(JwtClaimTypes.Email, "JonSnow@email.com"),
                        new Claim(JwtClaimTypes.EmailVerified, "true", ClaimValueTypes.Boolean),
                        new Claim(JwtClaimTypes.WebSite, "http://jon.com"),
                        new Claim(JwtClaimTypes.Address, JsonSerializer.Serialize(address), IdentityServerConstants.ClaimValueTypes.Json)
                    }
                }
            };
        }
    }
}
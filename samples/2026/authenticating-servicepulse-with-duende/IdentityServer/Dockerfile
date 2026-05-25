# Multi-stage build: SDK image compiles, then we copy just the published
# output into the smaller aspnet runtime image. Resulting image is around
# 230 MB; sufficient for a POC, optimisable for production with chiseled
# or distroless variants of the same base.

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY IdentityServer.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /out --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /out .
# Kestrel binds inside the container on 8080; the reverse proxy in
# docker-compose.yml maps host port 8080 here.
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "IdentityServer.dll"]

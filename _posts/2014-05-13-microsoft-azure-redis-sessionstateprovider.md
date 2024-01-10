---
layout: post
id: 578695
author: Dennis van der Stelt
image: '/images/microsoft-azure-redis-sessionstateprovider/header.png'
date: 20140513 040646
title: Microsoft Azure Redis SessionStateProvider
description: Read this morning about the Microsoft Azure Redis Cache Service on Scott Guthrie’s bl...
redirect_from:
  - "/dennis/2014/05/13/microsoft-azure-redis-sessionstateprovider"
  - "/blogs/dennis/archive/2014/05/13/microsoft-azure-redis-sessionstateprovider.aspx"
---

Read this morning about the Microsoft Azure Redis Cache Service on [Scott Guthrie’s blog](http://weblogs.asp.net/scottgu/archive/2014/05/12/azure-vm-security-extensions-expressroute-ga-reserved-ips-internal-load-balancing-multi-site-to-site-vpns-storage-import-export-ga-new-smb-file-service-api-management-hybrid-connection-service-redis-cache-remote-apps-and-more.aspx) and immediately had to try it out.

You’ll have to log in to the [Microsoft Azure Preview Portal](http://portal.azure.com/) and create a Redis cache service. After that you must have an ASP.NET Website for forms or MVC and install the [following Nuget package](http://www.nuget.org/packages/Harbour.RedisSessionStateStore/), which uses the StackExchange Redis Client:

```
Install-Package Harbour.RedisSessionStateStore
```

```xml
<system.web>
  <sessionstate mode="Custom" customprovider="RedisSessionStateProvider">
    <providers>
      <clear></clear>
      <add name="RedisSessionStateProvider" type="Harbour.RedisSessionStateStore.RedisSessionStateStoreProvider" host="TUw8207//FLhXjoV6g+FNPtwcgatYwCwqBd2BPwqr7o=@moverall.redis.cache.windows.net" clienttype="basic"></add>
    </providers>
  </sessionstate>
</system.web>
```

And it just works! Pretty epic!

---
layout: post
id: 458222
author: Dennis van der Stelt
date: 20080416 121714
title: Community Server on Windows 2008
description: TAGS When you’ve installed Community Server on Windows 2008 and especially are runnin...
categories:
    - Community Server
redirect_from:
  - "/dennis/2008/04/16/community-server-on-windows-2008"
  - "/blogs/dennis/archive/2008/04/16/community-server-on-windows-2008.aspx"
---

**TAGS** When you’ve installed Community Server on Windows 2008 and especially are running under IIS7, you’ll probably get some problems with at least your tags. Community Server will throw a 404 “Page not found” error on tags with spaces. If that’s the case, open up your web.config and paste the following code at the bottom, but within the “configuration” tags.


```csharp
<system.webserver>
<security>
  <requestfiltering allowdoubleescaping="true"></requestfiltering>
</security>
</system.webserver>
```

Now IIS7 might still throw an error because the configuration won’t allow you to overrule the default setting. In [this knowledge base article](http://support.microsoft.com/kb/942076) you’ll find more information.

Find the following file **%windir%System32inetsrvconfigapplicationHost.config** and open it in Notepad under Administrator permissions. Find the key ‘requestFiltering’ and set overrideModeDefault to “Allow” instead of “Deny”.
**AVATARS** When your avatars aren’t showing, it might be because you’re running in “Classic .NET AppPool” mode and not in “Integrated Pipeline”. Change it and it should work.

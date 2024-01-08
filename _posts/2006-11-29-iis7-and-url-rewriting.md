---
layout: post
id: 60571
author: Dennis van der Stelt
date: 20061129 125150
title: IIS7 and Url Rewriting
description: IMPORTANT UPDATEI found out where the <module> tag belongs! 🙂 I was running in Class...
categories:
    - ASP.NET
    - Development
tags:
  - Windows Vista
  - IIS7
redirect_from:
  - "/dennis/2006/11/29/iis7-and-url-rewriting"
  - "/blogs/dennis/archive/2006/11/29/iis7-and-url-rewriting.aspx"
---

**<font color="#ff0000">IMPORTANT UPDATE  
</font>**I found out where the <module> tag belongs! 🙂

I was running in Classic .NET AppPool, when switching to the DefaultAppPool in IIS7 I could use the <modules> section. So the new way to use HttpModules for UrlRewriting is:


```csharp
<modules runallmanagedmodulesforallrequests="true">
  <add name="RedirectEngine" type="RedirectEngine.Rewrite, RedirectEngine" precondition="managedHandler"></add>
</modules>
<validation validateintegratedmodeconfiguration="false"></validation>
```

No idea what the last tag does, but IIS7 placed it there, so I hope it does any good 😉
**** **Continue with (old) article…** I have this website that needs to pump out some information to another application, just plain old xml. The problem is that this application was originally calling some weird app that was accessed through these kind of urls:
* http://myserver/folder/giveme?id=120
* http://myserver/folder/iwanttoknow?id=120&more=1

So my solution was to place a backslash, so you’d get http://myserver/folder/giveme/?id=120.That way, it would be redirected to default.aspx and handle the request. Unfortunately, not an option, as the url was created by the calling application, based on just the domain. So after /myserver/ I had no control over the url it looked at.

My alternative was url rewriting. When there’s a request to some file, check the last part of the folder requested and redirect it to the right folder with a nice default.aspx in it. Until I ran into IIS7.**IIS7  
**The problem here is, that the request to non existing files don’t pass my HttpModule anymore! I just get a 404 and no breakpoint inside my code gets hit. In IIS6 every incoming call is forwarded to my HttpModule. I kept on seeing requests for favicon.ico for example. Not in IIS7 though.

Don’t ask me what I tried to get it working. I looked at Scott Guthrie’s blog, but couldn’t find anything useful. Except [this item](http://weblogs.asp.net/scottgu/archive/2005/11/14/430493.aspx), where Scott says you’ll have to configure IIS7 to make it work. Sure, thanks Scott, but how?! I also found [this forum thread](http://forums.iis.net/thread/1420080.aspx) on iis.net but have no idea where the <modules> tag should go.

So what’s my solution? I added a handler to IIS, which seems possible inside your web.config since IIS7.I added the following:


```csharp
<system.webserver>
        <handlers>
            <add name="MyFiles" path="*" verb="GET" modules="IsapiModule" scriptprocessor="%windir%Microsoft.NETFrameworkv2.0.50727aspnet_isapi.dll" resourcetype="File"></add>
        </handlers>
    </system.webserver>

```

So now every unknown file extension will be redirected to the ASP.NET Isapi module. Meaning it’ll go through my HttpModule and I can redirect the request. This isn’t all though, it still won’t transfer calls to me if there’s no file. So for every request that’s made, you’ll have to figure out what the file should be and place one in the folder. My files are, based on my demo urls in this article, “giveme” and “iwanttoknow”.

Remember, this is not a solution! It just plain sucks! I want it to work like in IIS6.However I need it to work right now on IIS7 as well, and fast, so I can finish this app. I’d like to hear if people know how to get it working without the handler and empty files. So leave a comment or [contact](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/contact.aspx) me if you know.



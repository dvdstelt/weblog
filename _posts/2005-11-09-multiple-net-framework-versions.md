---
layout: post
id: 10201
author: Dennis van der Stelt
date: 20051109 011800
title: Multiple .NET Framework versions
description: For the client I’m currently at, I was looking for some Microsoft documents on what t...
categories:
    - Development
redirect_from:
  - "/dennis/2005/11/09/multiple-net-framework-versions"
  - "/blogs/dennis/archive/2005/11/09/multiple-net-framework-versions.aspx"
---

For the client I’m currently at, I was looking for some Microsoft documents on what they say about running multiple versions next to each other and what version will be loaded. A lot of this information seems very logical and is something you just presume, but to me was never proven by real documents. And clients still like real documents over my word. I have to work on that! 🙂

One thing that may seem very obvious, but I saw being asked for over and over again, is : can you create .NET 1.1 applications in Visual Studio 2005?
**NO, you cannot develop .NET 1.1 applications in Visual Studio 2005!!!** I’ll keep away from discussions like if it should be able to do so. As well as about the fact that you probably would be able, after you’d convert everything back to a .NET 1.1 standard (on projects and files, etc) with some home-brew tool or something. Forget it. I won’t.

Other things that could be interesting.
* <div>**You can install all versions of the .NET Framework without any problems.** You can install them in random order, whatever you want. And I’m speaking from experience here! 🙂
    </div>
* <div>**You can run .NET 1.0 and .NET 1.1 applications with only .NET 2.0 installed.** There’s a sidenote, things actually *have changed* since version 1.0.Change is, something that used to work, is broken in the latest version.  

    For more information, check out the [breaking changes](http://msdn.microsoft.com/netframework/programming/breakingchanges/) at msdn.
    </div>
* <div>**When not specified, your applications will run in the first version available.** i.e. when you build for 1.1 and both 1.1 and 2.0 are available, it will run in 1.1.  

   You can read about that here in [.NET Framework 1.1 and 2.0 (Beta) Compatibility](http://msdn.microsoft.com/netframework/default.aspx?pull=/library/en-us/dnnetdep/html/netfxcompat.asp).  

    If you want to know how to specify your version, go read about [required runtime](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpgenref/html/gnconSupportedRuntimeElement.asp) and/or [supported runtime](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/cpgenref/html/gnconSupportedRuntimeElement.asp) at msdn.
    </div>
* <div>**You cannot run a library in version 1.1 and have the consuming app run 2.0.** Your application runs in one process and cannot load the CLR twice in one process. You have my word for it.  

    Indeed, no real document, simply because I could not find it. Is this so logical to Microsoft they didn’t think of writing it down?  

    I did found [a statement by Gary Chang](http://groups.google.nl/group/microsoft.public.vsnet.ide/browse_frm/thread/8865dbfcd0d5dc82/1b22e7c43805f66f?tvc=1#1b22e7c43805f66f) from Microsoft Community Support though. 🙂</div>

So there you have it.  
 Now let Google do the work. Let’s help Google a bit  : running multiple versions framework clr .net 1.0 1.1 2.0

---
layout: post
id: 87980
author: Dennis van der Stelt
date: 20070102 124103
title: ASP.NET debugging on VistaIIS7
description: For some reason, a single project I’m working on wouldn’t let the debugger attach to ...
categories:
    - ASP.NET
    - Development
    - Vista
tags:
  - Windows Vista
  - Vista
  - ASP.NET
  - IIS7
redirect_from:
  - "/dennis/2007/01/02/asp-net-debugging-on-vistaiis7"
  - "/blogs/dennis/archive/2007/01/02/asp-net-debugging-on-vistaiis7.aspx"
---

For some reason, a single project I’m working on wouldn’t let the debugger attach to my IIS7 on Vista. I was completely clueless on why this was happening. Great thing is, the problem is solved, it now connects. The problem remaining is, that I’m still completely clueless on why and what.

I was browsing through Google and came across [ServerSide](http://mvolo.com/blogs/serverside/), as it seems a weblog by some Microsoft Visual Studio bloke. He’s got a solution that apparently will make it into the final “Visual Studio 2005 Windows Vista Update” (how’s that for a name?). It’s a (not managed code) module you’ll have to register and include in your web.config and a lot of problems will fade like snow in the sun, or something like that.

It worked for me, so I’m quite happy. [Find the solution here](http://mvolo.com/blogs/serverside/archive/2006/12/28/Fix-problems-with-Visual-Studio-F5-debugging-of-ASP.NET-applications-on-IIS7-Vista.aspx).



---
layout: post
id: 474731
author: Dennis van der Stelt
date: 20080918 072451
title: Microsoft project “Velocity”
description: Thursday September the 4th I gave a presentation for DotNed about Velocity, the frame...
categories:
    - .NET Framework 3.5
    - Development
    - PDC08
redirect_from:
  - "/dennis/2008/09/18/microsoft-project-velocity"
  - "/blogs/dennis/archive/2008/09/18/microsoft-project-velocity.aspx"
---

Thursday September the 4th I gave a presentation for [DotNed](http://www.dotned.nl/) about Velocity, the framework to enable distributed cache on the Windows platform. It was a fun evening for me with lots of great questions from the audience. You can download the slides from [the site](http://www.dotned.nl/blogs/dennis_blog/archive/2008/09/05/892.aspx).

There were a few questions that I couldn’t answer though.
**Regions    
**I know assumptions are the mother of all <strike>censored</strike>, but I made the assumption that regions aren’t being replicated across hosts but stay in one host. It’s not entirely untrue, but it is a little more complex though.

When you specify a region in configuration or in the .Put() method calls, all objects in that region won’t get replicated or partitioned across hosts but will stay on a single host, also called a node. However if you don’t specify a region explicitly, the objects will get spread across nodes. However, Velocity will **still** create regions. And that’s what we were wondering about during the course where I explained I didn’t fully understood what was going on there. Well, the regions being created will (or might) hold a copy of your object and this way your object will get partitioned across hosts and preferably across machines.
**What about security?** Velocity enabled caching on enterprise scale, resulting in a cache distributed over possible hundreds of machines, accessed by a great number of applications. In CTP1 there’s no way to secure your data, which is likely a problem for a number of scenarios. The team just posted that for version 1 of Velocity they’re going to implement application level security using token level security and/or take the applicationid/siteid from ASP.NET to use that to secure access. Read more in [this thread](http://forums.microsoft.com/Forums/ShowPost.aspx?PostID=3842748&SiteID=1&mode=1) on the forums.

Still only 38 days, 16 hours and 37 minutes to PDC, hope to hear more about Velocity there.

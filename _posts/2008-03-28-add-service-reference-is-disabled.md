---
layout: post
id: 458096
author: Dennis van der Stelt
date: 20080328 081423
title: Add service reference is disabled
description: In Visual Studio 2008 you can rightclick a project and choose for “Add service refer...
categories:
    - Visual Studio 2008
    - WCF
redirect_from:
  - "/dennis/2008/03/28/add-service-reference-is-disabled"
  - "/blogs/dennis/archive/2008/03/28/add-service-reference-is-disabled.aspx"
---

In Visual Studio 2008 you can right-click a project and choose for “Add service reference” to create a proxy class for your web service. WCF preferred, of course.

But for some reason, the Visual Studio team disabled it when you’re in debug mode. Something that used to work in Visual Studio 2005, so after starting a host, you could add the reference. In VS2008 this is disabled, or grayed out’.

The solution is to set your host as startup project, press CTRL-F5 so it’ll be started *without debugging* and then you’re able to choose to add the service reference.

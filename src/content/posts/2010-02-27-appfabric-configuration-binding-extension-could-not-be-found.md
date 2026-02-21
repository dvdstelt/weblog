---
id: 482885
author: Dennis van der Stelt
title: AppFabric  Configuration binding extension could not be found.
description: I have recently installed the Windows Azure AppFabric SDK because I’m writing an arti...
pubDate: '2010-02-27T08:34:00'
tags:
  - .NET Framework 4.0
  - Azure
  - WCF
redirect_from:
  - /dennis/2010/02/27/appfabric-configuration-binding-extension-could-not-be-found
  - /blogs/dennis/archive/2010/02/27/appfabric-configuration-binding-extension-could-not-be-found.aspx
---
I have recently installed the Windows Azure AppFabric SDK because I’m writing an article for the Dutch .NET Magazine. Problem is I try to do everything in Visual Studio 2010 these days, just because it’s so cool to have something that’s buggy. Seriously! Sometimes you get headaches because you just can’t figure out why something’s not working, only to find out it’s because it really isn’t working because of the current beta version you’re working with. But on the other side it’s really fun and you learn a lot.

As now, when I got the following message.

> Configuration binding extension ‘system.serviceModel/bindings/netTcpRelayBinding’ could not be found. Verify that this binding extension is properly registered in system.serviceModel/extensions/bindingExtensions and that it is spelled correctly.

It’s a System.ConfigurationErrorsException which can mean that you might be right with what you configured, the .NET runtime just can’t figure out what it is that is wrong. This time it’s because some extensions to WCF weren’t added to the machine.config of .NET 4.0 RC. It was however added to the machine.config of .NET 2.0 so I took it from there. And for future reference for my dear readers and all others that come in via Google, I’m posting the fix here.

Sidenote : I’m using 2.0.50727 and 4.0.30128 version of the .NET Framework, but the versions might differ on your machine.

Go to C:WindowsMicrosoft.NETFrameworkv2.0.50727CONFIG and read the machine.config from there. In the node configurationsystem.servicemodelextensions you find two nodes. The first is bindingElementExtensions and the second is bindingExtensions. You’ll see some bindings with a name that contains “relay” in it. Copy these into notepad or so.

Now open up C:WindowsMicrosoft.NETFrameworkv4.0.30128Config and edit the machine.config there. Copy the lines from the 2.0 config that are missing in the 4.0 config and your AppFabric service should be able to start.

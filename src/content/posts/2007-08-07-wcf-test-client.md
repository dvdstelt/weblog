---
id: 334794
author: Dennis van der Stelt
title: WCF Test Client
description: Two things that should’ve been there since WCF v1. My colleague Alex Thissen already ...
pubDate: '2007-08-07T12:48:51'
tags:
  - .NET Framework 3.5
  - Visual Studio 2008
  - WCF
  - .NET 3.5
redirect_from:
  - /dennis/2007/08/07/wcf-test-client
  - /blogs/dennis/archive/2007/08/07/wcf-test-client.aspx
---
Two things that should’ve been there since WCF v1.My colleague Alex Thissen already blogged about the WCF Library projects and the [service host](http://www.alexthissen.nl/blogs/main/archive/2007/03/04/wcf-library-projects.aspx) that comes with it. In beta 2 there’s a new **test client** that’ll connect to your service and will show you the available operations, configuration and allows you to invoke the operations.

[![WCFTestClient](/images/wcf-test-client/wcftestclient_thumb_1.png)](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/WindowsLiveWriter/WCFTestClient_C9B9/WCFTestClient_1.png) 

When you take a look at the properties of your service library, you’ll notice that under the “Debug” tab page, a command line argument has been added: /client:”WcfTestClient.exe”. This allows it to start and connect to your service.

After a default installation, this client will crash upon connecting to your service. That’s because svcutil.exe isn’t signed in Beta 2, as you can [read](http://www.lhotka.net/weblog/VisualStudio2008Beta2AndNETFX35Beta2AreAvailableNow.aspx) here and [here](http://blogs.thinktecture.com/cweyer/archive/2007/07/27/414897.aspx). Unfortunately both bloggers don’t tell you where you can find svcutil. You can find it right here:

C:Program FilesMicrosoft SDKsWindowsv6.0abin

Open the Visual Studio 2008 command prompt, browse to that folder and delay sign it by executing the following command:

sn.exe -Vr svcutil.exe

Now both Service Util and the WCF Test Client work.



---
id: 484580
author: Dennis van der Stelt
title: ClickOnce deployment and customHostSpecified error
description: Some time ago now I wrote about doing manual ClickOnce deployment using the command l...
pubDate: '2011-01-11T10:59:15'
tags:
  - .NET Framework 4.0
redirect_from:
  - /dennis/2011/01/11/clickonce-deployment-and-customhostspecified-error
  - /blogs/dennis/archive/2011/01/11/clickonce-deployment-and-customhostspecified-error.aspx
---
Some time ago now I wrote about doing [manual ClickOnce deployment](https://bloggingabout.net/2008/11/26/deploying-clickonce-applications-automated-using-finalbuilder) using the command line and FinalBuilder. One of my readers posted a reaction about the following error.

> The customHostSpecified attribute is not supported for Windows Forms applications.

I did not have that specific error at the time, and the reader didn’t follow up on my reactions. But now I had the problem myself. Luckily I found the answer pretty fast. I used the old version of mage.exe from the .NET Framework 2.0 SDK. I needed to use the .NET Framework 4.0 SDK mage and my problem was solved. You can find that version right here:

> C:Program Files (x86)Microsoft SDKsWindowsv7.0ABin**NETFX 4.0 Tools**mage.exe

---
id: 441691
author: Dennis van der Stelt
title: Turn off automatic updates with ClickOnce
description: I got an email with the question how to turn off automatic checking for updates, whe...
pubDate: '2007-11-28T12:27:15'
tags:
  - .NET Framework 2.0
  - Visual Studio 2005
  - Visual Studio 2008
  - ClickOnce
redirect_from:
  - /dennis/2007/11/28/turn-off-automatic-updates-with-clickonce
  - /blogs/dennis/archive/2007/11/28/turn-off-automatic-updates-with-clickonce.aspx
---
I got an e-mail with the question how to turn off automatic checking for updates, when you’re doing a [manual check for updates with ClickOnce](https://bloggingabout.net/2007/11/05/manual-check-for-updates-with-clickonce). Strangely enough I forgot to mention this in my previous article.

[![ClickOnceAutoUpdateOff](/images/turn-off-automatic-updates-with-clickonce/clickonceautoupdateoff_thumb.png)](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/WindowsLiveWriter/TurnoffautomaticupdateswithClickOnce_BC54/ClickOnceAutoUpdateOff_2.png) 

The above dialog window can be obtained in the properties window of your project (Right-click your project in the solution explorer), under the “Publish” tabpage, using the “Updates…” button.

In the above window the “The application should check for updates” is turned on. Uncheck it and your application won’t automatically check for updates anymore.

Note that at the bottom, I’ve filled in the update location. For some reason, when you deploy your application with auto update turned off, it won’t be able to find the update location anymore. It’s being removed from the manifest! I have no idea if this is a bug or not, but it can be solved by entering the update location in the bottom textbox. Now the [manual check for updates with ClickOnce](https://bloggingabout.net/2007/11/05/manual-check-for-updates-with-clickonce) works again.



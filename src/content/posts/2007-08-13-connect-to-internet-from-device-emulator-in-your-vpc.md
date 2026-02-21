---
id: 339335
author: Dennis van der Stelt
title: Connect to internet from device emulator in your VPC
description: I’m writing some applications and demos for the Summer Class using the .NET Compact F...
pubDate: '2007-08-13T10:45:44'
tags:
  - .NET Compact Framework 3.5
  - Visual Studio 2005
  - Visual Studio 2008
  - Windows Mobile
  - .NET Compact Framework
redirect_from:
  - /dennis/2007/08/13/connect-to-internet-from-device-emulator-in-your-vpc
  - /blogs/dennis/archive/2007/08/13/connect-to-internet-from-device-emulator-in-your-vpc.aspx
---
I’m writing some applications and demos for the Summer Class using the .NET Compact Framework 3.5.For one of them I need the internet, but couldn’t connect. Some problem about the device emulator that can’t connect due to Virtual PC. I’ve found the solution now and wanted to share it.

First, install Active Sync 4.0 or higher. I’ve used 4.5.Then go to connection settings and set “Allow connections to one of the following” to “DMA”. Press okay.

[![devicemanager](/images/connect-to-internet-from-device-emulator-in-your-vpc/devicemanager_thumb.png)](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/WindowsLiveWriter/Connecttointernetfromdeviceemulatorinyou_AFC9/devicemanager.png)The simplest way for anyone to get the Mobile Device Emulator running is to start a new smart device project and build and deploy the project, or plain press “F5”. You’re now connected. In Visual Studio choose “Tools” and select “Device Emulator Manager”. Now one device should have some “play” icon in front of it, as in the screenshot on the right. Right-click the running emulator and choose “Cradle”. ActiveSync will start syncing stuff.
**Proxy server** It’s possible you’re browsing the internet using a proxy server. Be sure to configure it. In the Windows Mobile start menu, select “Settings”. Select the tab “Connections” at the bottom and then select the “Connections” icon. Select “Manage existing connections” and select the “Proxy settings” tab at the bottom.
**What network** Windows Mobile has two preferences on what network/connection to use for either internet or private network stuff. In my case it wanted to connect to the internet via an ISP. Of course I don’t have one in my emulator, so I had to change it to “My work network”. You can do this by selected “Settings” in the start menu, then select the “Connections” tab and then the “Connections” icon. Select the “Advanced” tab at the bottom and then press the “Select networks” button. In the top button set the combobox to “My work network” and you should have internet.
**UPDATE:  
**For some reason, Windows Mobile suddenly configures a proxy server in its settings, completely unknown to me. I have no idea where it comes from and I’m not using a proxy server anywhere. If I uncheck it, I can connect again. Very weird.

When first cradling my emulator ActiveSync cannot connect for some weird reason. In ActiveSync I choose “Connection settings…” from the file menu, choose the upper-right “connect” button and immediately cancel it. Then it’s suddenly able to connect.

You just gotta love this stuff! 🙂



---
id: 457932
author: Dennis van der Stelt
title: Disable Windows Vista UAC
description: Everyone who owns Vista knows UAC by now. Everyone also knows it’s not smart to turn ...
pubDate: '2008-02-22T03:31:53'
tags:
  - Vista
redirect_from:
  - /dennis/2008/02/22/disable-windows-vista-uac
  - /blogs/dennis/archive/2008/02/22/disable-windows-vista-uac.aspx
---
Everyone who owns Vista knows UAC by now. Everyone also knows it’s not smart to turn it off, but still a lot of people do so. It’s not easy for Microsoft to make their customers happy, is it now?! 😉

Anyway, a <u>smarter solution</u> is something I read on a weblog a long time ago, but I keep forgetting who actually wrote it. You won’t turn off UAC but you no longer need to respond to three separate dialogs anymore. I needed it again and started my search, to find it again on [Tim Sneath](http://blogs.msdn.com/tims/) his weblog, [right here](http://blogs.msdn.com/tims/archive/2006/09/20/763275.aspx).

For personal reference and to inform others I’m posting it here again, in short form.
1. In your start menu, type “Local Security Policy”
2. Accept the elevation prompt
3. From the snap-in, select “Local Policies” -> “Security Options”
4. Scroll all the way down and find the elevation prompt property. Set the proper option for yourself.

[![uac](/images/disable-windows-vista-uac/uac_thumb.png)](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/WindowsLiveWriter/DisableWindowsVistaUAC_E683/uac_2.png) 

Thanks Tim Sneath!

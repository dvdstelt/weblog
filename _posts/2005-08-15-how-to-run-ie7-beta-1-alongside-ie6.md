---
layout: post
id: 8927
author: Dennis van der Stelt
date: 20050815 014600
title: How to run IE7 (Beta 1) alongside IE6
description: For some applications, I always want to try out the latest versions. They sometimes c...
categories:
    - Miscellaneous
redirect_from:
  - "/dennis/2005/08/15/how-to-run-ie7-beta-1-alongside-ie6"
  - "/blogs/dennis/archive/2005/08/15/how-to-run-ie7-beta-1-alongside-ie6.aspx"
---

For some applications, I always want to try out the latest versions. They sometimes contain such cool new features, or look so much better, you just have to get those. Office, while adding nothing new for me personally, is one of those. To see the new cool icons sometimes just does it for me. Of course the new Visual Studio and now Team System, just gotta use them.

And now Internet Explorer 7 Beta 1 was released on MSDN. I’m not sure about this new version, but the previous integrated into Windows so deep, it could totally bring down Windows because of bugs, if you’d just install it. But now, [Jon Galloway has a way to bypass this all](http://weblogs.asp.net/jgalloway/archive/2005/08/12/422335.aspx), and keep running IE6 while testing IE7 next to it.

IE7 comes as a download from MSDN and is a self-extracting archive. This means it’s (in this occasion) a [WinRAR](http://www.rarlab.com/download.htm) file that you can (manually) extract into some folder. Now find the file SHLWAPI.DLL and delete the file in that directory. Create a new textfile, call it IEXPLORE.exe.local

This new textfile with the .local extension makes IE7 run in local mode, which means it won’t mess with your IE6, registry settings, etc.  
 And for nerds like me, there are older version of IE that can run standalone which can be found at [browsers.evolt.org](http://browsers.evolt.org/?/ie/32bit/standalone) and at [skyzyx.com](http://www.skyzyx.com/resources/). Since I haven’t run IE before IE4, it’s nice to check one out pure for the fun of it!

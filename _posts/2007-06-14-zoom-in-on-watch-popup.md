---
layout: post
id: 253100
author: Dennis van der Stelt
date: 20070614 095000
title: Zoomin on ‘watch popup’
description: During his ‘Applied Linq’ presentation at the Developer Days 2007, Alex Thissen tried...
categories:
    - Miscellaneous
    - Utilities
    - Visual Studio 2008
tags:
  - DevDays2007
  - DevDays
  - ZoomIt
  - Visual Studio 2008
redirect_from:
  - "/dennis/2007/06/14/zoom-in-on-watch-popup"
  - "/blogs/dennis/archive/2007/06/14/zoom-in-on-watch-popup.aspx"
---

During his ‘Applied Linq’ presentation at the Developer Days 2007, [Alex Thisse](http://www.alexthissen.nl/blogs/main/default.aspx)[n](http://www.alexthissen.nl/blogs/main/archive/2007/05/07/speaking-at-developer-days-2007.aspx) tried to zoom-in on some variable. I have no idea how this popup is called, but it’s kind of a watch in a popup, therefor a ‘watch popup’ ? Anyhow, Alex tried to zoom-in on it as you can’t (easily) modify its font-size. I’ve told him a dozen times he should use [ZoomIt](http://www.microsoft.com/technet/sysinternals/Miscellaneous/ZoomIt.mspx) for this, a tool by [SysInternals](http://www.microsoft.com/technet/sysinternals/default.mspx). Unfortunately, it didn’t work.

Alex has his ZoomIt key mapped to alt-1.When pressing alt in Visual Studio it’ll immediately think you want to open the menu and close the ‘watch popup’. I have the same problem with Media Player Classic, which uses alt-1 to alt-3 for setting the window size. Therefor I <strike>remapped my ZoomIt key to ctrl-1</strike>. The default is actually ctrl-1.Now this does work for the ‘watch popup’, if it wasn’t for another annoying feature of Visual Studio. Pressing the ctrl key will make the ‘watch popup’ transparent, resulting in the following…

![Watch popup after pressing ctrl key](/images/zoom-in-on-watch-popup/zoomit_watch_popup_1.png) 

As far as I can tell, there’s no solution to this. I’ve searched in the tons of keyboard mappings in Visual Studio, but can’t find anything on the transparency of the ‘watch popup’.

There is however another solution. Alex could’ve pressed SHIFT-F9 for the QuickWatch window, very usable by ZoomIt! 😉



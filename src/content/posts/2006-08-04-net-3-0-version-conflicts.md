---
id: 13239
author: Dennis van der Stelt
title: .NET 3.0 version conflicts
description: A while ago I had some problems uninstalling .NET 3.0 so I deleted everything, both f...
pubDate: '2006-08-04T12:25:00'
tags:
  - .NET Framework 3.0
  - Development
redirect_from:
  - /dennis/2006/08/04/net-3-0-version-conflicts
  - /blogs/dennis/archive/2006/08/04/net-3-0-version-conflicts.aspx
---
A while ago I had some problems uninstalling .NET 3.0 so I deleted everything, both files and everything related to WinFX in my registry. Not a smart thing to do. When installing the latest july CTP I had even more problems. I’m brave (read : crazy) enough to install everything on my own machine instead of some virtual pc session, so I really had to get things working again. Luckely more people had the same problem(s) and after some extensive searching and trial-and-error I got it working again.

But now another problem, I can’t load anything that’s related to WPF, as Orcas isn’t compatible with the july CTP. But my colleague Mike Glaser found that when you first install the june ctp, then Orcas, uninstall the june ctp and at last install the july CTP, you can at least load the WPF projects. You can’t edit them in Visual Studio however. But after installing Expression, the new design suite by Microsoft, you’re able to edit everything. You can load, build and run [Sudoku](http://wcf.netfx3.com/files/folders/distributed_applications/entry4543.aspx) from both the Expression Interactive Designer and Visual Studio 2005.
So now you know how to load WPF projects in Visual Studio 2005.

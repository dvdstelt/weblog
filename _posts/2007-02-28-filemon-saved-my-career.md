---
layout: post
id: 126354
author: Dennis van der Stelt
date: 20070228 124313
title: FileMon saved my career!
description: Okay, maybe I should be more careful with titles, but it is a catchy one! 😉 On my fr...
categories:
    - Personal
    - Utilities
redirect_from:
  - "/dennis/2007/02/28/filemon-saved-my-career"
  - "/blogs/dennis/archive/2007/02/28/filemon-saved-my-career.aspx"
---

Okay, maybe I should be more careful with titles, but it *is* a catchy one! 😉

On my fresh pc I had to install the [Guidance Automation Extensions](http://msdn.microsoft.com/vstudio/teamsystem/workshop/gat/download.aspx) (GAX) and during install, my laptop crashed. I know, please don’t start about XP vs. Vista anymore. But anyway, after rebooting I tried to install GAX again but got a configuration error. After traveling over a lot of websites that Google suggested, I ended up executing FileMon to see what config file it actually tried to reach. Funny enough the installer accesses about a million files which after searching for .xml and .config files I ended up with a few dozen files spread out over my system in many different folders.

So I scrolled down to the last items that the FileMon reported the installer to have accessed. To my surprise it tried to access machine.config a few lines before the end. The result was that I found that file heavily corrupted. After getting a new one from a colleague, everything was fine again.

Thank you [SysInternals](http://www.microsoft.com/technet/sysinternals/default.mspx) and [FileMon](http://www.microsoft.com/technet/sysinternals/utilities/filemon.mspx)! And thank you Windows for eating away another hour of production time. And Windows Live Writer for another 5 minutes! o:-)

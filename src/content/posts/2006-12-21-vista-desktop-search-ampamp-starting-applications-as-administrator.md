---
id: 80881
author: Dennis van der Stelt
title: Vista desktop search amp; starting applications as administrator
description: Via Tim Sneath I’ve learned that you can start an elevated command prompt from the St...
pubDate: '2006-12-21T01:28:15'
tags:
  - ASP.NET
  - Personal
  - Vista
  - Windows Vista
redirect_from:
  - /dennis/2006/12/21/vista-desktop-search-ampamp-starting-applications-as-administrator
  - /blogs/dennis/archive/2006/12/21/vista-desktop-search-ampamp-starting-applications-as-administrator.aspx
---
Via [Tim Sneath](http://blogs.msdn.com/tims/) I’ve learned that you can [start an elevated command prompt](http://blogs.msdn.com/tims/archive/2006/11/02/windows-vista-secret-10-open-an-elevated-command-prompt-in-six-keystrokes.aspx) from the Start Menu. Press ctrl-esc to pull up the start menu, type in “cmd”. cmd.exe is the command prompt. When it’s visible, just press ctrl-shift-enter and it’ll start up with elevated administrator rights.

This is very handy for executing iisreset as well, as you need elevated rights for it as well. But also Visual Studio 2005 and other applications can be started that way.

Something I really miss however is starting any file, with a right-click, as administrator. For example for my Visual Studio 2005 solutions I would’ve loved this functionality. Perhaps it can be achieved by some registry hacks. I’d like to know!



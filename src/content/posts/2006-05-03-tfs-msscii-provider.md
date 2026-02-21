---
id: 12123
author: Dennis van der Stelt
title: TFS MSSCII Provider
description: I was at a client yesterday, who wanted to migrate from Source Safe and a lot of othe...
pubDate: '2006-05-03T09:53:00'
tags:
  - Team System
redirect_from:
  - /dennis/2006/05/03/tfs-msscii-provider
  - /blogs/dennis/archive/2006/05/03/tfs-msscii-provider.aspx
---
I was at a client yesterday, who wanted to migrate from Source Safe and a lot of other tools, to Team Foundation Server. Problem was, they stil had some older VB6/ASP projects, and of course a lot of .NET 1.1 projects. For a lot of reasons, these cannot always just be upgraded to .NET 2.0.Conversion will take time, testing even longer, even though it seems everything works out great.

They had come up with all kinds of solutions to start using TFS Source Control for their older projects, like using just the Team Explorer besides VS2003 & VS6.Or start using .NET1.1 templates for VS2005.
A much more clean and simple solution however is, to use the "Team Foundation Server Microsoft Source Code Control Interface", or TFS MSSCCI. It has [‘just’ been released](http://blogs.msdn.com/bharry/archive/2006/03/24/559876.aspx) and supports at least the following IDE’s:
* Visual Studio 2003
* Visual Basic 6 SP6
* Visual C++ SP6
* Visual FoxPro 9 SP1
* Microsoft Access 2003 SP2
* SQL Server Management Studio 2005

As usual, unsupported and provided "as is", blah blah blah… The usual Microsoft customer care… But you’re allowed to ask questions [on their forums](http://forums.microsoft.com/MSDN/ShowForum.aspx?ForumID=22&SiteID=1). 😉

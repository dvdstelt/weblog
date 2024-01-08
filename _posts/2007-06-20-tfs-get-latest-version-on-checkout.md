---
layout: post
id: 262103
author: Dennis van der Stelt
date: 20070620 102702
title: TFS Get latest version on checkout
description: As most Team Foundation Server (TFS) users will know by now, upon checkout of a file ...
categories:
    - Team System
    - Utilities
    - Visual Studio 2005
tags:
  - Team Foundation Server
  - TFS
  - Visual Studio
  - Team System
redirect_from:
  - "/dennis/2007/06/20/tfs-get-latest-version-on-checkout"
  - "/blogs/dennis/archive/2007/06/20/tfs-get-latest-version-on-checkout.aspx"
---

As most Team Foundation Server (TFS) users will know by now, upon checkout of a file from source control, the latest version isn’t retrieved. For a lot of users very odd, while this was the cast in Visual Source Safe. This is actually by design. And this time “by design” doesn’t mean it’s a bug (or feature, if you will). Buck <strike>Rogers</strike> Hodges [explains why](http://blogs.msdn.com/buckh/archive/2005/08/20/454140.aspx) and I think it’s an excellent reason.

Just read though, on [Roy Osherove’s weblog](http://feeds.feedburner.com/~r/Iserializable/~3/126257141/get-latest-version-on-checkout-with-team-system-source-control.aspx) that there’s [a new add-in](http://sela.co.il/?CategoryID=975&ArticleID=501&Page=1) for Visual Studio that’ll check the version of the file you’re checking out and if it’s not the latest version, a popup will appear asking if you want to get the latest version. There are other add-ins that do this, but they don’t ask the question, they just do.

It’s something I’ll never install and use, because I believe TFS works the way it should be on that matter. But it’s good to have the choice.



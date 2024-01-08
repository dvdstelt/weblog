---
layout: post
id: 345860
author: Dennis van der Stelt
date: 20070822 084158
title: MSBuild tasks for Team Foundation Server
description: I’ve experienced editing Team Foundation Server builds by hand and I didn’t like it. ...
categories:
    - Team System
    - Utilities
    - Visual Studio 2005
tags:
  - Team Foundation Server
  - TFS
  - MSBuild
redirect_from:
  - "/dennis/2007/08/22/msbuild-tasks-for-team-foundation-server"
  - "/blogs/dennis/archive/2007/08/22/msbuild-tasks-for-team-foundation-server.aspx"
---

I’ve experienced editing Team Foundation Server builds by hand and I didn’t like it. Maybe I’m missing something here, but it’s very complex and troublesome. I want some more ‘advanced’ stuff in my build process, like preparing a build for our test environment but also for our production environment. I want to have different configuration files for both, with different connectionstrings for example. And I want my ClickOnce application to be deployed on the correct location with the right version numbers. And I want continues integration with CruiseControl.NET.

That’s not overly complex when I just use CC.NET and MSBuild. But with TFS I cannot extract the build onto my local desktop and change stuff until I think it’s right. I’m interfering with the normal continues builds and other teams don’t like this.

So I decided to leave TFS Build for what it is and use CC.NET and MSBuild stand-alone. Problem is, I still need to checkout files to increase version numbers and such. <u>But I cannot find any MSBuild tasks related to Team Foundation Server</u>!

So my question is…
1. Are there any MSBuild tasks that can talk to Team Foundation Server?
2. Is anyone interested in these if I’d develop them?
3. Is it a good idea to host this stuff on Codeplex?

I’d really like to know answers to these. Email to me directly or respond here. Thanks.



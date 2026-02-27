---
id: 11904
author: Dennis van der Stelt
title: Smart usage of localhost as mailserver
description: Some things are so simple, you’d expect everyone to know these things and use them wi...
pubDate: '2006-04-05T04:23:00'
tags:
  - Development
  - personal
redirect_from:
  - /dennis/2006/04/05/smart-usage-of-localhost-as-mailserver
  - /blogs/dennis/archive/2006/04/05/smart-usage-of-localhost-as-mailserver.aspx
---
Some things are so simple, you’d expect everyone to know these things and use them wisely. Unfortunatly, this isn’t always the case, even when it concerns me! 😉

Take for example mailing in .NET, using your localhost smtp server. How difficult can this be? You get an error that the server is unable to relay your mail, you go to IIS and search in the smtp server properties for relaying, set it up and go. Until at some point, on a server I was using at home, it still would not work, due to some security settings. So to make sure my relaying was not the problem, I threw relaying open for everyone. Resulting in a mail from my ISP that they banned me from using their smtp server, because my server was being used by spammers. The mail I got was sent a few hours before I looked at it. So I wanted to check my mail-queue with Windows Explorer. There were so many files in that directory, that Windows could not handle it and locked up. From that moment on, I’ve been pretty carefull with my relay settings 😉

I was thinking about this story when I read [Peter van Ooijen](http://codebetter.com/blogs/peter.van.ooijen/) his [last blog entry](http://codebetter.com/blogs/peter.van.ooijen/archive/2006/04/05/142331.aspx), where he explains how to use mail and setup your server for relaying mail. I’ll join Peter in the statement he ends his blog with; Use with care!

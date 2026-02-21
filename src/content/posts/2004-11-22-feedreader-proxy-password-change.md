---
id: 1643
author: Dennis van der Stelt
title: FeedReader proxy password change
description: Some keywords in the topic for everyone searching through Google! 😉 There’s a bug in...
pubDate: '2004-11-22T09:11:00'
tags:
  - Miscellaneous
redirect_from:
  - /dennis/2004/11/22/feedreader-proxy-password-change
  - /blogs/dennis/archive/2004/11/22/feedreader-proxy-password-change.aspx
---
Some keywords in the topic for everyone searching through Google! 😉

There’s a bug in FeedReader which results in not being able to change your proxy password. When you’re on a domain which makes you change your password every few weeks, that’s a bit of a problem. Luckely you can take a look at the source of FeedReader, as it’s open source on SourceForge.

<div class="code">If gProperties.ProxyEnabled Then  
  if gProperties.ProxyPassword = ” then  
    if gProperties.ProxyUsername <> ” Then  
      gProperties.ProxyPassword :=</div>  

As a result, I tried to remove the password from the .ini file, but that will lock up the application completely. So after removing the complete .ini file (from c:documents and settings[username]Application DataFeedReader) I could enter everything again and the popup came up which asked for my password.

Before doing this, I emailed the developers of FeedReader, with the question on how to change my password. If they respond, I’ll give them the solution to their problem. 😉

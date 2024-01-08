---
layout: post
id: 903
author: Dennis van der Stelt
date: 20040524 070100
title: Email tracker
description: I just read my CodeProject newsletter and found an article in it about tracking your ...
categories:
    - Development
redirect_from:
  - "/dennis/2004/05/24/email-tracker"
  - "/blogs/dennis/archive/2004/05/24/email-tracker.aspx"
---

I just read my CodeProject newsletter and found an article in it about [tracking your email](http://www.codeproject.com/aspnet/EmailTracker.asp). What is does, is include an image in the email that loads an .aspx page. This page is on your own server and when Outlook requests the image, the .aspx page is loaded, you know the email is openend en thus probably being read and you redirect the request to a transparent image, so the reader will not even know what happened.

Thing is, as the author notes, spammers might also use this. I’m using Outlook 2003.This version of Outlook has a standard setup to not download images on the fly, but requires an action by you, the user, to download these images. Most of the time I found this annoying, so I turned automatic downloading on. After reading this article, I turned it back off!

I get lots and LOTS of spam email at work. More then 50 a day! You might imagine how hard it is to find real emails between this spam! If anyone has any idea how to solve this problem within Outlook 2003 connected to Exchange, please reply. I’ve tried some solutions, but or they didn’t work, or they kept on crashing Outlook.

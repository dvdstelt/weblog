---
layout: post
id: 9110
author: Dennis van der Stelt
date: 20050825 123800
title: Testing software
description: Before Test Driven Development (TDD) most developers just randomly clicked through a ...
categories:
    - Agile
    - Development
redirect_from:
  - "/dennis/2005/08/25/testing-software"
  - "/blogs/dennis/archive/2005/08/25/testing-software.aspx"
---

Before [Test Driven Development](http://www.objectmentor.com/writeUps/TestDrivenDevelopment) (TDD) most developers just randomly clicked through a small part of the application they had just created, before turning it over to the tester. If there even was a tester. Probably everyone knows the number of bugs that bounced back and forward between testers and developers, and the time it took to reproduce the bug, find the source of the bug and then fix it. Only to find out you broke some other part and the process restarted.

These days, more and more projects at least use unit tests. And hopefully you use TDD, as this will definitely enhance your code in many ways.

[Jeremy Miller](http://codebetter.com/blogs/jeremy.miller/) wrote about Agile practices and how they can help [staunch the flow of defects](http://codebetter.com/blogs/jeremy.miller/archive/2005/08/25/131236.aspx). He describes some of the reasons that can introduce bugs, such as just plain developer mistakes, requirements that aren’t understood and edge cases. These are the cases that you just didn’t expect that would happen. I’ll get back on this later.

Jeremy also points out an invalid test environment can be one of the sources that can introduce bugs. Of course these are bugs that aren’t really there. The tester however just sees something’s not working and reports this in his tool. A (large part of the) solution would be to use automated builds and [Continuous integration](http://www.martinfowler.com/articles/continuousIntegration.html) (CI). He even goes as far as to say that *any project team that doesn’t have a dependable automated build of some sort is amateurish*.

I would recommend, that when you setup a project, use the time to setup automated builds and CI and you’ll experience the benefits for yourself after a while.

Back to the edge cases, as promised. Jeremy links to Jonathan Kohl his blog, and especially an article about where Jonathan describes how he reproduces an non-reproducible bug. In a nutshell, Jonathan tries to find out why one particular tester keeps finding a bug that no one can reproduce. The bug is found in some code that’s inside an installer. It tries to embed some code into a device. But because of the connection to the device that’s not fully seated, and the device itself was rocking a little because of some elements and during typing, the upload failed and timing issues occurred. The installer didn’t respond correctly to these facts and the bug was found. Jonathan noticed the rocking of the device from the corner of his eye, and he simulated everything at his own desk by doing the installation, while rocking his desk with his knee. His colleagues thought he was crazy, but after explaining the developer went from "that can’t happen" to "uh oh, I didn’t test if the system time is back in time, *and* that the connection to the device is down during installation to trap the error."

How’s that for a tester? [Follow his weblog here](http://www.kohl.ca/blog/). I think developers might learn from reading the occasional blogs like these. Developers and tester (should) work together tightly, so learn how they think, get inside their heads. In my experience most developers "hate" testers. At least I know I do some times, especially when discussing the term ‘showstopper’! 😉

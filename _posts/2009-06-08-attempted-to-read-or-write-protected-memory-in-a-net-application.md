---
layout: post
id: 481779
author: Dennis van der Stelt
date: 20090608 064037
title: Attempted to read or write protected memory in a .NET application
description: Now this got me puzzled today for some time. I started up Visual Studio 2008 and open...
categories:
    - Development
    - Visual Studio 2008
redirect_from:
  - "/dennis/2009/06/08/attempted-to-read-or-write-protected-memory-in-a-net-application"
  - "/blogs/dennis/archive/2009/06/08/attempted-to-read-or-write-protected-memory-in-a-net-application.aspx"
---

Now this got me puzzled today for some time. I started up Visual Studio 2008 and opened a solution I had been working on for some time. But when trying to debug the application, it threw an error on Unity and the SerivceLocator trying to get an instance of a class. Not an interface, a class. It had no constructor nor dependency properties or anything weird, but I used Unity because it was supposed to in the future.

Anyway, I got an error from Unity and some inner exception said

> Attempted to read or write protected memory. This is often an indication that other memory is corrupt.

Now that was super weird of course. Weirder even was that all tests, also using Unity,  still all succeeded. So I replaced the line of code to instantiate the class by hand and it worked. A few lines further LINQ was used and the same error occurred. So I tried everything from running other applications and opening other VS2008 solutions, doing memory tests, etc, etc. Everything worked fine, but just this one project I was supposed to work on.

I Googled and even Blinged for some time, without finding anything relevant. Until I stumbled upon [this thread](http://social.msdn.microsoft.com/Forums/en-US/csharpgeneral/thread/6adca20b-649f-41a4-8fa1-09534882d76c) in the Microsoft forums. There they did not find the error just weird, but wierd even.

Anyway, the solution was to enable JIT optimization. In other words, in Visual Studio 2008 choose “Tools” and then “Options”. Select “Debugging” and “General” and find the line that says “Suppress JIT optimization on module load”. This kind of makes sure that the debugger and the JIT compiled code aren’t running out of sync because the JIT compiler is such a super duper optimizer of your code. This did the trick.

Of course my code is so much optimized it never runs out of sync, but it still didn’t feel good. So I was trying to reproduce the error and turned “Supress JIT optimization” on again. To my even bigger surprise, the error did not return and my application is working just fine again. This even more ensured me turning it on or off on my own code, does not make a difference… 😉

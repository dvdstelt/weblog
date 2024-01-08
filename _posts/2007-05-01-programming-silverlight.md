---
layout: post
id: 185868
author: Dennis van der Stelt
date: 20070501 104145
title: Programming Silverlight
description: Just attended a session about Silverlight development using managed code. I’m startin...
categories:
    - MIX07
    - Silverlight
tags:
  - MIX07
  - Silverlight
redirect_from:
  - "/dennis/2007/05/01/programming-silverlight"
  - "/blogs/dennis/archive/2007/05/01/programming-silverlight.aspx"
---

Just attended a session about Silverlight development using managed code. I’m starting to love Silverlight the more I get to know about it. Some details about the current alpha version.

Silverlight is:
* Silverlight 1.0
* Managed Code (CLR)
* XAML Extensibility
* User Controls
* Contains sample controls

Some other info
* It has webservices support, so you can grab data from those.  
WCF support is on in the roadmap, so although currently unsure, they want it in.
* Asynchronous support.  
I’m guessing they’re simply using wsdl.exe to generate proxy classes. Generated proxy classes by wsdl.exe have this in them, but it immediately answered a question from the audience if Silverlight also supported multithreading.
* Basic XML support.  
Currently they don’t have XPath or XSD support, but it’s also in the roadmap.
* Linq support
* ScriptableAttribute makes that your class and/or methods are accessible from javascript. Quite cool.
* Someone from the audience asked if sessions could be accessed as well. Of course sessions are server-side and Silverlight runs completely client-side. The cool thing about this is that it’s (sort of) statefull, which is probably one of the reasons I like it so much! 😉

I’m now going to listen to the master; Nikhil Kothari.  
More to come, stay tuned!



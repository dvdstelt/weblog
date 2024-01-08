---
layout: post
id: 9059
author: Dennis van der Stelt
date: 20050823 032900
title: COM Interop registration failed.
description: I’m currently at a client where they use Excel extensivly. They use C++ libraries for...
categories:
    - Development
redirect_from:
  - "/dennis/2005/08/23/com-interop-registration-failed"
  - "/blogs/dennis/archive/2005/08/23/com-interop-registration-failed.aspx"
---

I’m currently at a client where they use Excel extensivly. They use C++ libraries for heavy calculations, C# for some other libraries and if I’m correct, VB6 to let Excel speak to all those libraries. A pretty wicked configuration, if you ask me. Worth mentioning is that they tried talking from within (managed) C# to the (unmanaged) C++ code and made <u>a lot</u> of calls to the other side. A lot. They were kind of surprised that it was so slow.

But anyway, the problem was that although the C# code was compiling properly, increasing build numbers every time, inside every assembly a reference to a specific interface assembly was wrong, referencing and old version. This was the error we got:

<font face="Courier New" size="2"></font>

> COM Interop registration failed. Type library exporter encountered an error while processing ‘xxx’. Error: Type library exporter can not load type XXX.Xxx.xxx (error: System.IO.FileLoadException: The located assembly’s manifest definition with name ‘yyy’ does not match the assembly reference.

<font face="Arial" size="2"></font>

The solution to this is, to remove all references to the specific assembly and shut down Visual Studio. VS.NET 2001 in our case.  
 Then load up VS.NET again and add the references again. Then it should work.

It seems that VS.NET imports the Type Library of the COM enabled assembly when adding a referencing to it. When you just remove the reference and add it immediatly again, the old Type Library remains in memory and it’s not updated.

One of those things you just have to know. Luckely for our client, Richard van der Pal did know and helped us out!

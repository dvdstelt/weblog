---
layout: post
id: 649
author: Dennis van der Stelt
date: 20040320 105000
title: C# vs. VB.NET again
description: In one of the questions posted on the C# Frequently Asked Questions blog, they talk a...
categories:
    - Development
redirect_from:
  - "/dennis/2004/03/20/c-vs-vb-net-again"
  - "/blogs/dennis/archive/2004/03/20/c-vs-vb-net-again.aspx"
---

In one of the questions posted on the [C# Frequently Asked Questions](http://blogs.msdn.com/csharpfaq) blog, they talk about [the advantages of C# over VB.NET](http://blogs.msdn.com/csharpfaq/archive/2004/03/11/87816.aspx). As always, this is something a lot of discussions have been going around, but it’s nice to hear a sum up from the C# team itself. But with some of the points I seriously question their opinion on some of the legacy stuff.
**Some of the VB.NET advantages:** * Support for optional parameters – very handy for some COM interoperability  
Seriously, couldn’t this be promoted differently? I know some VB.NET developers still using this feature, because it’s so handy, and not just for COM interoperability. Isn’t it just legacy, still available in a very new development platform?  
* Various legacy VB functions (provided in the <font face="Courier New">Microsoft.VisualBasic</font> namespace)  
Again, this legacy, why did they add this to .NET? They only reason I can think of, why this is still here, is because their VB2VB.NET converter couldn’t handle those functions. Or am I missing something here?  
* The <font face="Courier New">with</font> construct: it’s a matter of debate as to wether this is an advantage or not, but it’s certainly a difference.  
Now this I could live with, the with construct. On the [Ask a C# Language Designer](http://www.gotdotnet.com/team/csharp/learn/columns/ask.aspx#with) page they try to answer this and the only reasons are because there are only small or non-existent readability benefits (which I don’t agree with), increased language complexity (which is not my problem) and because of the C++ heritage (which I also don’t get, because C# was promoted to have the benefits of multiple languages). They even admit the with construct delivers more performance.
**Then ofcourse the C# advantages:** * XML documentation  
NDoc rules, doesn’t it?! 🙂

And then some other things like operator overloading, using statement and unsafe code, which just aren’t in VB.NET.  
Anyway, my point is, that the legacy advantages of VB.NET aren’t advantages. I still don’t care what choice people make or what language I have to develop my projects in (although I prefer C#) I just don’t get it when people come up with these legacy advantages.

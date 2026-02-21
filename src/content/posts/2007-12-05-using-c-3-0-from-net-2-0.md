---
id: 443407
author: Dennis van der Stelt
title: Using C# 3.0 from .NET 2.0
description: Yesterday I wrote an article on the property snippet in Visual Studio 2008 and that i...
pubDate: '2007-12-05T08:48:00'
tags:
  - .NET Framework 2.0
  - .NET Framework 3.5
  - Visual Studio 2005
  - Visual Studio 2008
redirect_from:
  - /dennis/2007/12/05/using-c-3-0-from-net-2-0
  - /blogs/dennis/archive/2007/12/05/using-c-3-0-from-net-2-0.aspx
---
Yesterday I wrote an article on the property snippet in Visual Studio 2008 and that it had changed from Visual Studio 2005.Only a few hours later, I questioned myself if even a few people might be interested in this. Not because of the snippet, but because of the abilities that Visual Studio 2008 and its C# compiler bring you.

<font color="#808080">Note : I do have interest for it, because I still have to teach people .NET 2.0.They look ‘gobsmacked’ at the automatic properties and as I don’t want to confuse them, I still like to have the old property snippet! 🙂</font>

[Daniel Moth](http://www.danielmoth.com/Blog/ "Über guru, influencer, hero, superman, etc, etc...") reminded me of an article of him from back in may, where he wrote about [using C# 3.0 features in .NET 2.0](http://www.danielmoth.com/Blog/2007/05/using-c-30-from-net-20.html) and the confusion in discussions about this ‘feature’.

The truth is, some of the new C# 3.0 features are purely compiler magic. So when you’re using Visual Studio 2008 and are working on a .NET 2.0 project, you *can* use a selected set new features. Not because they’re C# 3.0 features, but because they’re features of the new compiler!
* Local variable inference  
* Object initializers  
* Anonymous types  
* Lambda expressions

Daniel also explains that other features don’t work, because they rely on the [System.Core.dll](http://www.danielmoth.com/Blog/2007/02/systemcoredll.html) assembly. If you want to use extension methods for example, that’s not possible. You’re missing the ExtensionAttribute. Copy the following code into a Visual Studio 2008 .NET 2.0 project.

<div>  

<span>public</span> <span>static</span> <span>class</span> <span>Extensions</span>

{

  <span>///</span><span> </span><span><summary></summary></span>

  <span>///</span><span> Example of an extension method in C# 2.0</span>

  <span>///</span><span> </span><span></span>

  <span>///</span><span> </span><span><param name="”s”"></span><span>This disappears</span><span></span>

  <span>///</span><span> </span><span><param name="”value”"></span><span>The character to look for in the string</span><span></span>

  <span>///</span><span> </span><span><returns></returns></span><span>The number of times the specified character exists in the string.</span><span></span>

  <span>public</span> <span>static</span> <span>int</span> CountChars(<span>this</span> <span>string</span> s, <span>char</span> value)

  {

    <span>int</span> startIndex = 0, foundAt = 0, timesCounted = 0;

    <span>while</span> ((foundAt = s.IndexOf(value, startIndex)) != -1)

    {

      startIndex = foundAt + 1;

      timesCounted++;

    }

    <span>return</span> timesCounted;

  }

}
</div>  

Now you get a nice error…

[![extensionmethoderror](/images/using-c-3-0-from-net-2-0/extensionmethoderror_thumb.png)](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/WindowsLiveWriter/UsingC3.0from.NET2.0_11681/extensionmethoderror_2.png) 

Daniel again explains that this is really easy by adding that attribute ourselves. Check his [C# 3.0 features in .NET 2.0](http://www.danielmoth.com/Blog/2007/05/using-c-30-from-net-20.html) article for it. I’ve created a full solution though, which you can download at the bottom.

But Daniel goes even further by explaining how you can make LINQ work in .NET 2.0.Don’t forget that LINQ isn’t ‘just’ all compiler magic. The query expressions (using ‘from’, ‘where’, ‘select’, etc. (stand-alone) keywords) are, but the operators aren’t. Daniel explains the differences [over here](http://www.danielmoth.com/Blog/2007/02/decomposing-linq.html). Of course all the implementations of LINQ to objects, LINQ to SQL, LINQ to XML, etc live in the .NET Framework 3.5 assemblies. But what if we were to write our own? Again, there’s an example for this and you can guess from who. Find it [here](http://www.danielmoth.com/Blog/Moth.Linq.cs).

After implementing that class, you can easily write the following code in your .NET 2.0 project.

<div>  

<span>var</span> ints = <span>new</span>[] { 1, 2, 3, 4 };

<span>var</span> res2 = <span>from</span> p <span>in</span> ints

          <span>where</span> p > 2

          <span>select</span> p;
</div>  

Now isn’t that just cool?

Remember though, if you’re on a .NET 2.0 project and the other developers don’t have Visual Studio 2008 installed, you’re in for a problem. This doesn’t work in Visual Studio 2005!

Download the [solution with all the code here](https://bloggingabout-linux.azurewebsites.net/files/folders/443413/download.aspx).

---
layout: post
id: 442892
author: Dennis van der Stelt
date: 20071204 112401
title: Automatic properties and replacing the Visual Studio 2008 ‘prop’ snippet
description: In .NET Framework 3.5, we’ve gained automatic properties. Automatic properties are re...
categories:
    - .NET Framework 3.5
    - Visual Studio 2008
tags:
  - Visual Studio 2008
  - Visual Studio 2005
  - .NET Framework 3.5
  - .NET 3.5
  - C#
redirect_from:
  - "/dennis/2007/12/04/automatic-properties-and-replacing-the-visual-studio-2008-prop-snippet"
  - "/blogs/dennis/archive/2007/12/04/automatic-properties-and-replacing-the-visual-studio-2008-prop-snippet.aspx"
---

In .NET Framework 3.5, we’ve gained automatic properties. Automatic properties are really simple to understand. Instead of writing a full getter and setter with a private field (called a backing field, because it belongs to the property) you just write your property like this.


```csharp
namespace ClassA.Examples.AutomaticProperties
{
  public class Customer
  {
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string City { get; set; }
  }
}
```

The compiler creates a ‘real’ property with a backing field, which you can view with [Reflector](http://www.aisto.com/roeder/dotnet/ ".NET Reflector") or ildasm.

![automaticproperties](/images/automatic-properties-and-replacing-the-visual-studio-2008-prop-snippet/automaticproperties_3.png) 

If you want more info, check out [this blog entry](http://community.bartdesmet.net/blogs/bart/archive/2007/03/03/c-3-0-automatic-properties-explained.aspx "Automatic properties explained") by Bart de Smet.

Why I’m writing this, is because of the property snippet. I used to use the property snippet a lot, which produces some handy templated code. Visual Studio 2008 supports multi targeting and you can write software focused on the .NET Framework 2.0, 3.0 or 3.5.So you can develop an application without ever touching .NET Framework 3.5 or C# 3.0.Until you want to create properties… The new property snippet is based on the automatic properties in C# 3.0.
To solve this problem, first change the name of your original snippet from prop.snippet to aprop.snippet, where aprop stands for “automatic property”. You can find the property in the following folder, if installed at the default location.

![snippets_location](/images/automatic-properties-and-replacing-the-visual-studio-2008-prop-snippet/snippets_location_3.png) 

Just changing the filename isn’t it though. Below is the copy of the original Visual Studio 2005 property snippet. Notice the **Title** and **ShortCut** elements. In your aprop.snippet you should change this accordingly. Then copy the code below and create a new prop.snippet in the same folder. That’s it.


```csharp
<?xml version="1.0" encoding="utf-8" ?>
<codesnippets xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
  <codesnippet format="1.0.0">

      <shortcut>prop</shortcut>
      <description>Code snippet for VS2005 property and backing field</description>
      <author>Microsoft Corporation</author>
      <snippettypes>
        <snippettype>Expansion</snippettype>
      </snippettypes>

    <snippet>  
      <declarations>
        <literal>
          <id>type</id>
          <tooltip>Property type</tooltip>
          <default>int</default>
        </literal>
        <literal>
          <id>property</id>
          <tooltip>Property name</tooltip>
          <default>MyProperty</default>
        </literal>
        <literal>
          <id>field</id>
          <tooltip>The variable backing this property</tooltip>
          <default>myVar</default>
        </literal>
      </declarations>
      <code language="csharp"><![CDATA[private $type$ $field$;

  public $type$ $property$
  {
    get { return $field$;}
    set { $field$ = value;}
  }
  $end$]]>
      </code>
    </snippet>
  </codesnippet>
</codesnippets>
```
**UPDATE :** That’s really funny, while writing this article, Daniel Moth was doing [exactly the same](http://www.danielmoth.com/Blog/2007/12/code-snippet-for-property-old-style.html)… Well, not this one, but one a bit shorter. That’s why my article was posted half an hour later! 😉



---
id: 460143
author: Dennis van der Stelt
title: Stopwatch snippet
description: A little snippet that I use from time to time when I need information on how long som...
pubDate: '2008-06-11T10:00:53'
tags:
  - Development
  - Team System
  - Visual Studio 2005
  - Visual Studio 2008
redirect_from:
  - /dennis/2008/06/11/stopwatch-snippet
  - /blogs/dennis/archive/2008/06/11/stopwatch-snippet.aspx
---
A little snippet that I use from time to time when I need information on how long something takes. Type ‘sw’ (without the quotes) and [tab-tab](http://blogs.msdn.com/saraford/archive/2008/06/10/did-you-know-you-can-insert-a-snippet-via-tab-tab-234.aspx).

Installation is easy, just create a file called “sw.snippet” in your %Documents%Visual Studio 2008Code Snippets folder and paste the following in the file. You can use it immediately without restarting Visual Studio.


```csharp
<?xml version="1.0" encoding="utf-8" ?>
<codesnippets xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
  <codesnippet format="1.0.0">

      <shortcut>sw</shortcut>
      <description>Code snippet for adding complete Stopwatch usage and display of elapsed time.</description>
      <author>Dennis van der Stelt</author>
      <snippettypes>
        <snippettype>Expansion</snippettype>
      </snippettypes>

    <snippet>
      <references>
        <reference>
          <assembly>System.Diagnostics</assembly>
        </reference>
      </references>
      <code language="csharp">
        <![CDATA[Stopwatch sw = new Stopwatch();
      sw.Start();

      sw.Stop();

      TimeSpan ts = sw.Elapsed;
      string elapsedTime = String.Format("{0:00}:{1:00}:{2:00}.{3:00}",
                                          ts.Hours, ts.Minutes, ts.Seconds,
                                          ts.Milliseconds / 10);
      Console.WriteLine(String.Format("nnProcessing time : {0}", elapsedTime));]]>
      </code>
    </snippet>
  </codesnippet>
</codesnippets>
```

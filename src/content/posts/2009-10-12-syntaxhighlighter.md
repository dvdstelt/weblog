---
id: 482301
author: Dennis van der Stelt
title: Syntaxhighlighter
description: I’ve tried a lot of tools and addons to use syntax highlighting on my weblog and Blog...
pubDate: '2009-10-12T06:10:43'
tags:
  - blogging
  - Utilities
redirect_from:
  - /dennis/2009/10/12/syntaxhighlighter
  - /blogs/dennis/archive/2009/10/12/syntaxhighlighter.aspx
---
I’ve tried a lot of tools and addons to use syntax highlighting on my weblog and [BloggingAbout.NET](https://bloggingabout-linux.azurewebsites.net/) in general. I’ve fallen in love with two of them.
* [CopySourceAsHtml](http://copysourceashtml.codeplex.com/) by Colin Coller
* [SyntaxHighlighter](http://alexgorbatchev.com/wiki/SyntaxHighlighter) by Alex Gorbatchev

The first I use to use for my weblog. But this causes a lot of markup within the code and it can never be changed later on. I still use CopySourceAsHtml for posting in PowerPoint, Word and other tools though. Simply because it’s really, really good and easy to use from within Visual Studio.

SyntaxHighlighter is a set of Javascript that gives your code its color after it’s being displayed, ie. when the page has loaded. The code itself is rendered within <pre> tags and has no specific markup in HTML for the coloring. This makes the highlighting a bit slower, but with the additional benefits that there’s no extensive markup in the code, that the coloring libraries can be updated. Additionally a popup window is displayed for easily copying the code and some other useful buttons.

For installation I’ll redirect you to the official site.
**SyntaxHighlighter plugin for Windows Live Writer : PreCode** What makes my life especially easy as a blogger, is this plugin called "[PreCode](http://precode.codeplex.com/)". The plugin fits nicely into [Windows Live Writer](http://windowslivewriter.spaces.live.com/) and with a popup window, a paste and a fix indentation you have some new code layed out on your weblog. Could not be any easier.

This is the end result:

```csharp
namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            for (int i = 0; i < 10; i++)
            {
                Console.WriteLine("Hello world");
            }
        }
    }
}
```
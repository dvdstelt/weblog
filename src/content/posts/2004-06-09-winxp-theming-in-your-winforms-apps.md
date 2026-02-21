---
id: 980
author: Dennis van der Stelt
title: WinXP theming in your Winforms apps
description: I’m about to embark an adventure called Developing a .NET Windows Forms application w...
pubDate: '2004-06-09T10:10:00'
tags:
  - Development
redirect_from:
  - /dennis/2004/06/09/winxp-theming-in-your-winforms-apps
  - /blogs/dennis/archive/2004/06/09/winxp-theming-in-your-winforms-apps.aspx
---
I’m about to embark an adventure called *Developing a .NET Windows Forms application* with a collegue of mine. Untill now, I only embarked web applications, so this is a new one.

My collegue included a class he found on CodeProject, to handle WinXP theme support very easily. With every form load, you just add the following code and it supports WinXP themes. When activated ofcourse, which I never do! But the support in our application is nice nevertheless.

You can [find the class here](http://www.codeproject.com/csharp/HugoWinXpStyle.asp).

<font size="1"></font>

<font face="Courier New"><font color="#0000ff">private</font> <font color="#0000ff">void</font> MainForm_Load(<font color="#0000ff">object</font> sender, System.EventArgs e)  
</font><font face="Courier New">{  
</font><font face="Courier New">    WinXpStyle.FormLoad(sender, e, <font color="#0000ff">this</font><font size="1"><font size="2">);  
}</font></font></font>
**Now playing:** [Jessica Simpson](http://phobos.apple.com/WebObjects/MZSearch.woa/wa/advancedSearchResults?artistTerm=Jessica Simpson) – [Sweetest Skin](http://phobos.apple.com/WebObjects/MZSearch.woa/wa/advancedSearchResults?songTerm=Sweetest Skin&artistTerm=Jessica Simpson)

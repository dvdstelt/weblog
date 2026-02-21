---
id: 1717
author: Dennis van der Stelt
title: XmlPreprocess released
description: Now here’s another very pretty tool that can use an introduction. I’m talking about t...
pubDate: '2004-12-16T10:12:00'
tags:
  - Development
redirect_from:
  - /dennis/2004/12/16/xmlpreprocess-released
  - /blogs/dennis/archive/2004/12/16/xmlpreprocess-released.aspx
---
Now here’s [another very pretty tool](http://weblogs.asp.net/lorenh/archive/2004/12/14/307144.aspx) that can use an introduction. I’m talking about the XmlPreprocessor which has just been released. It’s a command line driven utility which will alter, for example, your web.config or app.config based on paramters and some conditions.

The the following example:

<configuration>  
 <system.web>  
 <font color="#008000"><!– ifdef ${production} –>  
 <!– <compilation defaultLanguage=”c#” debug=”false”/> –>  
 <!– else –>  
 </font><compilation defaultlanguage="”c#”" debug="”true”/">  
 <font color="#008000"><!– endif –>  
 </font></compilation></system.web>  
</configuration>

It will produce the following config file upon production release:

<configuration>  
 <system.web>  
 <compilation defaultlanguage="”c#”" debug="”false”/">  
 </compilation></system.web>  
</configuration>

You can insert the tool inside your built process or include it in an MSI script. Very powerfull and probably what a lot of projects need. There’s some discussion going on [here](http://weblogs.asp.net/jgalloway/archive/2004/12/15/309902.aspx) and [a reply here](http://weblogs.asp.net/lorenh/archive/2004/12/15/316528.aspx), but I think that it’s a nice ‘hack’.

Get the tool here : [http://xmlpreprocess.sourceforge.net/](http://xmlpreprocess.sourceforge.net/)

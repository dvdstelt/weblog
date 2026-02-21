---
id: 10979
author: Dennis van der Stelt
title: WF Beta 2  Developing on beta software
description: As said before, we’re using Windows Workflow Foundation (WF) to support flexible proc...
pubDate: '2006-02-07T06:20:00'
tags:
  - .NET Framework 3.0
  - Architecture and Design
redirect_from:
  - /dennis/2006/02/07/wf-beta-2-developing-on-beta-software
  - /blogs/dennis/archive/2006/02/07/wf-beta-2-developing-on-beta-software.aspx
---
As [said before](https://bloggingabout.net/2006/01/16/10792), we’re using Windows Workflow Foundation (WF) to support flexible processes within our application. Read [Marc’s blog](http://www.marcvandewert.nl/PermaLink,guid,54cf6768-5aa3-481f-bab1-69751a6cf328.aspx) about our experiences.

[Anko Duizer](http://www.ankoduizer.nl/PermaLink,guid,2d4b8d29-c15b-4170-8101-76cd6dc58acd.aspx) already mentioned WF being quite difficult, and he had doubts about the mainstream developers picking up WF, as Microsoft expects. But I didn’t expect it to be so difficult. The fact that we don’t have a lot of documentation and even less support, probably influences our judgement on the product. But it’s also pretty complex when you consider you need a lot of activities, with underlying activities and even more code-behind with a lot of events. And then we’re not even talking about persisting state, getting it back and having completely new architectural issues. Simple things like getting all objects in a certain state raise a lot of questions and/or issues.

And looking through release notes you notice that they’ve build a lot of things that were requested after beta 1.That might seem nice, but it doesn’t give me much confidence that they’ve build WF based on experience of what’s exactly needed in such a product. I think they’ve still got a long way to go. And as far as I can tell, this should be released together with Vista and Office 12.Pretty hard deadlines for all teams, which in my opinion can only result in pushing the date backwards.

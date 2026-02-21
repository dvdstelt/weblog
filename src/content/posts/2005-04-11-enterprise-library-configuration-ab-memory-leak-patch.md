---
id: 3362
author: Dennis van der Stelt
title: Enterprise Library – Configuration AB Memory Leak Patch
description: The Enterprise Library team recently became aware of a memory leak issue in the Confi...
pubDate: '2005-04-11T11:46:00'
tags:
  - Development
redirect_from:
  - /dennis/2005/04/11/enterprise-library-configuration-ab-memory-leak-patch
  - /blogs/dennis/archive/2005/04/11/enterprise-library-configuration-ab-memory-leak-patch.aspx
---
*The Enterprise Library team recently became aware of a memory leak issue in the Configuration Application Block, which is used by all other blocks in Enterprise Library.* [<font color="#0000cc">*Patch 1475*</font>](http://javascript:showDisclaimer(%20'/workspaces/releases/checkForDownload.aspx?id=83c68646-befb-4586-ba9f-fdf1301902f5&releaseid=7a1f4d8b-53f4-46b7-b571-66fac3ca4d8a' );)*, available in the Releases section of the site, contains a fix to the issue. Because the issue has the potential to impact many applications that use Enterprise Library, Microsoft strongly advises all users of Enterprise Library (January 2005) to install this patch and recompile all applications that use any of the application blocks.* <font face="Arial" size="2">So it seems important enough to spam this over hundreds of blogs! 😉</font>

You can find the [download here](http://www.gotdotnet.com/workspaces/workspace.aspx?id=295a464a-6072-4e25-94e2-91be63527327).

[Via [Ohad](http://weblogs.asp.net/israelio/archive/2005/04/09/397790.aspx)]

<!-- Posted by Bloggie - https://bloggingabout-linux.azurewebsites.net/rj -->

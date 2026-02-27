---
id: 11102
author: Dennis van der Stelt
title: Diving deep into SQLServer 2005
description: My colleague Anko Duizer has created a rather extensive list of do’s and dont’s about...
pubDate: '2006-02-17T03:24:00'
tags:
  - architecture
  - Development
redirect_from:
  - /dennis/2006/02/17/diving-deep-into-sql-server-2005
  - /blogs/dennis/archive/2006/02/17/diving-deep-into-sql-server-2005.aspx
---
<div>My colleague Anko Duizer has created a rather [extensive list of do’s and dont’s](http://www.ankoduizer.nl/PermaLink,guid,787fe50b-42da-4215-a923-d157b67041bd.aspx) about SQL-Server. There are some tips in there that are incredibly important, and perhaps he can illuminate some of those in the future. Like why you should avoid the use of GUIDs, you must not prefix stored procedures with ‘sp_’ and more like these.</div>
<div> </div>
<div>I’ve recently took a glimpse at a PowerPoint slide-deck by [Rob Howard](http://weblogs.asp.net/rhoward/archive/2004/05/28/143830.aspx) about the [performance of sites](http://www.rob-howard.net/Downloads/TechEd04-US/Running_www.asp.net.zip). For all asp.net sites (site, forum, blogs, etc), blogs.msdn.com, dotnetnuke.com and aspinsiders.com, they have only two web servers and one database server running. Rob shows for example, how their physical database server is running on three separate RAID0 configurations, one for OS, one for data and one for logs. The performance gain was incredible once implemented. This is also one of the tips Anko mentions, between the 46 others. Just nice to know how to boost performance of your database server.</div>
<div> </div>
<div>Anyway, if you want to know all this yourself, you can start with taking a really deep dive into SQL-Server with Bob Beauchemin. Immediately after DevDays 2006 here in The Netherlands, he’s going to present a class at our Class-A office in Woerden. For more information about the class, [click here](http://www.class-a.nl/?id=31).</div>

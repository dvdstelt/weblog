---
id: 9554
author: Dennis van der Stelt
title: SQL Server Express 2005 compared to MSDE2000
description: Alex Thissen gives a summary on his weblog from what he has heard at the SQL Pass 200...
pubDate: '2005-09-28T09:24:00'
tags:
  - Architecture and Design
  - Development
redirect_from:
  - /dennis/2005/09/28/sql-server-express-2005-compared-to-msde2000
  - /blogs/dennis/archive/2005/09/28/sql-server-express-2005-compared-to-msde2000.aspx
---
[Alex Thissen](http://www.alexthissen.nl/weblog/) gives [a summary on his weblog](http://www.alexthissen.nl/weblog/PermaLink.aspx?Guid=054ef92c-8ddb-4121-b9bb-fba374f5f909) from what he has heard at the SQL Pass 2005 conference about SQL Server Express (SSE).

First and foremost, SSE will be free! Comparing it to MSDE2000, that version had a limit of 10 connections, where SSE will be able to share more, although Alex doesn’t tell us how much. Probably because Microsoft is still figuring out how many they’ll provide, as with more options Alex describes. The .NET CLR will be hosted in SSE and you’ll be able to do in SSE what you’re able to do in SQL Server 2005.SSE has some limits on memory and CPU-s, so it’s not as scalable as the full product, but that won’t be needed. When you’re in need of scalability, you’ll probably want the full product. Also the SQL Express Manager is a stripped down version of the full SQL Server Manager, and SSE will also support Reporting Services, although with less functionality than the full product. Other things like replication, Service Broker and more is supported.

This seems like an ideal product for small companies that aren’t always willing to pay top dollar (or euros) for a product of which most functionality they’ll never use. I’m currently at a client that’ll probably want to use some sort of database. But it only has so few customers who’ll use the application (to be written) only a few times per week or so, that it doesn’t need SQL-Server 2000.Backups are created on tape, no need for mirroring or anything. SQL Server Express seems the ideal solution here. Worth spending some more time investigating it.

Thanks Alex

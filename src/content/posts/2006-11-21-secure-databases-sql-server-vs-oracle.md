---
id: 53667
author: Dennis van der Stelt
title: Secure databases  SQL Server vs. Oracle
description: Via Steve Eichert I came across an article about database security. It’s based on sec...
pubDate: '2006-11-21T10:37:13'
tags:
  - architecture
  - Development
  - Utilities
  - SQL Server 2005
  - Oracle
redirect_from:
  - /dennis/2006/11/21/secure-databases-sql-server-vs-oracle
  - /blogs/dennis/archive/2006/11/21/secure-databases-sql-server-vs-oracle.aspx
---
Via [Steve Eichert](http://steve.emxsoftware.com/Sql+Server/What+is+more+secure+Oracle+or+SQL+Server) I came across an [article about database security](http://www.databasesecurity.com/dbsec/comparison.pdf). It’s based on security flaws that have been reported over the years by external security researchers. Only flaws affecting the database servers itself have been considered, so Oracle Application Server has not been included for example. The conclusion is clear

> *The conclusion is clear – if security robustness and a high degree of assurance are concerns when looking to purchase database server software – given these results one should not be looking at Oracle as a serious contender.* When you look at the graphs, Oracle was <u>pretty</u> secure in the past, but since 2005 the number of security flaws has increased immensely. When we look at the previous SQL Server versions, less security flaws were reported over the years. When we look at SQL Server 2005, it hasn’t had a single security flaw reported since launch.



---
layout: post
id: 126351
author: Dennis van der Stelt
date: 20070228 123808
title: Shrink your SQL 2005 transaction logfiles
description: This might come in handy for some of you, as it did for me. I normally don’t have pro...
categories:
    - SQL Server 2005
redirect_from:
  - "/dennis/2007/02/28/shrink-your-sql-2005-transaction-logfiles"
  - "/blogs/dennis/archive/2007/02/28/shrink-your-sql-2005-transaction-logfiles.aspx"
---

This might come in handy for some of you, as it did for me. I normally don’t have problems with large transaction logfiles, but on our acceptance machine we have mirrored the production database. As [it’s replicated](http://blogs.class-a.nl/blogs/anko/archive/2007/01/08/peer-to-peer-replication.aspx), the databases are installed multiple times on the machine. In theory it’d be best to have them on multiple machines (to mirror production exactly), but we chose multiple SQL Server 2005 instances.

When the transaction logfiles are growing they take up a huge amount of diskspace. So in our script to restore the environment, we’ve included a few T-SQL statements to set the recovery model to simple and shrink the transaction logfiles immediately. Here’s the code, it might come in handy when you’ve got a database on your own machine as well.

USE [master]  
GO  
ALTER DATABASE [YourDatabase] SET RECOVERY SIMPLE WITH NO_WAIT  
GO  
USE [YourDatabase]  
GO  
DBCC SHRINKFILE (YourDatabase_log, 10)  
GO 

You don’t want to set the recovery model to simple on critical databases! If you’re not sure, just don’t change the recovery model. Transactional replication uses the transaction log and if the service agent stops, all transactions are stored in the log to be synced later.

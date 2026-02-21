---
id: 330824
author: Dennis van der Stelt
title: Cannot drop database because of replication
description: Wow it’s been some time since I blogged. Mainly because of being very busy at work an...
pubDate: '2007-08-03T08:40:51'
tags:
  - SQL Server 2005
  - SQL Server
redirect_from:
  - /dennis/2007/08/03/cannot-drop-database-because-of-replication
  - /blogs/dennis/archive/2007/08/03/cannot-drop-database-because-of-replication.aspx
---
Wow it’s been some time since I blogged. Mainly because of being very busy at work and three weeks of holidays. Next week I’ll be offline again because Pascal, Alex and me will be preparing for the [.NET 3.5 Summer Class](http://www.class-a.nl/index.aspx?id=12&catID=16&sid=22) in September. If you still don’t know what it is, have a look at it and be sure to come. We’ll teach you almost everything that’s .NET 3.5 and you’ll go home knowing what a great addition it is and how to build projects using it. This won’t be a standard training, you *will know* how to use this stuff in your next projects.

Anyway, I was having some problems with dropping a database. It was the mirror of another one, mirrored by transaction log shipping. For some reason during my holidays and after some tweaking done by my client on more then one database, it failed. After having a look, some properties changed and not for the good. I decided to set it up again from scratch.

After removing transaction log shipping from the root database, I wanted to drop the database on the mirror server. Unfortunately I got the following error:

Cannot drop the database ‘xxx’ because it is being used for replication. (Microsoft SQL Server, Error: 3724)

The jobs were gone, the root database wasn’t attached anymore, but SQL Server 2005 still thought it was being used for replication. I even tried hacking the system tables using the [dedicated administrator connection](http://msdn2.microsoft.com/en-us/library/ms189595.aspx) but it just wouldn’t drop, delete, detach or anything.
**Solution** The final solution was to create a new database on another server with the same name and create a backup. After copying the backup to the server with problems, I chose to restore the backup. You can’t do this by right-clicking on the database, because it’ll only allow to restore transaction logs. Right-click the server itself and choose to restore it onto the database with problems and select to “overwrite” in the options screen.

It overwrote the database and I could delete it!



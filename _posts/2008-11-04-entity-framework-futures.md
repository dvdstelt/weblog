---
layout: post
id: 476515
author: Dennis van der Stelt
date: 20081104 084624
title: Entity Framework Futures
description: A bit late, but it was still in my drafts folder, I just had to finish it. Timothy Ma...
categories:
    - Entity Framework
    - PDC08
redirect_from:
  - "/dennis/2008/11/04/entity-framework-futures"
  - "/blogs/dennis/archive/2008/11/04/entity-framework-futures.aspx"
---

A bit late, but it was still in my drafts folder, I just had to finish it. Timothy Mallalieu presented the session on the future of Entity Framework.
**The Data Platform   
**We have so many data storage options and so many needs for data.
* **Normal data access** Users and applications get data from the database via frameworks or libraries 
* **Integration/aggregation sync          
**We get data from the cloud, services, databases, etc. 
* **Reporting          
**Reports get data from a data warehouse 
* **Management, deployment, policy & security          
**We have metadata stored in XML, databases, etc. 
* **Models and workflow          
**We have all kinds of models and workflows needing data. 

The question is, how do I get the data I need? There are a lot of options currently.
* Core Storage 
* Data access API’s and frameworks (like ADO.NET) 
* Mid-tier frameworks and technologies (like Astoria) 
* Client technologies (custom build, with as example dynamic data) 

Entity Framework and EDM are the start for creating data-models and retrieving data. Those were released with .NET Framework 3.5 SP1, but there’s much more to come, starting with SSRS (SQL Server Reporting Services) and synching data for offline usage. These will be discussed this week at PDC.
**The new features?** Entity Framework vNext will have the ability to generate the database from the EF model. In the bits that become available, all objects will be dropped from the database though, when refreshing the database from the model. As I understood, this should be fixed in the final .NET 4.0 release, if Entity Framework will be released with .NET.

Entity Framework vNext will support lazy loading. As in LINQ to SQL it’s a property and you can turn it on and off.

Entity Framework vNext will support TableValuedFunctions.

Entity Framework vNext will have support for less XML model, instead you decorate your classes with attributes.

You can find info on LINQ to SQL and stopping further development on it in [this post](http://blogs.msdn.com/adonet/archive/2008/10/29/update-on-linq-to-sql-and-linq-to-entities-roadmap.aspx) and more in [this post](http://blogs.msdn.com/adonet/archive/2008/10/31/clarifying-the-message-on-l2s-futures.aspx).

All in all I expected more from the Entity Framework Futures talk. There has been a lot of discussion about the Entity Framework and Tim just showed some v2 features. I expected more on what the grand plan was with Entity Framework. I guess this also involves “Oslo”, M and MEntity. We’ll just have to wait for more to come…

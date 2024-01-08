---
layout: post
id: 476373
author: Dennis van der Stelt
date: 20081030 045414
title: “Oslo” repositories and models
description: Just saw Chris Sells show a session on some other expects of Oslo that wasn’t introdu...
categories:
    - M Language
    - Oslo
    - PDC08
redirect_from:
  - "/dennis/2008/10/30/oslo-repositories-and-models"
  - "/blogs/dennis/archive/2008/10/30/oslo-repositories-and-models.aspx"
---

**[![IMG_3245](/images/oslo-repositories-and-models/img_5f00_3245_5f00_thumb_5f00_3ea8adde.jpg)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/IMG_5F00_3245_5F00_13846271.jpg)**Just saw Chris Sells show a session on some other expects of Oslo that wasn’t introduced yet.

It was again stated that the repository in Oslo is a normal SQL Server database. All your models are just SQL in the database and everything is designed for extensibility.

Some of the core features are:
* **Repository capabilities** * Repository features are built on SQL Server
    * Repository install also runs on useful features, e.g. replication and mirroring 
    * Repository features are:
    * Catalog 
    * Secure views 
    * Auditing 
    * Versioning 
    * Claims-based security, etc 

The Oslo SDK provides tools to
    * Define new models : Intellipad, Visual Studio language services 
    * Compile models : m.exe, msbuild build tasks 
    * Deploy models : mx.exe 

Again, once your models are in the database, it’s just plain SQL data.   
Currently only SQL Server is supported, but of course the next logical step is XML and especially web services to <u>put your models in the cloud</u>!!!
* **Deployment         
** Application model can be used to define applications to be deployed.   
E.g. define a web service in the repository and deploy it without writing a line of code. 

The demo shown has in the database a few rows of data in the application model on a WCF service with WF. When deploying, it’s gathering data from the database and transforming it to something the runtime can understand. In the demo shown, the extension isn’t .svc but .xamlx   
 ** **mx.exe packages SQL for deployment to repository nodes 
    * Packages can come from M files
    * packages can be exported from repository nodes
* **Security         
**Security is claims-based.
    * Identity becomes just one of several possible claims 
    * Claims presented to authorize operations against resources 

Repository tables keep track of claims, resources and operations
    * Triggers implemented on /t:Repository-generated views to check claims. Everything is stored in again in tables. 
    * Views protect against direct access to tables 

Domain-specific security containers
    * Use “folders” to partition data 
    * Apps decide which data goes into what folder 
    * Security checks happen on folder boundaries 
    * Must call the field “Folder” for compiler to find it 
    * Folder ID must exist in the Item.Folders table
* **Versioning** * Data change synchronization
    * Between nodes using SQL Server Replication and Occasionally Connected Systems
    * Import/Export using SQL Server Change Tracking, e.g. repository <-> file system
    * Schema evolution
    * Extend M type and provide backwards compatibility for old clients w/ computed values
    * SQL Server Integration Services (SSIS) for data migration

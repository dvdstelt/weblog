---
layout: post
id: 25823
author: Dennis van der Stelt
date: 20060929 023636
title: Community Server 2.1 to ASP.NET 2.0 upgrade
description: Until a few hours ago, BloggingAbout.NET ran on ASP.NET 1.1. For multiple reasons I w...
categories:
    - BloggingAbout.NET
    - Community Server
redirect_from:
  - "/dennis/2006/09/29/community-server-2-1-to-asp-net-2-0-upgrade"
  - "/blogs/dennis/archive/2006/09/29/community-server-2-1-to-asp-net-2-0-upgrade.aspx"
---

Until a few hours ago, BloggingAbout.NET ran on ASP.NET 1.1.For multiple reasons I wanted to upgrade to ASP.NET 2.0, one of them being that most Community Server addons are released ASP.NET 2.0 only. So I’ve created an exact copy of BloggingAbout.NET on my laptop and prepared the upgrade. And although I’ve taken the time to prepare everything I had some problems uploading all the files.

CS 2.1 consists of over 5000 files. So I created an entire backup just before the upgrade and deleted everything but a few folders. I really wanted a clean install as I’ve been ugrading and adding files since .Text or so. Then I tried to upload all files, but after 2500 files, the rest just kept failing. I still have no idea what it was, but I tried again after restarting my ftp client and it worked. I just hope I haven’t missed any file.

Anyway, perhaps I can help people out with their upgrade. You might want to prepare already, because Community Server 3.0 is only going to be available in ASP.NET 2.0.Here are the steps to take:
1. Backup your website
2. Backup your database
3. Upload an [app_offline.htm](http://weblogs.asp.net/scottgu/archive/2006/04/09/442332.aspx) file.  
This is a new ASP.NET 2.0 option. When it finds this file, it shows it on every page. I placed a message about BloggingAbout.NET being under maintenance.
4. Change the ASP.NET version to 2.0.  Immediatly your site will go offline, because of the file uploaded in the previous step.
5. Delete all folders except:
    1. aspnet_client
    2. FilesStorage
    3. Photos
    4. app_offline.htm
6. I also had a directory where weblog owners store their images, a temp folder and a folder where files are being stored for activity reports and such.
7. Remember to adjust the web.config connectionstrings to the correct database.
8. Upload all the files.
9. Rename app_offline.htm to some other name, so next time you’ll be able to use it again.

That’s exactly what I have done, although step 8 took a little longer than expected. Everything worked like a charm from the first start. New features I’ve added are the ReallySimpleDiscoveryHandler and new MetaWeblogHandler by [Robert McLaws](http://www.robertmclaws.com/archive/2006/09/17/New-CommunityServerStuff-Update.aspx), although I’ve modified the source so files are uploaded in a different folder. Also the fact that the original was packed together with a few other addons, is something I don’t really like, so I created a completely new assembly. From day one, [Dave Burk has requested](http://communityserver.org/blogs/dailynews/archive/2006/08/30/546566.aspx) the configurable imagedump folder, but Robert hasn’t added this yet. Perhaps I’ll do this and release the modified addon myself. So Robert, if you read this, please beat me to it! 🙂

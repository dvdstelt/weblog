---
layout: post
id: 458048
author: Dennis van der Stelt
date: 20080314 020745
title: Silverlight and clearing its isolated storage
description: I’ve been looking all around for information about Silverlight its Isolated Storage. ...
categories:
    - Silverlight
redirect_from:
  - "/dennis/2008/03/14/silverlight-and-clearing-its-isolated-storage"
  - "/blogs/dennis/archive/2008/03/14/silverlight-and-clearing-its-isolated-storage.aspx"
---

I’ve been looking all around for information about Silverlight its Isolated Storage. I was doing some tests with storing files and wanted to clear the isolated storage. I’ll repeat the same words for SEO purposes : clear silverlight isolated storage. 🙂

![silverlight_folder](/images/silverlight-and-clearing-its-isolated-storage/silverlight_folder_3.png) 

After I finally found the folder myself, using Sysinternals ProcessMonitor, I searched again on the internet if anyone had referenced the folder yet. Of course the one and only [Mike Taulty did](http://mtaulty.com/CommunityServer/blogs/mike_taultys_blog/archive/2008/03/07/10226.aspx). How come [these three English chaps](http://mtaulty.com/CommunityServer/blogs/mike_taultys_blog/archive/2008/02/25/10205.aspx) do so much great work?

The word is that the isolated storage for Silverlight is cleared when the browser cache is flushed, and perhaps it’s because of the beta, but this wasn’t my experience. If you want to clear the cache, go to the folder below, find the specific file(s) and delete them there.

> C:UsersDennisAppDataLocalLowMicrosoftSilverlightis

If you want more information about Isolated Storage in Silverlight 2, check out [this page](http://silverlight.net/Quickstarts/IsoStore/StoreData.aspx).

---
layout: post
id: 44843
author: Dennis van der Stelt
date: 20061110 123308
title: Community Server newMediaObject
description: I wanted to see if the newMediaObject module, offered by the Community Server team, h...
categories:
    - BloggingAbout.NET
    - Community Server
tags:
  - Windows Live Writer
  - newMediaObject
  - Community Server
redirect_from:
  - "/dennis/2006/11/10/community-server-newmediaobject"
  - "/blogs/dennis/archive/2006/11/10/community-server-newmediaobject.aspx"
---

I wanted to see if the newMediaObject module, [offered](http://communityserver.org/files/folders/cs_service_packs/entry555672.aspx) by the [Community Server](http://www.communityserver.org/) team, had benefits over my current implementation. Although I still have to figure out why, the implementation we had running kept creating copies of the media objects when re-publishing something. After updating, this doesn’t happen anymore, something that can save me some megabytes.

I did make a change though. We’re using George J. Capnias’ FreeTextBox wrapper and it uses the fullname as storage location. That’s why I’ve changed inside the original version. You can [download it here](/files/newMediaObject.zip).

However, if you’d like to make the changes yourself or change it to something completely else, you *can* do it yourself. Create a local copy of your community and place the .ashx file inside the /blogs/ directory and open it with Visual Studio and set a breakpoint at the first line in the MetaWeblog2.MediaObjectInfo method. Then from the VS2005 menu choose Debug -> Attach to process… Choose the aspnet_wp.exe process. Open Windows Live Writer, create a new post, insert an image and publish it. Visual Studio 2005 should pick up the request and start debugging.

The code I changed is merely the lines below the commented out lines.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: blue">if</span> (mediaObject.bits != <span style="color: blue">null</span> && !Globals.IsNullorEmpty(mediaObject.name))

{

  <span style="color: green">//AddFile(weblog.ApplicationKey, new MemoryStream(mediaObject.bits), mediaObject.bits.Length, mediaObject.name);</span>

  AddFile(username, <span style="color: blue">new</span> MemoryStream(mediaObject.bits), mediaObject.bits.Length, mediaObject.name);

  MediaObjectInfo info = <span style="color: blue">new</span> MediaObjectInfo();

  <span style="color: green">//info.url = Globals.FullPath(FileStorageUrl(weblog.ApplicationKey, mediaObject.name));</span>

  info.url = Globals.FullPath(FileStorageUrl(username, mediaObject.name));

  <span style="color: blue">return</span> info;

}

</div>


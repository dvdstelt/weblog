---
id: 476379
author: Dennis van der Stelt
title: “M” and MService
description: I’ve been talking to people and perhaps here on the blog that during the Doug Purdy t...
pubDate: '2008-10-30T07:02:25'
tags:
  - AppFabric
  - M Language
  - Oslo
  - PDC08
redirect_from:
  - /dennis/2008/10/30/m-and-mservice
  - /blogs/dennis/archive/2008/10/30/m-and-mservice.aspx
---
I’ve been talking to people and perhaps here on the blog that during the Doug Purdy talk they showed a demo of MService where, with a few lines of code, a REST enabled WCF services with WF activities was created with only so few lines of actual code.


```csharp
service Service
{
  operation PhotoUpload(stream : Stream) : Text
  {
    .PostUriTemplate = "upload";

    index : Text = invoke DateTime.Now.Ticks.ToString();
    filename : Text = "d:\demo\photo\" + index + ".jpg";
    invoke MService.ServiceHelper.StoreInFile(stream, filename);

    return index;
  }

  operation PhotoGet(index : Text) : Stream
  {
    .UriTemplate = "getphoto/{index}";
    .ContentType = "image/jpeg";

    filename : Text = "d:\demo\photo\" + index + ".jpg";
    return invoke File.OpenRead(filename);
  }

  endpoint HttpEndpoint
  {
    Binding = WebHttpBinding;
    Address = "http://localhost:8080/service/";
  }
}
```

Add breakpoints, post a photo or get one and the breakpoints are hit under debugging. You can see activities and endpoints in the locals window.

At the bottom you can see the endpoint defined. The first operation is PhotoUpload and it invokes code to store a file. Runtime this results in a WF activity storing the file on disc. The second operation is the get and it invokes a file read activity.

In the PhotoUpload operation you also see the invoke of DateTime.Now.Ticks.ToString(), which will result in a code-activity in WF, running the specified code.

This is just it, a REST enabled service for uploading, storing and retrieving images.

Remember that this is MService, including a WF/WCF runtime that understands the language ‘M’, hosted inside Dublin.

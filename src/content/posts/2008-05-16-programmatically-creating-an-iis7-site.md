---
id: 459025
author: Dennis van der Stelt
title: Programmatically creating an IIS7 site
description: I’m using FinalBuilder to build and deploy websites on our test server. FinalBuilder ...
pubDate: '2008-05-16T01:52:46'
tags:
  - Development
  - Miscellaneous
  - Utilities
redirect_from:
  - /dennis/2008/05/16/programmatically-creating-an-iis7-site
  - /blogs/dennis/archive/2008/05/16/programmatically-creating-an-iis7-site.aspx
---
I’m using FinalBuilder to build and deploy websites on our test server. FinalBuilder is a great product, but our client is using Windows Server 2008 and FinalBuilder does not have actions for IIS7.I might add the actions to my weblog, but here’s some code to create a new IIS7 website using C#.

Create a new solution and add a reference to C:WindowsSystem32InetServMicrosoft.Web.Administration.dll. Paste the following code and you’ve got yourself a website on port 82 using the default application pool. In IIS it’s named *MyCoolWebsite*.


```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Web.Administration;

namespace TestApp
{
  class Program
  {
    static void Main(string[] args)
    {
      string siteName = "MyCoolWebsite”;
      string applicationPoolName = "DefaultAppPool”;
      string virtualDirectoryPath = "/”;
      string virtualDirectoryPhysicalPath = "C:\temp\”;
      string ipAddress = "*”;
      string tcpPort = "81”;
      string hostHeader = "”;
      string applicationPath = "/”;
      long highestId = 1;

      using (ServerManager mgr = new ServerManager())
      {
        Site site = mgr.Sites["siteName”];
        if (site != null)
          return; // Site bestaat al

        ApplicationPool appPool = mgr.ApplicationPools[applicationPoolName];
        if (appPool == null)
          throw new Exception(String.Format("Application Pool: {0} does not exist.”, applicationPoolName));

        foreach (Site mysite in mgr.Sites)
        {
          if (mysite.Id > highestId)
            highestId = mysite.Id;
        }
        highestId++;

        site = mgr.Sites.CreateElement();
        site.SetAttributeValue("name”, siteName);
        site.Id = highestId;
        site.Bindings.Clear();

        string bind = ipAddress + ":” + tcpPort + ":” + hostHeader;

        Binding binding = site.Bindings.CreateElement();
        binding.Protocol = "http”;
        binding.BindingInformation = bind;
        site.Bindings.Add(binding);
        //site.Bindings.Add(bind, "http”);

        Application app = site.Applications.CreateElement();
        app.Path = applicationPath;
        app.ApplicationPoolName = applicationPoolName;
        VirtualDirectory vdir = app.VirtualDirectories.CreateElement();
        vdir.Path = virtualDirectoryPath;
        vdir.PhysicalPath = virtualDirectoryPhysicalPath;
        app.VirtualDirectories.Add(vdir);
        site.Applications.Add(app);

        mgr.Sites.Add(site);
        mgr.CommitChanges();
      }
    }
  }
}
```

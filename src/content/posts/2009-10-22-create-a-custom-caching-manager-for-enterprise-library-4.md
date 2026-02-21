---
id: 482362
author: Dennis van der Stelt
title: Create a custom caching manager for Enterprise Library 4
description: I wanted to create a custom caching manager for Enterprise Library 4 that did… nothin...
pubDate: '2009-10-22T08:06:20'
tags:
  - Enterprise Library
redirect_from:
  - /dennis/2009/10/22/create-a-custom-caching-manager-for-enterprise-library-4
  - /blogs/dennis/archive/2009/10/22/create-a-custom-caching-manager-for-enterprise-library-4.aspx
---
I wanted to create a custom caching manager for Enterprise Library 4 that did… nothing. I Googled and Binged but could not find a way to temporarily turn off caching completely. And I want that so I can do some performance tests with the websites we have on the server. I don’t want to know how fast my app is, I want to load test the server and see how it performance, with and without caching. So that’s why I decided to create a Caching Manager that did nothing.

The documentation did not tell me much though, and there are some really weird gotchas in there. Here’s the part about the custom caching manager.

[![caching_documentation](/images/create-a-custom-caching-manager-for-enterprise-library-4/0066_caching_5f00_documentation_5f00_thumb_5f00_1db62864.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/2110.caching_5F00_documentation_5F00_5019FBE3.png) 

Inherit from ICacheManager and add ‘the following configuration element’. And they’re serious about that part!!! I’ll show you why. Here’s what I did. First, I created a new Class Library and added a class named PointlessCacheManager that inherits from ICacheManager and put the attribute on top of it. I added another one for those who need it, but it’s commented out. This extra class also does absolutely nothing! 🙂 First the custom cache manager.


```csharp
//[ConfigurationElementType(typeof(PointlessCacheManagerData))]
[ConfigurationElementType(typeof(CustomCacheManagerData))]
public class PointlessCacheManager : ICacheManager
{

    public PointlessCacheManager()
    {
    }

    public PointlessCacheManager(NameValueCollection collection)
    {
    }

    public void Add(string key, object value, CacheItemPriority scavengingPriority, ICacheItemRefreshAction refreshAction, params ICacheItemExpiration[] expirations)
    {
    }

    public void Add(string key, object value)
    {
    }

    public bool Contains(string key)
    {
        return false;
    }

    public int Count
    {
        get { return 0; }
    }

    public void Flush()
    {

    }

    public object GetData(string key)
    {
        return null;
    }

    public void Remove(string key)
    {
        return;
    }

    public object this[string key]
    {
        get { return null; }
    }
}
```

If you use the CustomCacheManagerData you need the constructor with the NameValueCollection as parameter. The PointlessCacheManagerData uses the default constructor, or you can modify it to whatever you like.
**Are we done yet? Maybe almost!!!** Again, if you want to have a custom cache manager that does nothing, you’re done with adding classes and you can skip the next part and continue reading at the configuration part. If you need more, like your own configuration, read on…

Now here’s the second class, with an even lesser implementation.


```csharp
[Assembler(typeof(PointlessCacheManagerAssembler))]
public class PointlessCacheManagerData : CustomCacheManagerData
{
}
```

But this PointlessCacheManagerData class also references another class named PointlessCacheManagerAssembler. These two classes are used for reading configuration and initiating the cache manager. Here’s the last class.


```csharp
public class PointlessCacheManagerAssembler : IAssembler<icachemanager, cachemanagerdatabase="">
{
    public ICacheManager Assemble(Microsoft.Practices.ObjectBuilder2.IBuilderContext context, CacheManagerDataBase objectConfiguration, IConfigurationSource configurationSource, ConfigurationReflectionCache reflectionCache)
    {
        PointlessCacheManager createdObject = new PointlessCacheManager();
        return createdObject;
    }
}
```
**Configuration  
**[![app_config_entlib](/images/create-a-custom-caching-manager-for-enterprise-library-4/2063_app_5f00_config_5f00_entlib_5f00_thumb_5f00_3530b266.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/8831.app_5F00_config_5F00_entlib_5F00_405A3CB0.png) Now comes the fun part. You want to configure the new cache manager in your application. Most of it is pretty easy though. Open the Enterprise Library Configuration application, or open up the application configuration by right-clicking it in Visual Studio, as you can see on the right.

When the configuration is opened (either in the seperate EntLib Config app or in Visual Studio), right-click the configuration node and select “New” and “Caching Application Block”. A new node should be added and under it you should see a node called “Cache Managers” with the default cache manager under it. Right-click the “Cache Managers” node (or folder, if you will) and select “New” and “Custom Cache Manager”. This is where you’ll configure your PointlessCacheManager.

However, and this is a big however. Two even. But only if you used another class than the default CustomCacheManagerData in the attribute on top of your PointlessCacheManager. Because the documentation told you to put “[ConfigurationElementType(typeof(CustomCacheManagerData))]” on top of your custom cache manager. And as I said before, they mean what they say. Although we don’t *want* to use that class when we implement our own configuration, we need to put the CustomCacheManagerData on top anyway. If you did that and compiled the class, we can configure our custom cache manager.

[![app_config_entlib_2](/images/create-a-custom-caching-manager-for-enterprise-library-4/3644_app_5f00_config_5f00_entlib_5f00_2_5f00_thumb_5f00_00242336.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/7853.app_5F00_config_5F00_entlib_5F00_2_5F00_7C19D563.png) You can first give this one a name. I named mine “Pointless Cache Manager”. Note the spaces, the name is nowhere related to class names. Now select the “Type” key so that you can add a value. A small button should come available to select the type in an assembly. I pointed it out in the image on the left. Locate the assembly with the PointlessCacheManager in it on your harddrive. You should get the following image. If not, read on as well.

[![app_config_assembly](/images/create-a-custom-caching-manager-for-enterprise-library-4/8446_app_5f00_config_5f00_assembly_5f00_thumb_5f00_3fee09bb.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/4214.app_5F00_config_5F00_assembly_5F00_60091678.png) 
**<font color="#ff0000">REMEMBER :</font>** When you made a change, mistake or anything like this, you need to restart the host of the configuration, to be able to see the changes. In other words, when you loaded the Enterprise Library Configuration application, restart it. When you’re changing the configuration in Visual Studio, restart it. Because it loads the assembly and never refreshes it, so changes aren’t visible until you restart the host application.

Make sure you’ve got the commented out line in the PointlessCacheManager uncommented so that it exactly (!) states what the documentation states. Once you’ve configured it correctly in your application’s configuration (or web.config) you can change it back to where it states that you’re using the PointlessCacheManagerData instead of the CustomCacheManagerData, recompile and work with it.

Now you can switch back and forth between the normal en the pointless cache manager.</icachemanager,>

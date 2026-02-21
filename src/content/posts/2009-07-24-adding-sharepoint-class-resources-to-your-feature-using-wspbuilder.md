---
id: 481966
author: Dennis van der Stelt
title: Adding SharePoint class resources to your feature using WSPBuilder
description: I was having some troubles adding class resources to my SharePoint feature, while usi...
pubDate: '2009-07-24T06:05:34'
tags:
  - SharePoint
redirect_from:
  - /dennis/2009/07/24/adding-sharepoint-class-resources-to-your-feature-using-wspbuilder
  - /blogs/dennis/archive/2009/07/24/adding-sharepoint-class-resources-to-your-feature-using-wspbuilder.aspx
---
I was having some troubles adding class resources to my SharePoint feature, while using WSPBuilder. I searched quite some, and here’s what I did to make it work.

First you need to start with a good project. You can build one pretty fast if you create a new WSPBuilder project and add a “WebPart with feature” to the project. Now the WSPBuilder templates should have created a project with the 12-hive folder inside your project where your webpart feature should be specified.

[![folderstructure](/images/adding-sharepoint-class-resources-to-your-feature-using-wspbuilder/2352_folderstructure_5f00_thumb_5f00_511f6587.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/0876.folderstructure_5F00_6AF39BB6.png)If you want to add a nice .jpg image to your feature, there are two ways. Embedding it in a .resx file (that’s another blogpost) or copying it to the filesystem of the SharePoint server. Of course not manually, but from inside your feature. Here’s how.
1. Add a new folder and name it “80” 
2. Add a new folder and give it the name of your project 
3. Add the .jpg to this folder, or create subfolders if you’d like. 
4. Add the following code to your webpart to retrieve the image.

Imagine that your project is called “WebPartResources” then you’d have the structure in your project as shown in the image on the right. Right-click the project, build the WSP and you should have the roughly the following manifest.xml inside your .wsp file.


```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- Solution created by WSPBuilder. 7/23/2009 10:46:15 PM  -->
<solution xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" solutionid="c8d22333-f09b-4819-b026-a6cb7d64b41a" resetwebserver="True" xmlns="http://schemas.microsoft.com/sharepoint/">
  <assemblies>
    <assembly location="WebPartResources.dll" deploymenttarget="GlobalAssemblyCache">
      <safecontrols>
        <safecontrol assembly="WebPartResources, Version=1.0.0.0, Culture=neutral, PublicKeyToken=6763c0814d065309" namespace="WebPartResources" typename="*" safe="True"></safecontrol>
      </safecontrols>
      <classresources>
        <classresource location="dennis.jpg" filename="dennis.jpg"></classresource>
      </classresources>
    </assembly>
  </assemblies>
  <applicationresourcefiles>
    <applicationresourcefile location="WebPartResourcesdennis.jpg"></applicationresourcefile>
  </applicationresourcefiles>
  <featuremanifests>
    <featuremanifest location="WebPartWithResourcesfeature.xml"></featuremanifest>
  </featuremanifests>
</solution>
```

After deploying it, you should be able with the following code to retrieve the image from this folder, although version and publickeytoken could possible change! 🙂  

C:Program FilesCommon FilesMicrosoft Sharedweb server extensionswpresourcesWebPartResources1.0.0.0__6763c0814d065309


```csharp
SPWeb currentWeb = SPControl.GetContextWeb(Context);
Type currentType = this.GetType();
string classResourcePath = SPWebPartManager.GetClassResourcePath(currentWeb, currentType);

Image image = new Image();
image.ImageUrl = classResourcePath + "/dennis.jpg";
```

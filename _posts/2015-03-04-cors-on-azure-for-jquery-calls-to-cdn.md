---
layout: post
id: 578731
author: Dennis van der Stelt
image: '/images/cors-on-azure-for-jquery-calls-to-cdn/header.png'
date: 20150304 091720
title: CORS on Windows Azure for jquery calls to CDN
description: For a website I was verifying of images existed on our Windows Azure CDN in javascrip...
categories:
    - ASP.NET
    - Azure
tags:
  - asp.net
  - azure
  - security
redirect_from:
  - "/dennis/2015/03/04/cors-on-azure-for-jquery-calls-to-cdn"
  - "/blogs/dennis/archive/2015/03/04/cors-on-azure-for-jquery-calls-to-cdn.aspx"
---

For a website I was verifying of images existed on our Windows Azure CDN in javascript/jquery and I got a CORS error for the images.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://cdn.mydomain.com. This can be fixed by moving the resource to the same domain or enabling CORS.

I’m not going to explain what CORS is, but you can read more about it on [wikipedia](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing "CORS on Wikipedia"). What it does is not allow you to read content on DomainA from DomainB. There are rules about how this works and I was used to uploading a crossdomain.xml or clientaccesspolicy.xml file in the root of the website. But how was I supposed to do this on Azure Blob Storage which enabled our Azure CDN? Especially since the API and the .NET API are at version 4 or something, a lot of data on the internet is outdated.

I ran the following code with NuGet package [WindowsAzure.Storage version 4.3.0](http://www.nuget.org/packages/WindowsAzure.Storage/4.3.0 "Windows Azure .NET API"). You can install it via the following command:

Install-Package WindowsAzure.Storage -Version 4.3.0

It installs multiple packages. Although there are multiple ways to configure the connectionstring, in this solution I used the way it’s mostly described as in Microsoft MSDN articles; as an AppSetting.


```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
	<appsettings>
		<add key="CDNStorage" value="DefaultEndpointsProtocol=https;AccountName=##accountname##;AccountKey=##supersecretkey##"></add>
	</appsettings>
</configuration>
```

After this you can use the following code to set CORS settings.


```csharp
class Program
{
	static void Main(string[] args)
	{
		CloudStorageAccount storageAccount = CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("CDNStorage"));

		var client = storageAccount.CreateCloudBlobClient();
		var properties = client.GetServiceProperties();
		var corsSettings = properties.Cors;

		for (int i = 0; i < corsSettings.CorsRules.Count; i++)
		{
			corsSettings.CorsRules.Remove(corsSettings.CorsRules[0]);
		}
		client.SetServiceProperties(properties);

		//var corsRuleToBeRemoved = corsSettings.CorsRules.FirstOrDefault(a => a.AllowedOrigins.Contains("mydomain.com"));
		//if (corsRuleToBeRemoved != null)
		//{
		//	corsSettings.CorsRules.Remove(corsRuleToBeRemoved);
		//	client.SetServiceProperties(properties);
		//}

		var cors = new CorsRule();
		cors.AllowedOrigins.Add("mydomain.com");
		cors.AllowedOrigins.Add("http://localhost:42");
		cors.AllowedMethods = CorsHttpMethods.Get | CorsHttpMethods.Head;
		cors.MaxAgeInSeconds = 3600;
		properties.Cors.CorsRules.Add(cors);

		client.SetServiceProperties(properties);
	}
}
```

Line 05 shows retrieval of connectionstring and instantiation of the storage account.  
 Line 24 creates a new rule  
 Line 25 allows our own website  
 Line 26 is additionally for testing purposes. Remember that everyone running a website on localhost has access. not recommended in production.  
 Line 27 additionally sets both ‘get’ and ‘head’, because we verify if images are available not by retrieving them, but just verifying if they’re there.  
 Line 31 stores the settings in your storage account

The following lines are for altering current settings  
 Line 09 retrieves current CORS settings from your account  
 Line 11 runs through all settings  
 Line 13 removes every single one of them  
 Line 15 stores the settings, as in line 31  
 Line 17 uses LINQ to find a specific CORS rule inside the currently active rules

I hope this clarifies things a bit and helps others when changing (or adding) CORS settings for their domain.

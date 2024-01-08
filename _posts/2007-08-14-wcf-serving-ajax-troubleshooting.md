---
layout: post
id: 340334
author: Dennis van der Stelt
date: 20070814 011551
title: WCF serving AJAX troubleshooting
description: I hope in the RTM you’ll get more help solving your WCF Ajax problems then I currentl...
categories:
    - .NET Framework 3.5
    - ASP.NET
    - Visual Studio 2008
    - WCF
tags:
  - WCF
  - .NET 3.5
  - ASP.NET
  - ASP.NET AJAX
  - AJAX
redirect_from:
  - "/dennis/2007/08/14/wcf-serving-ajax-troubleshooting"
  - "/blogs/dennis/archive/2007/08/14/wcf-serving-ajax-troubleshooting.aspx"
---

I hope in the RTM you’ll get more help solving your WCF Ajax problems then I currently get, because I’m getting mad from time to time. In my quest for getting things to work, I learned some stuff I wanted to share. Read: have a checklist for myself because I tend to forget this kind of stuff! 😉
1. First, have a look at the errors your service reports. Right-click your service’s .svc file in Visual Studio 2008 and choose “View in browser”.   
2. If you’re using the WebScriptServiceHostFactory in your .svc file you don’t need anything in your web.config and you can remove the entire <system.servicemodel> part. This is how the .svc then should look like:

<span style="font-size: 10pt;background: yellow;font-family: 'Lucida Console'"><%</span><span style="font-size: 10pt;color: blue;font-family: 'Lucida Console'">@</span><span style="font-size: 10pt;font-family: 'Lucida Console'"> <span style="color: #a31515">ServiceHost</span> <span style="color: red">Language</span><span style="color: blue">=”C#”</span> <span style="color: red">Debug</span><span style="color: blue">=”true”</span> <span style="color: red">Service</span><span style="color: blue">=”WebApplication1.WCFAjaxService”</span> <span style="color: red">CodeBehind</span><span style="color: blue">=”Service.svc.cs” </span></span><span style="font-size: 10pt;color: red;font-family: 'Lucida Console'">Factory</span><span style="font-size: 10pt;color: blue;font-family: 'Lucida Console'">=”System.ServiceModel.Activation.WebScriptServiceHostFactory”</span><span style="font-size: 10pt;background: yellow;font-family: 'Lucida Console'">%></span>
3. The default namespace of your service is [http://tempuri.org](http://tempuri.org). You need this in your javascript creating your proxy.

<span style="font-size: 10pt;color: blue;line-height: 115%;font-family: 'Lucida Console'">var</span><span style="font-size: 10pt;line-height: 115%;font-family: 'Lucida Console'"> proxy = <span style="color: blue">new</span> tempuri.org.IWCFAjaxService();</span> 

When Internet Explorer tells you the object tempuri isn’t know, you can take a look at the generated javascript to see what the correct objectname is. By placing /js behind your service you can download the javascript.

Example : http://localhost/service.svc/js 
4. The service can’t handle multiple authentication schemes; meaning you can only have anonymous access or integrated security or another option. In IIS Management right-click your website (or virtual directory) and select the “Directory Security” tab, press the first “Edit” button for Authentication and access control and select only one checkbox.  
After this you’ll have to stop and start the website which can be done by using IISRESET in the command prompt.

When I come across more I will post them here, including an update comment.



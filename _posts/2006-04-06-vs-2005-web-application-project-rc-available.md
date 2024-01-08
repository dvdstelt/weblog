---
layout: post
id: 11915
author: Dennis van der Stelt
date: 20060406 124000
title: VS 2005 Web application project RC available
description: At my current project we’ve been working with the Visual Studio 2005 Web Application ...
categories:
    - Development
    - Team System
redirect_from:
  - "/dennis/2006/04/06/vs-2005-web-application-project-rc-available"
  - "/blogs/dennis/archive/2006/04/06/vs-2005-web-application-project-rc-available.aspx"
---

![Do not open page on F5](/images/vs-2005-web-application-project-rc-available/webprojectnostartuppage.png)At my current project we’ve been working with the Visual Studio 2005 Web Application Project since some weeks. Source Safe kept bugging us by checking in everything in the web-folder(s), so we decided to use the WebApp Project template. In our situation the web application was used for our webservice(s). Our Windows application used the webservices to retrieve data. As I’ve [epxlained here](https://bloggingabout.net/2006/02/21/11126) you can setup multiple startup projects, so it becomes really easy to debug your webservice, and you don’t need to attach your debugger to the webserver every time.

Unfortunatly, the WebApp Project template did not have the option available to *not* start up a browser once you hit the F5 button, like the normal VS2005 website has. So I emailed Scott Guthrie, he forwarded the mail to the team working on the template and we got their word that they’d include it into the final.

Although it’s not final, the release candidate is here and as promised, the option is included! Way to go!

[Download the installer here](http://msdn.microsoft.com/asp.net/reference/infrastructure/wap/default.aspx), and you might need the [VS2005 2005 upgrade](http://www.microsoft.com/downloads/details.aspx?FamilyId=8B05EE00-9554-4733-8725-3CA89DD9BFCA&displaylang=en) first, which enables support for the web project.

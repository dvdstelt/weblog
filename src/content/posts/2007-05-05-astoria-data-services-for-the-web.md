---
id: 189551
author: Dennis van der Stelt
title: Astoria, data services for the web
description: "At MIX07 I’ve seen a presentation by Pablo Castro from the ADO.NET team on a new\_proj..."
pubDate: '2007-05-05T11:46:00'
tags:
  - Architecture and Design
  - ASP.NET
  - MIX07
  - Astoria
  - XML
  - JSON
redirect_from:
  - /dennis/2007/05/05/astoria-data-services-for-the-web
  - /blogs/dennis/archive/2007/05/05/astoria-data-services-for-the-web.aspx
---
At MIX07 I’ve seen a presentation by [Pablo Castro](http://blogs.msdn.com/pablo/) from the ADO.NET team on a new project codenamed “Astoria”. It’s a new technology used for getting data over the web. It’s very useful in Ajax scenarios where you’d like some XML or, maybe even better, JSON data into your JavaScript to present on the screen. I can see this being much more performant and easy to use than writing some (web)services or something.

Information can be found on Pablo’s weblog (read the ‘[introduction](http://blogs.msdn.com/pablo/archive/2007/04/30/codename-astoria-data-services-for-the-web.aspx)‘ and the ‘[faq](http://blogs.msdn.com/pablo/archive/2007/05/03/astoria-faq-from-mix.aspx)‘) and [the website at mslivelabs](http://astoria.mslivelabs.com/). Those are quite large reads though and you might want to quickly know how this works. Think of it as a website that just presents data in the format you’d like it to be. Currently XML and JSON are supported. You retrieve the data by URLs that Astoria accepts. For example…

<font face="Courier New">**http://www.class-a.nl/trainings/** </font>…would retrieve all Class-A trainings you could register for. You’d get some info with details for it.

<font face="Courier New">**http://www.class-a.nl/trainings[WCF]/**</font>  
…would give you information about the WCF training we have.

<font face="Courier New">**http://www.class-a.nl/trainings[WCF]/modules/**</font>  
…would then give you all modules that are within the WCF training.

<font face="Courier New">**http://www.class-a.nl/schedule/2007?month=06**</font>  
…would give you all scheduled trainings for June 2007

<font face="Courier New">**http://www.class-a.nl/schedules[2007]/training[WCF]/** </font><font face="Courier New">**http://localhost/customers[class-a]/orders/**</font>  
…might give you information about the WCF training that is scheduled for June 2007.And the second URL could’ve been used to first search for all customers and then all orders for customer class-a.
**Entity Framework** It can present this data in XML, very usable for hierarchal data. But JSON is of course also very usable as it’s immediately usable within JavaScript. Astoria runs right on top of Entity Framework, so it’s not directly bound to the database. Instead, it’s entirely based on Entity Data Models coming from the Entity Framework. It’s also using the new web abilities in WCF I’ll be writing about later.

Pablo also showed an example with binding his Astoria data against a datagrid that was developed by someone from the ASP.NET team. Although only used for the demo, I can already see the masses using this as an alternative to getting data the ‘right’ way. Because it’s so easy to use Astoria, it’s also very easy to use it the ‘wrong way’. But Astoria definitely has its benefits! This is something we’ll talk more about at the [Class-A SummerClasses](http://blogs.class-a.nl/blogs/anko/archive/2007/04/18/update-summer-classes-2007.aspx)!



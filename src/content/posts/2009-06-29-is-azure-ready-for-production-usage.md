---
id: 481872
author: Dennis van der Stelt
title: Is Azure ready for production usage?
description: Last week at the SDN Event in Houten, I presented a session on Windows Azure and how ...
pubDate: '2009-06-29T07:59:25'
tags:
  - Azure
  - SDN
redirect_from:
  - /dennis/2009/06/29/is-azure-ready-for-production-usage
  - /blogs/dennis/archive/2009/06/29/is-azure-ready-for-production-usage.aspx
---
Last week at the SDN Event in Houten, I presented a session on Windows Azure and how you can develop applications on it. How it differs from developing for servers that run on premises. After the presentation, the question was asked if developing for Azure was a wise idea, as some stuff did not seem production ready.

After thinking a bit more about this, I believe the person based his question on the fact that I talked about two subjects
* Creating Azure Storage tables in the cloud and not being able to detect whether they’re there already.        
Read [this article](http://blog.smarx.com/posts/try-to-create-tables-only-once) from Steve Marx for more info, although since the article it changed a bit. Blog coming up on that. 
* Deleting all entries in a table (truncate table) isn’t (directly) possible via the API.        
You’ll have to read every entry and delete each of them manually. 

I’ve talked about this and perhaps because of this (or me) people got the impression Azure is not production ready. Maybe these issues will be solved, maybe not. These are all API related issues though and have nothing directly to due with Azure being production ready.

From what I’m observing, the Azure team is working really hard to get Azure working and perhaps spends less time on tooling and API. I’m very sure these will come in the near future, but we can already develop for Azure and it’s less important than getting a complex technology like Azure ready for release. And that’s what I am sure of, that the team is making sure Azure *will work*.
**Is Windows Azure production ready?** The short and simple answer is probably no, because Windows Azure has not been officially released yet. But in my opinion it’s definitely worth checking out, because –as I said during the presentation- Microsoft is investing heavily on it. Invest in Azure now and reap the benefits of it sooner or later. It is expected that cloud computing will be as common in usage, as plugging in an electric device and instantly getting power is common right now.

---
id: 481320
author: Dennis van der Stelt
title: Azure and Virtual Machine hours
description: I suddenly remember that Azure can supply you with analytics on how your services and...
pubDate: '2009-03-12T09:04:16'
tags:
  - azure
redirect_from:
  - /dennis/2009/03/12/azure-and-virtual-machine-hours
  - /blogs/dennis/archive/2009/03/12/azure-and-virtual-machine-hours.aspx
---
I suddenly remember that Azure can supply you with analytics on how your services and storage is doing, so I wanted to check this. Some funny results came out of this.

First of all, these statistics are about my [speed traps](/2009/02/23/cloud-service-in-azure-speedtraps/) application I blogged about before. It’s nice to know what it actually does. 
1. The application is running two roles:
    1. A web role for displaying an HTML page to the users with all speed traps. This role also has a WCF service running in the same web role.
    2. A worker role for retrieving the speed traps from my external source.
2. The application itself checks every 10 minutes if there are speed traps available. No matter if it finds any, it deletes all entries in the database and stores all found entries in the database again. 

So here are the statistics for my service and my website. Urls can be found in the previous post.

![vmhours_hourly_usage](/images/azure-and-virtual-machine-hours/vmhours_5f00_hourly_5f00_usage_5f00_thumb_5f00_5c41a06f.png) ![vmhours_daily_usage](/images/azure-and-virtual-machine-hours/vmhours_5f00_daily_5f00_usage_5f00_thumb_5f00_29056706.png) 

In the left image you can see the number of VM hours used every hour. This means that every hour of the day, I use up 4 hours of VM usage. This results in 96 VM hours per day. Which is kind of weird, as you get a max of 2000 VM hours per trial-key, which means my service should not be able to run for 21 days straight. Meaning that my speed traps service should start failing any day now! Here’s how…

 We have the production and staging environment. The staging is of course to test if your application works, so you can more confident release it to production. For every environment you can have both a worker role and a web role. Both of these have, as Microsoft states, their own virtual machine. So as I ran one production version with both a web- and worker role, I use up two virtual machine hours per hour. But as I still had my staging environment running as well, I was using up 4 virtual machine hours per hour. And as you get 2000 VM hours per token you receive from Microsoft, my service won’t be running for 21 days straight. So I immediately suspended and deleted my staging environment, hoping I can now extend my speed traps service for 5 more days. 😉 

The following two pictures are about my storage. In the left image you can see the daily network usage in megabytes. Per day I transfer a maximum of about 2 megabytes. On the right side you can see the daily storage usage in megabytes as well. The funny thing is, as I’ve told, that every time before I store the latest speed traps, I delete all current available in my table storage. But still I use up to 40 MB of storage per day. Is that accumulated? No idea.

![storage_networkusage](/images/azure-and-virtual-machine-hours/storage_5f00_networkusage_5f00_thumb_5f00_19ee882c.png) ![storage_mbstored](/images/azure-and-virtual-machine-hours/storage_5f00_mbstored_5f00_thumb_5f00_26e8683d.png)

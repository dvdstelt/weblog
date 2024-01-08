---
layout: post
id: 483383
author: Dennis van der Stelt
date: 20100525 053119
title: Microsoft AppFabric explained for SDN
description: Last Tuesday, may 18th 2010, I gave a presentation on Microsoft’s AppFabric. I explai...
categories:
    - AppFabric
    - Azure
    - SDN
    - WCF
redirect_from:
  - "/dennis/2010/05/25/microsoft-appfabric-explained-for-sdn"
  - "/blogs/dennis/archive/2010/05/25/microsoft-appfabric-explained-for-sdn.aspx"
---

Last Tuesday, may 18th 2010, I gave a presentation on Microsoft’s AppFabric. I explained that there are actually two themes of it; Windows Server AppFabric and Windows Azure AppFabric. They both have their own products.
* **Windows Server AppFabric** * Services and Workflow Management         
This is sometimes called “Hosting” and was known under its codename “Dublin”
    * Caching         
Distributed caching which was known under its codename “Velocity”
* **Windows Azure AppFabric** This was known under its previous name as “.NET Services”
    * ServiceBus         
This is used to connect applications through firewalls, proxies and NAT.
    * Access Control         
Once you’ve connected your applications, you might want to secure the connection.          
This is also used to map different identity stores so you don’t need federated identities.

You can download the [slidedeck](/files/AppFabric.pptx) and the [demos](/files/MicrosoftAppFabricSDN.zip).

A short review on all 4 products
1. **Services and Workflow Manangement** This seems quite cool and quite stable. Surely something you’d want to use asap if you’re running WCF services and/or WF workflows.
2. **Caching** This one is quite hard to grasp at first, especially the terminology used. It’s also a shame there are no decent tools to work with and monitor stuff. Try to introduce this within your IT department as they need to provide one or more machines as a caching server. I’m going to try though!
3. **ServiceBus** Not very difficult to grasp and use, but you sure need to find a good project to be able to introduce this.
4. **Access Control** One of the hardest parts of the AppFabric, but isn’t security always a bitch? But Access Controls probably tops those all as there aren’t any good examples for mapping identities and no tools whatsoever to support it.

[Let me know](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/contact.aspx) if you have any experience with these or if you’re planning on using it!

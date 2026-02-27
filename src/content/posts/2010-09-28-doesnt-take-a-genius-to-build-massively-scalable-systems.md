---
id: 484103
author: Dennis van der Stelt
title: Doesn’t take a genius to build massively scalable systems
description: I was just watching Bytes by MSDN where Billy Hollis interviews Ron Jacobs, Sr. Techn...
pubDate: '2010-09-28T02:21:13'
tags:
  - AppFabric
  - architecture
  - azure
redirect_from:
  - /dennis/2010/09/28/doesnt-take-a-genius-to-build-massively-scalable-systems
  - /blogs/dennis/archive/2010/09/28/doesnt-take-a-genius-to-build-massively-scalable-systems.aspx
---
I was just watching [Bytes by MSDN](http://channel9.msdn.com/Blogs/Bytes+by+MSDN) where [Billy Hollis](http://www.slmasters.net/#/Home) [interviews](http://channel9.msdn.com/Blogs/Bytes+by+MSDN/Bytes-by-MSDN-Ron-Jacobs-and-Billy-Hollis-discuss-Windows-Server-AppFabric) [Ron Jacobs](http://blogs.msdn.com/b/rjacobs/), Sr. Technical Evangelist for the Microsoft Server AppFabric platform. Billy Hollis asked him if it’s a big cliff to start using this awesome power that is AppFabric. Here’s what Ron said:

> It’s not a big cliff. It’s similar to what you do now. I would say, the biggest thing is, first of all, you’ve got to get workflow. I know a lot of people look and they are like : “Workflow?” Trust me, it’s great! And once you get your grip on workflow, if you can write apps that work on Windows Workflow, on a local machine, you can throw that thing in the cloud, it will desume.

I have no idea what ‘desume’ is, but I guess it means ‘it will rock’ or something like that! And I agree!

But I don’t really have a clue to why you’d have to throw it in the cloud. I understand that Microsoft is betting big on the cloud and want all their evangelists to push the cloud into our brains. But what Ron Jacobs is talking about isn’t possible in the cloud right now, or at least not with AppFabric. Windows Server AppFabric and Windows Azure AppFabric might be more aligned in the future, but right now they’re definitely not.

[![](/images/doesnt-take-a-genius-to-build-massively-scalable-systems/0160_hollisjacobs2_5f00_thumb_5f00_4ddf5b10.png)](/wp-content/uploads/2014/01/0160_hollisjacobs2_5f00_thumb_5f00_4ddf5b10.png) [![](/images/doesnt-take-a-genius-to-build-massively-scalable-systems/6471_hollisjacobs_5f00_thumb_5f00_16f5a2a4.png)](/wp-content/uploads/2014/01/6471_hollisjacobs_5f00_thumb_5f00_16f5a2a4.png)

I think we’ve got some great new opportunities when using Windows Server AppFabric for hosting our applications. In the past I had some major issues with WF3 while I did not even know the technology that well. My concerns were
* Hosting your workflows
* Monitoring your workflows
* Persisting your workflows

These three have all been solved by AppFabric. But how about that massively scalability that Ron Jacobs is talking about? When I first tried to look up what it took to get a cluster of AppFabric servers up and running, I could not find a lot of information on what to do. Until I discovered I actually did not have to do anything! Just make sure every single server is pointing towards the same database, has the same version of the workflows and you’re done!

So as the title says, it doesn’t take a genius to build a massively scalable system. Doesn’t mean you can brainlessly start building workflows and expect AppFabric to solve it all. You just don’t have to be a genius anymore.

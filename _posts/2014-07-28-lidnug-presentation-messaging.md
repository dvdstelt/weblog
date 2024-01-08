---
layout: post
id: 578711
author: Dennis van der Stelt
image: '/images/lidnug-presentation-messaging/header.jpg'
date: 20140728 112825
title: LIDNUG Presentation on messaging
description: The LinkedIn DotNet User Group (LIDNUG) organisation requested me to do a Building Re...
categories:
    - Architecture and Design
    - NServiceBus
    - WCF
tags:
  - architecture
  - messaging
  - msmq
  - nservicebus
  - wcf
redirect_from:
  - "/dennis/2014/07/28/lidnug-presentation-messaging"
  - "/blogs/dennis/archive/2014/07/28/lidnug-presentation-messaging.aspx"
---

The LinkedIn DotNet User Group (LIDNUG) organisation requested me to do a Building Reliable Systems with Messaging session for them. This webcast was something quite new for me, because I’ve never presented anything without seeing and interacting with an audience. The software we used was able to do Q&A where the audience can ask one question at a time. And some really great questions were asked, giving me the opportunity to have some interaction with the audience after all. In the end I spoke about messaging for an hour and 45 minutes without being interrupted, after being a bit afraid I’d not be able to talk about the subject long enough! I had somewhere between one and one-and-a-half-hour. Apparently I still don’t know myself that well.

Anyway, I explained why decoupling your application through messaging is important to me and my (business) clients and what platform-, spatial en temporal coupling is. I then showed a demo how to obtain spatial coupling using WCF and a finished demo showing it working using WCF over MSMQ. I then talked about the publish/subscribe pattern and how this achieves me to fully decouple multiple services. Something I’ve been doing for quite some time, even before the term “Micro Services” was coined. I showed off a demo using NServiceBus and how a simple order was submitted to a back-end service, after which it was picked up by multiple other services. Even distinguishing regular and strategic customers, without a sending client ever knowing these were treated differently.

I also showed how NServiceBus has great tooling called ‘ServiceInsight’ to show how messages flow through your system. The day before my session my license expired and probably because of all the beta software I installed and fiddled with, my system would not accept a new license. Unfortunately I could not show ServicePulse, another great product for monitoring your endpoints and messages. Luckily there’s more to find on the Particular website at the videos and presentations page.

Both demos can be downloaded via links at the bottom of this post. However the NServiceBus Shop example is far from finished, although I will try to make it better and finish it in the near future. LIDNUG also recorded the presentation, but for some reasons the audio is a bit out-of-sync with the video, making the coding part a bit hard to follow.

Thanks for LIDNUG for giving me the opportunity to speak about one of my favorite subjects and I hope everyone enjoyed the talk and learned something from it. Also congrats to everyone who won the Packt Publishing ‘Learning NServiceBus’ book from David Boike.

[slideshare id=37414160&doc=messaging-140728034013-phpapp01]

Downloads :
* [NServiceBusShopExample](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2014/07/NServiceBusShopExample.zip)
* [MessagingDemo](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2014/07/MessagingDemo.zip)

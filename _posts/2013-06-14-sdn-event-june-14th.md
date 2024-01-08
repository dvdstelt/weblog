---
layout: post
id: 578505
author: Dennis van der Stelt
image: '/images/sdn-event-june-14th/header.png'
date: 20130614 084630
title: SDN Event June 14th
description: For SDN Event of June 14th I did two presentations Transactions Why are transactions ...
categories:
    - Architecture and Design
    - Development
    - Enterprise Library
    - SDN
redirect_from:
  - "/dennis/2013/06/14/sdn-event-june-14th"
  - "/blogs/dennis/archive/2013/06/14/sdn-event-june-14th.aspx"
---

For SDN Event of June 14th I did two presentations
1. **Transactions** [![](/images/sdn-event-june-14th/5751_transactions_5f00_thumb_5f00_3adad593.png)](/wp-content/uploads/2014/01/5751_transactions_5f00_thumb_5f00_3adad593.png)Why are transactions the bottleneck of so many applications? Why isn’t the database always consistent, even though we use transactions? This session explains why everything in a database is a transaction and how a developer should deal with them. Why your software complains that MSDTC isn’t running and how the CAP Theorem can help. After this session you’ll be able to explain to your DBA why he doesn’t understand transactions. [Slidedeck here](http://www.slideshare.net/DennisvanderStelt/transactions-22988855).I spoke about messaging, of which you can find more information here:
    1. [What is messaging](https://bloggingabout.net/2012/04/25/what-is-messaging)
    2. [High Availability](https://bloggingabout.net/2012/09/19/high-availability) (a good article on benefits of messaging)
2. **SOLID Principles part 2** [![](/images/sdn-event-june-14th/8512_solid2_5f00_thumb_5f00_05d0d714.png)](/wp-content/uploads/2014/01/8512_solid2_5f00_thumb_5f00_05d0d714.png)Of the SOLID principles, made famous by Robert C. Martin, we’ll discuss the Interface Segregation Principle and the Dependency Inversion Principle. This session will explain them thoroughly and give real life examples instead of the regular customer & order examples. You’ll walk away knowing what the benefits are and how to use them properly.
    * [Slidedeck here](http://www.slideshare.net/DennisvanderStelt/solid-principles-part-2)
    * [Demo code ](/files/MvcDependencyInjectionWithUnity.zip)

During the presentation the implementation of the Factory was incorrect, as the objects instantiated weren’t done so using the Unity Container. This is fixed in this demo. The EmailMessageSender even uses an additional IResourceRepository to retrieve (faked) translations from the database.

If you have questions, don’t hesitate to [contact me](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/contact.aspx).

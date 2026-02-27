---
id: 578505
author: Dennis van der Stelt
title: SDN Event June 14th
description: For SDN Event of June 14th I did two presentations Transactions Why are transactions ...
pubDate: '2013-06-14T08:46:30'
image: /images/sdn-event-june-14th/header.png
tags:
  - Architecture and Design
  - Development
  - Enterprise Library
  - SDN
  - events
  - presenting
redirect_from:
  - /dennis/2013/06/14/sdn-event-june-14th
  - /blogs/dennis/archive/2013/06/14/sdn-event-june-14th.aspx
---
For SDN Event of June 14th I did two presentations

## Transactions

Why are transactions the bottleneck of so many applications? Why isn’t the database always consistent, even though we use transactions? This session explains why everything in a database is a transaction and how a developer should deal with them. Why your software complains that MSDTC isn’t running and how the CAP Theorem can help. After this session you’ll be able to explain to your DBA why he doesn’t understand transactions. [Slidedeck here](http://www.slideshare.net/DennisvanderStelt/transactions-22988855).I spoke about messaging, of which you can find more information here:

  1. [What is messaging](/2012/04/25/what-is-messaging/)
  1. [High Availability](/2012/09/19/high-availability/) (a good article on benefits of messaging)

<center>
<iframe src="https://www.slideshare.net/slideshow/embed_code/key/fBiO1MQqN4wNRv?startSlide=1" width="597" height="486" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px;max-width: 100%;" allowfullscreen></iframe><div style="margin-bottom:5px"><strong><a href="https://www.slideshare.net/DennisvanderStelt/transactions-22988855" title="Transactions" target="_blank">Transactions</a></strong> from <strong><a href="https://www.slideshare.net/DennisvanderStelt" target="_blank">Dennis van der Stelt</a></strong></div>
</center>

## SOLID Principles part 2

Of the SOLID principles, made famous by Robert C. Martin, we’ll discuss the Interface Segregation Principle and the Dependency Inversion Principle. This session will explain them thoroughly and give real life examples instead of the regular customer & order examples. You’ll walk away knowing what the benefits are and how to use them properly.
    * [Slidedeck here](http://www.slideshare.net/DennisvanderStelt/solid-principles-part-2)
    * [Demo code ](/files/MvcDependencyInjectionWithUnity.zip)   

During the presentation the implementation of the Factory was incorrect, as the objects instantiated weren’t done so using the Unity Container. This is fixed in this demo. The EmailMessageSender even uses an additional IResourceRepository to retrieve (faked) translations from the database.

<center>
<iframe src="https://www.slideshare.net/slideshow/embed_code/key/8ebVuA6Tw8S7vE?startSlide=1" width="597" height="486" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px;max-width: 100%;" allowfullscreen></iframe><div style="margin-bottom:5px"><strong><a href="https://www.slideshare.net/DennisvanderStelt/solid-principles-part-2" title="SOLID Principles part 2" target="_blank">SOLID Principles part 2</a></strong> from <strong><a href="https://www.slideshare.net/DennisvanderStelt" target="_blank">Dennis van der Stelt</a></strong></div>
</center>

If you have questions, don’t hesitate to [contact me](/contact).

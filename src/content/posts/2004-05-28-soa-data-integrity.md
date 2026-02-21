---
id: 929
author: Dennis van der Stelt
title: SOA & Data integrity
description: Clemens Vasters made a post about sharing data stores across services. He says the te...
pubDate: '2004-05-28T06:43:00'
tags:
  - Architecture and Design
redirect_from:
  - /dennis/2004/05/28/soa-data-integrity
  - /blogs/dennis/archive/2004/05/28/soa-data-integrity.aspx
---
Clemens Vasters made a post about [sharing data stores across services](http://staff.newtelligence.net/clemensv/). He says the temptation is just too big that some developer will go and make a database join across the “data domains” of services and cause a co-location dependency of data and schema dependencies between services.

You could say I have zero to none experience on SOA, but I’m very interested in the subject and read my share part of articles on it. It’s kinda like when .NET was released and you found (kinda) a whole new way of developing applications, this is like a whole new way of designing applications with a bunch of new programming methods on the way down.

But the more I read about SOA and discuss the topic with collegues, the more questions I have. And the problem is, most of them stay unanswered. At work, I’m implementing a (small) application the SOA way for the first time.

The topic mentioned Clemens blogged about, is not that difficult. The first thing developers say when first hearing about SOA is that you will get performance issues when you can’t lay really large joins over tables but have to get all the data through each individual service. Ofcourse this depends on how the services are defined, but that’s another topic. I asked Clemens about deleting and his simple answer was: *Don’t delete, by more disks*. Thanks for the answer. 🙁

Anyway, in the comments, [Ray Jezek](http://blogs.geekdojo.net/jez) has some questions as well. One argument of SOA is that you can replace a service with another one. Clements has the example of a customer services replaced by Siebel. And although it had crossed my mind, Ray raises questions about the identifying key of the customer. What if we defined an int and Siebel uses GUIDs? It’s kind of an extreme situation, but what about using an integer and a string, where the string also uses A-Z as possibilities. I ask you, what if we have both services running side-by-side and we want to take out our own service and use Siebel? Because Siebel already has our customers so we can’t generate them with out own keys. Now we have to build a mapper service in which we map our previous key with the Siebel key. That’s probably doable.

But there’s more. All the time, I hear that I have to use a unique business entity as the key. For example, use CustomerID and not some internal id. With internal ids, we’d never be able to ‘just’ transfer our customers into Siebel and always need a mapper. But what if we come across the case we have cusomter id’s of [00223] and Siebel uses [82A02PPQ]? Or even worse, uses {17e97ffa-d478-4c17-87de-a075d826fe1f} ? Then all of a sudden, our users are overflown with totally different patterns in their CustomerIDs.

This is getting quite a long blog, but the question Ray raises is, why aren’t there any examples and/or implementations on these subjects? Has everybody only been thinking about SOA but never implemented it yet? Very hard to believe. Also hard to believe is nobody has been thinking about these problems. What also is hard to believe, but true in fact, that there’s not much information on these topics. Maybe there’s a really big gap here Microsoft might fill with some [Patterns & Practices](http://www.microsoft.com/resources/practices/) or [Architecture](http://msdn.microsoft.com/architecture/) site. Or maybe you know of good sites and/or implementations.

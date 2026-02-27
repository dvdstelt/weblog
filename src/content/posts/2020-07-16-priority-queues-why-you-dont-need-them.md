---
id: 578961
author: Dennis van der Stelt
title: Priority Queues – Why you don’t need them
description: Dealing with higher priority for certain messages often requires more than just an ad...
pubDate: '2020-07-16T11:33:17'
image: /images/priority-queues-why-you-dont-need-them/header.jpg
tags:
  - architecture
  - nservicebus
  - messaging
redirect_from:
  - /dennis/2020/07/16/priority-queues-why-you-dont-need-them
  - /blogs/dennis/archive/2020/07/16/priority-queues-why-you-dont-need-them.aspx
---
At Starbucks, you can get a coffee pretty quickly, mostly because of the way their queuing system works¹. But imagine if Starbucks starts selling burgers, prescription drugs and used cars². A burger might come in a basket with cheese, bacon, a drink and choice of fries. A car requires even more processes to complete before a transaction is finished. Different wait times for these products will ruin the customer experience for people waiting in line to order a coffee, who have to wait for completely different processes to finish first.

What we’d like is for customers who want to purchase a coffee quickly to get through the line faster than those getting a car. Obviously, this is not a real business scenario. But one that could exist in our domain is where we have strategic customers—the VIP customers with lots and lots of money. The business rules might specify that strategic customers need to get priority over regular customers. As with the Starbucks example, we don’t want strategic customers to have to wait in line with regular customers, making them wait until every customer before them has been served.

We might think that priority queues are a good fit for this scenario. But are they?

## Why we should not use priority queues

Often, the reason for message priority comes from a business standpoint. There is more to dealing with strategic customers than just message priority. Imagine that instead of providing a fully automated process, a sales representative might want to call the customer to confirm the purchase. It could also be that different fees apply or even larger differences in business logic exist than with regular customers. There could be different shipment options that regular customers don’t have. Depending on the domain there can be many deviations from the business processes around regular customers.

So when designing the system to deal with regular customers and strategic customers, it is about more than just message priority. There is likely a difference in code, possibly even the design of the component that deals with strategic customers. So it’s not just about two different queues, with one of them having priority. It’s likely that we want to separate the design and code for strategic customers from code for the regular customers.

This is especially true when dealing with Service Level Agreements (SLA). In addition to higher priority, we also might want orders from strategic customers to be processed faster. We might have a separate database, use a different concurrency mode or implement a different caching strategy. Possibly we’d want to scale out the strategic customers. If at the same time you’d have to scale out the regular customers, because they are in the same endpoint, this could add additional costs that are not desirable. And we haven’t even mentioned different types of metrics, monitoring and warnings, all designed to keep our most lucrative customers happy.

## Who decides what is a priority?

Imagine a customer gains strategic customer status because they purchase millions of products in a single order. The question is how they should be treated when they make a smaller purchase, like so many other regular customers do? It is likely they should still be treated as strategic customers.

But if we have two different endpoints to send messages to, each of them with their own queue, who is responsible for deciding whether the message gets priority or not? If it’s the sender of the messages, it should have knowledge of who is a strategic customer or not. This is a design decision that can be considered, but it also introduces tighter coupling. If we value the Single Responsibility Principle, we don’t want to introduce more responsibilities into our sender than necessary. As the result would be that if the logic changes to decide if a message has priority, the sender needs to be changed as well.

## Three examples

In a series of 3 follow-up articles, I will show several ways how to <s>deal with priority queues</s> and manage message priority.
* [Sender decides](/2020/07/18/priority-queues-sender-decides/)  
In this sample, the sender of the messages decides where a command should go. It thus has knowledge of the different customer types.
* [Publishing messages, sender decoupled](/2020/07/23/priority-queues-publishing/)  
Instead of sending a message, events are published. The sender has no knowledge of customer types, which improves loose coupling.
* [4+1 architectural view models](/2020/08/07/41-architectural-view-model/)  
A side-step from the priority queues to explain the difference view models in your architecture and introduce some concepts used in the next article.
* [Interceptors](/2020/08/26/priority-queues-interceptors/)  
In this post we’re separating logical design from physical design and try to achieve the maximum decoupling, but best performance. Any receiver can provide a small component to the sender that will be used to verify if a message should be send or not.
**Resources** ¹ [What Starbucks can teach us about software scalability](https://particular.net/blog/what-starbucks-can-teach-us-about-software-scalability) by Weronika Łabaj  
² [Queues are still queues](https://lostechies.com/jimmybogard/2010/11/18/queues-are-still-queues/) by Jimmy Bogard

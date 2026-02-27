---
id: 578995
author: Dennis van der Stelt
title: 4+1 architectural view model
description: Once upon a time, I came across a question about a system that was designed according...
pubDate: '2020-08-07T12:16:39'
image: /images/41-architectural-view-model/header.jpg
tags:
  - architecture
  - microservices
redirect_from:
  - /dennis/2020/08/07/41-architectural-view-model
  - /blogs/dennis/archive/2020/08/07/41-architectural-view-model.aspx
---
Once upon a time, I came across a question about a system that was designed according to the microservices architectural style. The question was about how to handle network requests across a scaled-out and load-balanced back-end. When a single visitor accessed the website, it resulted in tens of thousands of HTTP requests in the back-end. With 3 to 4 users, connection timeouts started appearing everywhere. Even though their microservices were loosely coupled and autonomous.

The reason I am sharing this is that everyone immediately understands this behavior is wildly undesirable. Tens of thousands of network requests for a single page request is simply too many. It’s an example of something that went well beyond how we would expect a system to perform. Tens of thousands of out-of-process HTTP requests for visiting a single page is obviously a problem. But with how many requests is it not a problem anymore? 5000? 1000? 50? 10?

## The problem

One of the problems here is that likely on paper everything looked fine. There were all these fine-grained services that all would do their own work. They all seemed loosely coupled and autonomous. A monolith is one big block. On paper, the microservices were small, independent blocks that all would do their own thing and were loosely coupled from all the other blocks. Once in production though, every single service relied on many other services, which rely again on many others. An entire chain of RPC requests occurred, often over HTTP, every single one of them inflicted with the [fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing).

On paper, everything seemed fine, but in production, the experience is quite different.

## Different architectural views

Drawing a few boxes on a whiteboard doesn’t make them loosely coupled & highly cohesive and even autonomous by default. You need to look at your architecture from different angles. Philippe Kruchten already described this in what he calls the [4+1 architectural view model](https://www.cs.ubc.ca/~gregor/teaching/papers/4+1view-architecture.pdf).

> The “4+1” view model is rather “generic”: other notations and tools can be used, other design methods can be used, especially for the logical and process decompositions, but we have indicated the ones we have used with success.
> <cite>Philippe Kruchten, Architectural Blueprints—The “4+1” View Model of Software Architecture</cite>

His whitepaper and other articles on the internet already describe and explain the different views. I don’t think I can add a lot more information there. I want to get a little bit more practical.
**Temporal coupling** One of my favorite subjects in distributed systems is messaging. Communication over HTTP means temporal coupling via [Remote Procedure Calls](https://en.wikipedia.org/wiki/Remote_procedure_call) (RPC). Message queues remove the temporal coupling. It introduces different challenges, like [eventual consistency](/2020/06/27/dealing-with-eventual-consistency/). I mention messaging and temporal coupling because those don’t appear in the logical view of your architecture. I’ve noticed more than once that this is the only view used to design a system. Solving temporal coupling in your system via messaging should appear in the Process view and possibly in the Physical view, also called the deployment view.

## Deployment view

One very interesting aspect of building a system is what I learned from [Udi Dahan](https://udidahan.com/) during his [ADSD course](https://particular.net/adsd). The fact that the logical view and the physical or deployment view can be very different.
**Duplicating code versus multiple deployments** In the logical view, there can be some code that is not duplicated at all. But in the physical view, it’s deployed all over the place. That is not duplication of code, but rather deploying the same piece of code multiple times. I’ve had discussions in the past where some Javascript validation code was deployed to the front-end and loaded in the browser. But the same validation code was deployed to a DocumentDb database (like MongoDb) and ran there as well. Not everyone immediately agreed this was no duplication of code. Everyone understands that NuGet packages for libraries like [MediatR](https://github.com/jbogard/MediatR) or [NServiceBus](https://particular.net/nservicebus) exist and are used all over. But when you do the same for a small piece of (business) code that you want to reuse multiple times throughout your system, it suddenly raises eyebrows.
**Sharing code** Another example that I want to highlight is because of [my posts on priority messaging](/2020/07/16/priority-queues-why-you-dont-need-them/). In the third sample that I will write about next, I will separate a few pieces of code and in the logical view, they are very close to the components they belong to.

![Logical view where a regular interceptor and a strategic interceptor are located near their receivers.](/images/41-architectural-view-model/41-logical-view-1.png)

In the development view, they have names that represent the responsible components, to which the smaller interceptor components belong to. There are four different projects in Visual Studio
* RegularReceiver
* RegularReceiver.Interceptor
* StrategicReceiver
* StrategicReceiver.Interceptor

The `RegularReceiver.Interceptor` and `StrategicReceiver.Interceptor` their names were chosen, to visualize in the development view to which other components they belong to.

![](/images/41-architectural-view-model/41-physical-view.png)

In the physical- or deployment view, however, the Interceptor components are not deployed with the components they belong to. Instead, they are deployed with the sender. This means the deployment view literally changes how we look at the components, then how we look at them from the logical view. How they are actually deployed, loaded, and used is part of the next blogpost in the [Priority Queues – Why you don’t need them](/2020/07/16/priority-queues-why-you-dont-need-them/) series of posts.

## Conclusion

I wrote this post for two reasons
1. The fact that there are boxes in the logical view of your architecture, doesn’t automagically mean there is decoupling. There are more views in your architecture. Remember that one view doesn’t tell the entire story. There might be coupling, especially temporal coupling, that might incorrectly be considered as decoupling.
2. There is a difference in designing a system on paper and how you deploy it, if you consider the 4+1 architectural view models. Embrace the fact that responsibilities can exist in one part of your system. But deploying components from different responsibilities together with other components, doesn’t mean the responsibilities suddenly have changed.

This way you open up new possibilities for a better design and other considerations for deploying your code.

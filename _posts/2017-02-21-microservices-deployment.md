---
layout: post
id: 578842
author: Dennis van der Stelt
image: '/images/microservices-deployment/header.png'
date: 20170221 024335
title: Microservices deployment
description: In the past we used to have monoliths. These were bad. Big balls of mud. Whenever we ...
categories:
    - Architecture and Design
redirect_from:
  - "/dennis/2017/02/21/microservices-deployment"
  - "/blogs/dennis/archive/2017/02/21/microservices-deployment.aspx"
---

In the past we used to have monoliths. These were bad. Big balls of mud. Whenever we changed something, it was impossible to predict which part of the big ball of mud we might have broken. That’s why microservices are so great. They aren’t bug balls of mud. They are small, autonomous and independently deployable units. We basically went from the picture on the left, to the picture on the right.

[![Showing difference between most monolith & microservices implementation is purely based on RPC calls.](/images/microservices-deployment/microservices-1-1.png)](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2017/02/microservices-1-1.png)  
 So let’s have a look what changed. Initially, we had a lot of in-process calls throughout our code. But due to a lot of coupling, our system easily broke after touching the code. We now have RPC style calls. According to a lot of sources this happens preferably via REST/HTTP. So the result is that deployment of our architecture is far more complex than it used to be. And the RPC style calls over HTTP introduce an insane amount of latency. Oh, and we also still have the issue of easily breaking the system after touching the code. So what did microservices solve again?

## Changing technology doesn’t change coupling

Just because we ripped apart our methods and deployed them separately didn’t make them autonomous and didn’t solve coupling. The fact that we introduced REST/HTTP, doesn’t magically make them autonomous. They still depend on methods, but we now call them out-of-process and renamed methods to microservices.

Whenever we talk about microservices, please don’t assume REST/HTTP and separate deployable units solve anything. They are technical implementation details in an architecture that is till the same. Remember the [4+1 architectural view](https://en.wikipedia.org/wiki/4%2B1_architectural_view_model) we used to learn about? Architecture is more than code, communication protocol and deployment. That’s just the physical view of the architecture. What our system should look like when it’s in production. But why do we ignore the other views? What about the logical- and the process architecture?

## Coupling is solved by proper encapsulation

What we need to do is give more focus to encapsulation. I doubt it’s the first time you were told to properly encapsulate your code. When we learned about object oriented programming, we learned about encapsulation. When we were doing componentized development, we did it to achieve proper encapsulation. And again when we tried Service Oriented Architecture (SOA). And right now we think microservices will solve our encapsulation issues. But I bet we are better at pointing out the technological changes, than name what actually changed in our architecture. Our way of thinking. Our way of designing systems. Our way of looking at architecture.

When we take into account the logical view in our architecture, one of the things we do is look at cohesion. What parts of the system cannot live without other parts? And what parts might exist without other parts? Is it actually required for the inventory of a product to live side-by-side with the product details, like name and description? As if the name of a product is related to the price of a product. Try to look at consistency boundaries of your system. How can we divide our system into multiple services? Call them bounded contexts, domains, vertical layers, service boundaries, whatever you want to call them. As long as you don’t focus on implementation details so much, when selecting the appropriate architectural style for your system.

---
id: 579094
author: Dennis van der Stelt
title: Distributed Monolith
description: How can a microservices-based architecture, that looked great on paper, turn into a s...
pubDate: '2021-07-01T01:43:22'
image: /images/distributed-monolith/header.jpeg
tags:
  - architecture
  - microservices
  - soa
redirect_from:
  - /dennis/2021/07/01/distributed-monolith
  - /blogs/dennis/archive/2021/07/01/distributed-monolith.aspx
---
How can a microservices-based architecture, that looked great on paper, turn into a system that is a nightmare to maintain? Let’s have a look at how well-intended systems turn into a distributed monolith.

Most developers, when they start learning about programming languages, start with [structured programming](https://en.wikipedia.org/wiki/Structured_programming). An important part of is *subroutines*, callable units which we usually call functions or methods. These are the root of all evil when it comes to building distributed systems.

### Hello world

The first thing we learn is to break up code into smaller subroutines. This makes them better readable and maintainable. An entry point in code is then just a few lines of code calling subroutines, which by themselves contain just a few lines of code and call other subroutines. Even the simplest examples in the world work this way. In C# it looks something like this:


```csharp
class Program
{
  static async Task Main(string[] args)
  {
    Console.WriteLine("Hello World!"); 
  }
}
```

There’s a subroutine (method) called `WriteLine`, we provide it with some text and it outputs the text on the console. Let’s take this example a few steps further.

In the not-so-distant past, developers were promised that if they used webservices, their system would be decoupled, and more scalable, and additional promises were made. Because their big, bad, monolithic application was broken up into smaller webservices it would then suddenly turn into this decoupled distributed system.

So taking the "Hello world" sample one step further, the end result would be something like this.


```csharp
class Program
{
  static async Task Main(string[] args)
  {
    var name = "Dennis";
    var client = new MyHelloWorldService();
    var result = client.HelloWorld(name);
  }
}
```

What we’ve done here is that the variable `name` has been serialized so it can be sent to a webservice. But what do we know from this code about our webservice?
* It is likely that webservices communicate over HTTP, although other transports are possible as well. No matter which transport it is, a lot of things suddenly change in behavior. Previously, calling methods would be extremely fast. Communicating out-of-process over a transport like HTTP makes things much slower and brings other changes you have to take into account.
* The webservice could be on the same machine. However since it crosses the process boundary and needs HTTP, it introduces a lot of latency. The webservice could also be on the other side of the world. But since [latency is zero](https://particular.net/blog/latency-is-zero), many developers don’t bother thinking about this during development.
* We serialized the content of the `name` variable so it can be sent over HTTP. In theory the string `name` doesn’t have to be serialized, but since it’s a webservice it likely wants to communicate using XML, adding XSD, WSDL, etc. But since [the network is homogeneous](https://particular.net/blog/the-network-is-homogeneous), how could this add more complexity?
* Have you ever received an `408 Request Timeout`? You can’t tell from that error what happened on the other side. Was your request processed successfully? Or is your order lost because it was never stored in the webservice? You can never tell, but why bother, if [the network is reliable](https://particular.net/blog/the-network-is-reliable).

I’m being a bit sarcastic. In short, we’re running into the [fallacies of distributed computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing). The problem is that this is not visible in these two lines of code, where we initiate some client object and just call a method as if it was in process. Webservices hide all the complexity and often developers don’t think about the fallacies of distributed computing.

So methods are not the root of all evil, but making out-of-process calls look like you’re calling methods is a big issue. But things could get worse.

### Microservices

Since webservices didn’t deliver on all those earlier mentioned promises of an architecture that was loosely coupled, more scalable and so on, we needed something else. And then microservices got introduced. Our services would finally be small enough for our architecture to be loosely coupled, scalable and no longer monolithic.

We got rid of XML, XSD, and WSDL and replaced them with JSON and did REST calls over HTTP. Quite a few developers implemented some layer on top of all of their methods and were doing an incredibly large amount of HTTP requests. Up until a point where one implementation, mentioned on StackOverflow, did thirty-thousand HTTP requests when a single user did a single page request on a website.

We all kind of get that thirty-thousand HTTP requests is not optimal. Even worse, when a developer need to change something in the code, it was harder than ever to properly test this. As a result, more bugs than ever were introduced because something was changed that another microservice (read: out-of-process method) did not expect to happen. Hence the name *distributed monolith*.

But how many HTTP requests would still be acceptable for a microservices-based architecture? A thousand? A hundred? Ten? Less?

### Solving the issue

There are at least two issues with the discussed approach so far.

##### Low coupling, high cohesion

There are *things* in our system that have very high cohesion and have a high amount of coupling. This could be the database and the user interface or some details in an order and details from a customer. These highly cohesive *things* should stay together and [not be split apart](https://bloggingabout-linux.azurewebsites.net/2015/10/27/business-components-as-mini-systems/). Not in a different architectural layer, not in a different component and especially not separated via HTTP requests. If we can find those *things* and put them together in something we can call a logical service*, we can decouple them from other *things* that also share a high cohesion with each other. That’s how we achieve loose coupling.
* A logical service means it’s not a technical thing like a webservice, controller or something similar, but a collection of *things* that logically should be grouped together.

##### Keeping the model in sync with events

After we’ve brought these highly cohesive *things* together into different logical services, you’ll find that we don’t need to communicate between them via request/response. For example, if we have one of these highly cohesive things that calculate how high the invoice for an order of a specific customer is, do we really need to know how many characters there are in the name of this customer? Would a customer with more than 15 characters in the name, result in a higher discount on the invoice?

We do need to keep the model in sync though. One service might be responsible for deciding *when* a customer becomes a preferred customer. But another service might change its behavior based on this. We can communicate between these services with events. And the event does not need to transfer any business data. Communicating the event `CustomerBecamePreferred` and including only the identifier of the customer should be enough. The identifier is the least volatile thing in your system. It’s the least likely to change.

##### Asynchronous communication

If we use synchronous communication and do some sort of request/response between services, we still run the risk that information might get lost. The other service could not respond, an HTTP Timeout error could occur, the receiving side might not be able to submit the data and so on.

It’s better to use the power of publish/subscribe that many message brokers like Azure Service Bus, RabbitMQ and Amazon SQS provide. That way your event should not get lost.

### Conclusion

If you don’t want to end up with a distributed monolith, you need a different way to design your system. Don’t simply replace subroutines with out-of-process microservices that don’t solve your problems. Think about high cohesion and low coupling and what this means for the boundaries between your components.

And try to understand the difference between request/response and publish/subscribe and how this solves temporal coupling.

Together this can bring true loose coupling and a highly scalable system that can still be maintained after many years in production.

If you want to know more, I recommend reading my blog and watching the following videos:

My presentation at NDC on sharing data between services: _Autonomous microservices don’t share data. Period._

<iframe src="https://www.youtube.com/embed/0TYbHVc2yWI" frameborder="0" allowfullscreen></iframe>

Udi Dahan on _Avoid Failed SOA business & Autonomous Components to the Rescue_

<iframe src="https://www.youtube.com/embed/82SZ-cEtE7o" frameborder="0" allowfullscreen></iframe>

If you worry about asynchronous communication and eventual consistency _Dealing with eventual consistency_

<iframe src="https://www.youtube.com/embed/kXGUSVz3eNg" frameborder="0" allowfullscreen></iframe>
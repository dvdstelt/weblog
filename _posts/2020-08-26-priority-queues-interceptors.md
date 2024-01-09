---
layout: post
id: 579017
author: Dennis van der Stelt
image: '/images/priority-queues-interceptors/header.png'
date: 20200826 111143
title: Priority Queues – Interceptors
description: In the previous articles, I demonstrated why there is not really a need for priority ...
tags:
  - 4+1 architectural view model
  - architecture
  - mediatr
  - message priority
  - microservices
  - priority queues
redirect_from:
  - "/dennis/2020/08/26/priority-queues-interceptors"
  - "/blogs/dennis/archive/2020/08/26/priority-queues-interceptors.aspx"
---

In the [previous articles](https://bloggingabout-linux.azurewebsites.net/2020/07/16/priority-queues-why-you-dont-need-them/), I demonstrated why there is not really a need for priority queues. That is because the different messages likely need to be handled differently, both from the business- and infrastructure perspective. Then I created samples for how the [sender can decide](https://bloggingabout-linux.azurewebsites.net/2020/07/18/priority-queues-sender-decides/) what a priority message is, and another for how [publish/subscribe can be used](https://bloggingabout-linux.azurewebsites.net/2020/07/23/priority-queues-publishing/), so that every single receiver can decide if it needs to process the message.

But as always, every solution has its trade-offs. The first introduces unnecessary coupling on the sender’s side. The second solution means more I/O which can become a bottleneck and possibly cost more in a cloud environment. In this article, I’m going to demonstrate a third solution, which addresses all of the trade-offs of the other two methods at the expense of some complexity.

## The theory

In the second sample, I liked that each receiver could decide by itself if the message should be processed by that receiver, or if the message should be ignored. The sender had no knowledge if the message was about a regular- or strategic customer, or of how many receivers there could be and where they are. Additionally, there is flexibility in changing the business logic or even adding additional receivers without the sender knowing about it. It was truly decoupled from the receivers. However, as I mentioned, this results in many additional messages being sent. Each receiver receives a copy of the message.

What I want to achieve in the third example is that each receiver extracts and removes the code that decides whether or not the message should be processed. Then share this small piece of code with the sender. But in a plugin kind of way, where you can add, remove, or change these pieces of code without altering the sender in any way. That way it’s still decoupled in the sense that the sender itself has no knowledge of any receiver, but the code to determine who should process the message is still executed before sending the message itself.

So in my [4+1 architectural view model](https://bloggingabout-linux.azurewebsites.net/2020/08/07/41-architectural-view-model/) article, I explained that in the logical view, these components are combined with the receivers. But in the physical view, they are deployed together with the sender.

## The implementation

To implement this, I need an interface and at least two assemblies that have a class that implements the interface. I also need some infrastructural code that searches for assemblies that are deployed with the sender and then searches for implementations of this interface. I’m using NServiceBus which already has an `AssemblyScanner` class that I can use for exactly this.

The sender then has to iterate over all the interface implementations found and execute each of them once it decides it needs to send a message. Each of these classes can then decide on their own whether or not a message should be sent to its receiver. This is basically a copy of the earlier publish/subscribe solution in the second sample. Except that the publish/subscribe is now in-process, the decision is made before actually sending the message, but the responsibility for this decision remains with the receivers.

## MediatR

Doing in-process publish/subscribe is exactly what [MediatR](https://github.com/jbogard/MediatR) by [Jimmy Bogard](https://jimmybogard.com/) does. This means we don’t have to reinvent the interfaces or the publish/subscribe mechanism. I can implement an interface according to MediatR:


```csharp
public class RegularInterceptor : INotificationHandler<ordersubmitted>
{
  public async Task Handle(OrderSubmitted notification, CancellationToken cancellationToken)
  {
  }
}
```

Then a notification published via MediatR will automatically call the `Handle `method on this class, which can then decide whether or not a message should be sent to the `RegularReceiver`. Let’s have a complete look at how this solution is set up and works in Visual Studio.

## Visual Studio solution setup

Because this sample is a bit more complex, some changes have been made since the [first sample](https://bloggingabout-linux.azurewebsites.net/2020/07/18/priority-queues-sender-decides/). That article contains most of the information about the project structure though. You’ll also want to read about the proposed solution in the [4+1 architectural view model](https://bloggingabout-linux.azurewebsites.net/2020/08/07/41-architectural-view-model/) article. In this solution two additional projects have been added:
* **RegularReceiver.Interceptor** This project contains the implementation that decides whether or not a customer is a regular customer. If it is, it will send a message to the `RegularReceiver `component.
* **StrategicReceiver.Interceptor** This project is exactly like the `RegularReceiver.Interceptor` but for strategic customers.

Normally, we’d create a [NuGet](https://www.nuget.org/) package from these assemblies. A deployment script would then deploy these NuGet packages together with the `Sender` application. Because in this article we’re not really deploying, but want an F5 experience in Visual Studio, I’ve added project references to both interceptor projects from the `Sender` project. More info and a picture of what this looks like will be shown later in this article.

> Note: This is not the only shortcut that was made. The interceptor classes `RegularInterceptor` and `StrategicInterceptor` are implementing interfaces defined by MediatR. That could be something you might decide to avoid. I chose to do it this way because any other solution would make this sample more complex. Another thing to consider is that each interceptor actually sends the same message, while the important thing they decide is related to routing; where should the message be sent to? You could decide to change the solution so that some kind of routing information is returned to the sender, which is then used to send the actual message.

The entire solution can be [found on GitHub](https://github.com/dvdstelt/PriorityQueues/tree/master/src/03%20-%20CustomComponents).

## Setting up our host

So we’ll use MediatR to publish in-process notifications. The classes that receive these notifications will send the actual message using NServiceBus. This means the interceptor classes have to get an `IMessageSession` injected via dependency injection. You can read more about [injecting- ](https://docs.particular.net/nservicebus/dependency-injection/#externally-managed-mode-injecting-the-message-session) or [how to use IMessageSession](https://docs.particular.net/nservicebus/messaging/send-a-message#inside-the-incoming-message-processing-pipeline) in the NServiceBus documentation.

Since we’re in .NET Core already, we’ll use [ServiceCollection](https://docs.microsoft.com/en-us/dotnet/api/microsoft.extensions.dependencyinjection.iservicecollection). This allows us to easily set up NServiceBus, MediatR, logging, etc.


```csharp
static async Task Main(string[] args)
{
    // We're using NServiceBus anyway, so let's use it to scan all assemblies.
    var assemblyScannerResults = new AssemblyScanner().GetScannableAssemblies();

    var services = new ServiceCollection();
    services.AddTransient<worker>();
    services.AddMediatR(assemblyScannerResults.Assemblies.ToArray());
    services.AddLogging(configure => configure.AddConsole());

    var endpointConfiguration = new EndpointConfiguration("Sender");
    endpointConfiguration.ApplyDefaultConfiguration();

    var endpointInstance = await Endpoint.Start(endpointConfiguration);
    services.AddSingleton<imessagesession>(endpointInstance);

    await services.BuildServiceProvider().GetService<worker>().Run();
}
```

In lines 6 to 9 we set up the `ServiceCollection` and add MediatR and logging, but also a `Worker` class that will actually initiate sending the messages. Lines 11 and 12 set up NServiceBus, where all of the configuration comes from the `Shared` project. In lines 14 and 15 we start the endpoint and provide the instance to the `ServiceCollection`. That way it can be injected into the interceptor notification handlers. On line 17 we build the container, extract the worker, and execute it.

MediatR needs to be told where to look for implementations of the `INotificationHandler<t>` interface. I’m using the `AssemblyScanner `that comes with NServiceBus on line 4 to get a collection of all assemblies in the folder. I then provide that to MediatR on line 7.

What was previously the `Program `class, changed into the `Worker` class. The code itself didn’t change a lot, except that where it used to send the message, it now uses MediatR to publish a notification. You can see MediatR being injected into the Worker on line 8. The notification is published on line 21. Note that what is shown below, is only a very small part of the `Worker` class.


```csharp
public class Worker
{
    const int BatchSize = 250;

    private readonly ILogger<worker> log;
    private readonly IMediator mediator;

    public Worker(ILogger<worker> log, IMediator mediator)
    {
        this.log = log;
        this.mediator = mediator;
    }

    private async Task SendMessage()
    {
        var notification = new OrderSubmitted
        {
            CustomerIdentifier = customers[random.Next(customers.Length)]
        };

        await mediator.Publish(notification);
    }
}
```

## Interceptors

![](/images/priority-queues-interceptors/interceptor-project-references.png)

The mentioned interceptor assemblies actually decide if a message should be sent to their receiver. The interceptors are separated into two different assemblies. To be fully transparent, in the image on the right you can see that the Sender project has references to those projects. I’ll repeat again, this is only so you can press F5 inside Visual Studio and everything works out-of-the-box. In production scenarios, I’d have these deployed together with the Sender in my build & deployment pipeline. Either way works the same; the `AssemblyScanner` can pick up the interceptor assemblies and offer them to MediatR.

Let’s have a look at the complete `StrategicInterceptor `class. Once MediatR publishes a notification, both the `RegularInterceptor `and `StrategicInterceptor `receive the notification and decide whether or not they should send a message to their receiver.


```csharp
public class StrategicInterceptor : INotificationHandler<ordersubmitted>
{
    private readonly ILogger<strategicinterceptor> log;
    private readonly IMessageSession messageSession;

    public StrategicInterceptor(ILogger<strategicinterceptor> log, IMessageSession messageSession)
    {
        this.log = log;
        this.messageSession = messageSession;
    }

    public async Task Handle(OrderSubmitted notification, CancellationToken cancellationToken)
    {
        if (!Customers.GetPriorityCustomers().Contains(notification.CustomerIdentifier))
            return;

        var message = new SubmitOrder()
        {
            CustomerId = notification.CustomerIdentifier
        };

        var sendOptions = new SendOptions();
        sendOptions.SetDestination("StrategicReceiver");

        await messageSession.Send(message, sendOptions).ConfigureAwait(false);
    }
}
```

On line 6 is the constructor and you can see the `IMessageSession` being injected.

On line 14 you can see the decision whether or not to continue and send a message. If this is *not a strategic customer* then we immediately return from the function.

On line 23 you can see that this interceptor knows who its receiver is. Therefore it’s not an issue to hardcode the routing information here, because it refers to the logical endpoint. That information should not change and is completely decoupled from transport. On line 25 you see the message being sent.

## Conclusion

So this is the final post in the [priority queues series](https://bloggingabout-linux.azurewebsites.net/2020/07/16/priority-queues-why-you-dont-need-them/). We looked at three different options where, combined with the 4+1 architectural view models, I decided I liked this option best. It adds some complexity, but the reason I like it is because it’s the cleanest. There’s the least amount of coupling inside the sender, and the least amount of I/O and costs. Although if I/O and costs aren’t an issue, the second option might be the most acceptable option.

As always, the only right answer is: *It depends*. Every solution has trade-offs and it’s up to you to decide what option you like best and suits your needs. I hope I’ve made clear why you likely should not be using priority queues, but a different type of solution that suits the problem better.</strategicinterceptor></strategicinterceptor></ordersubmitted></worker></worker></t></worker></imessagesession></worker></ordersubmitted>

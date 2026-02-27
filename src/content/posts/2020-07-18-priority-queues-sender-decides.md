---
id: 578971
author: Dennis van der Stelt
title: Priority Queues – Sender decides
description: See how to send messages with a higher priority using NServiceBus....
pubDate: '2020-07-18T12:35:34'
image: /images/priority-queues-sender-decides/header.jpg
tags:
  - architecture
  - nservicebus
  - messaging
redirect_from:
  - /dennis/2020/07/18/priority-queues-sender-decides
  - /blogs/dennis/archive/2020/07/18/priority-queues-sender-decides.aspx
---
When we send a message that should be processed with a higher priority, often it’s not enough to just have priority queues. More than likely the higher priority messages are also processed differently, different decisions, and even different deployment requirements. As a result, it is likely more efficient to have two separate components each deal with their own messages.

This article is example 1 of a series on dealing with message priority. You can find the explanation and index in the [opening post](/2020/07/16/priority-queues-why-you-dont-need-them/).

## Introduction

In the previous article I explained why having priority queues by itself is likely not enough. There might be business logic that is different for priority messages, different deployment requirements, SLA, monitoring, etc. In this article I’ll show how to setup two endpoints where each will be processing either regular or strategic customers. The endpoints will be created using [NServiceBus](https://particular.net/nservicebus) and the [Learning Transport](https://docs.particular.net/transports/learning/). This way we don’t focus on any specific transport technology nor do we have to install anything specific. We can purely focus on the code to decide how we should deal with priority messages. I’m assuming basic knowledge about NServiceBus. If you’re interested in learning more, check out the [Getting Started guide](https://particular.net/learn/getting-started) or try the [tutorial](https://docs.particular.net/tutorials/nservicebus-step-by-step/).

In this example we’ll override the default routing strategy in the sender by using [SendOptions](https://docs.particular.net/nservicebus/messaging/send-a-message#overriding-the-default-routing). Normally you’d set up routing for each [command](https://docs.particular.net/nservicebus/messaging/messages-events-commands) so developers don’t have to deal with routing when sending the command. Remember that in the opening post I raised some concerns about this strategy. But as mentioned it is a design option that can be considered.

The entire solution is available in GitHub in the [PriorityQueues](https://github.com/dvdstelt/PriorityQueues) repository with the code for this article specifically in the Visual Studio solution in [this folder](https://github.com/dvdstelt/PriorityQueues/tree/master/src/01%20-%20SendOptions).

## Visual Studio solution setup

In the solution are 4 projects available.
* **Sender** This is a the endpoint, hosted inside a console application, that will send messages to either the regular customers endpoint or strategic customers endpoint.
* **RegularReceiver** This is a the endpoint, hosted inside a console application, that will process orders for regular customers.
* **StrategicReceiver** This is the endpoint, hosted inside a console application, that will process orders for strategic customers.
* **Shared** This is a shared *Class Library* that each of the mentioned projects have access to as a project reference. It contains:
    * An `EndpointConfigurationExtensions` class that provides default configuration for each NServiceBus endpoint. It specifies transport, serializer, recoverability options and error- and audit queue.
    * The `SubmitOrder` command that will be send to one of the receiver endpoints.
    * A `Customers` class that contains a simple list of strategic customers and regular customers.

Make sure when you want to test or debug the entire sample to set each endpoint (Sender, RegularReceiver and StrategicReceiver) as projects that will start when pressing F5.Having [multiple startup projects](https://docs.microsoft.com/en-us/visualstudio/ide/how-to-set-multiple-startup-projects) will be much easier than starting each individual project by itself.

## Processing regular messages

We’ll first discuss how regular messages should be processed. The first part is hosting our NServiceBus endpoint. In the [Program](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/RegularReceiver/Program.cs#L14-L22) file you can see how the endpoint is created and started in lines 5 to 8.We’ll wait for keypress before shutting down our endpoint in line 13 and closing the console.


```csharp
static async Task Main(string[] args)
{
    DisplayHeader();

    var endpointConfiguration = new EndpointConfiguration("RegularReceiver")
        .ApplyDefaultConfiguration();

    var endpointInstance = await Endpoint.Start(endpointConfiguration);

    Console.WriteLine("Press a key to quit...");
    Console.ReadKey(true);

    await endpointInstance.Stop();
}
```

NServiceBus will now process incoming messages and map our [SubmitOrder](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/Shared/Messages/SubmitOrder.cs) message to the [SubmitOrderHandler](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/RegularReceiver/Handler/SubmitOrderHandler.cs).


```csharp
public class SubmitOrderHandler : IHandleMessages<submitorder>
{
    readonly ILog log = LogManager.GetLogger<submitorderhandler>();

    public async Task Handle(SubmitOrder message, IMessageHandlerContext context)
    {
        log.Info($"Message received with CustomerId [{message.CustomerId}]");

        // Emulate a delay as if RegularReceiver is slower than StrategicReceiver
        await Task.Delay(250);
    }
}
```

Nothing is really happening in our `SubmitOrderHandler` and therefor in line 10 I’m emulating that this endpoint is slower than the strategic customers endpoint.

## Processing priority messages

The [Program](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/StrategicReceiver/Program.cs) file of the StrategicReceiver is exactly like the RegularReceiver. The [SubmitOrderHandler](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/StrategicReceiver/Handlers/SubmitOrderHandler.cs) as well, except that now there is no delay in the handler.

## Sending messages

In the [Sender](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/Sender/Program.cs) it is where the interesting things are happening. I’ll show how to specify a message should be sent to either the regular- or strategic receiver using SendOptions. First, as before, the endpoint is [configured and started](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/Sender/Program.cs#L31-L50). After that we’re in an [endless loop, awaiting a key-press](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/Sender/Program.cs#L31-L50) for a choice to either send a single message, a batch of 250 messages or quite the application.


```csharp
class Program
{
    const int BatchSize = 250;

    private static IEndpointInstance endpointInstance;
    private static readonly Random random = new Random();
    private static readonly Guid[] customers = Customers.GetAllCustomers().ToArray();
```

At the very start of the Program class, as seen in the code above, the batch size is specified in line 3, as well as an array with all customers in line 7 that is generated in the [Customers](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/Shared/Customers.cs) class. For every message a random customer GUID is selected from the array and used as CustomerId when sending the message.

When `2` is pressed, a batch of 250 messages is sent using the [SendBatch](https://github.com/dvdstelt/PriorityQueues/blob/master/src/01%20-%20SendOptions/Sender/Program.cs#L75-L84) method. Either way the `SendMessage `method is used:


```csharp
private static async Task SendMessage()
{
    var customerId = customers[random.Next(customers.Length)];
    var destination = Customers.GetPriorityCustomers().Contains(customerId) ? "StrategicReceiver" : "RegularReceiver";

    var message = new SubmitOrder
    {
        CustomerId = customerId
    };

    var sendOptions = new SendOptions();
    sendOptions.SetDestination(destination);

    await endpointInstance.Send(message, sendOptions).ConfigureAwait(false);
}
```
* On line 3 you can see the random customer GUID being selected.
* On line 4 the destination is decided. The list of priority customers is used to verify if it’s a priority customer or not. If it is, the message will be send to the `StrategicReceiver` endpoint, otherwise it’ll be send to the `RegularReceiver `endpoint.
* On line 6 to 9 the message is actually created.
* On line 11 and 12 the `SendOptions` are configured.
* Finally on line 14 the message is send and the `SendOptions` are provided as an override.

Two remarks about line 14:
1. Normally, the `SendOptions` should not be used. Instead, use a [regular routing](https://docs.particular.net/nservicebus/messaging/routing). This prevents making mistakes. If in the future handlers will be split to multiple endpoints, you’ll need to go over every single send to verify if the correct endpoint is used.
2. You can see the sender currently has the knowledge and functionality to decide which message should be sent to which endpoint. From a coupling perspective, you’d rather not have this responsibility with the sender.

## Running the sample

If you run the sample, three console windows should appear. The sender, the regular receiver and the strategic receiver.

![The 3 console windows showing logging output for each.](/images/priority-queues-sender-decides/priorityqueues-sendoptions.png)

You can test the behavior by sending a single message. You can see an emulation of what happens when many messages arrive and the RegularReceiver might get very busy, but the StrategicReceiver only gets a handful of messages and is finished processing them much faster. Possibly because of better hardware, scaling out, etc.

## Conclusion

As you can see we are now able to deal with message priority by having two separate queues, but also having two different endpoints. With all the benefits mentioned in the [opening post](/2020/07/16/priority-queues-why-you-dont-need-them/).

In the next article we’ll have a look how to lose the knowledge of both receiver from the sender by using publish/subscribe. And thus remove the coupling the sender has on both receivers.</submitorderhandler></submitorder>

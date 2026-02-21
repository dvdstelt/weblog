---
id: 578988
author: Dennis van der Stelt
title: Priority Queues – Publishing
description: Instead of deciding to which queue a priority message should be sent to, a better des...
pubDate: '2020-07-23T11:07:31'
image: /images/priority-queues-publishing/header.jpg
tags:
  - Architecture and Design
  - NServiceBus
  - message priority
  - priority queues
redirect_from:
  - /dennis/2020/07/23/priority-queues-publishing
  - /blogs/dennis/archive/2020/07/23/priority-queues-publishing.aspx
---
Instead of deciding to which queue a priority message should be sent to, a better design is where the sender has no knowledge of priority messages or any receiver. We can achieve this using the publish/subscribe messaging pattern.

This article is example 2 of a series on dealing with message priority and priority queues. You can find the explanation and index in the [opening post](https://bloggingabout-linux.azurewebsites.net/2020/07/16/priority-queues-why-you-dont-need-them/).

## Introduction

So far we’ve taken a look at why priority queues by themselves are likely not enough. In the first sample, we’ve taken a look at how we can change the destination per message for strategic customers. That involves coupling though, as the sender needs to have knowledge about who strategic customers are and where messages for those customers should be sent to.

In this sample, we’ll see how this behavior changes by using publish/subscribe. The sender is responsible for sending the message but doesn’t know who is listening to the published messages. Both the regular receiver and the strategic receiver will receive the message and decide by themselves whether it’s a strategic customer or not and if they should process the message.

## Visual Studio solution setup

Since the [first sample](https://bloggingabout-linux.azurewebsites.net/2020/07/18/priority-queues-sender-decides/) that used SendOptions, the Visual Studio solution did not change. You can find more information about the setup there.

You can find the [complete sample in GitHub](https://github.com/dvdstelt/PriorityQueues/tree/master/src/02%20-%20PublishSubscribe).

## Publishing messages

The difference in the [Sender project](https://github.com/dvdstelt/PriorityQueues/tree/master/src/02%20-%20PublishSubscribe/Sender) is in the [SendMessage method](https://github.com/dvdstelt/PriorityQueues/blob/master/src/02%20-%20PublishSubscribe/Sender/Program.cs#L86-L94).


```csharp
private static async Task SendMessage()
{
    var message = new OrderSubmitted
    {
        CustomerId = customers[random.Next(customers.Length)]
    };

    await endpointInstance.Publish(message).ConfigureAwait(false);
}
```

On line 3 you can find the message that is being created, in this case it changed to an event. More on that in a bit. On line 8 you can see the `SendOptions` are not being used anymore. Instead the message is published. The sender has no knowledge of who subscribed to the message. That is being handled by NServiceBus and/or the message broker.

As mentioned, the message was renamed from `SubmitOrder` to `OrderSubmitted`. It was changed from *making a request* to *communicating that an action has been performed*. If you check the message, it’s no longer implementing the `ICommand` interface, but the `IEvent` interface. The interface is only a [marker interface](https://docs.particular.net/nservicebus/messaging/messages-events-commands#identifying-messages-marker-interfaces) – also replaceable by [conventions](https://docs.particular.net/nservicebus/messaging/conventions) – but using it makes NServiceBus enforce messaging best practices. You can read more details about the different message types on the [NServiceBus documentation site](https://docs.particular.net/nservicebus/messaging/messages-events-commands).


```csharp
public class OrderSubmitted : IEvent
{
    public Guid CustomerId { get; set; }
}
```

## Processing only your messages

The interesting part is now in the receivers. The handler is accepting the same message, except that the name changed to `OrderSubmitted`. NServiceBus figured out that, since this is an event, there must be a publisher. There is no need to tell NServiceBus where the publisher is, all that is taken care of behind the scenes. It automatically subscribes to the event. So when the message is published, both the `RegularReceiver` and the `StrategicReceiver` receive the event.


```csharp
public class SubmitOrderHandler : IHandleMessages<ordersubmitted>
{
    public async Task Handle(OrderSubmitted message, IMessageHandlerContext context)
    {
        if (!Customers.GetPriorityCustomers().Contains(message.CustomerId))
        {
            log.Info($"Message received with CustomerId [{message.CustomerId}]");

            // Emulate a delay as if RegularReceiver is slower than StrategicReceiver
            await Task.Delay(250);
        }
    }
}
```

In the code above we see the [message handler](https://github.com/dvdstelt/PriorityQueues/blob/master/src/02%20-%20PublishSubscribe/RegularReceiver/Handler/SubmitOrderHandler.cs) for the `RegularReceiver`. In line 5 we see that the incoming `CustomerId `on the message is verified against a list of known strategic customers. If the `CustomerId `is not found in that list, we process the message. The `StrategicReceiver` [message handler](https://github.com/dvdstelt/PriorityQueues/blob/master/src/02%20-%20PublishSubscribe/StrategicReceiver/Handlers/SubmitOrderHandler.cs) looks almost alike, except that it only processes messages where the `CustomerId` *is in the list of known strategic customers*.

For demo purposes, the message handler for the `RegularReceiver `delays each message for 250 milliseconds. That way we can see what would happen if more messages were processed by this handler, but they take longer than the ‘better performing’ `StrategicReceiver`.

## Running the sample

If you run this second sample, again make sure the 3 appropriate Console Window applications will be started, as with the previous sample. The result should be the same as with the previous sample, except that this sample has less coupling than the previous one.

![The 3 console windows showing logging output for each.](/images/priority-queues-publishing/priorityqueues-sendoptions.png)

## Pros and cons

I’ll reiterate some of the items on the list
* Pro: The sender has no knowledge about whether a customer is a strategic customer or not.
* Pro: The sender is better loosely coupled to the receivers.
* Pro: There is no one with knowledge about all the receivers. You could theoretically add a new receiver without changing the others. If you create a third-category customer, this could mean changing at least the strategic receiver.
* Con: The messages are duplicated at best (a copy of the message in each queue) and are processed by each endpoint.
    * This increases I/O and reduces performance
    * In cloud scenarios, you pay per transaction, which means increased cost.

## Conclusion

As always, there are trade-offs. With a low(er) throughput of messages, this is likely the easiest solution that provides the least amount of coupling. With a higher throughput, this can result in much more I/O and in a cloud environment, possible higher costs.

In the third sample, we’ll see a design that might combine the best of both worlds. But the end result will also be a little bit more complex. So it’s again a trade-off, where a better design and less possible throughput issues, for a more complex design.</ordersubmitted>

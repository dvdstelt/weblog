---
id: 578876
author: Dennis van der Stelt
title: Adding correlation identifier to logs with NServiceBus
description: In a production environment, it can be hard to diagnose logfiles and investigate if s...
pubDate: '2019-06-26T03:22:21'
image: /images/adding-correlation-identifier-to-logs-with-nservicebus/header.jpg
tags:
  - NServiceBus
redirect_from:
  - /dennis/2019/06/26/adding-correlation-identifier-to-logs-with-nservicebus
  - /blogs/dennis/archive/2019/06/26/adding-correlation-identifier-to-logs-with-nservicebus.aspx
---
In a production environment, it can be hard to diagnose logfiles and investigate if something went wrong. Especially in an asynchronous environment, where multiple threads are adding entries at the same time. It’s easy to add a number for the thread you’re on, but it doesn’t improve a lot. Especially in messaging systems, where messages can flow through various endpoints, it can become even more complex. There are options however, to make this a bit more easy. Especially if you’re using NServiceBus.

In this post we’ll have a look at how we can add an identifier to the header of messages and how Log4Net can use this when creating entries in logfiles. In NServiceBus we’ll use the option to [manipulate headers](https://docs.particular.net/nservicebus/messaging/header-manipulation) and in log4net we’ll use the [LogicalThreadContext](https://logging.apache.org/log4net/log4net-1.2.12/release/sdk/log4net.LogicalThreadContext.html) and a custom [pattern layout](https://logging.apache.org/log4net/log4net-1.2.13/release/sdk/log4net.Layout.PatternLayout.html).

### Add identifier to the outgoing message

There are different choices in adding any identifier to a message. NServiceBus itself already adds various headers to each message.
* A message identifier which is unique to each message. This could be used for a single message, but isn’t suitable for correlating log entries for multiple messages.
* A correlation identifier, which is a pointer to a previous message. That way you know which message caused this message to be send. Also less useful.
* A conversation identifier, which is unique from the first message being sent and carries over to all messages that are a result of this message.

The [ConversationId](https://docs.particular.net/nservicebus/messaging/headers#messaging-interaction-headers-nservicebus-conversationid) is very useful to use. It is possible that you might want to use your own identifier, or a so called *business identifier*. This can be a random unique identifier or something like a customer id or order id. For the purpose of this article, I’ll create a unique identifier and add it to the headers, instead of reusing any of the existing headers.


```csharp
var sendOptions = new SendOptions();
sendOptions.SetHeader("BusinessCorrelationId", Guid.NewGuid().ToString().Substring(0, 8));

var message = new MyMessage();
await endpoint.Send(message, sendOptions);
```

In line 2

In line 2 you can see I even trimmed down the Guid to make it more readable later in logfiles.

### Adding identifier to Log4Net context

For NServiceBus to take the header off the message and put it onto the LogicalThreadContext of Log4Net we can write a [behavior](https://docs.particular.net/nservicebus/pipeline/manipulate-with-behaviors).


```csharp
public class AddCorrIdToLog4NetBehavior : Behavior<iincomingphysicalmessagecontext>
{
    public override Task Invoke(IIncomingPhysicalMessageContext context, Func<task> next)
    {
        var headers = context.Message.Headers;
        var businessCorrelationId = headers["BusinessCorrelationId"];

        LogicalThreadContext.Properties["BusinessCorrelationId"] = businessCorrelationId;

        return next();
    }
}
```

The `BusinessCorrelationId` that was put onto the message as a header using `SendOptions`, is now taken off of the message and registered on the `LogicalThreadContext` of Log4Net. What we need to do now is register the behavior with NServiceBus so it gets added to the pipeline.


```csharp
var pipeline = endpointConfiguration.Pipeline;
pipeline.Register(new AddCorrIdToLog4NetBehavior(), "Adds header to log4net thread context.");
```

### Pattern Layout

Now we’ll configure Log4Net to use a specific pattern layout. We’ll use the standard Log4Net Console Appender to give an idea how to configure it, but you can use any appender available.


```csharp
var layout = new PatternLayout { ConversionPattern = "%d [%property{BusinessCorrelationId}] %-5p %c - %m%n" };
layout.ActivateOptions();

var consoleAppender = new ConsoleAppender
  { 
    Threshold = Level.Info, 
    Layout = layout 
  };
consoleAppender.ActivateOptions();

var executingAssembly = Assembly.GetExecutingAssembly(); 
var repository = log4net.LogManager.GetRepository(executingAssembly); 
BasicConfigurator.Configure(repository, consoleAppender);
```

Now simply tell NServiceBus to use Log4Net.


```csharp
// Tell NServiceBus to use Log4Net
LogManager.Use<log4netfactory>();
```

### Creating a log entry

Now we’ll add a sample handler and log a single entry to verify if this is working.


```csharp
public class MyMessageHandler : IHandleMessages<mymessage>
{
  private readonly ILog log = LogManager.GetLogger<mymessagehandler>();

  public Task Handle(MyMessage message, IMessageHandlerContext context)
  {
    log.Info("Received message");

    return Task.CompletedTask;
  }
}
```

If you now look at the log file, you should see the business identifier being added to all log entries that process an NServiceBus message. In the next entry it’s the value [e236abf0].


```plain
2019-06-26 15:07:59,228 [e236abf0] INFO LoggingCorrelationId.MyMessageHandler - Received message
```

You can [download the entire sample](https://github.com/dvdstelt/NServiceBus-Samples/tree/master/samples/LoggingCorrelationId) on my GitHub repository.</mymessagehandler></mymessage></log4netfactory></task></iincomingphysicalmessagecontext>

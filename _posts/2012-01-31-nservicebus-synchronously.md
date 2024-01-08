---
layout: post
id: 577180
author: Dennis van der Stelt
date: 20120131 030317
title: nServiceBus synchronously
description: DISCLAMER  Do NOT do this! It’s bad! This article is just here for reference. But se...
categories:
    - Architecture and Design
    - NServiceBus
redirect_from:
  - "/dennis/2012/01/31/nservicebus-synchronously"
  - "/blogs/dennis/archive/2012/01/31/nservicebus-synchronously.aspx"
---

<span style="color: #ff0000;">**DISCLAMER : Do NOT do this! It’s bad!**</span>

This article is just here for reference. But seriously, do not do this!!! You *will* get hurt! Now let’s get to the original article…

When you read a title like this, everything that makes you a developer should start worrying. Because nServiceBus is build on top of the concept of asynchronous messaging. Normally, it does not support the request/reply communication pattern as you would normally understand this pattern. You are able to send a reply message to the originator, the application that initially sent you the message. But this is inherently asynchronous.

However… With the company I work for, we’re investing a lot of time on messaging. One application needed to call a component that supported this asynchronous messaging. The application itself however is very linear and was very, very hard to interrupt, send a message and have a message handler wait for the result. This really required a Saga and this was too much work at the time. We already had plans for a refactoring where we’d introduce a Saga, but we needed the functionality that called out this other component now. So we created a small piece of code that actually waits for nServiceBus te receive the reply. After this the normal flow of the application can continue.

Again, I really need to clarify that this was a temporary solution and eventually we fixed this by refactoring the code and support a Saga, a long running process that was persisted while waiting for the response.

Here’s the code to do it though


```csharp
DataResponseMessage response = null;

RequestDataMessage message = new RequestDataMessage() { DataId = g, SomeMessage = "Whatever" };

var synchronousHandle = Bus.Send(message)
                            .Register(asyncResult =>
                            {
                                NServiceBus.CompletionResult completionResult = asyncResult.AsyncState as NServiceBus.CompletionResult;
                                if (completionResult != null && completionResult.Messages.Length > 0)
                                {
                                    // Always expecting one IMessage as reply
                                    response = completionResult.Messages[0] as DataResponseMessage;
                                }
                            }
                            , null);

synchronousHandle.AsyncWaitHandle.WaitOne();

Console.WriteLine("Reply : {0}", response.ResponseMessage);
```

For completeness, I’ll include the message handler from the component the message was sent to. This is normal nServiceBus code.


```csharp
public class RequestDataMessageHandler : IHandleMessages<requestdatamessage>
{
    public IBus Bus { get; set; }

    public void Handle(RequestDataMessage message)
    {
        var response = Bus.CreateInstance<dataresponsemessage>(m => 
        { 
            m.DataId = message.DataId;
            m.ResponseMessage = "I got the message : " + message.SomeMessage;
        });

        Bus.Reply(response);
    }
}
```</dataresponsemessage></requestdatamessage>

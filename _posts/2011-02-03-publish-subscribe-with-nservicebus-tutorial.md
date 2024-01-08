---
layout: post
id: 484733
author: Dennis van der Stelt
date: 20110203 102718
title: Publish Subscribe with nServiceBus tutorial
description: When starting to dig into nServiceBus, you’ll notice almost every single example is e...
categories:
    - Architecture and Design
    - Development
    - NServiceBus
redirect_from:
  - "/dennis/2011/02/03/publish-subscribe-with-nservicebus-tutorial"
  - "/blogs/dennis/archive/2011/02/03/publish-subscribe-with-nservicebus-tutorial.aspx"
---

When starting to dig into nServiceBus, you’ll notice almost every single example is executed via the NServiceBus.Host.exe instead of doing it in-process. In my opinion this might be more likely on the receiving side (the subscriber) that just does some stuff in the background. But on the sending side (the publisher) this is mostly triggered by an interactive process, like a website or application where a user triggers the publishing of the message.

My problem was that I had an interactive process triggering the message and the receiving side was a Windows application. So not much use for the nServiceBus host here. Now there’s a lot of documentation and videos on why someone would want to use nServiceBus and how to use its principles. There’s also quite some documentation on different options, but binding them together in a tutorial so you can really get a grasp on what’s happening and why this is happing is something I really missed. And as I like explaining stuff, here’s my version.

### Intoduction

In this tutorial we’ll create 3 projects in a single solution.
1. One class library (a .dll) that will contain the message.
2. One console application for the publisher.
3. One console application for a subscriber.

The publisher will send messages without knowing if none, one or multiple subscribers are interested in that message. The pub/sub sample that comes with nServiceBus shows you how you can subscribe via configuration and code and how different subscribers can process a ‘single’ message differently. This is also explained in the two online videos [at the official site](http://www.nservicebus.com/Training.aspx) or [download the videos](http://blog.torresdal.net/2010/06/08/NNUGPresentationUdiDahanOnNServiceBus.aspx).

### Creating the message

The smartest thing you can do, when defining event messages with nServiceBus, is use interfaces, which is explained in the mentioned videos. As an example we’ll create a message for the event when an order is processed. First create a class library named “PubSubTutorialMessages” and add a single class called IOrderProcessed. Remember that this is an interface.


```csharp
public interface IOrderProcessed : IMessage
{
    int OrderId { get; set; }
    int CustomerId { get; set; }
}
```

I like to put in as little information as possible, but that’s a personal preference and also with the thought that you should not put information in messages that can change. Of course if the other system has no knowledge of your original database, it can’t query this information. An idea is to have a webservice provide this information, instead of putting every bit of information in the message. But it always depends and I make decisions on this with every single message I need to send/publish.

### Creating the publisher

This is all we need for our first solution. Now we’ll build the publisher. First we need a new project, create a console application this time with the name “*Publisher*”. Add some references first
1. NServiceBus.dll
2. NServiceBus.Core.dll
3. log4net.dll
4. PubSubTutorialMessages (our own project)

Now we’re set up and we’ll start writing code to host nServiceBus ourselves. If you run into problems at the beginning, there are two things you should check.
1. Did you add a using statement for NServiceBus?

If not, the extension methods for DefaultBuilder, XmlSerializer, etc. won’t be visible
2. Make sure your console application does <u>not</u> use the .NET Framework 4 <u>client profile</u>.Right-click the project, select *properties* and check the *target framework* on the *Application* tab.


```csharp
using NServiceBus;
using PubSubTutorialMessages;
```

```csharp
IBus bus = NServiceBus.Configure.With()
    .DefaultBuilder()
    .XmlSerializer()
    .MsmqTransport()
        .IsTransactional(true)
    .UnicastBus()
    .MsmqSubscriptionStorage()
    .CreateBus()
    .Start();
```

Here you can see how I configured my bus in code. There’s not much to say about this, it’s really basic. Xml serialization, Msmq, Unicast (the only available option), we use MsqmSubscriptionStorage for registering who subscribes to what and we’re telling the IoC to create the bus. Additionally you can add .Log4Net() to enable logging. By default the console window will be filled with debug messages that might help out. Check out [the documentation](http://www.nservicebus.com/SelfHosting.aspx) for more info.

This needs some configuration, which we’ll add next in our app.config


```xml
<?xml version="1.0"?>
<configuration>
    <configsections>
        <section name="MsmqTransportConfig" type="NServiceBus.Config.MsmqTransportConfig, NServiceBus.Core"></section>
        <section name="UnicastBusConfig" type="NServiceBus.Config.UnicastBusConfig, NServiceBus.Core"></section>
        <section name="Logging" type="NServiceBus.Config.Logging, NServiceBus.Core"></section>
    </configsections>

    <msmqtransportconfig inputqueue="PublisherQueue" errorqueue="error" numberofworkerthreads="1" maxretries="5"></msmqtransportconfig>

    <logging threshold="WARN"></logging>
</configuration>
```

The config sections are default .NET behavior. What we see is the MsmqTransportConfig configuration.
1. **InputQueue** is the queue where our publisher will be accepting subscription requests on. Our subscriber will post an initial message here.
2. **ErrorQueue** is simply the queue where errors will appear in. This can be locally or a remote machine.

On the official website you can find more information on [msmq settings](http://www.nservicebus.com/faq/MsmqTransportConfig.aspx) and on how to [handle the error queue](http://www.nservicebus.com/faq/ExceptionHandling.aspx).

Now we need to send the message. We’re working with an interface for our messages and we can’t instantiate these. nServiceBus can do this for us however.


```csharp
var message = bus.CreateInstance<iorderprocessed>();
message.CustomerId = 10;
message.OrderId = 15;

bus.Publish(message);
```

This is all you need to do now to publish messages. When you publish them, they’ll disappear into thin air, because no one is listening currently. We need a subscriber for that.

### Creating the subscriber

Create another console application called “*Subscriber*” and add the 4 references to it as with the publisher. After that we have to configure the bus in code first, but this time it needs a one additional line.


```csharp
IBus bus = NServiceBus.Configure.With()
               .Log4Net()
               .DefaultBuilder()
               .XmlSerializer()
               .MsmqTransport()
                   .IsTransactional(true)
               .UnicastBus()
                   .LoadMessageHandlers()
               .MsmqSubscriptionStorage()
               .CreateBus()
               .Start();

Console.WriteLine("Press any key to quit...");
Console.ReadLine();
```

You can see I added a call to the *LoadMessageHandlers()* method. This is because the subscriber must process the messages sent and with this line, nServiceBus will iterate over all assemblies and classes to find out which ones implement the *IHandleMessages<t>* interface. So what we should do is implement this interface first. On a side, as you can see that I simply wait for a keypress in this demo, as the class the will implement the *IHandleMessages<t>* interface will handle the messages async.


```csharp
public class TutorialMessageHander : IHandleMessages<iorderprocessed>
{
    public IBus Bus { get; set; }

    public void Handle(IOrderProcessed message)
    {
        Console.WriteLine(String.Format("Processed order {0} for customer {1}", message.OrderId, message.CustomerId));
    }
}
```

We implement the interface and specify T as *IOrderProcessed*, because that’s the message the publisher will send. Put the cursor over the *IHandleMessages<iorderprocessed>* and press CTRL + . and you’ll get a widget in Visual Studio 2010 with the option to implement the interface, like the image below.

[ ](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/2870.ctrlpunt_5F00_4E97419A.png)[![](/images/publish-subscribe-with-nservicebus-tutorial/2818_ctrlpunt_5f00_thumb_5f00_1bc73b26.png)](/wp-content/uploads/2014/01/2818_ctrlpunt_5f00_thumb_5f00_1bc73b26.png)

After you did this, you can write the code to handle the message. In my case, I simply write it to the console. The funny thing is, because everything happens asynchronously, you have no idea when this will be outputted. This normally isn’t a problem at all, except for when logging is turned on. Because logging and our own *Console.WriteLine* will happen asynchronously, our own line will be somewhere inside the nServiceBus messages. You can turn of logging by removing the .Log4Net() line or setting the log level way lower, as you can [read in the documentation](http://www.nservicebus.com/Logging.aspx) (bottom of the page).

Now all we need is to configure our subscriber.


```xml
<?xml version="1.0"?>
<configuration>
    <configsections>
        <section name="MsmqTransportConfig" type="NServiceBus.Config.MsmqTransportConfig, NServiceBus.Core"></section>
        <section name="UnicastBusConfig" type="NServiceBus.Config.UnicastBusConfig, NServiceBus.Core"></section>
        <section name="Logging" type="NServiceBus.Config.Logging, NServiceBus.Core"></section>
    </configsections>

    <msmqtransportconfig inputqueue="SubscriberQueue" errorqueue="error" numberofworkerthreads="1" maxretries="5"></msmqtransportconfig>

    <logging threshold="WARN"></logging>

    <unicastbusconfig>
        <messageendpointmappings>
            <add messages="PubSubTutorialMessages" endpoint="PublisherQueue"></add>
        </messageendpointmappings>
    </unicastbusconfig>

</configuration>
```

Let’s go over this a bit.
1. The MsmqTransportConfig is about the same, except for the *InputQueue*. This states the queue in which we want to receive messages that concern us! So the publisher will put messages it publishes, in this queue, after we subscribed ourselves.
2. Logging is turned down and only shows warning messages.
3. The UnicastBusConfig configuration has two important options.
    1. *Messages* is set to *PubSubTutorialMessages*.This tells nServiceBus that all messages in the *PubSubTutorialMessages.dll* assembly should be routed to this subscriber.
    2. *Endpoint* is set to *PublisherQueue*.This is the endpoint the publisher is using to listen to new subscriptions.

If the publisher is on ServerA, we should set UnicastBusConfig’s Endpoint to PublisherQueue@ServerA. If you want another subscriber, copy the subscriber project and change the InputQueue. That’s all.

Now you should be able to run the application and have it send messages. [Here’s the solution](/files/PubSubTutorial.zip) so you can test it out for yourself.</iorderprocessed></iorderprocessed></t></t></iorderprocessed>

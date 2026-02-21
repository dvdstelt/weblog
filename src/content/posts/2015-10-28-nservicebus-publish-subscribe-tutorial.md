---
id: 578788
author: Dennis van der Stelt
title: NServiceBus Publish Subscribe tutorial
description: In this tutorial I’ll try to explain how publish subscribe (pubsub) works and how ...
pubDate: '2015-10-28T03:26:46'
image: /images/nservicebus-publish-subscribe-tutorial/header.jpg
tags:
  - NServiceBus
  - nservicebus
  - publish subscribe
redirect_from:
  - /dennis/2015/10/28/nservicebus-publish-subscribe-tutorial
  - /blogs/dennis/archive/2015/10/28/nservicebus-publish-subscribe-tutorial.aspx
---
In this tutorial I’ll try to explain how publish / subscribe (pub/sub) works and how to set this up using NServiceBus.

# Publish Subscribe pattern

The pattern in itself, I think, is easiest to understand when looking at the button click event in Windows Forms. The button was developed in the .NET Framework and has, among others, the click event. Mostly you’ll have a single method subscribed to the click event. But it is possible to have multiple methods subscribe to the same click event. Or one method subscribed to multiple button click events. Or a variation of this.

It’s the same with messaging. You can have some code publish an event, without knowing who your subscribers are. Because the event is about something that already happened, it’s always in past tense. So when you cancel an order, you’ll have the OrderCancelled event.

With NServiceBus you can subscribe to these events and the subscription will be stored by NServiceBus. The subscriptions can be stored as MSMQ messages, but more logically would be SQL Server storage or some other data storage mechanism. For transports that support publish/subscribe natively, no persistence is required. Read more [about this here](http://docs.particular.net/nservicebus/messaging/publish-subscribe/).

# Tutorial

So enough with the theoretical side of things, there are already way too many resources that describe this. Let’s get to the code. Here’s what we’re going to do
1. Create a class library that will contain our messages
2. Focus on the pub/sub side first and create the publisher
    1. Create a class library
    2. Add NServiceBus NuGet packages
    3. Configure the service
    4. Write a handler that will publish the event
3. Add the subscriber
    1. Add another class library
    2. Add NServiceBus NuGet packages
    3. Configure the service
    4. Write the handler that will subscribe to the event
    5. Configure NServiceBus to send the subscription
4. Add a console application that will initiate the message calls

### Create the messages

![](/images/nservicebus-publish-subscribe-tutorial/solutionname.png)First we’ll create the solution and the class library that will contain the messages. The messages need to go into a separate assembly because they will be shared among different projects. So in Visual Studio, create a new **Class Library.** We’ll call the project Messages, but name the solution PubSubDemo, as shown in the image on the right.

Visual Studio automatically adds Class1 but we need two different classes, CancelOrderCommand and OrderCancelledEvent. Both only have one property of type Guid with the name Id. Here’s the code for these.


```csharp
namespace Messages
{
  public class CancelOrderCommand
  {
    public Guid OrderId { get; set; }
  }

  public class OrderCancelledEvent
  {
    public Guid OrderId { get; set; }
  }
}
```

### Create the publisher

Now we’ll create the project that actually publishes the messages as this is the focus of this article. Add another Class Library to your solution with the name Publisher. Now you should have two projects in your solution.

We’ll add the NServiceBust.Host NuGet package. I always use the Package Manager Console (View -> Other Windows -> Package Manager Console) instead of the NuGet GUI, but that’s just my thing. This article is written on NServiceBus 5.2.9 with NServiceBus.Host 6.0 but it should work with older and newer 5.x version as well. To be 100% sure this works, use the following commands in the Package Manager Console. When NServiceBus 6.0 will be released, significant changes to the API will be made and these demos won’t work out of the box anymore. It should be real easy to upgrade however.


```powershell
Install-Package NServiceBus -Version 5.2.9 -Project Publisher
Install-Package NServiceBus.Host -Version 6.0.0 -Project Publisher
```

A couple of things happened. First of all the packages were installed, references were added and an additional file was added to your project called EndpointConfig.cs. We’ll look at the file later. I first want you to right-click the Publisher assembly and take a look at the properties. Under “Debug” you’ll find the “Start external program” was set to the NServiceBus.Host.exe file. This executable will host your service. During debugging this host will be executed, instead of your Class Library, which cannot be executed at all. In production, it should [be properly installed](http://docs.particular.net/nservicebus/hosting/nservicebus-host/#installation) and run as a Windows Service. What the host does is scan for class libraries (.dll files) and possible implementations of certain interfaces. For example the IConfigureThisEndpoint interface in our EndpointConfig.cs file.

After getting rid of all comments, the file looks like this


```csharp
namespace Publisher
{
  using NServiceBus;

  public class EndpointConfig : IConfigureThisEndpoint
  {
    public void Customize(BusConfiguration configuration)
    {
      configuration.UsePersistence&lt;PLEASE_SELECT_ONE&gt;();
    }
  }
}
```

What we’ll do is
* [Name the endpoint](http://docs.particular.net/nservicebus/messaging/specify-input-queue-name) “publisher”, which will result in a queue name with the same name
* [Configure the transport](http://docs.particular.net/nservicebus/transports/)
* [Configure the serializer](http://docs.particular.net/nservicebus/serialization/)
* [Configure persistence](http://docs.particular.net/nservicebus/persistence/)
* Add [conventions for unobtrusive](http://docs.particular.net/nservicebus/messaging/unobtrusive-mode) commands and events

This will make the file look like this


```csharp
namespace Publisher
{
  using NServiceBus;

  public class EndpointConfig : IConfigureThisEndpoint
  {
    public void Customize(BusConfiguration configuration)
    {
      configuration.EndpointName("publisher");
      configuration.UseTransport<msmqtransport>();
      configuration.UseSerialization<jsonserializer>();
      configuration.UsePersistence<inmemorypersistence>();

      ConventionsBuilder conventions = configuration.Conventions();
      conventions.DefiningCommandsAs(t => t.Namespace != null && t.Namespace == "Messages" && t.Name.EndsWith("Command"));
      conventions.DefiningEventsAs(t => t.Namespace != null && t.Namespace == "Messages" && t.Name.EndsWith("Event"));
    }
  }
}
```

Remember our messages in the Class Library called “Messages”? The convention specifies that all messages should be in this namespace and that types for commands should end with “Command” and with events they should end with “Event”. When we’ve done that, let’s have a look at the App.config configuration. There’s a lot of green, but if we remove the green, we’ll end up with this.


```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<configuration>
	<configsections>
		<section name="MessageForwardingInCaseOfFaultConfig" type="NServiceBus.Config.MessageForwardingInCaseOfFaultConfig, NServiceBus.Core"></section>
		<section name="UnicastBusConfig" type="NServiceBus.Config.UnicastBusConfig, NServiceBus.Core"></section>
		<section name="AuditConfig" type="NServiceBus.Config.AuditConfig, NServiceBus.Core"></section>
	</configsections>
	<messageforwardingincaseoffaultconfig errorqueue="error"></messageforwardingincaseoffaultconfig>
	<unicastbusconfig>
		<messageendpointmappings></messageendpointmappings>
	</unicastbusconfig>
	<auditconfig queuename="audit"></auditconfig>
</configuration>
```

For now this is enough, we’ll get back to this later. We’ll now have a look at the file Class1.cs which we’ll change into a message handler. If you haven’t done so, **add a reference to the Messages project**. Then make sure that Class1.cs looks like this. And don’t forget to rename the file to CancelOrderHandler.cs to not get confused by names.


```csharp
namespace Publisher
{
  public class CancelOrderHandler : IHandleMessages&lt;CancelOrderCommand&gt;
  {
    public void Handle(CancelOrderCommand message)
    {
      throw new NotImplementedException();
    }
  }
}
```

We’ve created a message handler for the CancelOrderCommand. This is default NServiceBus and [can be read about here](http://docs.particular.net/nservicebus/handlers/). Now what we want to do is publish a message. To do this, we need a reference to the Bus, which we’ll have injected via the constructor. Then we can publish a new event, based on the incoming message. This will make our class look like this.


```csharp
public class CancelOrderHandler : IHandleMessages<cancelordercommand>
{
  private readonly IBus Bus;

  public CancelOrderHandler(IBus bus)
  {
    Bus = bus;
  }

  public void Handle(CancelOrderCommand message)
  {
    Bus.Publish<ordercancelledevent>(m => m.OrderId = message.OrderId);
  }
}
```

I’ve omitted everything like logging to clarity. The solution on GitHub will have a little bit more. This handler could not be any simpler. We are now done with this project, and we’ll need to add two more. We’ll add the subscriber and a console application, initiating the process by sending out the initial CancelOrderCommand over the bus. Later on we’ll transform this project, so that it is not only a publisher, but also subscriber of its own events.

### Create the subscriber

Add another Class Library called “Subscriber” and perform the two NuGet Package commands again, but now for this specific project.


```powershell
Install-Package NServiceBus -Version 5.2.9 -Project Subscriber
Install-Package NServiceBus.Host -Version 6.0.0 -Project Subscriber
```

Again the App.config and EndpointConfig.cs will be added. The EndpointConfig.cs will look almost the same, except for the endpoint name being set to “subscriber”.


```csharp
public class EndpointConfig : IConfigureThisEndpoint
{
  public void Customize(BusConfiguration configuration)
  {
    configuration.EndpointName("subscriber");
    configuration.UseTransport<msmqtransport>();
    configuration.UseSerialization<jsonserializer>();
    configuration.UsePersistence<inmemorypersistence>();

    ConventionsBuilder conventions = configuration.Conventions();
    conventions.DefiningCommandsAs(t => t.Namespace != null && t.Namespace == "Messages" && t.Name.EndsWith("Command"));
    conventions.DefiningEventsAs(t => t.Namespace != null && t.Namespace == "Messages" && t.Name.EndsWith("Event"));
  }
}
```

We’ll change Class1.cs into the handler for the event. Be sure not to forget to add a reference to the Messages project.


```csharp
namespace Subscriber
{
  public class SubscriberHandler : IHandleMessages<ordercancelledevent>
  {
    public void Handle(OrderCancelledEvent message)
    {
      Console.ForegroundColor = ConsoleColor.Blue;
      Console.WriteLine("OrderCancelledEvent with id {0} received.", message.OrderId);
      Console.ResetColor();
    }
  }
}
```

Now the important part is the configuration file. Here we specify that there is an endpoint with messages that we’re interested in. In the following configuration, we specify that we’re interested in everything, but we can of course trim this down and be more specific into what we’re interested in. But we’ll keep it as easy as possible in this demo, so that it’ll always work. So line 12 was added in comparison to the configuration of the publisher. With this line we are telling the endpoint called “Publisher” that we’re interested in events being published, that are in the assembly called “Messages”. When we’ve done this, we’re also done with this project and will speed up and create our console applicaiton.


```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<configuration>
	<configsections>
		<section name="MessageForwardingInCaseOfFaultConfig" type="NServiceBus.Config.MessageForwardingInCaseOfFaultConfig, NServiceBus.Core"></section>
		<section name="UnicastBusConfig" type="NServiceBus.Config.UnicastBusConfig, NServiceBus.Core"></section>
		<section name="AuditConfig" type="NServiceBus.Config.AuditConfig, NServiceBus.Core"></section>
	</configsections>
	<messageforwardingincaseoffaultconfig errorqueue="error"></messageforwardingincaseoffaultconfig>
	<unicastbusconfig>
		<messageendpointmappings>
			<add assembly="Messages" endpoint="publisher"></add>
		</messageendpointmappings>
	</unicastbusconfig>
	<auditconfig queuename="audit"></auditconfig>
</configuration>
```

### Create the console application

What we could do, is immediately publish a message from the publisher using the [IWantToRunWhenBusStartsAndStops](http://docs.particular.net/nservicebus/lifecycle/iwanttorunwhenthebusstartsandstops#lifecycle-iwanttorunwhenthebusstartsandstops-v4_x-5_x) interface. But since we’re using the InMemory persistence for our subscriptions, this could turn out ugly. Because the subscription isn’t registered yet, when we start sending out the message. It gets too complicated to make that work, so we’ll use a seperate console application to send out the first command.

Add a new console application called “ConsoleApplication”, add a reference to the Messages project and install NServiceBus (not the host) via NuGet.


```powershell
Install-Package NServiceBus -Version 5.2.9 -Project ConsoleApplication
```

Now change the code of your console application to this.


```csharp
class Program
{
  static void Main(string[] args)
  {
    BusConfiguration configuration = new BusConfiguration();
    configuration.UseTransport<msmqtransport>();
    configuration.UseSerialization<jsonserializer>();

    ConventionsBuilder conventions = configuration.Conventions();
    conventions.DefiningCommandsAs(t => t.Namespace != null && t.Namespace == "Messages" && t.Name.EndsWith("Command"));

    CancelOrderCommand cmd = new CancelOrderCommand();
    cmd.OrderId = Guid.NewGuid();

    Console.WriteLine("When you're ready, press a key to send the command!");
    Console.ReadKey();

    using (ISendOnlyBus bus = Bus.CreateSendOnly(configuration))
    {
      Console.WriteLine("Sending CancelOrderCommand");
      bus.Send(cmd);
    }
  }
}
```

And now add the following configuration


```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
	<configsections>
		<section name="UnicastBusConfig" type="NServiceBus.Config.UnicastBusConfig, NServiceBus.Core"></section>
	</configsections>

	<unicastbusconfig>
		<messageendpointmappings>
			<add assembly="Messages" endpoint="publisher"></add>
		</messageendpointmappings>
	</unicastbusconfig>
</configuration>
```

We do almost everything the same, although we’re creating the Bus ourselves using the CreateSendOnly method. This will make the initialization of the Bus extremely fast. Then we send the initial command. But first we wait for a keypress. Why is that?

At first, the subscriber is immediately sending out a subscription message to the publisher, via MSMQ. The publisher has to pick up this message and store the subscription; in memory of course, because that’s what we specified. If we start sending out the initial command, the subscription isn’t stored in memory yet and no event will be send out. So it’s imperative that we see a “NServiceBus.SubscriptionReceiverBehavior” message coming in on the console window of the Publisher service. If we wait about 5 seconds, that should be more than enough.

Press a key and the command should be send, immediately followed by an event being send out. The event is picked up by the subscriber. Put in breakpoints to actually see it happen, or add some output to the console. Friendly reminder that outputting to the console doesn’t help when your service is running as a Windows Service. But for testing purposes it’s fine.

### Making your publisher a subscriber

So how about adding another subscriber, our own publisher? Open up the configuration of the publisher and change the MessageEndpointMapping to also subscribe.


```xml
<unicastbusconfig>
	<messageendpointmappings>
		<add assembly="Messages" endpoint="publisher"></add>
	</messageendpointmappings>
</unicastbusconfig>
```

Now create a new handler inside the Publisher project.


```csharp
public class OrderCancelledHandler : IHandleMessages<ordercancelledevent>
{
  public void Handle(OrderCancelledEvent message)
  {
    Console.ForegroundColor = ConsoleColor.Green;
    Console.WriteLine("OrderCanclledEvent with id {0} received.", message.OrderId);
    Console.ResetColor();
  }
}
```

Run everything again and you’ll see that you now have two subscribers, your Subscriber service and your Publisher service.

### Conclusion

Both the console application, the publisher and the subscriber projects now have the same MessageEndpointMappings in their configuration. In the Console Application, this means you want to send messages of the “Messages” assembly to the “publisher” endpoint. In the Subscriber service this means you want to send messages of the “Messages” assembly to the “publisher” endpoint, but also want to receive events in that assembly. And adding the same configuration to the publisher service means about the same.

This gives a lot of flexibility and hopefully made the publish/subscribe pattern used with NServiceBus a lot clearer.

You can find the [code here on GitHub](https://github.com/dvdstelt/pubsubdemo/).</ordercancelledevent></jsonserializer></msmqtransport></ordercancelledevent></inmemorypersistence></jsonserializer></msmqtransport></ordercancelledevent></cancelordercommand></inmemorypersistence></jsonserializer></msmqtransport>

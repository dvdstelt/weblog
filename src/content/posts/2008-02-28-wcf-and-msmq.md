---
id: 457966
author: Dennis van der Stelt
title: WCF and MSMQ
description: It’s been a while since I blogged about one of my favorite topics, Windows Communicat...
pubDate: '2008-02-28T08:52:33'
tags:
  - .NET Framework 3.0
  - WCF
redirect_from:
  - /dennis/2008/02/28/wcf-and-msmq
  - /blogs/dennis/archive/2008/02/28/wcf-and-msmq.aspx
---
It’s been a while since I blogged about one of my favorite topics, Windows Communication Foundation.

In this article I’ll explain how you can use MSMQ with WCF to really process messages asynchronously. It’s unbelievable how easy this is. Read my complete [WCF series](/2006/10/18/WCF-Part-0-_3A00_-Introduction/) on how to set up your first service. The idea in this example is that we have to send some e-mails, but we don’t want that to be done immediately.

We’ll setup the service with a Console Application. In another post we’ll host our service using a Windows Service.
**1: Make sure MSMQ is installed.** [![WindowsComponentsVista](/images/wcf-and-msmq/windowscomponentsvista_thumb.png)](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/WindowsLiveWriter/WCFandMSMQ_BAEC/WindowsComponentsVista_2.png) MSMQ must of course be installed. Check your Windows components to see if it’s installed. In Vista this is under “Control Panel” -> “Programs and Features” -> “Turn Windows features on or off”.

On the right you can see I’ve turned on everything. If it’s already installed you should be able to take a look at the queues. Right-click on the “Computer” icon and choose “Manage”. It’s under “Services and Applications”.
**2: Setup a class library.** Create a new project and make it a class library. Add a really simple interface. Again, if you want to know the how and why, read my complete WCF series.


```csharp
[ServiceContract(Namespace="http://schemas.class-a.nl/msmq/example01/2008/02/”, SessionMode=SessionMode.NotAllowed)]
public interface ISendMail
{
  [OperationContract(Name = "SubmitMessage”, IsOneWay = true)]
  void SubmitMessage(MailMessage message);
}
```

Now we need an implementation for our service. In the code below I only output the message to the console. Normally you’d use tracing or logging for this, but in a bit we’ll build a console application to host everything.


```csharp
public class SendMailService : ISendMail
{
  public void SubmitMessage(MailMessage message)
  {
    Console.WriteLine("To      : " + message.ToAddress);
    Console.WriteLine("From    : " + message.FromAddress);
    Console.WriteLine("Subject : " + message.Subject);
    Console.WriteLine("Body    : " + message.Body);
  }
}
```

As you can see I’m transferring a MailMessage. Here’s the datacontract for it.


```csharp
[DataContract(Name="MailMessage”, Namespace="http://schemas.class-a.nl/msmq/example01/2008/02/”)]
public class MailMessage
{
  [DataMember(Name="ToAddress”, IsRequired=true, Order=1)]
  public string ToAddress { get; set; }
  [DataMember(Name = "FromAddress”, IsRequired = true, Order = 2)]
  public string FromAddress { get; set; }
  [DataMember(Name = "CCAddress”, IsRequired = false, Order = 3)]
  public string CCAddress { get; set; }
  [DataMember(Name = "BCCAddress”, IsRequired = false, Order = 4)]
  public string BCCAddress { get; set; }
  [DataMember(Name = "Subject”, IsRequired = true, Order = 5)]
  public string Subject { get; set; }
  [DataMember(Name = "Body”, IsRequired = true, Order = 6)]
  public string Body { get; set; }
}
```

That’s our service, let’s get to hosting
**3: Create a host** In a next post I will explain hosting this WCF service in a Windows Service. For now, a Console Application will do. It’s also much simpler to debug and test our application that way. Add a new Console Application to your solution.

First thing we need to do, is make sure we have a queue. First create a reference to the System.Messaging assembly. Then past the following code in your Main() method.


```csharp
string queueName = ConfigurationManager.AppSettings["SendMailQueueName”];

if (!MessageQueue.Exists(queueName))
  MessageQueue.Create(queueName, true);
```

As you can see, we’re getting the SendMailQueueName from the configuration and if it doesn’t exist yet, we’ll create it. For the configuration, just download the complete solution.

Now just create a ServiceHost and open it.


```csharp
Type serviceType = typeof(SendMailService);
using (ServiceHost host = new ServiceHost(serviceType))
{
  host.Open();
}
```

Beside the fact we’ve checked for existence of the queue using System.Messaging, we did nothing so far concerning MSMQ. The only thing noticeable is setting the operation as a OneWay operation.
**4: Setting up the host configuration** Let’s have a look at the services configuration. We’ve configured a single service, based on the SendMailService. It as two endpoints, but one’s for exchanging metadata (MEX endpoint). As you can see from the binding and the address of the other endpoint, this is the first time we’re specifying that we want to use MSMQ. We’re using the NetMsmqBinding and a private queue for our service.


```csharp
<system.servicemodel>
  <services>
    <service behaviorconfiguration="MetadataBehavior" name="EmailService.SendMailService">
      <endpoint address="net.msmq://localhost/private/ClassA_SendMail" binding="netMsmqBinding" contract="EmailService.ISendMail" bindingconfiguration="SendMailNetMsmqBinding"></endpoint>
      <endpoint address="mex" binding="mexHttpBinding" contract="IMetadataExchange"></endpoint>
      <host>
        <baseaddresses>
          <add baseaddress="http://localhost:8080/SendMail/"></add>
        </baseaddresses>
      </host>
    </service>
  </services>
</system.servicemodel>
```

Pay attention to the ‘behaviorConfiguration’ attribute on the service and my ‘SendMailNetMsmqBinding binding configuration’. The behavior configuration isn’t interesting, it’s just enabling the MEX endpoint to work. The binding configuration for the endpoint is slightly interesting. As you can see below I’ve set the security to ‘None’. That’s because my laptop isn’t attached to a domain. By default it’s on transport security, meaning it’ll use Active Directory integration, which won’t allow me to connect in my situation. You’ll get a nice :

> Binding validation failed because the binding’s MsmqAuthenticationMode property is set to WindowsDomain but MSMQ is installed with Active Directory integration disabled. The channel factory or service host cannot be opened.

The deadLetterQueue attribute is Windows version specific, because I can only set it to custom on Vista and Windows Server 2008.No need for a custom created queue here, it’ll just group the messages in the dead-letter queue, so you’ll know they’re yours. Read [this article on MSDN](http://msdn2.microsoft.com/en-us/library/ms789035.aspx) for more info.


```csharp
<bindings>
  <netmsmqbinding>
    <binding name="SendMailNetMsmqBinding" deadletterqueue="Custom">
      <security mode="None"></security>
    </binding>
  </netmsmqbinding>
</bindings>
```
**5: Creating a client** Normally our client is calling the service directly. We can’t do that, but we can get the metadata from our service, because we’ve set up a MEX endpoint. Add a new console application to your solution and create a service reference to the service. You can add a service reference by starting your service WITHOUT debugging. This way the option isn’t disabled in your console client.

Now open the proxy code and insert a message!


```csharp
static void Main(string[] args)
{
  SendMailClient svc = new SendMailClient();

  MailMessage msg = new MailMessage();
  msg.ToAddress = "dennis@nospam.class-a.nl”;
  msg.FromAddress = "dvdstelt@nospam.gmail.com”;
  msg.Subject = "Test mail”;
  msg.Body = "Wow, is this going to work?”;

  svc.SubmitMessage(msg);
}
```

Isn’t that extremely simple?! The only difference is in the configuration. This proves a lot of what’s WCF is in the configuration.

Test MSMQ by stopping the service and just running the client. You can see the message in MSMQ. Start your host and it should disappear almost immediately.

Download [the solution](/files/MSMQ-Example.zip) for a complete view on what we’ve done.

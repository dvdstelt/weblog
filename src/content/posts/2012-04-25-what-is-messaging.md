---
id: 577522
author: Dennis van der Stelt
title: What is messaging
description: I’ve written in SDN Magazine about messaging and how it relates to RPC. It isn’t abou...
pubDate: '2012-04-25T06:45:40'
image: /images/what-is-messaging/header.png
tags:
  - architecture
  - nservicebus
  - SDN
  - WCF
  - WCF4
redirect_from:
  - /dennis/2012/04/25/what-is-messaging
  - /blogs/dennis/archive/2012/04/25/what-is-messaging.aspx
---
I’ve written in SDN Magazine about messaging and how it relates to RPC. It isn’t about messaging vs. RPC, but more or less an attempt to explain what benefits messaging can add to your software. Monday April 23rd I gave a presentation about the same subject. With this post I want to show the code so people can have a better look at it. Remember that there’s so much more possible than I show. I’m not going all the way, just showing how spatial coupling can be solved. Platform coupling is solved by WCF and nServiceBus self and temporal coupling can be achieved by doing it asynchronously over MSMQ, for example. nServiceBus does this by default, WCF can do this by marking operations as OneWay and selecting the msmqBinding.

So what did I show? First of all, let’s look at code that Visual Studio 2010 has in its WCF Service Application template. I sometimes get remarks that the info in a post is not complete, so here it goes
1. Do File –> New Project
2. Select “WCF” on the left and then the “WCF Service Application” template.

You can see IService1 interface with a method named “GetData” which expects a single parameter and returns a string value. The client knows the method to execute and when something changes, the coupling of the client to the service might break the client. Versioning is only on of the many problems that might hit you. This is the implementation in the Service1 class.


```csharp
public string GetData(int value)
{
    return string.Format("You entered: {0}", value);
}
```

Add a new Console Application to your solution, add a Service Reference without changing anything of the defaults. Then create the code to call this service. Your console application should look like this.


```csharp
class Program
{
    static void Main(string[] args)
    {
        ServiceReference1.Service1Client svc = new ServiceReference1.Service1Client();
        string result = svc.GetData(10);

        Console.WriteLine("Result : {0}", result);
    }
}
```

So the idea is that we don’t create separate methods for everything we want to send, but rather have something in place that finds the correct handler class for our message. So what we need is a single generic method in our service contract that accepts anything that conforms to a message we specify. Add the following method to your IService1 interface and make sure your code compiles. This means you’ll have to implement the method in the Service1 class.


```csharp
[OperationContract]
void Execute(Message message);
```

As you can see we specified the class Message as parameter so we’ll need to define it as well.


```csharp
public class Message
{
}
```

Now the Execute method on our Service1 class needs to call a handler class that will contain our code. We’ll specify a default interface so that all our handlers adhere to this interface. That way we’ll be able to easily find all handlers via reflection. Let’s have a look at the interface.


```csharp
public interface IHandleMessages<t> where T : Message
{
    void Handle(T message);
}
```

Now all we need to do is create a real message and a handler that will be able to work with this message.


```csharp
public class GameOfTheYear : Message
{
    public string Name { get; set; }
    public int Year { get; set; }
}

public class GameOfTheYearHandler : IHandleMessages<gameoftheyear>
{
    public void Handle(GameOfTheYear message)
    {
        Debug.WriteLine("Game : " + message.Name);
    }
}
```

The message is quite simple and the implementation of our handler maybe even simpler. But these aren’t the point currently. What is important is how we actually execute the Handle method from our service. Here’s the code for it and we’ll go through it line by line.


```csharp
public void Execute(Message message)
{
    Assembly assembly = (message.GetType()).Assembly;

    var allMessageHandlers =
            from type in assembly.GetTypes()
            where !type.IsAbstract
            from interfaceType in type.GetInterfaces()
            where interfaceType.IsGenericType
            where interfaceType.GetGenericTypeDefinition() == typeof(IHandleMessages<>)
            select type;

    Type messageInterface = typeof(IHandleMessages<>).MakeGenericType(message.GetType());
    var myMessageHandlers = allMessageHandlers
                                    .Where(type => type.GetInterfaces()
                                    .Any(it => it == messageInterface))
                                    .Distinct();

    foreach (var handler in myMessageHandlers)
    {
        object handlerInstance = Activator.CreateInstance(handler);
        MethodInfo methodInfo = handler.GetMethod("Handle");
        methodInfo.Invoke(handlerInstance, new[] { message });
    }
}
```

At line 3 we get the assembly of the message we’ve received. This is part of the convention over configuration you can use, which states that the handler for the message should be in the same handler. Of course you could scan every single assembly in the same folder as you. For performance benefits you can scan it a single time and store all handlers and its methods in memory. Again, we’re keeping it simple so it’s easier to understand. At line 5 we’re searching for all types that are not abstract (line 7), implement a generic interface (line 9) that are of type IHandleMessages (line 10).

Then in line 13 we compose a type of the generic IHandleMessages interface with the type of our message. In line 14 we filter our just selected handlers so that we’ll only have the ones that actually implement our exact interface. Now that we have our actual handlers, we can try to create an instance of it (line 21), find the Handle method and invoke it with our message as its parameter.

Now refresh your ServiceReference in your console application client by right-clicking the service reference and selecting the update item in the context menu. Now you should be able to create a GameOfTheYear object. However, although our service does recognize the “Execute” method, it has no knowledge of the GameOfTheYear class. This simply is because WCF doesn’t automatically provides every single class in its WSDL/MEX-endpoint so we need to provide this information to it. Open the IService1 interface again and change the contract for our Execute method so it looks like this.


```csharp
[OperationContract]
[ServiceKnownType("GetKnownTypes", typeof(MessageTypeFinder))]
void Execute(Message message);
```

Now recompile the project and update the service reference again. Everything should work flawlessly again. If this works, we can try to see if we can do something very valuable; create an additional handler that logs our messages to disk.


```csharp
public class GameOfTheYearLogHandler : IHandleMessages<gameoftheyear>
{
    public void Handle(GameOfTheYear message)
    {
        Logger.Write("We've processed " + message.Name);
    }
}
```

The same code will execute both handlers without any changes. We’ve really decoupled the execution and handling of the message we’re sending from the initial service. As you can see we can create multiple handlers for a single message. What we can also do is create a single handler for multiple messages. We’ll first define the message and add an additional interface to our GameOfTheYearHandler.


```csharp
public class GameReview : Message
{
    public string NameOfGame { get; set; }
    public string Review { get; set; }
}

public class GameOfTheYearHandler : IHandleMessages<gameoftheyear>, IHandleMessages<gamereview>
{
    public void Handle(GameOfTheYear message)
    {
        Console.WriteLine("Game : " + message.Name);
    }

    public void Handle(GameReview message)
    {
        Console.WriteLine("Revied : " + message.NameOfGame);
    }
}
```

First thing to remember is that we need to make sure the GameReview message is specified as a KnownType to our service. As we don’t want many lines with ServiceKnownTypeAttribute statements there, we need a different solution. Add the following class to your code and then replace the original ServiceKnownType line with the last line in the following code.


```csharp
public class MessageTypeFinder
{
    public static IEnumerable<type> GetKnownTypes(ICustomAttributeProvider provider)
    {
        IEnumerable<type> query =
                from type in typeof(Message).Assembly.GetTypes()
                where typeof(Message).IsAssignableFrom(type)
                select type;

        return query.ToArray();
    }
}

[ServiceKnownType("GetKnownTypes", typeof(MessageTypeFinder))]
```

Now we only need to tweak the execution of the handlers in the foreach loop to the following code.


```csharp
foreach (var handler in myMessageHandlers)
{
    var methods = from m in handler.GetMethods()
                                where m.Name == "Handle"
                                from p in m.GetParameters()
                                where p.ParameterType == message.GetType()
                                select m;

    object handlerInstance = Activator.CreateInstance(handler);
    var methodInfo = methods.Single();
    methodInfo.Invoke(handlerInstance, new[] { message });
}
```

We can’t simply select the Execute method anymore, as there are multiple. So we’re checking the parameter type and see if it’s the same type as our incoming message. There obviously cannot be more than one method with the exact same parameters, so we can select Single() on line 10 and then we’ll be able to execute the method.

FYI: During the SDN event I forgot to create the actual instance of the handler and was trying to execute the Handle method on the type. This is obviously not possible. So now you know why it didn’t work during the presentation.
**nServiceBus** So during the presentation I also mentioned nServiceBus. If you look at the code you need to write to use nServiceBus, this is exactly the handlers and messages as I’ve shown in the code above. However with nServiceBus you can use interfaces as messages so you can create message with complex inheritance trees. A method to “initiate” an interface is provided, which creates a proxy which you can then fill with your information. Since version 3.0 of nServiceBus you no longer need to implement the IMessage interface on your messages which makes creating libraries with messages that are shared, much easier, since you don’t need an assembly reference to nServiceBus anymore.

Of course we have no need to write plumbing code, as nServiceBus has done this all for you.
1. Transactions are supported in WCF, but with nServiceBus everything is transactional by default.
2. As said, in WCF you can mark messages OneWay and select the msmqBinding to use msmq. nServiceBus does this by default.
3. nServiceBus makes it possible to do request/reply asynchronously. Due to the nature of queuing, it’s not possible to immediately send a response. The sending application however can specify a return queue in it’s message (nServiceBus does this for you) and with a Bus.Reply(myMessage) you send the return message.
4. Retry of message is supported with a variable amount of retries. After final failure the messages get enriched with exception information and transferred to a (configurable) error queue.
5. Publish/Subscribe is possible where one publisher has no knowledge of any clients receiving the messages. A variable number of clients can subscribe to the messages and nServiceBus takes care of subscriptions. Since version 3.0 you can store these in RavenDB.
6. Long running processes (called sagas) are supported where you can wait for multiple incoming messages before continuing.
7. Timeouts are supported so when within a saga messaging don’t arrive on time, you can send yourself a warning. Since version 3.0 you can also send messages to yourself in the future. These messages don’t arrive before the time you specified.
**Conclusion  
**Again, messaging isn’t the silver bullet to your problems. It is however another way to communicate out of process to other applications or business components. It should provide additional options to implement without your architecture and you should seriously consider it if you haven’t used messaging and/or queuing frameworks before. Messaging has a lot of additional perks which I wrote about in my SDN article. When the new magazine arrives, I’ll post the PDF on my weblog. Until then, you are allowed to contact me and request the article.

Download the [source here](/files/MessagingExample.zip).</type></type></gamereview></gameoftheyear></gameoftheyear></gameoftheyear></t>

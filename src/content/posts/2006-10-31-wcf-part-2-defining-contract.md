---
id: 41113
author: Dennis van der Stelt
title: WCF Part 2  Defining contract
description: As seen in the previous article, we need an address, binding and contract to complete...
pubDate: '2006-10-31T12:00:00'
tags:
  - .NET Framework 3.0
  - Development
  - WCF
  - Windows Communication Foundation
  - WCF Contracts
redirect_from:
  - /dennis/2006/10/31/wcf-part-2-defining-contract
  - /blogs/dennis/archive/2006/10/31/wcf-part-2-defining-contract.aspx
---
As seen in the previous article, we need an address, binding and contract to complete the WCF ABC. We’ll start at the contract.

A contract is defined *explicitly*, via a class. You add a [ServiceContract] attribute to the class. All methods you want to expose in your service, you mark as [OperationContract], as methods are called operations in services.


```csharp
[ServiceContract]
public class Hello
{
    [OperationContract]
    string HelloWorld()
    {
        return "Hello world”;
    }

    string HelloComputer()
    {
        return "Hello computer”;
    }
}
```

The operations are defined *explicitly*, a Service Orientation tenet. HelloComputer won’t be visible by consumers of our service; it isn’t marked with an attribute. The HelloWorld operation however is, even though it’s private inside the .NET World.
**Interfaces** We prefer however, to have an interface for our contract and have our actual service implement the interface. That’s because
* Interfaces can extend/inherit other interfaces
* A single class can implement multiple interfaces
* You can modify the implementation of a service without breaking the contract
* You can version your service via old and new interfaces

It’s always best to have an interface and implement it. The attributes also must be specified in the interface.


```csharp
[ServiceContract]
public interface IHello
{
    [OperationContract]
    string HelloWorld();

    string HelloComputer();
}

public class Hello : IHello
{
    string IHello.HelloWorld()
    {
        return "Hello world”;
    }

    string IHello.HelloComputer()
    {
        return "Hello computer”;
    }
}
```

In the next article I’ll show you how you can host this service. In the future we’ll also consume the service and I will try to tell more about contracts and versioning.

[[Go to the WCF series article index](https://bloggingabout.net/2006/10/18/WCF-Part-0-_3A00_-Introduction)]



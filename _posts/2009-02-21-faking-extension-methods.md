---
layout: post
id: 481205
author: Dennis van der Stelt
date: 20090221 041957
title: Faking extension methods
description: I just read a post from Daniel Cazzulino about mocking extension methods. He wants to...
categories:
    - .NET Framework 3.5
    - Agile
    - TypeMock
redirect_from:
  - "/dennis/2009/02/21/faking-extension-methods"
  - "/blogs/dennis/archive/2009/02/21/faking-extension-methods.aspx"
---

I just read [a post](http://www.clariusconsulting.net/blogs/kzu/archive/2009/02/19/Makingextensionmethodsamenabletomocking.aspx) from [Daniel Cazzulino](http://www.clariusconsulting.net/blogs/kzu/) about mocking extension methods. He wants to mock an extension method so that it behaves as he defines in his test, instead of actually calling the real method.

To do this, Daniel creates an interface where every method signature is copied to, modifies the original static class so it’s not static anymore and holds a reference to the object that the extension method was for in the first place. It’s a really cool article, but as Daniel says himself “This is more work, I know, but now you can…”

I break him off there. You know what I have to write to mock my extension methods? Here’s the code:


```csharp
//
//
//
```

How do I do this? Easy, I’m using [Typemock Isolator](http://www.typemock.com/). Imagine I’ve got the following extension method:


```csharp
public static class MessagingExtensions
{
    public static SendResult SendTo(this SomeType target, string address)
    {
        // Do something
        throw new NotImplementedException("Don't do anything!!!");
    }
}
```

The extension method is for the type SomeType, which doesn’t have any members. It’s just here for show. I’ve explicitly added the exception so we’ll be sure this method will never get executed. I’ve also got a Worker class that I want to test.


```csharp
public class Worker
{
    public SendResult Execute()
    {
        SomeType st = new SomeType();
        return st.SendTo("dvdstelt@gmail.com");
    }
}
```

I want to test if everything goes well with this method. It doesn’t do anything exciting, so there aren’t a lot of options, but this method isn’t what this article is about. What we want to see is that the extension method *SendTo* is never actually called. So how about it? Here’s my test:


```csharp
[TestMethod, Isolated]
public void ExecuteSucceeds()
{
    // Arrange
    Isolate.Fake.StaticMethods(typeof(MessagingExtensions));
    Isolate.WhenCalled(() => MessagingExtensions.SendTo(null, "")).WillReturn(SendResult.Sent);

    // Act
    Worker worker = new Worker();
    SendResult result = worker.Execute();

    // Assert
    Assert.AreEqual<sendresult>(SendResult.Sent, result);
    Isolate.Verify.WasCalledWithAnyArguments(() => MessagingExtensions.SendTo(null, ""));
}
```

Line 5 makes sure that all static methods to MessagingExtensions are never actually called, and for our demo this isn’t even necessary.  

Line 6 makes sure that when SendTo is called, it will return the right result.

Line 13 is actually a bogus verification, because I’m really testing here if Isolator is returning the right result. But to be sure, we’ll keep it in. Line 14 verifies if the extension method was called, as we expected to.

So to conclude, I did not write one line of code extra to mock away the extension method. This is thanks to Typemock Isolator, the tool you just have to have when you’re doing unit testing.
**Update february 23, 2009  
**Eli Lopian commented that you can also call the extenson method on the extended type directly, as shown in the code below.


```csharp
// Arrange
var dummy = new SomeType();
Isolate.WhenCalled(() => dummy.SendTo("")).WillReturn(SendResult.Sent);

// Assert
Isolate.Verify.WasCalledWithAnyArguments(() => dummy.SendTo(""));
```
**Update februari 23, 2009  
**You can [find a VS2008 solution here](/files/ExtensionMethods.zip), so you can see what’s actually happening.</sendresult>

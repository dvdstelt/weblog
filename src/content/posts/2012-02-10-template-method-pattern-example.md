---
id: 577208
author: Dennis van der Stelt
title: Template Method Pattern example
description: This blogpost is part of a series Template Method Pattern explanation Template Method...
pubDate: '2012-02-10T10:03:49'
tags:
  - architecture
  - Development
redirect_from:
  - /dennis/2012/02/10/template-method-pattern-example
  - /blogs/dennis/archive/2012/02/10/template-method-pattern-example.aspx
---
This blogpost is part of a series
1. [Template Method Pattern explanation](/2012/02/10/template-method-pattern-explanation/)
2. Template Method Pattern example
3. [Template Method Pattern advanced](/2012/02/10/template-method-pattern-advanced-example/)

So in my previous post I explained how I change the template method pattern a bit with protected abstract methods. In this post I’ll explain why I used this pattern and how I chose to implement it.

##### Requirements

At my current employer we send a lot of messages to customers. It varies per customer how message are being send. Some want a simple email, others want an xml document in their email, others want an xml document over HttpPost and others want us to send the message directly into a customers system, for example SalesForce. Most customers only have one option, some customers want multiple options.

When the software was first build, we only did send messages via email. A very simple solution was build. As more and more variations were required, a better solution was required. In our system, information is gathered, which is being inserted into the messages we send. We needed templated messages which contain placeholders. However, as some customers receive XML fed directly into their system, we needed to change some placeholder values, as not every system understands our values “male” and “female”, but rather have “1” or “0” for these values. Technical requirements are also important. We need to be able to store a successful or failed result to a datastore and needed to log exceptions as well.

First, we’ll have a look at how we solve different transport mechanisms. Additional requirements for templates will be explained in another post, where we’ll add the decorator pattern and implement an additional template method pattern.

Perhaps you’ll understand better what I implemented, if I show you the code that is executed to actually send out everything. In our system, we dynamically define which modules are being executed, in the following code I’ve defined a message sender for email and HttpPost.

```csharp
static void Main(string[] args)
{
    TemplatedMessage message = new TemplatedMessage();
    message.Identifier = Guid.NewGuid();
    message.EmailAddress = "dvdstelt@gmail.com";
    message.Template = "Dude!";

    List<messagesenderbase> MessageSenders = new List<messagesenderbase>();
    MessageSenders.Add(new EmailMessageSender());
    MessageSenders.Add(new HttpPostMessageSender());

    foreach (var sender in MessageSenders)
    {
        sender.Execute(message);
    }

    Console.WriteLine("nnDone...nn");
}
```

First the message is defined. It contains a guid for reference, an email address and a template. The template is the actual message. Then we initialize the two message senders and execute these one at a time in the foreach loop. Let’s have a look at the implementation of the base class.

```csharp
public abstract class MessageSenderBase 
{ 
    protected TemplatedMessage Message { get; private set; }

    public virtual void Execute(TemplatedMessage message) 
    { 
        Message = message;

        Initialize(); 
        SendMessage(); 
        CleanUp(); 
    }

    protected abstract void SendMessage();

    private void Initialize() 
    { 
        if (Message == null) throw new InvalidOperationException("Message cannot be null"); 
        Console.WriteLine("Initializing {0} for MessageId [{1}].", this.GetType().Name, Message.Identifier); 
    }

    private void CleanUp() 
    { 
        Console.WriteLine("Cleaning up {0} for MessageId [{1}].", this.GetType().Name, Message.Identifier); 
        Console.WriteLine("tSaving state changes to datastore..."); 
        Console.WriteLine("tSaving result to logfile..."); 
    } 
}
```

The base class of course cannot be instantiated, so we made it abstract. The message that was created in the first codeblock, is stored in a protected property (line 3), so we don’t have to pass it to every single method. Normally I don’t like vague global variables, but as it’s protected, I don’t see real harm. The SendMessage method is the abstract method that the derived classes must use to write code that they are responsible for. The Initialize method has a guard for a proper message, some might want this to be in the Execute method.

The Initialize and CleanUp method don’t do anything in the above code, but normally you’d use those for logging, storing state and exception handling. We have Enterprise Library code there for logging, and we log the current progress to a trace listener, rolling textfile and database. With the regular trace listener we can use [DebugView](http://technet.microsoft.com/en-us/sysinternals/bb896647) from Sysinternals for live tracing.

The Execute method is the only public method. It is the method that will be executed and used to run every method in the right order. This will always run the SendMessage method of a derived class, simply because this base class has no implementation. So let’s have a look at our email sender.

```csharp
public class EmailMessageSender : MessageSenderBase
{
    protected override void SendMessage()
    {
        Console.WriteLine("I'm sending the message via email.");
    }
}
```

This could not be a lot simpler. Of course the actual implementation isn’t here, but that’s the point of the example. There’s no other code in this class, but the code that’s related to sending the message over email. This is completely according to the Single Responsibility Principle. When a customer requires an additional way of sending the message, we don’t need to change any code. We simply add another class with the required functionality. That’s Open/Closed Principle for you!

I hope you understand why I like this implementation of the Template Method Pattern. For deriving classes, it’s completely clear what to implement. For external applications, it’s completely clear what to execute. In the last part of the Template Method Pattern series, we’ll introduce additional functionality and solve one problem with the decorator pattern and another template method pattern implementation. That post also includes a download if you want to play around with the code.
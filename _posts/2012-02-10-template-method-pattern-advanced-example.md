---
layout: post
id: 577210
author: Dennis van der Stelt
date: 20120210 100500
title: Template Method Pattern advanced example
description: This blogpost is part of a series Template Method Pattern explanation Template Method...
categories:
    - Architecture and Design
    - Development
redirect_from:
  - "/dennis/2012/02/10/template-method-pattern-advanced-example"
  - "/blogs/dennis/archive/2012/02/10/template-method-pattern-advanced-example.aspx"
---

This blogpost is part of a series
1. [Template Method Pattern explanation](/blogs/dennis/archive/2012/02/10/template-method-pattern-explanation.aspx)
2. [Template Method Pattern example](/blogs/dennis/archive/2012/02/10/template-method-pattern-example.aspx)
3. Template Method Pattern advanced

So we’ve looked at the Template Method Pattern with an implementation as really simple example, and another real world implementation. We have additional requirements however. We also need to transform the template so that placeholders will contain the proper text, and have the value of the placeholders customized to our customers. Let’s first look again at the executing code, so we get an idea of what API we want.


```csharp
static void Main(string[] args)
{
    TemplatedMessage message = new TemplatedMessage();
    message.Identifier = Guid.NewGuid();
    message.EmailAddress = "dvdstelt@gmail.com";
    message.Template = "So you're a {{Sex}} and like to play {{BestGameEver}}.";

    message.PlaceHolders.Add("Sex", "male");
    message.PlaceHolders.Add("BestGameEver", "Modern Warfare 3");

    MessageSenderBase emailMessageSender = new EmailMessageSender();
    emailMessageSender = new MessageSenderPlaceholderParserDecorator(emailMessageSender);
    emailMessageSender = new MessageSenderPlaceholderFormatterDecorator(emailMessageSender);

    List<messagesenderbase> MessageSenders = new List<messagesenderbase>();
    MessageSenders.Add(emailMessageSender);
    MessageSenders.Add(new HttpPostMessageSender());

    foreach (var sender in MessageSenders)
    {
        sender.Execute(message);
        Console.WriteLine("");
    }

    Console.WriteLine("The final message is:n{0}", message.Template);
    Console.WriteLine("nnDone...nn");
}
```

It’s exactly the same code, with some additional lines added to it.
* Line 6 shows a new template in the message. You can see the placeholders {{Sex}} and {{BestGameEver}}.
* Line 8 & 9 show an additional property in the <span style="font-family: Courier New;">TemplatedMessage</span>, knowing <span style="font-family: Courier New;">PlaceHolders</span>, which is of type <span style="font-family: Courier New;">Dictionary<string, string=""></string,></span>
* Line 11 shows the initialization of the <span style="font-family: Courier New;">EmailMessageSender</span>, which hasn’t changed since last post.
* Line 12 shows the initialization of a decorator, to parse the placeholders and put in proper text from the <span style="font-family: Courier New;">PlaceHolders</span> dictionary. As the decorator pattern defines, this decorator wraps the MessageSender originally used.
* Line 13 shows an additional decorator, which replaces values that our customer doesn’t understand. Our customer doesn’t understand “male”, so the <span style="font-family: Courier New;">MessageSenderPlaceHolderFormatterDecorator</span> replaces its values.
* Line 16 shows the previously instantiated <span style="font-family: Courier New;">EmailMessageSender</span> being added, wrapped by two decorators.
**Decorator pattern and a rewrite of the template method** So without changing anything in the current <span style="font-family: Courier New;">MessageSenderBase</span> class or derivates, we want to add additional functionality to perform the parsing and formatting of the placeholders. I chose to implement the decorator pattern, which is a wrapper around the original class, where both have the exact same interface. A really nice [decorator example](http://www.ruchitsurati.net/index.php/2010/07/23/decorator-pattern-with-c/) of it can be found on [Ruchit Surati](http://www.ruchitsurati.net/) his weblog.

The decorator normally has an interface with a public method. Every class that implements this interface has to implement the method, as do the decorators. Our public method is the <span style="font-family: Courier New;">Execute</span> method, so we’ll override that method. In the original base class, it was the template method, calling the abstract methods <span style="font-family: Courier New;">Initialize</span>, <span style="font-family: Courier New;">SendLead</span> and <span style="font-family: Courier New;">Cleanup</span>. We don’t need this behavior anymore, so we’ll break it. Instead, we’ll use it again to recreate it as an alternative template method. We’ll now make it call a new abstract method called <span style="font-family: Courier New;">Decorate</span> and after that, run the Execute method on the MessageSender we are wrapping. We’ll also override and seal the <span style="font-family: Courier New;">SendMessage</span> method, because our decorators never send messages.

The end result is shown in the Visual Studio class diagram below. Normal UML diagrams show the association from the <span style="font-family: Courier New;">MessageSenderDecorator</span> to the <span style="font-family: Courier New;">MessageSenderBase</span> a bit clearer; Visual Studio shows it as either a reference without a property, or a property without a clear reference. I’m mentioning this because from the perspective of the decorator pattern, this is an important reference. It shows the intent that we wrap the original MessageSender inside our decorator.

[![](/images/template-method-pattern-advanced-example/7558_templatemethodpatternadvanced_5f00_thumb_5f00_651c302b.png)](/wp-content/uploads/2014/01/7558_templatemethodpatternadvanced_5f00_thumb_5f00_651c302b.png)

The code for the decorator base class.


```csharp
public abstract class MessageSenderDecorator : MessageSenderBase
{
    protected MessageSenderBase MessageSender { get; private set; }

    public MessageSenderDecorator(MessageSenderBase messageSender)
    {
        MessageSender = messageSender;
    }

    // This method needs concrete implementation
    protected abstract void Decorate(TemplatedMessage message);

    // Close the SendMessage method, decorators don't send messages!
    protected sealed override void SendMessage() { }

    public override void Execute(TemplatedMessage message)
    {
        Decorate(message);
        MessageSender.Execute(message);
    }
}
```

Now we'll implement the first decorator.

```csharp
public class MessageSenderPlaceholderParserDecorator : MessageSenderDecorator
{
    public MessageSenderPlaceholderParserDecorator(MessageSenderBase messageSender) : base(messageSender) {    }

    protected override void Decorate(TemplatedMessage message)
    {
        message.Template = ParseTemplate(message.Template, message.PlaceHolders);
    }

    private string ParseTemplate(string template, Dictionary<string, string=""> placeHolders)
    {
        foreach (var placeholder in placeHolders)
        {
            var key = string.Format("{{{{{0}}}}}", placeholder.Key);
            var value = placeholder.Value.ToString();

            template = template.Replace(key, value);
        }

        return template;
    }
}
```

As you can see, our real decorator implementation now implements the <span style="font-family: Courier New;">Decorate</span> method, which we had to implement based on our base class. What this class do is simply replace every placeholder with the actual value. Going back to our first code snippet of the static <span style="font-family: Courier New;">Main</span> method, you can see that we first wrap the <span style="font-family: Courier New;">EmailMessageSender</span> into the decorator to parse all placeholders. Then we wrap it inside the second decorator, for parsing all values of the placeholders. If we turn this around, first the template message will be parsed, and only then the values in the <span style="font-family: Courier New;">PlaceHolders</span> dictionary will be replace. This is of course too late, and this is a bit of a downside to the decorator. When writing completely procedural code, not many developers would make this mistake. With the decorator pattern, you’ll have to think a bit about it. The intent here isn’t as clear as you’d want it to be.
**Conclusion** It’s always hard for new developers to write software like this. From my own experience, when first coming into contact with design patterns, you start to search for a design pattern based on a problem you have. After a lot of experience with some design patterns, you’ll start thinking the other way around. Instead of starting with a problem and finding a good design pattern that solves it, you’ll immediately start thinking about a design pattern that matches the problem you’re solving. Again, this is experience and takes practice. Try playing around with design patterns until you know them and know what they do. It’s not that important to be able to draw them out in a UML class diagram, from the top of your head. As long as you can remember which problems they solve and how you should roughly implement them.

Speaking of finding the right design pattern for a problem; this could very likely be solved in multiple ways, with different patterns. But it’s an example of how a problem could be solved using design patterns. I still have to completely implement this into our system and might come up with alternate solutions altogether. But I started this as a proof of concept and it seemed nice enough to blog about it. I hope you learned something from it, because that is still the reason for me to blog! 😉

[Download the source here.](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2012/02/TemplateMethodPattern.zip)

<div></div></string,></messagesenderbase></messagesenderbase>

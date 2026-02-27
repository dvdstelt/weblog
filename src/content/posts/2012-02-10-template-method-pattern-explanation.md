---
id: 577207
author: Dennis van der Stelt
title: Template Method Pattern explanation
description: This blogpost is part of a series Template Method Pattern explanation Template Method...
pubDate: '2012-02-10T10:02:39'
tags:
  - architecture
  - Development
redirect_from:
  - /dennis/2012/02/10/template-method-pattern-explanation
  - /blogs/dennis/archive/2012/02/10/template-method-pattern-explanation.aspx
---
This blogpost is part of a series

1. Template Method Pattern explanation
2. [Template Method Pattern example](/2012/02/10/template-method-pattern-example/)
3. [Template Method Pattern advanced](/2012/02/10/template-method-pattern-advanced-example/)

I’ve recently read a post about someone who hated the Template Method Pattern, because its intent wasn’t revealed. When based on the many examples out there, you might agree with this. First let’s see what the theoretical intent of the pattern is. You can look it up on [wikipedia](http://en.wikipedia.org/wiki/Template_method_pattern), but recently I’ve come across [sourcemaking.com](http://sourcemaking.com/design_patterns/template_method) where a lot of patterns are described and I really like that site! Besides a good theoretical explanation it also has examples in many languages. About the intent of the Template Method Pattern it says:

* Define the skeleton of an algorithm in an operation, deferring some steps to client subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm’s structure.
* Base class declares algorithm ‘placeholders’, and derived classes implement the placeholders.

 ![ ](/images/template-method-pattern-explanation/3733_templatemethodpatternsimple_5f00_thumb_5f00_51f3f186.png)

So you define a skeleton and derived classes have to implement the placeholders. The problem with the default pattern is that everything is public. This is something I don’t like myself. I’d rather have a protected and abstract skeleton so that derived classes exactly know what to implement, but external classes only see the public template method from the base class.

```csharp
public abstract class AbstractClass
{
    protected abstract void StepOne();
    protected abstract void StepTwo();
    protected abstract void StepThree();

    public void TemplateMethod()
    {
        StepOne();
        StepTwo();
        StepThree();
    }
}
```

As you can see the skeleton (the StepOne, StepTwo & StepThree methods), is protected and abstract. Protected means the methods are private for outsiders, only derived classes can see the methods. Abstract means it has no implementation, but derived classes must implement it. The TemplateMethod however is public and can be called. Let’s have a look at an implementation.

```csharp
public class ConcreteClass : AbstractClass
{
    protected override void StepOne()
    {
        Console.WriteLine("Inside Step 1");
    }

    protected override void StepTwo()
    {
        Console.WriteLine("Inside Step 2");
    }

    protected override void StepThree()
    {
        Console.WriteLine("Inside Step 3");
    }
}
```
Here you can see that the template method is nowhere to be seen, but the abstract methods were implemented. When the template method is executed, all three methods will be called. In a console application this would look like this.

```csharp
static void Main(string[] args)
{
    AbstractClass myObject = new ConcreteClass();

    myObject.TemplateMethod();

    Console.WriteLine("Finished, press a key to continue...");
    Console.ReadKey();
}
```

This is of course again one of the over simplified examples, in a following post I will show a concrete example that I had to develop for the company I work for.

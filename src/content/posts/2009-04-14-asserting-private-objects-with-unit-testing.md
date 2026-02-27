---
id: 481517
author: Dennis van der Stelt
title: Asserting private objects with unit testing
description: There’s a lot of discussion going on about designing for testability. One of the prob...
pubDate: '2009-04-14T09:58:16'
tags:
  - agile
  - Testing
  - TypeMock
redirect_from:
  - /dennis/2009/04/14/asserting-private-objects-with-unit-testing
  - /blogs/dennis/archive/2009/04/14/asserting-private-objects-with-unit-testing.aspx
---
There’s a lot of discussion going on about designing for testability. One of the problems of unit testing your code is that you might want to insert a fake object (like a [stub or mock](http://martinfowler.com/articles/mocksArentStubs.html)) so that your code under test won’t actually call out to the database or an external logging class. You can solve this by [Inversion of Control](http://martinfowler.com/articles/injection.html#ServiceLocatorVsDependencyInjection) (IoC) and using Dependency Injection (DI). You insert an object you want to isolate or an object you want to do assertions on via the constructor or properties.

[Typemock Isolator](http://www.typemock.com/) also has a very powerful feature where you don’t have to use dependency injection. Let me be clear on this before you continue reading : you don’t have to. I know with Isolator you might not even need DI but it’s still a good practice to decouple dependencies. But I personally think it’s a bit sad that you need to change your design and use DI just because else you would not be able to write your test. And that’s where Isolator can help us.

Imagine we have to following code. A class called “SomeClass” with a method called “SomeMethod” that we want to test. This method however creates an instance of the “ClassWithProperties” class. Our method will fill this object and we really want to see what happened with this object. We want to verify it using tests. We’ve got different tests to test “ClassWithProperties”, but we want to know if the few lines of code that work with this extra class is doing what we expect it to do.


```csharp
public class SomeClass
{
    public void SomeMethod(string name, int age)
    {
        ClassWithProperties cwp = new ClassWithProperties();
        cwp.Name = name;
        cwp.Age = age;

        // Start processing, calling ServiceAgents, whatever...
    }
}

public class ClassWithProperties
{
    public string Name { get; set; }
    public int Age { get; set; }
}
```

A real life example of this, for me at least, was where an Order object was created and filled with order lines and customer information and I wanted to assert the flow inside the method and if the object was filled correctly. Was the Order object indeed filled with the correct information?

We can insert the ClassWithProperties object via DI or use a ServiceLocator but why do that if you have a powerful framework? Using Reflective Mocks, the ‘old’ way (since there’s a much better API now) we could do the following.


```csharp
[TestMethod]
public void CanWeGrabInternalObject()
{
    // Arrange
    string name = "Dennis";
    int age = 34;

    Mock mockedClassWithProperties = MockManager.Mock<classwithproperties>();

    // Act
    new SomeClass().SomeMethod(name, age);

    // Assert
    var result = mockedClassWithProperties.MockedInstance as ClassWithProperties;
    Assert.AreEqual(name, result.Name);
    Assert.AreEqual(age, result.Age);
}
```

What you see here is that a Mock object is created at line 8, which could be described as a fake version of our ClassWithProperties. We then make the call to “SomeMethod” at line 11 and pass two arguments that is mapped onto the class that’s created inside “SomeClass”. However using MockManager.Mock we make sure future instances are replaced by our fake object. When the call to “SomeMethod” is done we can retrieve the instance that our fake object is at line 14.We can then easily assert its current state and see if everything was correct. The Reflective Mocks is however not the most easiest way to go, although it’s still very powerful.

The Triple-A or ArrangeActAssert API is since Isolator 5.0 the way to go because of cleaner unit tests and its API is also much easier to understand. In our example we’d get the following result.


```csharp
[TestMethod]
public void CanWeGrabInternalObjectWithNewAPI()
{
    // Arrange
    string name = "Alex";
    int age = 37;

    var fake = Isolate.Fake.Instance<classwithproperties>();
    Isolate.Swap.NextInstance<classwithproperties>().With(fake);

    // Act
    new SomeClass().SomeMethod(name, age);

    // Assert
    Assert.AreEqual(name, fake.Name);
    Assert.AreEqual(age, fake.Age);    
}
```

In line 8 we create the fake instance but nothing happens with future instances. If we’d use DI we could inject our fake object. As we’re not, in line 9 we’re making sure the next instance that’s created is swapped with our fake object. As you can see this is exactly the same behavior as the first test we wrote, but it’s much more clearer on what’s happening. We then call “SomeMethod” and make the same assertions.

However we’re now interfering with everything that’s normal to this ClassWithProperties. Constructor and other methods aren’t called. When we do want the class to act as usual, ie. be able to execute methods on it, we need a different approach. The "Isolate.Fake.Instance” method has an overload that allows us to supply an argument what the fake object should actually do. We can use *Members.CallOriginal* on it to make it behave like before. However that will also destroy our ability to check the state of the swapped object.

This is where we can perform a little trick though. Now that we have access to our fake object, we can redirect every call to this fake object to an object of our liking. We don’t even have to use a fake object. Hence the following test.


```csharp
[TestMethod]
public void CanGrabFakedObjectAndRedirectCalls()
{
    // Arrange
    string name = "Marco";
    int age = 33;

    var fake = Isolate.Fake.Instance<classwithproperties>(Members.CallOriginal);
    var original = new ClassWithProperties();
    Isolate.Swap.NextInstance<classwithproperties>().With(fake);
    Isolate.Swap.CallsOn(fake).WithCallsTo(original);

    // Act
    new SomeClass().SomeMethod(name, age);

    // Assert
    Assert.AreEqual(name, original.Name);
    Assert.AreEqual(age, original.Age);            
}
```

Here you see that with the creation of the fake “ClassWithProperties” object, we specify that we actually want to call the original object. You normally do this, for example, when you want to verify specific calls on the object, set expectations on only a few method calls and/or want to redirect one or more calls. And that’s what we do, but we’re redirecting all calls. And we redirect them to the variable we call “original” in this test.

This will make sure, everything that’s happening on the fake object will get redirected to the object that we initialized, maintain and eventually assert in our test. Again, simple state based testing, although less elegant than the first test with reflective mocks.

Now of course there’s also a different way and speaking of elegant code, this is also technically better. And although I love state based testing over verifications (because most of the time it’s more readable), this last test is probably the nicest there is right now.


```csharp
[TestMethod]
public void UseVerificationsOnObject()
{
    // Arrange
    string name = "Mike";
    int age = 35;

    var fake = Isolate.Fake.Instance<classwithproperties>(Members.CallOriginal);
    Isolate.Swap.NextInstance<classwithproperties>().With(fake);

    // Act
    new SomeClass().SomeMethod(name, age);

    // Assert
    Isolate.Verify.WasCalledWithExactArguments(() => fake.Name = name);
    Isolate.Verify.WasCalledWithExactArguments(() => fake.Age = age);
}
```

As a conclusion, there seem to be a lot of options with Typemock Isolator. Two remarks have to be made here. First of all, Isolator is so powerful that sometimes problems can have multiple solutions to it. This isn’t always what you want, as this makes finding the best solution harder. Especially when you don’t know what the best solution is, even though you know all possible solutions. Luckily with the new AAA API it’s much more clearer on what path to take.

As a second, for these tests, I’d say the last one is the best, because it’s best at revealing all the intention, one of my favorite rules of TDD by Kent Beck in his *Extreme Programming Explained*.</classwithproperties></classwithproperties></classwithproperties></classwithproperties></classwithproperties></classwithproperties></classwithproperties>

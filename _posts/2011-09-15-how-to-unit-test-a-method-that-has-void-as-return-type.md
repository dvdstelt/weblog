---
layout: post
id: 575527
author: Dennis van der Stelt
date: 20110915 060138
title: How to unit test a method that has void as return type
description: How do I test a method that returns void? For example a method like this. public void...
categories:
    - Agile
    - Development
    - Testing
redirect_from:
  - "/dennis/2011/09/15/how-to-unit-test-a-method-that-has-void-as-return-type"
  - "/blogs/dennis/archive/2011/09/15/how-to-unit-test-a-method-that-has-void-as-return-type.aspx"
---

How do I test a method that returns void? For example a method like this.


```csharp
public void Process(int leadId)
{
    decimal price = _calculator.CalculateNormalLead(leadId);

    Lead lead = new Lead(leadId, price);

    _leadRepository.Save(lead);
}
```

How to test what the state of the lead object is? This is a question that comes up a lot of the time. It has many different answers. Some options:
* Return a type anyway, even though you don’t use it. Or expose a property with the result. This are design changes that are only neccesary for testing. I’m sure that’s not what we want. 
* Check what the method changed, like records in the database. That’s a slow integration test. 
* <div align="left">Split the methods so that one portion of it returns something, and the second method just takes the result and uses it. This way however, you’ll have to make two calls to your class, which I think is even worse than the previous two options!</div>
* <div align="left">Expose internals by using the InternalsVisibleTo attribute. But now you have to make changes to the design of your class again, making private methods or properties internal.</div>
* <div align="left">Another option is to accept you can’t test everything. What you can however check is</div>
    * <div align="left">Check if it throws exceptions</div>
    * <div align="left">Check if it changes mutable objects you pass in as parameters</div>
    * <div align="left">Do interaction based testing. Either write mocks or use a mocking framework to verify if calls were made to another method.</div>

This last thing is something we can really use. Now this might not always work, but in our case it’s very usable. Imagine we have a repository that in production kind of works like this.


```csharp
public class LeadRepository : ILeadRepository
{
    public void Save(Lead lead)
    {
        throw new NotImplementedException("Sorry, this is for an integration test.");
    }
}
```

Now I said kind of, because I don’t want to bother you with a lot of database and query stuff. But our lead enters this class and we’d really like to have this one! This repository implements an interface and the class is injected into the *Invoicing* class, where our *Process* method is. For the complete example, check the solution. But for now, check out this *FakeRepository* I created to use during testing.


```csharp
public class FakeRepository : ILeadRepository
{
    public Lead CreatedLead { get; private set; }

    public void Save(Lead lead)
    {
        CreatedLead = lead;
    }
}
```

The only thing this repository does, is put the lead it receives into a property of the *FakeRepository* class. Remember that the repository in production does not have this property, so normally it’s never exposed.

Now we can write a test that injects our own fake objects and when asserting, we use the property of our FakeRepository to check the state of our lead.


```csharp
[TestMethod]
public void Does_MapPropertiesCorrectly_When_CalculatingALead()
{
    // Arrange
    int leadId = 1;
    decimal leadPrice = 0.5m;
    FakeRepository fakeRepository = new FakeRepository();
    FakeCalculator calculator = new FakeCalculator(leadPrice);

    // Act
    Invoicing invoicing = new Invoicing(calculator, fakeRepository);
      invoicing.Process(leadId);

    // Assert
    Lead result = fakeRepository.CreatedLead;
    Assert.AreEqual(leadId, result.LeadId);
    Assert.AreEqual(leadPrice, result.Price);
}
```

See how easy it sometimes is? Download the [complete solution here](/files/TestingVoidMethods.zip).

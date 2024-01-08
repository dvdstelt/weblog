---
layout: post
id: 474886
author: Dennis van der Stelt
date: 20080929 023310
title: Typemock Isolator  Getting internal variables
description: Sometimes you execute some method and the method returns void. But it still does some...
categories:
    - TypeMock
redirect_from:
  - "/dennis/2008/09/29/typemock-isolator-getting-internal-variables"
  - "/blogs/dennis/archive/2008/09/29/typemock-isolator-getting-internal-variables.aspx"
---

Sometimes you execute some method and the method returns void. But it still does some complicated stuff and you want to check if everything worked. But you can’t access the internal variable that was created. You can mock everything away and make sure you set the proper return values. But there’s also another way to achieve about the same result.

Imagine we have a customer class.


```csharp
public class Customer
{
  public string Name { get; set; }
  public int Age { get; set; }
}
```

We’re also having a class that internally creates a customer and works with it a little.


```csharp
public class ClassToTest
{
  public void Somemethod()
  {
    int[] ages = new int[] { 33, 34, 35 };

    Customer c = new Customer();
    c.Name = "Dennis van der Stelt";
    c.Age = ages.SkipWhile(i => i < 34).First();
  }
}
```

As you can see, normally it’d be impossible to test what happened to the customer object. Unless you’re using TypeMock Isolator. Here’s how.


```csharp
1 [TestMethod]
    2 public void TestExample()
    3 {
    4   MockManager.Init();
    5   Mock mockedCustomer = MockManager.Mock<customer>(Constructor.NotMocked);
    6 
    7   ClassToTest ctt = new ClassToTest();
    8   ctt.Somemethod();
    9 
   10   Customer c = mockedCustomer.MockedInstance as Customer;
   11   Assert.AreEqual<string>("Dennis van der Stelt", c.Name);
   12   Assert.AreEqual<int>(34, c.Age);
   13 }
</int></string></customer>
```

In line 5 we’re telling Isolator to mock the object, but we’re not setting any expectations. Therefor nothing is hidden or mocked away. We’re even telling the constructor to be executed normally. In lines 7 & 8 we execute the method. In line 10 we’re getting the instance that was created inside our tested method and after that, we can assert its values in line 11 and 12.
Now image that the age.SkipWhile() method was some call to another class or even the database. We’d definitely want to mock that out. But we’re already using reflective mocks. Although more powerful, it’s so much easier to work with natural mocks. Here’s how.


```csharp
1 [TestMethod]
    2 public void TestExample2()
    3 {
    4   MockManager.Init();
    5   Mock mockedCustomer = MockManager.Mock<customer>();
    6 
    7   int[] someArray = new int[] { 1, 2, 3 };
    8   using (RecordExpectations recorder = RecorderManager.StartRecording())
    9   {
   10     someArray.SkipWhile(i => i < 2).First();
   11     recorder.Return(5);
   12   }
   13 
   14   ClassToTest ctt = new ClassToTest();
   15   ctt.Somemethod();
   16 
   17   Customer c = mockedCustomer.MockedInstance as Customer;
   18   Assert.AreEqual<string>("Dennis van der Stelt", c.Name);
   19   Assert.AreEqual<int>(5, c.Age);
   20 }
</int></string></customer>
```

As you can see in line 7 I’m creating a temporary integer array so I can use the SkipWhile extension method on it. It holds completely different values however. In line 11 I set the actual return value, again completely separated from anything else I’ve created before. I tell it to return the value 5 and that’s what I’m asserting later in my test on line 19.
But what if more instances of the Customer class are created? That’s also very easy, because the natural mocks work exactly like the real code it passes. As you can see in the example below on line 5 and 6 I expect two Customer classes to be created and set the resulting mocked object to different variables. In line 15 and 16 I retrieve the second Customer object and assert its values.


```csharp
1 [TestMethod]
    2 public void TestExample()
    3 {
    4   MockManager.Init();
    5   Mock mockedCustomer = MockManager.Mock<customer>(Constructor.NotMocked);
    6   Mock mockedCustomer2 = MockManager.Mock<customer>(Constructor.NotMocked);
    7 
    8   ClassToTest ctt = new ClassToTest();
    9   ctt.Somemethod();
   10 
   11   Customer c = mockedCustomer.MockedInstance as Customer;
   12   Assert.AreEqual<string>("Dennis van der Stelt", c.Name);
   13   Assert.AreEqual<int>(34, c.Age);
   14 
   15   Customer c2 = mockedCustomer2.MockedInstance as Customer;
   16   Assert.AreEqual<string>("Eli Lopian", c2.Name);
   17 }
</string></int></string></customer></customer>
```

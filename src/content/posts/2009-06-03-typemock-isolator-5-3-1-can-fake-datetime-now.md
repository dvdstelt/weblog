---
id: 481755
author: Dennis van der Stelt
title: Typemock Isolator 5.3.1 can fake DateTime.Now
description: I just downloaded and installed Isolator 5.3.1 which has the ability to fake DateTime...
pubDate: '2009-06-03T12:44:45'
redirect_from:
  - /dennis/2009/06/03/typemock-isolator-5-3-1-can-fake-datetime-now
  - /blogs/dennis/archive/2009/06/03/typemock-isolator-5-3-1-can-fake-datetime-now.aspx
---
I just downloaded and installed [Isolator 5.3.1](http://www.typemock.com/) which has the ability to fake DateTime.Now, probably one of those functions in .NET you’ve always wanted to isolate correctly in tests. And now you can. For quick reference, check the [Typemock Insider blog](http://blog.typemock.com/2009/05/mockingfaking-datetimenow-in-unit-tests.html).

This can however be a breaking change in your unit tests. For example, we had the following test to verify of a DateTime was put into a property.


```csharp
Isolate.Verify.WasCalledWithAnyArguments(() => someObject.ProcessDate = DateTime.Now);
```

With version 5.3.1 the test failed with the following error message.

> TypeMock Verification: Method MyNameSpace.SomeClass.ProcessDate was called with mismatching arguments.

I fixed this by setting the following behavior on DateTime.Now.


```csharp
// Arrange
var testDate = new DateTime(2000, 1, 1);
Isolate.WhenCalled(() => DateTime.Now).WillReturn(testDate);

// Act
// Some code here

// Assert
Isolate.Verify.WasCalledWithAnyArguments(() => someObject.ProcessDate = testDate);
```

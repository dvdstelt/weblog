---
layout: post
id: 573350
author: Dennis van der Stelt
date: 20110912 011727
title: Value of Unit testing
description: There are probably uncountable amount of articles, posts and arguments on to why Unit...
categories:
    - Testing
redirect_from:
  - "/dennis/2011/09/12/value-of-unit-testing"
  - "/blogs/dennis/archive/2011/09/12/value-of-unit-testing.aspx"
---

There are probably uncountable amount of articles, posts and arguments on to why Unit Testing is so valuable. I just found a nice example that would’ve (or at least should’ve) been caught using Unit Tests. The following code was a bit adjusted to the need of this post, but has a mistake. See if you can spot it.


```csharp
public class Discount
{
    public Discount(decimal percentage, DateTime startDate, DateTime endDate)
    {
        endDate.Add(new TimeSpan(23,59,59));

        Percentage = percentage;
        StartDate = startDate;
        EndDate = endDate;            
    }

    public decimal Percentage { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
}
```

If you haven’t spotted it, I’d advise you to write a unit test to show that it’s failing. Here’s mine.  

I’ve used [FluentAssertions](http://fluentassertions.codeplex.com/) by the way, a library I love that helps me assert my code more easily.


```csharp
[TestMethod]
public void Does_MapPropertiesCorrectly_When_CreatingNormalDiscount()
{
    // Act
    Discount discount = new Discount(5, new DateTime(2001, 9, 11), new DateTime(2011, 9, 11));

    // Assert
    discount.EndDate.Should().Be(new DateTime(2011, 9, 11, 23, 59, 59));
}
```

What is says is that it’s still 2011/9/11 00:00:00 instead of at the last second of that day. The problem here is that the endDate.Add method adheres to the framework guidelines. That is that you can’t edit an object you get passed by external source, only return new values. So the Add method returns a new DateTime object. We can make the test working with the following adjustment.


```csharp
public class Discount
{
    public Discount(decimal percentage, DateTime startDate, DateTime endDate)
    {
        endDate = endDate.Add(new TimeSpan(23,59,59));

        Percentage = percentage;
        StartDate = startDate;
        EndDate = endDate;            
    }

    public decimal Percentage { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
}
```

The only change I made was on line 5.

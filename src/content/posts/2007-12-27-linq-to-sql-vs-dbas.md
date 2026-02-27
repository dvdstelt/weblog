---
id: 450153
author: Dennis van der Stelt
title: LINQ to SQL vs. DBA’s
description: Why is it that in Oracle world, it’s much more custom to have a database administrato...
pubDate: '2007-12-27T11:02:11'
tags:
  - .NET Framework 3.5
  - architecture
redirect_from:
  - /dennis/2007/12/27/linq-to-sql-vs-dbas
  - /blogs/dennis/archive/2007/12/27/linq-to-sql-vs-dbas.aspx
---
Why is it that in Oracle world, it’s much more custom to have a database administrator (DBA) on your project than when you’re working with SQL-Server? I believe it brings great value to a project to have a dedicated experienced DBA working in the team. And I think part of the problem is the fact that Oracle is much more complex to manage, whereas SQL-Server figures out a lot by itself. That’s of course a lot of power coming from SQL-Server, but it has its negatives that most developers don’t think they require a DBA that often.

I’m writing this because since LINQ and specifically LINQ to SQL has been released, I’ve had some discussions on wether the query engine of LINQ to SQL is smart enough to create solid and performing queries. There are a lot of things to say here, because when is a query fast enough? This also depends on the requirements of your architecture. Otherwise it’s just a gut feeling of when it’s not fast enough anymore.

But someone stated recently that
***a LINQ to SQL query can never be as fast as a stored procedure written by a DBA*** ****** LINQ to SQL could never optimize your query because it doesn’t know enough about the database, whereas a DBA does. The conclusion was that you should stick to regular ADO.NET. Of course this is nonsense. For multiple reasons
1. **Dynamic (aka ad-hoc) queries are as fast as stored procedures** There’s been a great debate in the past about this, check out the [this article](http://weblogs.asp.net/rhoward/archive/2003/11/17/38095.aspx) by Rob Howard, its comments and [the response](http://weblogs.asp.net/fbouma/archive/2003/11/18/38178.aspx) from Frans Bouma. I won’t go into details there anymore about what is fast and/or more secure, but the result isn’t too friendly towards Stored Procedures. It’s all about execution path, which is cached for both types of queries.  
Personally I don’t really like Stored Procedures because a lot of people put way too much logic in these. Never in my life have I seen business logic or conditional statements in dynamic (aka ad-hoc) queries. And I also hate editing them, but that’s a personal thing.
2. **LINQ to SQL must be optimized, as would a DBA do with his queries** It’s really obvious, but some seem to forget this. Although LINQ to SQL seems very smart to me, you should know what’s happening where and when and how to optimize this. Charlie Calvert posted a nice article on [deferred execution](http://blogs.msdn.com/charlie/archive/2007/12/09/deferred-execution.aspx) in LINQ to SQL. When you know how this works, a lot of the examples are obvious. Until he reaches a point where he gives an example on displaying the row-count three times in a row. When you don’t pay attention, the query is executed three times! If you’re more likely to make this mistake, you’re probably better of using your own T-SQL queries.
3. **LINQ to SQL supports Stored Procedures** During a presentation I gave, I once got the question if we could still use the power of stored procedures with LINQ to SQL. I responded that we could indeed use stored procedures, but would rather leave ‘the power of’ out of the sentence. You can use Stored Procedures, forget about the query engine and only use the feature of mapping relational data onto objects in LINQ to SQL.

Why I’d rather leave out ‘the power of’ is first because of non existing performance differences, as explained in bullet 1 in this article, and because of the following reason. Imagine you have a database called “Northwind” with a table filled with Customers who all live in a certain city. Image we’d have a Stored Procedure called CustomersByCity that wants a city as parameter and returns all columns for all customers living in that city. We can execute this in LINQ to SQL like this:


```csharp
var query = db.CustomersByCity("London”);
```

Creating a smaller view would look like this:


```csharp
var query = from c in db.CustomersByCity("London”)
            select new { c.ContactName, c.City };
```

And adding another where clause to filter out some more customers:


```csharp
var query = from c in db.CustomersByCity("London”)
            where c.ContactName.Contains('A')
            select new { c.ContactName, c.City };
```

The truth is that our ‘powerful’ Stored Procedure is returning the same results in every single example. In the second code example, the new view is created from a result where still all columns are returned. And in the third example a new LINQ to Objects query is executed over the results coming from the Stored Procedure. The above examples are very likely to happen when you only use Stored Procedures and most developers won’t know what really happened. In a normal LINQ to SQL query, this would’ve been optimized into a smaller query. 
4. **Not many projects have (dedicated) DBA’s** I’ve done my share of projects, for both large and small companies, customers and projects. At the ones that I was lucky enough to have a DBA available, we wouldn’t likely have database performance issues. But unfortunately most projects I’ve been on did not have the luxury of a DBA. On some of those, I’ve seen developers create chaos with T-SQL. For those projects, simple LINQ to SQL queries are probably much better than some of the stuff that developers can create.

I hope I’ve explained why it’s not logical to <u>easily</u> ditch LINQ to SQL in favor of the regular ADO.NET and Stored Procedures, simply because of performance or other issues. I’m not saying you should use LINQ to SQL everywhere and I’m not saying it’s the silver bullet. I’m also not saying you can *never* write more performing queries in Stored Procedures than LINQ to SQL can. When you’re working with and querying large sets of data, you’re probably better of using Stored Procedures instead of retrieving thousands of rows into your application. But not using it at all because of the wrong reasons and not giving it a try without some investigation or proof of concept, might be even worse. It can save you a serious amount of time in your development.

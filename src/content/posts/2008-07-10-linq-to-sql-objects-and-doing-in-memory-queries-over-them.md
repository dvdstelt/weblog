---
id: 464649
author: Dennis van der Stelt
title: LINQ to SQL objects and doing inmemory queries over them
description: This is extremely easy and for most of you probably so obvious that you’ll start spam...
pubDate: '2008-07-10T06:20:13'
tags:
  - .NET Framework 3.5
  - LINQ
redirect_from:
  - /dennis/2008/07/10/linq-to-sql-objects-and-doing-in-memory-queries-over-them
  - /blogs/dennis/archive/2008/07/10/linq-to-sql-objects-and-doing-in-memory-queries-over-them.aspx
---
This is extremely easy and for most of you probably so obvious that you’ll start spamming me that this is time spend better on other things. But it has helped others and maybe it can help some of my visitors. I’ve used it when migrating data between two databases, where the data models were nothing alike.

When you’re using LINQ to SQL and are creating new objects that are defined in your LINQ to SQL classes (or .dbml) you can still query over them before committing them to the database. Here’s an example.


```csharp
// Create root collection that we can query in our application.
List<customer> customers = new List<customer>();  

Customer customer = new Customer();
customer.CompanyName = "Class-A";
customer.ContactName = "Dennis van der Stelt";

// Add this customer to our collection.
customers.Add(customer);

Product product = new Product();
product.ProductName = "i pwn n00bs t-shirt";

Order_Detail orderDetails = new Order_Detail();
orderDetails.Product = product;

Order order = new Order();
order.Customer = customer;
order.Order_Details.Add(orderDetails);

// Select all ordered products by Dennis
var query = from c in customers
            from o in c.Orders
            from d in o.Order_Details
            select d.Product;
</customer></customer>
```

As you can see I never used db.SubmitChanges() so it’s not in the database yet. I did however query over the in-memory collection(s) I’ve build. I’ve created a root collection *customers* which I’ll use in my application to start querying. You can pass around the list of customers if you’d like.

With this example I can go through all customers in one database and pass every product. Imagine that Alex Thissen had ordered [the same t-shirt](http://www.noobstore.com/prod_tshirt-m-ipwn.shtml) (which he didn’t btw, he ordered the [übergamer t-shirt](http://www.noobstore.com/prod_tshirt-m-uber.shtml) from the n00b store 😉 I’d be able to query the created products, see that it was already created and make a reference to that product, instead of (again) creating a new one.

Hope that last paragraph makes sense.

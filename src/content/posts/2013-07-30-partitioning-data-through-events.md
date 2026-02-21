---
id: 578616
author: Dennis van der Stelt
title: Partitioning data through events
description: In my last post I explained the problem of coupling. One of the mentioned solutions w...
pubDate: '2013-07-30T10:29:48'
image: /images/partitioning-data-through-events/header.jpg
tags:
  - Architecture and Design
  - CQRS
  - NServiceBus
redirect_from:
  - /dennis/2013/07/30/partitioning-data-through-events
  - /blogs/dennis/archive/2013/07/30/partitioning-data-through-events.aspx
---
In my [last post I explained the problem of coupling](https://bloggingabout.net/2013/01/04/databases-and-coupling). One of the mentioned solutions was to divide and conquer. Don’t put everything into a single monolithic database, because sooner or later you’ll run into problems because of that decision.
* Every component will have coupling towards and inside the database.
    * Once a change is made, it is possible another component will fail at runtime.
    * Locking is really hard to solve with so many components accessing the same data for different reasons.
* The database will become a bottleneck if you’re business is growing.
    * More and more data will be added and changing requirements will cause your schemas to be changed more often.
    * Performance will become a problem at some time
* Introducing replication as a way to scale out your database will bring the CAP Theorem into play
    * This will most likely cause a sacrifice of consistency.
    * This isn’t a problem that can’t be solved, but it’s hard enough without a single monolithic database.
    * Not a lot of developers (and especially DBA & operations) out there know how to deal with this

The reason I’m putting so much focus on data and the database is for a reason. Often I discuss requirements with developers and they already model out an ERD inside their head to store the data. I’d rather model business processes first, ignoring data storage completely. It’s no wonder so many administrative interfaces are so poorly designed and obviously created by a developer. When the database comes first, the user experience comes last. But back to the topic.

The data needs to be partitioned across multiple databases. But what if the data that is partitioned over multiple databases, is still physically accessed by multiple business processes and/or components? The same problem remains. We are now able to distribute our data over multiple physical servers, resulting in better performance in our database. However in code there’s still coupling. Most likely your system is performing worse then before, since the coupling is solved through in-memory mapping of the data.

You should not ‘just’ partition the data. You should also ‘partition’ your business processes. When you’ve isolated a business process, you’ll more likely be able to partition your data for that business process with actual benefit. Think about an example that probably a lot of us use in our day to day work. Most financial departments have their own system and when customers need to be invoiced, we send some data to this system and forget about it completely. When a customer purchased a product, we will very likely send this information towards the financial system to have it invoiced. We can probably do with the following information:

## Register customer purchase
1. The fact that an item was purchased
2. Key of the product
3. Key of the customer
4. Date and time of purchase

[![](/images/partitioning-data-through-events/recruiter-720x340.png)](/wp-content/uploads/2013/06/recruiter.png)This is all the information the financial system needs to calculate what a customer should pay. It knows the price of the product at the time it was purchased. It now knows who should be billed. And it probably knows about discounts or customer specific bulk purchase discounts. The financial system will create the final invoice and the customer is required to pay the bill.

Notice that the financial system doesn’t actually need the name of the product. Historically we might specify a name in the financial system, but it is not required to be able to calculate the final invoice. But hold this thought for now, I’ll get back to this later. The financial system also doesn’t need to know to which category it belongs to. It also doesn’t need to know about a list of popular products or a list of products that you’ll likely also want to buy. All this information can be partitioned and isolated in another component.

## Customer hasn’t paid

Now the business process of billing a customer has been isolated, how do we deal with customers that did not pay on time? Perhaps there are business rules that specify a non-paying customer can’t purchase anything until the invoice has been paid. We need some sort of notification back into our own system, that will make sure the customer can’t purchase anything anymore. The information provided in this notification is
1. The fact that an invoice wasn’t paid before the due data
2. Key of the customer
3. Date and time the invoice went overdue

This is all the information required to have the business rule go into effect and nothing more.

## Events

[![](/images/partitioning-data-through-events/7181_contact_2d00_movie_2d00_still_5f00_57b952bf.jpg)](/wp-content/uploads/2014/01/7181_contact_2d00_movie_2d00_still_5f00_57b952bf.jpg)I hope you’re starting to see a pattern. What we are specifying in the above examples are simple messages between two components. The first bullet of both messages specifies their intent. When you’re used to [messaging patterns](https://bloggingabout.net/2012/04/25/what-is-messaging) you’ll understand that we can specify the intent in the name of the message.

We can send the message specifically to the financial system, but what if we’ve isolated other components as well? What if they need to be made aware of the purchase as well? An example could be a component that needs to ship the purchased items. We can send the message to different locations using [publish/subscribe pattern](http://www.enterpriseintegrationpatterns.com/PublishSubscribeChannel.html). Whenever we use pub/sub we send out events, and events are always in the past tense.


```xml
<?xml version="1.0"?>
<messages>
    <itempurchased>
        <productidentifier>57cbe59c-6881-4e5d-84a5-3264e2252ac2</productidentifier>
        <customeridentifier>2ed3cd8e-b7c2-4557-9442-4f58939c201b</customeridentifier>
        <purchasedate>2013-01-17T13:37:00</purchasedate>
    </itempurchased>
</messages>
```

## Conclusion

What we’ve just done is introduce [Event Driven Architecture](http://www.eaipatterns.com/docs/EDA.pdf). Instead of relying on Remote Procedure Calls into another web (or REST based) service we’ve published information to another component, before the information was actually needed. At my current employer, we don’t invoice customers until the end of the month. And the second example provided information about a customer who didn’t pay the bill, so the system knew in advance that it wasn’t allowed to purchase anything else anymore. Where historically we might’ve queried the database for the state of the customer. But now we already had the information in our system, even before the next purchase ever took place!

As you might have noticed I mostly only publish identifiers, included in an event with a specific name. This is for a reason, but part of another article.

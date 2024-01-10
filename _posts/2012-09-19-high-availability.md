---
layout: post
id: 578023
author: Dennis van der Stelt
image: '/images/high-availability/header.jpg'
date: 20120919 072540
title: High availability
description: We’ve had a lot of success applying the principles and practices of the Advanced Dist...
categories:
    - Architecture and Design
    - NServiceBus
redirect_from:
  - "/dennis/2012/09/19/high-availability"
  - "/blogs/dennis/archive/2012/09/19/high-availability.aspx"
---

We’ve had a lot of success applying the principles and practices of the [Advanced Distributed Systems Design](http://www.udidahan.com/training/#Advanced_Distributed_System_Design) course into our project and [Udi Dahan asked](http://www.udidahan.com/2012/09/03/high-availability-a-la-dennis/) if I could shed some more light on how things played out for us, so here it is.

First of all, I wasn’t the only one who worked on this project – credit must also go to Sander Kooij and Maarten Vermeulen. Although I was the architect envisioning the solution, these guys were the ones that actually made it happen in code.

We work at [Tellus](http://tellus.com), a global leader in lead generation. With current offices in Rotterdam, Los Angeles, London, Berlin and Sydney, Tellus serves over 100 countries and 10,000 businesses that depend on us to provide them high quality and high volume leads, no matter where or what industry.

## Legacy

When we started out, we had to face quite a lot of legacy code. And if that wasn’t enough, that code depended on one of the worst legacy databases I’ve ever seen. A lot of Udi Dahan’s training is about dealing with and preventing coupling. For us, this legacy database was really where all the coupling was.

For a long, long time I believed the only way to get rid of that coupling was to start from scratch – a rewrite. This would be done by iteratively and incrementally building out features, releasing them, and improving from there. Eventually we’d get up to the point where we could remove the old legacy system. This path would’ve taken several developers at least a year of work, without any guarantees of success.

It was not until I’d taken Udi Dahan’s course that I realized there were other ways. Udi describes a phased approach to restructuring old legacy code piece by piece while building out new and better designed components alongside them in a loosely coupled manner, all the while keeping the system still working.

I don’t want to make it sound easy. It was a long and hard process for us, but I’m convinced it was the better choice. This is why I was especially proud of our first major release. I am still working out better ways to manage our future transitions though, and digging into things like how much of what kind of documentation will be necessary and sufficient.

## Maintainability

The current codebase is much more maintainable, being built of smaller modules that follow the Single Responsibility Principle, although what we’ve got goes much farther than that.

One of the problems Udi talks about in the course is hidden coupling between modules that talk to the same database. We really felt this pain in the legacy system where changing one part of it often ended up breaking other parts in totally unexpected ways.

I’m happy to say that we now have truly autonomous modules that each depend on their own database schema only, interacting with each other via publish/subscribe patterns. These “Business Components” enable us to modify and maintain each of them independently knowing that the chance of breaking code somewhere else is practically nonexistent.

There’s no way we could have achieved this with the traditional layered service approach.
## View Models and Events  

One of the ways we had originally dealt with the deadlocks and performance issues plaguing our main database was by having stored procedures extract, transform, and load data to a different database – a “kind of” view model. While this helped a bit, we couldn’t run this process more than once a day as it took so long and hit the database quite hard. Unfortunately, this solution didn’t work that well for data that needed to be very fresh, like the customer data in our system.

For this reason, we avoided this kind of database-centric solution in the new components being built and made much deeper use of messaging and publish/subscribe patterns. It did take some time to make the transition, but we’re now seeing components publishing events even as they process other events received from different components – the kinds of “event cascades” Udi describes in his course.

## Fast System Upgrades  

Our original design had a component receiving events via publish/subscribe regarding a status update of our customers. When we deployed this to our test environment, the results were blazing fast and worked like a charm so I thought we could take things another step further.

Udi Dahan talks about the fallacy of centralization in the course and it really resonated with me. I realized we didn’t need to centralize this functionality just on the back-end server, so long as we had our deployment story organized.

What we did was to take the component deployed to the back-end and make it a part of our front-end web servers as well, enabling much earlier updates than before and a much better user experience. The really amazing thing was that we didn’t have to make any code changes for this – only our deployment scripts, and just like that we had it live on 24 web servers!

Watching this in action really put the daily legacy view-model update to shame and really proved to our business stakeholders the value of our approach. The publish/subscribe capabilities of NServiceBus really paid off here.

## Change of requirements & fast redeployment

Just like many other projects, even before the first deployment, change requests started coming in. We decided not to put it off and went into production promising to make the changes soon after.

Since all the change requests were in a specific area of business and we had designed our system in such a way that all the code dealing with a specific business capability would be encapsulated in a single service, we knew that changing that code wouldn’t break functionality in any other service. While it was one thing hearing that theory during the course, seeing it in action across 25 servers was quite another.

By using messaging, queues, and publish/subscribe patterns, we were able to upgrade a core part of our system without touching any other parts – even those that it communicates with on an ongoing basis. During the short period of time that it was down, the queues took care of buffering the communication for that service without affecting anything else. The system as a whole was never really down.

This was a totally new experience for our company – an upgrade without downtime, even with the thousands of websites we’re running.
## In Closing

If you have the opportunity of going on the Advanced Distributed Systems Design course, I’d really recommend it. It’s hard to summarize all the practical tidbits of information I got from the course but it really changed my perspective on what’s possible in software. If you live in The Netherlands and want an introduction, come to the [DotNed meeting held on Thursday](http://www.dotned.nl/register/48/distributed-systems-design-bij-macaw-door-dennis-van-der-stelt.aspx), september 27th at Macaw in Amsterdam.

While there’s so much more we’re looking to put into place, I’m really proud of how far we’ve come and hope you’ve enjoyed hearing about it.

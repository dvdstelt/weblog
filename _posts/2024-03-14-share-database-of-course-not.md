---
layout: post
id: 20240314
author: Dennis van der Stelt
image: '/images/2024/how-to-migrate-to-jekyll/header.jpg'
date: 20240314 090000
title: Shared database? Of course not!
description: What is so bad about shared databases with microservices?
tags:
  - 4+1 architectural view model
  - microservices
  - service boundaries
---
# Share database? Of course not!

Whenever I hear developers or architects talk about it, almost always everyone agrees that services shouldn't share their database. It's something that is so widely known that everyone tries to avoid it. In this article we'll discuss why *we think* it's a bad idea but how looking at it from a different angle, we might come to different opinions than we currently have.

***Unfortunately, it's not always possible. Due to time pressure or some of the (architectural) patterns don't allow it and a database is shared. We know it's an issue and promise ourselves we'll fix it in the future when we get rid of some technical debt. But it is also widely known that these are great plans, but it'll likely never happen.***

> [!TIP]
>
> Before you read on, try to think for a while why it's actually such a bad idea to have services share their database.

## Why not share a database?

#### Coupling

A common conception is that a shared databases massively increases coupling. Adding or modifying features of a system often results in modifying the database schema. As a result, other services that depend on that schema, immediately break. Every service now needs to be verified if it won't break because of the dependency on that schema.

As you might now, I'm an advocate for looking at your architecture through different lenses. The [4+1 architectural view model](https://bloggingabout.net/2020/08/07/41-architectural-view-model/) provides this. In the below image, you can see a logical view of the system on the left and a physical view of the system on the right. In the logical view you can see that each service has its own *datastore* and is logically separated from any other service. On the right side you can see the same 3 components with their own database. However, some of them also access the database of another service.

![](..\images\2024\share-database\shared-database.png)

This means the logical view isn't correct. Because of there's a dependency (read: coupling) on any of the other databases, it should be visible in the logical view as well. Let's update the image and make sure it's correctly representing those dependencies.

![](..\images\2024\share-database\shared-database-logical-view.png)

As I mentioned before, it's the common conception that this should not be how we share data between services. Instead we introduce a [service layer](https://martinfowler.com/eaaCatalog/serviceLayer.html). Don't you love that you can use the word "service" everywhere and have it mean something different each time? Anyway, here's an updated picture. Now each service has its own WebAPI. If a service requires some data, it can just do a request to the other service.

![shared-api](..\images\2024\share-database\shared-api.png)

Let's assume it's a minimal API, just because we heard at conferences that it's cool. I know why minimal APIs are nice to work with, but I always like my code to be very explicit instead of assuming something has a specific default. The same goes for my diagrams however. In the above image, we see the physical view with services being able to request data from other services. But these are dependencies as well, aren't they? The services still depend on data from another service. Instead of depending on some schema, they depend on a contract defined by the API. But what else is a schema than a contract?

So when we look at the logical view again, we have to conclude that we need to add those dependencies again. However the WebAPI is an implementation detail in the physical view. And as a result, the logical view should look like this:

![](..\images\2024\share-database\shared-api-logical-view.png)

Even though we removed the direct dependency on the database in the *physical view* using a WebAPI, the *logical view* is exactly the same as when each service could use a shared database.

So when you hear you shouldn't use a shared database but instead introduce a [service layer](https://martinfowler.com/eaaCatalog/serviceLayer.html) because it has less coupling, you might want to reconsider if this is actually true.

#### Versioning



### 

Er is koppeling tussen microservices als ze data delen, ongeacht of dat via een directe verbinding is naar de data in een database, of naar data via een zelfgebouwde API.

### Consistency

Als je caching gebruikt, heb je eventual consistency.

Als je direct naar database gaat, heb je grootste kans dat consistency overeind blijft. Dat lukt echter alleen als je bijv. de order, orderdetails, inventory, shipping status en meer tegelijkertijd bijwerkt. Met microservices zijn meer van deze zaken verdeeld over meerdere microservices en meerdere databases. Hoe houd je dan je database consistent? Met een API heb je hetzelfde probleem, maar velen merken dit aan als voordeel van direct naar databases gaan. Dat is dus niet haalbaar in een echt microservices systeem.

### Versioning

Het is lastiger met database om versioning toe te passen dan met een andere API, zoals REST.

### Data synchronization

Sowieso een slecht idee. Eventual consistency is al iets wat niet eenvoudig is om mee om te gaan, laat staan als data verspreid moet worden over meerdere microservices en hun database en het probleem verergert.



https://www.techtarget.com/searchapparchitecture/tip/Can-you-really-use-a-shared-database-for-microservices

https://www.linkedin.com/advice/0/what-benefits-drawbacks-using-shared-database-microservices

https://thegreatapi.com/blog/why-sharing-a-database-between-microservices-is-a-bad-idea/#:~:text=In%20conclusion%2C%20sharing%20a%20database,the%20risk%20of%20security%20concerns.

https://medium.com/@benlugavere/why-microservices-shouldnt-share-a-database-a48216ba26d5

https://microservices.io/patterns/data/shared-database.html
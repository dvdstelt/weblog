---
id: 20240314
author: Dennis van der Stelt
title: Shared database? Of course not!
description: What is so bad about shared databases with microservices?
pubDate: '2024-03-14T09:00:00'
image: /images/2024/share-database/header.jpg
tags:
  - architecture
  - microservices
---
Whenever I hear developers or architects talk, almost always everyone agrees that services shouldn't share their database. It's something that is so widely known that everyone tries to avoid it. In this article we'll discuss why *we think* it's a bad idea, but how looking at it from a different angle, we might come to different opinions than we currently have.

## Sharing a database

It is a common conception that a shared databases massively increases coupling. Adding or modifying features of a system often results in modifying the database schema. As a result, other services that depend on that schema, immediately break. Every service needs to be verified if it won't break because of the dependency on that schema.

### Different views make coupling visible

I'm an advocate for looking at your architecture through different lenses. The [4+1 architectural view model](/2020/08/07/41-architectural-view-model/) provides this and allows us to use different views to see our architecture. In the image below, on the left is a logical view of a system and on the right a physical view of the system. In the logical view you can see that each service has its own *datastore* and is logically separated from any other service. On the right side you can see the same 3 components with their own database. However, some of them also access the database of another service.

![](\images\2024\share-database\shared-database.png)

I often see developers create designs like this; as if there's no coupling and hiding this in the logical view. But the coupling is then introduced in the physical view without visualizing this.

We can see the example in our image above. We now visualized a dependency (read: coupling) in the physical view and we should not hide this dependency in the logical view either. It means the logical view isn't correct. Let's update the image and make sure it's correctly representing those dependencies.

![](\images\2024\share-database\shared-database-logical-view.png)

## Decoupling through layers

As I mentioned before, it's a common conception that this should not be how we share data between services. To solve this, we want to introduce a [service layer](https://martinfowler.com/eaaCatalog/serviceLayer.html). Don't you love that you can use the word "service" everywhere and have it mean something different each time? Anyway, here's an updated picture. Now each service has its own WebAPI. Not visible in our image, but our API could share data over HTTP in JSON format. If a service requires some data, it can just do a request to the other service.

![shared-api](\images\2024\share-database\shared-api.png)

Let's assume it's a minimal API, just because we heard at conferences that it's cool. I know why minimal APIs are nice to work with, but I always like my code to be very explicit instead of assuming something has a specific default. The same goes for my diagrams however. In the above image, it's clear in the physical view that services are able to request data from other services using the WebAPI. But these are dependencies as well! The services still depend on data owned by another service. Instead of depending on a schema in a relational database, they depend on a contract defined by the API. But what else is a schema than a contract?

So looking at the logical view again, we have to conclude that we need to add those dependencies again. However the WebAPI is an implementation detail in the physical view. And as a result, the logical view should look like this:

![](\images\2024\share-database\shared-api-logical-view.png)

Even though we removed the direct dependency on the database in the *physical view* using a WebAPI, the *logical view* is exactly the same as when each service could directly use a shared database.

So when you hear you shouldn't use a shared database but instead introduce a [service layer](https://martinfowler.com/eaaCatalog/serviceLayer.html) because it has less coupling, you might want to reconsider if this is actually true.

I'm working on a series of blogposts that should explain how we can truly have logical services that have no direct dependency on each other. Where the [service boundaries are explicit](https://www.infoq.com/news/2007/08/MsSoaTenets/). A link to the original [Don Box article](https://web.archive.org/web/20040615055648/http://msdn.microsoft.com/msdnmag/issues/04/01/Indigo/default.aspx).

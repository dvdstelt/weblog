---
id: 20260805
author: Dennis van der Stelt
title: Four Order classes and no Order service
description: The five boundaries from the previous post, now visible in code. Four classes named Order, three named Product, and no shared model tying them together.
pubDate: '2026-08-05T01:00:00'
image: /images/2026/four-order-classes.jpg
topic: omnomnom
sources:
  omnomnom: 35920e4d1d1f43c3b54a7174348c13e7295ff170
tags:
  - distributed systems
  - microservices
  - service boundaries
  - architecture
  - omnomnom
---
Open the [OmNomNom solution](https://github.com/dvdstelt/OmNomNom), search for a class called `Order`, and you get four results. Four namespaces, four different models, four separate database files. None of them is the real one.

In most codebases, that would look suspicious. Somebody copied a model into another project three years ago, nobody noticed, and now the two have drifted far enough apart that fixing it needs a meeting.

In OmNomNom, it is the design.

It is what [the previous post](https://bloggingabout.net/2026/06/04/finding-omnomnoms-service-boundaries/) was arguing for. That post stopped after finding and naming five service boundaries, with a promise to show how those boundaries land in code.

So let's open the solution.

## Five boundaries in the solution

The five boundaries from the previous post are Catalog, Finance, Marketing, Shipping, and PaymentInfo. In the solution, they appear as five separate folders, with projects named after the boundary they belong to.

```
Catalog/
  Catalog.Data
  Catalog.Endpoint
  Catalog.Endpoint.Messages
  Catalog.ServiceComposition
  Catalog.ServiceComposition.Events
Finance/
  Finance.Data
  ...
```

A boundary does not necessarily need every one of those projects. The suffix describes the role a project plays.

`<X>.Data` contains the private model: the `DbContext`, entities, and seed data. Other boundaries do not use it.

`<X>.Endpoint` is where decisions happen. It contains message handlers, the occasional saga, and the registration code that turns it into a running NServiceBus endpoint.

`<X>.Endpoint.Messages` contains the public messaging contracts: commands that may be sent to the boundary and events it publishes.

`<X>.ServiceComposition` contains the boundary's contribution to HTTP responses. Some boundaries also have `<X>.ServiceComposition.Events` for the in-process events used while composing those responses. That is the subject of the next post.

Marketing is worth a second look because it only has three of these projects. There is no `Marketing.Endpoint.Messages`, and that is not an oversight. Marketing publishes nothing. It subscribes to Catalog's `OrderPlaced`, updates its own counters, and never asks anyone else to care about the result.

A boundary that only listens does not need public messaging contracts of its own. The project structure follows what the boundary actually does instead of applying the same template everywhere.

More important than the naming convention are the project references.

If `Finance.Endpoint` wants to reach into `Catalog.Data`, it cannot just add a `using` statement and start reading Catalog's entities. There is no project reference. Crossing that line requires someone to deliberately change the dependencies between the projects.

That does not make boundary violations impossible. Someone can still add the reference. But it makes the violation visible at exactly the point where it happens.

If Finance needs to react to a decision Catalog owns, it can do that through Catalog's contracts instead of reaching into Catalog's private model.

## Four Order classes

Which brings us back to those four search results.

Catalog's `Order` tracks what the customer asked for:

```csharp repo="omnomnom" file="src/Catalog.Data/Models/Order.cs" lines="1-14"
```

Finance's `Order` tracks what the customer owes:

```csharp repo="omnomnom" file="src/Finance.Data/Models/Order.cs" lines="1-21"
```

Shipping's `Order` tracks where it goes:

```csharp repo="omnomnom" file="src/Shipping.Data/Models/Order.cs" lines="1-11"
```

And PaymentInfo's `Order` is this:

```csharp repo="omnomnom" file="src/PaymentInfo.Data/Models/Order.cs"
```

That is the whole class.

PaymentInfo does not know what was ordered, what it cost, or where it is going. It knows which card belongs to which order. That is the extent of its authority, so that is the extent of its model.

These are not smaller copies of a bigger `Order` model living somewhere else. There is no bigger model. Nowhere in OmNomNom is there a type containing all of these properties, and there is no shared order table underneath them.

```d2 theme=200 hide-class-markers
direction: down
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Catalog": {
  shape: class
  "**Order Identifier**"
  "Product Identifier"
  "Ordered Quantity"
}

"Finance": {
  shape: class
  "**Order Identifier**"
  "Product Identifier"
  "Billable Quantity"
  "Price"
  "Discount"
  "Fulfilled"
  "Billing Address"
  "Charged Amount"
}

"Shipping": {
  shape: class
  "**Order Identifier**"
  "Customer Identifier"
  "Shipping Address"
  "Delivery Option"
}

"PaymentInfo": {
  shape: class
  "**Order Identifier**"
  "Credit Card Identifier"
}

"Catalog" -> "PaymentInfo": {style.opacity: 0}
"Finance" -> "PaymentInfo": {style.opacity: 0}
"Shipping" -> "PaymentInfo": {style.opacity: 0}
```

A screen may eventually need information from several of these boundaries at once. That does not require turning them back into one domain model. We can compose the information when we need it, which is what the next post will get into.

Marketing is the fifth boundary, but it does not appear in that diagram because Marketing has no `Order` class at all. It has `OrderActivity`:

```csharp repo="omnomnom" file="src/Marketing.Data/Models/OrderActivity.cs"
```

It is an append-only log, one row per ordered line, feeding the trending calculation.

Marketing does not care about an order as a thing. It cares that something was bought, and when. Modelling that as an `Order` would be the noun sneaking back in through the side door.

`Product` splits in much the same way.

[Catalog's](https://github.com/dvdstelt/OmNomNom/blob/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Catalog.Data/Models/Product.cs) has name, description, image, style, brewery, and country.

[Finance's](https://github.com/dvdstelt/OmNomNom/blob/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Finance.Data/Models/Product.cs) has price and discount.

[Marketing's](https://github.com/dvdstelt/OmNomNom/blob/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Marketing.Data/Models/Product.cs) has rating, rating count, order count, and trending.

Same `ProductId`, three classes, three files, three databases.

The important part is not that OmNomNom duplicated `Order` and `Product`. It did not. Each boundary models the part of reality it has authority over. The shared identifier tells them which real-world thing they are talking about without forcing them to agree on one model of that thing.

No `OrderService`, no `ProductService`, and no shared table underneath pretending otherwise.

## The quantity argument, now with a compiler

In the previous post I spent a section arguing that `OrderedQuantity` and `BillableQuantity` are not the same property with two names.

They usually contain the same number. They answer different questions, change for different reasons, and belong to different authorities.

That was prose. Here are the two models.

Both classes happen to be called `OrderItem`, and they live in the same two files as the `Order` classes above.

```csharp repo="omnomnom" file="src/Catalog.Data/Models/Order.cs" lines="16-24" highlight="23"
```

```csharp repo="omnomnom" file="src/Finance.Data/Models/Order.cs" lines="23-38" highlight="29,37"
```

Two properties on two different classes in two different assemblies.

Catalog has a product and the quantity that was ordered. Finance has the information needed to determine what should be billed, including price, discount, and whether the item was fulfilled.

There is no shared `Quantity` property that slowly accumulates enough meanings to satisfy everybody.

Finance's `Fulfilled` flag also shows how those models cooperate without becoming one. Catalog decides what it can actually fulfill and publishes that decision. Finance reacts to it and decides what that means for the amount the customer should be charged.

Catalog never updates Finance's order. Finance never asks Catalog for its `Order` object.

They communicate decisions instead of sharing state.

We will follow those messages themselves later in the series.

## Delivery options, twice

Delivery options are another example from the previous post that becomes much more concrete in code.

Shipping's delivery option is something with a name that may or may not be available for an address:

```csharp repo="omnomnom" file="src/Shipping.Data/Models/DeliveryOption.cs"
```

Finance's delivery option is something that costs money, unless the order is large enough:

```csharp repo="omnomnom" file="src/Finance.Data/Models/DeliveryOption.cs"
```

Neither model is incomplete.

They are two models of the same real-world thing, each containing what its owner needs to make its own decisions. Shipping does not need the price. Finance does not need the rules that determine whether an option is available for a particular address.

The customer still experiences one delivery option. The software does not need one universal definition of it.

That was the entire goal.

## What is not a boundary

There are more projects in the solution than the five business boundaries, and it matters that we do not start counting those as boundaries too.

`CompositionGateway` is the HTTP front door. `OmNomNom.BackOffice` sends confirmation emails. `WorkflowComposer` holds in-flight checkout state. `ITOps.Shared` contains configuration shared by the endpoints. `OmNomNom.AllInOne` is a host that can run multiple endpoints in one process.

Those are technical components, not additional areas of business authority.

My favourite example is [`Checkout.Endpoint`](https://github.com/dvdstelt/OmNomNom/tree/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Checkout.Endpoint), which is a fully configured NServiceBus endpoint containing exactly zero business message handlers.

Its job is to process an outbox on behalf of the gateway.

Calling it an endpoint does not make it a service boundary. An endpoint is part of the messaging topology. A boundary describes who owns decisions and data. Sometimes those concepts line up neatly. Sometimes they do not.

Checkout is infrastructure. Counting it as a sixth boundary just because it has `.Endpoint` in the name would put us straight back to discovering architecture from technical nouns.

## What this bought

None of this requires an elaborate enforcement mechanism.

There is no runtime boundary checker and no architecture test suite failing the build when somebody reaches across a line. There is a solution structure, a naming convention, separate models and databases, and project references that make crossing a boundary require an explicit change.

That turns out to provide a lot of value.

The problem with shared models is rarely that someone sits down and decides to create a giant coupled model. It happens one reasonable property at a time.

Someone needs a customer's email address. The class is already there. Adding another property costs almost nothing. Six months later, three different parts of the system depend on it for three different reasons.

When the model you want is in an assembly you deliberately do not reference, that convenience disappears. You have to stop and ask a more useful question:

Do I actually own this information?

If the answer is no, adding a project reference should feel suspicious. Maybe what you really need is a decision published by the boundary that does own it.

So far, though, all of this is data sitting still.

The interesting question is what happens when a single web page needs a beer's name from Catalog, its price from Finance, and its rating from Marketing, while none of those three boundaries is allowed to reach into the other two.

That is the next post.

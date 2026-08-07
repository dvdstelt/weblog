---
id: 20260805
author: Dennis van der Stelt
title: Four Order classes and no Order service
description: The five boundaries from the previous post, opened up in the solution. Four classes named Order, three named Product, and a compiler that keeps them apart.
pubDate: '2026-08-05T01:00:00'
image: /images/2026/four-order-classes.png
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
Open the [OmNomNom solution](https://github.com/dvdstelt/OmNomNom), search for a class called `Order`, and you get four results. Four namespaces, four sets of properties, four separate database files. None of them is the real one.

In most codebases that is a finding. Somebody copy-pasted a model into a second project three years ago, nobody noticed, and now the two have drifted far enough apart that fixing it needs a meeting. In OmNomNom it is the design. It is what [the previous post](https://bloggingabout.net/2026/06/04/finding-omnomnoms-service-boundaries/) was arguing for, except that post stopped at the point where I named the boundaries and promised to show you the code.

So let me show you the code. Every snippet below is pulled straight out of the repository at the commit this post was written against, and the GitHub icon on each block opens that exact file. Nothing here is retyped, so nothing here can quietly drift away from what actually runs.

## Five boundaries, five folders

The five boundaries from the previous post are Catalog, Finance, Marketing, Shipping, and PaymentInfo. In the solution they are [five folders](https://github.com/dvdstelt/OmNomNom/tree/35920e4d1d1f43c3b54a7174348c13e7295ff170/src), and everything that belongs to a boundary lives in exactly one of them.

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

That is more projects than a boundary strictly needs, and the reason is that "a boundary" is not one kind of thing. It owns data, it makes decisions about that data, it tells other boundaries what it decided, and it contributes something to a screen. Those are four jobs with four different audiences, and the suffix says which job a project is doing.

`<X>.Data` is the private model. The `DbContext`, the entities, the seed data. No other boundary references it, ever.

`<X>.Endpoint` is where the decisions happen. Message handlers, the occasional saga, and the registration code that turns it into a running NServiceBus endpoint.

`<X>.Endpoint.Messages` is the public contract. Commands other boundaries may send, events other boundaries may subscribe to. This is the only project in the folder that anyone outside the boundary is allowed to reference.

`<X>.ServiceComposition` is the boundary's contribution to HTTP responses, and `<X>.ServiceComposition.Events` carries the in-process events those contributions raise. Both are for the next post.

Marketing is worth a second look here, because it only has three of these projects. There is no `Marketing.Endpoint.Messages`, and that is not an oversight. Marketing publishes nothing. It subscribes to Catalog's `OrderPlaced`, updates its own counters, and never asks anyone else to care about the result. A boundary that only listens does not need a public contract, so it does not have one. Five projects is what a boundary needs when it both talks and listens, not a template to stamp onto every folder.

The interesting part is not the naming convention. It is that project references make the rule enforceable. "Boundaries only communicate through messages" is the sort of thing that gets written on a wiki page, agreed to in a meeting, and then quietly violated the first time somebody needs a customer's email address and notices that the other team's assembly is right there. Here, `Finance.Endpoint` cannot reference `Catalog.Data`, because nothing does. If you want something from Catalog, you subscribe to a Catalog event, and that is a code review conversation rather than a `using` statement.

## Four Order classes

Which brings us back to the four hits.

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

That is the whole class. PaymentInfo does not know what was ordered, what it cost, or where it is going. It knows which card belongs to which order. That is the extent of its authority, so that is the extent of its data.

I want to be clear that this is not a smaller version of a bigger model that lives somewhere else. There is no bigger model. Nowhere in OmNomNom is there a type that has all of these properties on it, and no database you could query to get them in one row. If you want to know everything about order `a3f1...`, you ask four boundaries and put the answers next to each other, which is exactly what the gateway does.

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

Marketing is the fifth boundary and it does not appear in that picture, because Marketing has no `Order` class at all. It has `OrderActivity`:

```csharp repo="omnomnom" file="src/Marketing.Data/Models/OrderActivity.cs"
```

An append-only log, one row per ordered line, feeding the trending calculation. Marketing does not care about orders. It cares that something was bought, and when. Modelling that as an `Order` would have been the noun sneaking back in through the side door.

`Product` splits the same way, by the way. [Catalog's](https://github.com/dvdstelt/OmNomNom/blob/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Catalog.Data/Models/Product.cs) has name, description, image, style, brewery, and country. [Finance's](https://github.com/dvdstelt/OmNomNom/blob/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Finance.Data/Models/Product.cs) has price and discount. [Marketing's](https://github.com/dvdstelt/OmNomNom/blob/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Marketing.Data/Models/Product.cs) has rating, rating count, order count, and trending. Same `ProductId`, three classes, three files, three databases.

That is an actual implementation of `Order` and `Product`, with their attributes split across service boundaries. No `OrderService`, no `ProductService`, and no shared table underneath pretending otherwise.

## The quantity argument, now with a compiler

In the previous post I spent a section arguing that `OrderedQuantity` and `BillableQuantity` are not the same property with two names. They usually hold the same number. They answer different questions, they change for different reasons, and they belong to different authorities.

That was a paragraph of prose, and prose does not survive contact with a developer in a hurry. Here are the two classes. Both are called `OrderItem`, and they live in the same two files as the `Order` classes above.

```csharp repo="omnomnom" file="src/Catalog.Data/Models/Order.cs" lines="16-24"
```

```csharp repo="omnomnom" file="src/Finance.Data/Models/Order.cs" lines="23-38"
```

Two properties, on two classes that happen to share a name, in two assemblies that cannot see each other. There is no refactoring that accidentally merges them, because there is no place where both are in scope. Note that they do not even agree on what else belongs on a line item: Catalog has a product and a count, Finance has money.

Finance's `Fulfilled` flag is where the two meet, and it meets them the long way around. Catalog decides what it could actually ship, publishes the result, and Finance flips `Fulfilled` to false on the lines that did not make it so the customer is not charged for them. Catalog never writes to a Finance table. It publishes what it decided and Finance decides what that means for the invoice.

This becomes clearer once we follow the messages themselves, a few posts from now.

## Delivery options, twice

The clearest example of all this is the one I already argued for in the previous post: delivery options have two sides.

Shipping's delivery option is a thing with a name that may or may not be available for an address:

```csharp repo="omnomnom" file="src/Shipping.Data/Models/DeliveryOption.cs"
```

Finance's delivery option is a thing that costs money, unless the order is big enough:

```csharp repo="omnomnom" file="src/Finance.Data/Models/DeliveryOption.cs"
```

Neither of them is missing anything. They are two partial models of the same real world thing, each holding what its owner needs to make its own decision, and neither is waiting for the other to fill in the rest.

It carries all the way through. When the customer picks a delivery option during checkout, that single click ends up as two files with identical names in two different projects, [`Finance.ServiceComposition.Workflow.DeliveryOptionWorkflowSlice`](https://github.com/dvdstelt/OmNomNom/blob/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Finance.ServiceComposition/Workflow/DeliveryOptionWorkflowSlice.cs) and [`Shipping.ServiceComposition.Workflow.DeliveryOptionWorkflowSlice`](https://github.com/dvdstelt/OmNomNom/blob/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Shipping.ServiceComposition/Workflow/DeliveryOptionWorkflowSlice.cs), each producing its own `SubmitDeliveryOption` command aimed at its own endpoint. Same click, two commands, two boundaries. Nobody had to agree on a shared definition of what a delivery option is, which was the entire goal.

## What is not a boundary

There are more projects in the solution than the five folders, and it matters that they are visibly not boundaries.

`CompositionGateway` is the HTTP front door. `OmNomNom.BackOffice` sends the confirmation emails. `WorkflowComposer` holds in-flight checkout state. `ITOps.Shared` is the endpoint configuration every endpoint calls. `OmNomNom.AllInOne` is a host that runs everything in one process, which is a story for the last post in this series.

My favourite is [`Checkout.Endpoint`](https://github.com/dvdstelt/OmNomNom/tree/35920e4d1d1f43c3b54a7174348c13e7295ff170/src/Checkout.Endpoint), which is a fully configured NServiceBus endpoint containing exactly zero message handlers. Its entire job is to process an outbox on behalf of the gateway. It is a good reminder that "endpoint" is a deployment word and "boundary" is an architecture word, and that a demo which conflates them is teaching the wrong lesson. Checkout is infrastructure that happens to be shaped like an endpoint, and the moment you count it as a sixth boundary you are back to counting processes.

## What this bought

None of this is elaborate. There is no framework enforcing ownership, no runtime check, no architecture test suite failing the build when somebody reaches across a line. There is a folder per boundary, a suffix convention, and a set of project references that make the wrong thing awkward enough that you notice you are doing it.

That turns out to be most of the value. The reason shared models rot is not that someone made a bad decision, it is that adding one more property to a class you can already see costs nothing at the moment you do it. If the class is in an assembly you do not reference, the cost shows up immediately, at the point where you can still ask whether the property belongs to you at all.

So far, though, all of this is data sitting still. The interesting question is what happens when a single web page needs a beer's name from Catalog, its price from Finance, and its rating from Marketing, and none of those three is allowed to know the other two exist.

That is the next post.

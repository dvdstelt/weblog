---
id: 20260529
author: Dennis van der Stelt
title: Service boundaries are about authority
description: Service boundaries are not about data shape or workflow. They are about authority, and most diagrams skip the part that matters.
pubDate: '2026-05-29T01:00:00'
image: /images/2026/service-boundaries-are-about-authority.png
topic: omnomnom
tags:
  - distributed systems
  - microservices
  - service boundaries
  - architecture
  - omnomnom
---
Right now, dozens of systems contain a record of you. None of them describes the same person.

Your bank knows an account holder, a tax identifier, and a pattern of money moving in and out. Your employer knows an employee, a salary band, and how many vacation days remain. Your phone provider knows a subscriber, a device, and a monthly data allowance. Your doctor knows a blood pressure history, a height, and that thing with your knee.

All of those systems refer to the same human being. Yet their models barely overlap. More importantly, they do not need to. In fact, it would be strange if they did.

The bank should not know about your knee. The doctor should not know your supermarket purchases. Your employer should not know your mobile data usage. The boundaries between those organizations do not just separate responsibilities. They limit information flow. Each organization sees only the part of the world it needs in order to make its own decisions.

The interesting thing is not that these models are incomplete. It is that they are intentionally incomplete.

Now imagine somebody decided to bring all of this together. One system. One schema. One canonical definition of a person. Every bank, employer, doctor, supermarket, and phone provider reading and writing the same record.

You can almost feel the design meeting stretching into its third month.

Suddenly every field is important to somebody. Every change requires negotiation. Every team argues about ownership. The model grows larger, more complicated, and less useful to everyone involved.

Outside software, this sounds ridiculous. Inside software, we build versions of it all the time.

This is the first post in a series walking through OmNomNom, a demo I built because I wanted to make service boundaries visible in code. Before any of the implementation makes sense, I need to explain what I mean by *service boundary*, because most of the time when developers and architects use that phrase, we are not talking about the same thing.

## The word "service" is doing too much work

When somebody says "service", they could mean almost anything. A microservice. A WCF service. A Windows service. The Service layer in a layered architecture. A REST endpoint. A team. The thing the platform team calls a service on their deployment dashboard.

Don't you love that you can use the same word everywhere and have it mean something different each time?

The result is that two architects can spend an hour agreeing about services while talking about completely different things. So let me pin it down.

For this series, when I say *service boundary*, I mean the logical boundary around a service's authority. It is not a process. It is not a unit of deployment. It is not a component, a project, or something you can point at in your favourite IDE.

A service is the technical authority for a business capability. It owns a set of related business decisions, the information needed to make those decisions, and the rules about what information is allowed to cross its boundary.

That last part matters. If every piece of information can cross the boundary freely, there is no meaningful boundary. There is only a shared model spread across multiple codebases, which is like a monolith but with more network calls.

Boundaries are not walls, though. Nothing useful gets built if every part of the system is completely isolated from every other part. Some information has to cross. The trick is deciding which information is stable enough, small enough, and boring enough to be shared without dragging the rest of the model along with it. Otherwise we run into the risk that decision-making will flow with it.

The bank, the doctor, and the employer can all agree they are talking about the same person without agreeing on what a person looks like.

That distinction is where the interesting part starts.

## Nouns, verbs, and authority

The naive way to grow a monolith is "one table, one screen, one controller, one team". Everybody can read every table because it's all one database. Every team writes to every table because there is no boundary stopping them. Every change touches three teams because every screen reads from every table.

Eventually somebody says "we should split this into microservices", and the question becomes *how*. The answer almost always falls into one of two traps.

### Splitting by noun

The first is splitting by **noun**. Customer service, Order service, Product service, Inventory service. One service per entity on the whiteboard.

Congratulations. You've reinvented the monolith and distributed it across a network.

What you've really done is shard the CRUD database across processes. The decisions did not move. You just spread the same coupling across a network. Every cross-cutting screen now needs to fan out calls to four services and assemble the answer somewhere else.

Splitting by noun is splitting by data shape, and data shape is not where the coupling lives.

### Splitting by verb

The second trap looks more sophisticated. It's splitting by **verb**. Order Processing service. Returns Handling service. Onboarding service.

Verbs feel closer to what the business actually does, which is why this one is tempting. The problem is that verbs in a domain model *are* the coupling. Every verb ties nouns together. An Order has a Customer. A Product has a Price. A Customer earns a Discount. The verbs are the lines between the boxes on the diagram, the connective tissue that makes the picture busy in the first place.

When you cut your services along verbs, you are cutting along the coupling and then calling the result a boundary. The verb did not break the coupling. The verb was the coupling.

### Splitting by authority

What actually works is splitting by authority. Not "who holds the data". Not "who runs the workflow". Who gets to decide.

Which part of the business is allowed to say what something costs? Who decides whether an address is deliverable? Who is allowed to declare a product trending?

A service is not a single decision. It is the technical authority for a business capability. It owns a set of related business decisions, plus the information needed to make those decisions.

## The diagrams skip the part that matters

Here is something I see over and over. An architect draws a diagram. Boxes are nouns: Customer, Order, Product. Arrows are verbs: places, contains, ships.

```d2 theme=200 hide-class-markers
# Dark theme for two-tone class boxes; page-matched canvas; white connections and labels
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

Customer: {
  shape: class
  " ": ""
  "  ": ""
}

Order: {
  shape: class
  " ": ""
  "  ": ""
}

Product: {
  shape: class
  " ": ""
  "  ": ""
}

Shipment: {
  shape: class
  " ": ""
  "  ": ""
}

Payment: {
  shape: class
  " ": ""
  "  ": ""
}

Customer -> Order: places
Customer -> Payment: uses
Order -> Product: contains
Order -> Shipment: ships via
Order -> Payment: paid by
```

The diagram gets handed to a development team. The team has to turn each box into a class, and a class needs properties, and nobody has talked about properties yet.

So the developers guess. They look at the screens, they look at the database, they stuff every property that mentions "Product" onto the Product class. The diagram doesn't object, because the diagram never had an opinion about properties in the first place.

But the properties are exactly where the decisions live.

The name on a product is a Catalog decision. The price is a Finance decision. The popularity is a Marketing decision. Three properties. Three authorities. Three boundaries.

Architects tend to spend their time on the boxes and arrows because that's where the diagram lives. But the properties are doing more work than the boxes are. They're where the authority actually attaches.

That's why "nobody owns Product" is the right answer.

Catalog owns the name, image and description. Finance owns the price and the billing rules. Marketing owns the popularity and what shows up on the homepage. Same conceptual thing. Three different sets of properties. Three different authorities.

Those boundaries still need enough shared context to line up. Otherwise Catalog, Finance, and Marketing are not talking about the same thing at all. But that shared context should be the smallest, least volatile thing that can do the job. Enough to say "this is the same thing", not enough to smuggle the entire Product model across the boundary in a fake mustache.

That is the trick.

Share enough information to establish context. Keep decision-making authority where it belongs. And that's the thing most discussions about service boundaries miss. We start by asking where the data belongs. We should be asking who gets to decide.

In the next post, I'll give an example of how service boundaries are formed, and then show how those boundaries appear in OmNomNom.

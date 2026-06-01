---
id: 20260530
author: Dennis van der Stelt
title: Finding service boundaries is not a naming exercise
description: Service boundaries are not named into existence. They are discovered by asking who actually gets to decide, what handoffs exist, and where authority quietly leaks.
pubDate: '2026-05-30T01:00:00'
image: /images/2026/finding-service-boundaries.png
topic: omnomnom
tags:
  - distributed systems
  - microservices
  - service boundaries
  - architecture
  - omnomnom
---
I once worked with a company where Sales said they were responsible for almost everything.

They owned the customer relationship. They negotiated deals. They understood the market. They knew what customers were willing to pay. If you asked Sales who decided a product's price, the answer would be obvious.

Sales did.

Then I spoke to Finance, and Finance had a slightly different version of reality. Finance knew how Sales worked. Sales would take the cost price Finance gave them and add a certain percentage on top. So when Finance thought a product should have a better margin, they quietly adjusted the cost price before giving it to Sales.

Sales thought they owned the price.

Finance had found a more creative answer.

And now the interesting question is not "where does price live?" The interesting question is "who actually has authority over price?"

That is why finding service boundaries is not a naming exercise. You are not looking for nouns on a whiteboard. You are not looking for the department with the loudest opinion. You are looking for authority. Who is allowed to make a decision? Who influences it? Who can override it? Who has built a workaround because the official process was apparently designed during a particularly optimistic workshop?

In the previous post, I argued that service boundaries are about authority. Not databases, deployments, projects, or teams, but the part of the business that gets to make a set of related decisions.

That still leaves the annoying question: how do you find them?

## Start without computers

A useful trick is to imagine the business without software. Not because paper is better. Paper is terrible. That is why we invented databases and then immediately started abusing them.

But without software, the handoffs become visible. One department receives an order. Someone decides whether it can be accepted. A note goes to another department to bill the customer. After billing, the warehouse is told what needs to be shipped. If there is a problem with the address, someone has to decide whether delivery is still possible.

Those notes, handoffs, policies, and exceptions are clues. They tell you where one part of the business stops making decisions and another part starts.

In a real organization, this means talking to people who understand the business. Not just one person, and definitely not only the person with the nicest diagram. Talk to Sales, Finance, Operations, Support, and the people who know where the official process breaks down every Thursday afternoon because "that's just how it works".

Those conversations are where the boundaries start to appear.

## Ask who gets to decide

The questions are not "where is the data stored?" or "which screen needs this field?" Those questions matter eventually, but they are not where service boundaries come from. They are implementation questions. Useful, but too late.

The better questions are more annoying. Who decides what something costs? Who decides whether a customer is preferred? Who decides whether an address is deliverable? Who decides whether a product is popular? Who decides whether payment information is acceptable?

The answers are not always clean. Sometimes two departments both think they own the same decision. Sometimes nobody owns it. Sometimes a spreadsheet named `FinalPrices_v7_really-final.xlsx` owns it, which is always reassuring. But those conversations are the work.

A service is not a single decision. A service is the technical authority for a business capability. It owns a coherent set of related business decisions, plus the information needed to make those decisions.

So when you ask "who gets to decide?", you are not trying to create one service for every answer. That way lies madness, and probably Kubernetes. You are looking for clusters. Which decisions use the same language? Which decisions change for the same business reason? Which decisions are made by the same people? Which rules are so tightly related that separating them would create constant negotiation?

That is where a service boundary starts to form.

## Do not name services too early

The fastest way to ruin this exercise is to start with names like Product service, Customer service, Inventory service, or Order service.

Those names feel useful because everyone recognizes them. That is exactly the problem. Names are sticky. Once you call something Product, every property that mentions a product starts to look like it belongs there. Once you call something Inventory, every stock-related rule gets pulled toward it. Once you call something Customer, half the organization suddenly wants to store its data there because, technically, a customer was involved.

Congratulations. You have not found a boundary. You have created a gravity well.

Use boring names at first. Service A, Service B, Blue, Green, or That Weird One In The Corner. The name comes later, after you understand the authority.

This feels silly, but it helps. A meaningless name prevents you from smuggling assumptions into the design too early. It forces you to keep asking which decisions belong together, rather than arguing whether some field "sounds like" it belongs in Product.

## Look for cohesion, not size

A common reaction to this way of thinking is to split too much. If service boundaries are about decisions, and every business has lots of decisions, should we create lots of services?

Please don't.

The goal is not to create as many services as possible. The goal is to find cohesive authority. A service should own a set of related decisions that belong together because they change together, use the same language, and are governed by the same part of the business.

That usually means the boundaries are larger than people expect. In many systems, you may end up with four, five, maybe eight meaningful service boundaries. Not forty. If you split highly cohesive decisions apart, you do not get decoupling. You get paperwork with an API.

And yes, there are no solutions, only trade-offs.

A boundary that is too large becomes a dumping ground. A boundary that is too small creates constant negotiation. The trick is finding the point where decisions within the boundary are strongly related, and decisions outside the boundary can evolve without everyone having to hold a meeting every time a property changes.

Which is, admittedly, less catchy than "just make everything a microservice".

## Share as little as possible

There is one trap I want to avoid before we get to OmNomNom. When we say that data should not cross service boundaries, that is still the right instinct.

The less information crosses a boundary, the more freedom each service has to make its own decisions. That is how we get high cohesion and low coupling. If Finance needs Catalog's private product model to calculate a price, or Shipping needs Finance's pricing rules to decide whether something can be delivered, the boundary is probably wrong. Authority has leaked.

But there is always some coupling. Otherwise the services have no idea they are talking about the same customer, order, or product.

The kind of information that can safely cross a boundary is the boring stuff. Stable identifiers. Things with no business rules attached to changing them, because they basically do not change. There is no business rule that says "this customer has 100 orders, so we now need to create new identifiers for the previous orders". There is no rule that says "this item went out of stock, so it needs a new identifier". Each service can safely assume those identifiers keep pointing at the same thing.

That is also why meaningful identifiers are dangerous. An order number should not contain the year, the month, the customer number, or some clever sequence that increments per customer. Clever identifiers invite clever interpretations. If a customer sees order 2026-001 and 2026-003, they will ask what happened to 2026-002. Congratulations, your identifier has become a business process.

Inside a system, the same problem appears. If an identifier carries meaning, some service will eventually depend on that meaning. At that point you are no longer sharing identity. You are sharing business data while wearing a fake mustache.

So the rule is not "share whatever is convenient". The rule is the opposite.

Share almost nothing.

When you must share something, prefer the smallest, least volatile, least meaningful thing that can establish context. Enough to say "we are talking about the same thing", but not enough to make everyone agree on what that thing looks like.

## Boundaries are discovered

Finding service boundaries is not something you do by staring at a database schema until enlightenment happens.

You talk to people. You follow handoffs. You ask who decides. You look for rules, policies, exceptions, and workarounds. You avoid naming services too early. You cluster decisions that belong together. You keep testing whether information crosses because it should, or because authority is leaking.

That is the real work.

In the next post, I will use OmNomNom as an example and show how those questions led to Catalog, Finance, Marketing, Shipping, and PaymentInfo.

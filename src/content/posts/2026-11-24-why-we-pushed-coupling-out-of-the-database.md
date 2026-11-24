---
id: 20261124
author: Dennis van der Stelt
title: Why we pushed coupling out of the database
description: OmNomNom gained projects, composition handlers, and microviews just to show some beers. Looking back at the hidden coupling we wanted to avoid, the tradeoffs we made, and when this architecture earns its keep.
pubDate: '2026-11-24T01:00:00'
topic: omnomnom
tags:
  - distributed systems
  - microservices
  - service boundaries
  - software architecture
  - technical debt
  - omnomnom
---
We have spent three posts getting a beer onto a screen.

There are separate schemas, composition components, events for building lists, and UI components belonging to different services. There is a CompositionGateway that hosts components it does not own, and a Website that does the same thing in the browser.

If you are looking at all of that and thinking "I could have done this with a query and a page", you are probably right.

So before we follow the customer into checkout, I want to look back at why we did this exercise. The point was never to find the shortest way to display a beer. It was to explore what happens when we give business decisions clear owners, and keep following those boundaries through the implementation.

The reason I care about that is unintended coupling. The kind that makes a small change surprisingly difficult, especially in a system that has been growing for years.

## The technical debt that keeps coming back

Most of us have worked on a system where changing one thing means understanding several other things first. A property looks unused, but removing it breaks a report. A status change affects a workflow in another part of the application. A new pricing rule requires changes in code that supposedly only deals with products.

We call it technical debt. We clean up classes, extract methods, improve names, and sometimes replace an entire framework. Those changes can help, but the next feature still needs knowledge from half the application.

Some of that debt survives because we keep improving the code inside boundaries that were never right in the first place. We make a shared Product model nicer without questioning why pricing, stock, descriptions, and popularity all have to agree on that model.

Unclear boundaries are not the cause of every maintenance problem. But when different business decisions are tangled together, tidying up the implementation leaves the underlying dependency in place.

And some of the worst of it is already there before we open a C# file.

## The coupling hiding in the database

A database diagram shows relationships. Foreign keys are helpful because at least they tell us that one row depends on another.

There are also relationships that the diagram does not show. If a column in one table has the value `2`, a column in another table must not have the value `A`. Perhaps a handler enforces that rule. Perhaps several handlers each enforce part of it. Perhaps it is something you learn after breaking production once.

The dependency exists whether the database declares it or not.

Now imagine years of those rules accumulating around a shared model. To change one value safely, you need to understand what it means elsewhere. To retrieve something useful, you need to reconstruct it from a collection of tables that were designed around everyone who ever needed a piece of it.

Before I started practicing this architectural style, I was used to queries with six or more joins. Writing the query was only part of the work. I needed the context behind those tables: which statuses mattered, which relationships were optional, and which apparently unrelated values changed the meaning of the result.

The biggest revelation for me was how much simpler those queries became once I started finding clearer service boundaries. There were fewer things to join, because the model inside a boundary no longer had to describe everything the rest of the system knew about the same real-world thing.

Joins and foreign keys are useful inside a boundary. Counting them is not a way to discover an architecture. What changed was how much unrelated business knowledge I needed to retrieve and use the data.

If the rule about `2` and `A` is a genuine business invariant that must always hold together, we need to understand who owns it. Splitting those values into different schemas would not solve the problem. We might have found information that belongs inside the same boundary. We cannot turn a real dependency into independence by moving its columns.

## What changed in OmNomNom

At the start of the series, we questioned whether there should be one Product that everyone shares. We eventually gave Catalog the beer's descriptive information, Finance its pricing information, and Marketing its popularity information.

That decision changed what each service needed to know.

Finance can retrieve a price without understanding beer styles, images, or ratings. Catalog can describe a beer without understanding discounts. They share a product identifier so their contributions can refer to the same beer, but they do not need a shared entity containing all of those meanings.

The customer still needs the information together. We moved the point where it comes together out of a shared database model and into composition.

In [the product page post](/2026/11/03/one-product-page-three-services/), the URL supplied the identifier and the services retrieved their contributions independently. In [the list post](/2026/11/04/composing-product-lists-with-servicecomposer/), Catalog first selected the products and made their identifiers available for other contributors. Each service still queried its own information.

The dependency on the selected set did not disappear. We made it explicit as a composition event, with a much smaller agreement than a shared model of everything a product can be.

The gateway hosts that cooperation through ServiceComposer. It does not contain a controller that knows how Finance calculates prices or how Marketing determines popularity.

This is what I mean by pushing coupling up. The services still have relationships and contracts. But we bring their contributions together near the point where someone needs them, while keeping the business knowledge behind those contributions with its owner.

## All the way into the UI

In [the previous post](/2026/11/05/service-boundaries-in-the-ui/), we continued into the browser. Finance supplied the price component, Marketing the rating component, and Catalog the description and stock components. Branding arranged and bound those components into a page.

That last step matters. Otherwise we could separate everything on the backend and then put all the knowledge back together in a frontend that understands everybody's rules.

Somewhere, the information does need to become one website. The customer should see a beer they can buy, without needing to understand our service boundaries. Branding provides that coherent experience while the business services own their contributions.

The same applies to an API for an external system. We cannot expect every consumer to adopt our internal boundaries and reconstruct an interaction by calling all our services individually. We can provide a useful external contract and handle its composition and binding at the edge of our system.

The coupling there is deliberate: which inputs a component accepts, which fields a response exposes, and how contributions are brought together. That is much easier to reason about than business assumptions scattered through tables, queries, and unrelated code.

## Where I used to stop

I have not always taken this as far as we did in OmNomNom.

In earlier systems, I often stopped at ViewModel composition. The services supplied their own data, and then I assembled the UI as a more conventional website. I did not maintain microviews along the same boundaries.

Part of that was personal. I am not someone who wants to dive deeply into frontend frameworks, CSS, and everything involved in maintaining a component structure across many pages. Stopping at the composed response was a tradeoff I was willing to make.

It meant fewer view files and a simpler frontend structure, with more coupling between the HTML and the information being displayed. The UI needed more knowledge than it would have needed with service-owned microviews. For those systems, I accepted that cost.

These days, AI makes me more inclined to continue those boundaries into the UI. It can help me work through the CSS, find repeated presentation code across pages, and identify components that can be reused. It helps me keep track of a part of the application that I have never particularly enjoyed keeping track of myself.

I still need to decide who owns the behavior and review whether the implementation respects that decision. But the practical effort of building and maintaining the microviews feels different to me now.

The useful lesson from OmNomNom is not that you must adopt every component we created. It is to understand where you stop, and what knowledge gets coupled together beyond that point. Even when I stopped before microviews, getting that coupling out of the database and the underlying business models was already a substantial improvement.

## You do not need to be Amazon

I once heard someone say that this kind of architecture is only necessary for websites the size of Amazon. I sincerely disagree.

The question I would ask is how long the system needs to remain maintainable. If I expect an application to be developed and maintained for at least a decade, I take these boundaries seriously. You do not need millions of users to accumulate ten years of business rules.

Over those years, new functionality arrives, people leave, and assumptions get forgotten. Every unintended dependency makes the next change a little harder. Clear boundaries give those changes somewhere to belong and limit how much of the system needs to understand them.

The boundaries themselves should be relatively stable. Moving responsibilities between services repeatedly is expensive, because their data, contracts, and consumers have to move with them. That is why we spent time discovering authority before writing composition handlers.

Relative stability does not mean business rules stop changing. Businesses have been selling products, determining prices, taking payments, and delivering goods for a very long time. Their policies and tools have changed enormously. The underlying responsibilities are often recognizable across those changes.

The exact boundaries still depend on the company. Two retailers can organize authority differently. A major change in the business can require a change in boundaries too. But a new discount policy should usually fit inside an existing pricing responsibility, rather than force us to redraw the whole architecture.

## An existing system gives you evidence

If your system has no clear service boundaries today, it is not too late to start thinking about them.

In one respect, you have an advantage. After years of development, you know more about the domain than you did at the start. You have examples of rules that change together, features that repeatedly require coordination, and places where one shared model is trying to serve different purposes. The people maintaining and using the system can help explain why.

A greenfield project can have knowledgeable people too, but it does not yet have that history of actual changes and their consequences. Some of what looks like a good boundary is still a hypothesis.

The difficulty in an existing system is acting on what you discover. You have years of code, data, integrations, and assumptions to untangle while continuing to deliver working software. In a substantial system, that can take many years and careful planning.

Finding a boundary and moving everything behind it are different pieces of work. You can begin by identifying the owner of a decision, making dependencies visible, and keeping the next change from adding another dependency in the wrong direction. Then plan the separation in steps that the system and its teams can sustain.

The value of understanding the boundaries starts before you have finished extracting them. A rewrite does not have to be the price of admission.

## Where I would not start this way

A startup still trying to discover its business is a different situation. The uncertainty is about what problem it solves, who will pay for it, and how it will make money. The responsibilities we want to give stable boundaries may change considerably as those answers change.

My advice is to avoid committing to this full architectural style at that stage. Learn the business first and keep the implementation easy to change. Otherwise you can spend a great deal of effort maintaining separations around assumptions that do not survive the next change in direction.

Trust me. I have tried it. It hurts.

For OmNomNom, we deliberately carried the exercise from data ownership through composition and into the UI. That made the extra projects and files visible. The dependencies they help us avoid are much less visible, especially in a small demo where we can still remember every rule.

What I wanted to show is where that complexity can live. Inside each boundary, we work with a smaller model and a clearer responsibility. At the edge, we bring contributions together for a customer or an API consumer. The system still cooperates, but fewer parts need to know how the others work.

With that reasoning in place, we can follow the customer into checkout. This time the services will collect their own information before there is a completed order, and we will see how those same ownership decisions guide the write side of the system.

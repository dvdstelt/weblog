---
id: 20260604
author: Dennis van der Stelt
title: Finding OmNomNom's service boundaries
description: Walking OmNomNom through the questions from the previous post and landing on five boundaries that are nothing like Product, Order, Customer, and Payment.
pubDate: '2026-06-04T01:00:00'
image: /images/2026/omnomnom-services.png
topic: omnomnom
tags:
  - distributed systems
  - microservices
  - service boundaries
  - architecture
  - omnomnom
---
In the previous post, I wrote about how to find service boundaries. Not by naming nouns, not by drawing entities, and definitely not by creating a service every time a property looks lonely.

In this post, I want to do that for OmNomNom.

### What is OmNomNom

OmNomNom is a demo webshop I built. Initially I wanted to incorporate the check out process of the largest e-commerce retailer in the world, but when I started thinking which products I wanted to add, I decided to focus the website around craft beer. Not that the product itself has had any influence on the final solution, I just thought it would be nicer than toilet paper or e-readers.

The website is supposed to be an example on how to find service boundaries and I want to show how to implement them. Because I can be very hand-wavy when talking about service boundaries. This is proven by the fact I already spend two posts on it in the series without going in depth in the demo project.

This is where I should probably say that in a real project, I would talk to domain experts, compare viewpoints, look for disagreements, follow handoffs, and spend a lot more time discovering where the business decisions actually live.

For OmNomNom, the domain expert is me.

I like beer.

Clearly we are in safe hands.

More seriously, this is not meant to be a perfect model for every webshop. The boundaries I found for OmNomNom can be wildly different from the boundaries in another e-commerce system. A similar webshop selling beers, one selling books, and one selling prescription medicine may all have products, orders, payments, and shipping. That does not mean they have the same or even similar service boundaries as OmNomNom.

The point is not to copy the result. The point is to show the thinking.

## Start with the product page

The front page of OmNomNom shows beers. Each beer has a name, description, brewery, image, beer style, rating, price, discount, stock information, and probably a few other things I forgot because demos have a habit of growing while nobody is watching.

The naive move is to put all of that in a Product service.

That would be convenient. It would also be exactly the thing I argued against in the first post.

So instead of asking "what belongs to Product?", I want to ask a different question: which decisions are being made here, and which of those decisions belong together?

The name, description, image, brewery, and beer style feel like one cohesive set. They describe how the beer appears in the catalog. They are usually created together, reviewed together, and changed for similar reasons. If the brewery name changes, we upload a better product image, or we correct the style from Porter to Stout after someone sends us a strongly worded email, that has nothing to do with the price of the beer or whether it is currently popular.

There may be more complexity hiding here in a real system. Images might go through an approval workflow. Brewery information might have rules around suppliers. But in OmNomNom, I have no reason to split those apart.

So for now, those properties go into Service A.

```d2 small theme=200 hide-class-markers
# Dark theme for two-tone class boxes; page-matched canvas; white connections and labels
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Service A": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
}
```

I am deliberately not naming it yet as explained in [the previous post](/2026/06/02/finding-service-boundaries-is-not-a-naming-exercise/). At this stage I want the boundary to earn its name.

## Price is not product information

Price and discount are different.

A beer's name can stay the same while the price changes every week. The description does not care whether there is a discount. The image does not care whether we are running a promotion. It might feel as if beer style has some loose correlation with price because stouts are often more expensive than lagers, but that is not the same as business rules. Correlation is not a boundary. It is barely even an architecture diagram.

Price and discount influence each other directly. If we calculate the amount to charge for an order line, both matter. A discount changes the billable amount. A price change changes the billable amount. Those decisions belong together.

So price and discount go into Service B.

```d2 medium theme=200 hide-class-markers
# Dark theme for two-tone class boxes; page-matched canvas; white connections and labels
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Service A": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
}

"Service B": {
  shape: class
  "**Product Identifier**"
  "Price"
  "Discount"
}
```

This is also where we start seeing the need for shared context. Service A knows how to present the beer. Service B knows what it costs. They still need to agree that they are talking about the same beer.

That does not mean Service B needs the product name, description, image, brewery, and beer style. It only needs the smallest stable thing that identifies the product. In OmNomNom, that is the product identifier.

That identifier is boring on purpose. It should not contain the year, the beer style, the brewery, or some clever sequence that invites interpretation later. It just identifies the thing. The less meaning it has, the less likely another service will build business rules on top of it.

A boring identifier is a feature. I know, contain your excitement.

## Popularity is its own decision

The beer also has a rating and a number of ratings, coming from [Untappd](https://untappd.com/). At first glance, this looks like product information. It appears on the product card, so surely it belongs with the product.

But screens are terrible at finding boundaries. A screen shows information from multiple places. That does not mean the information belongs together.

The interesting part is not the rating itself. The interesting part is what the business might do with it. If OmNomNom wants to sort products by popularity, highlight trending beers, or promote beers that are getting attention, those are marketing decisions. They are not catalog decisions and they are not pricing decisions.

So rating and popularity-related information go into Service C.

```d2 theme=200 hide-class-markers
# Dark theme for two-tone class boxes; page-matched canvas; white connections and labels
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Service A": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
}

"Service B": {
  shape: class
  "**Product Identifier**"
  "Price"
  "Discount"
}

"Service C": {
  shape: class
  "**Product Identifier**"
  "Untappd rating"
  "Untappd Check Ins"
}
```

Could I later discover that this belongs with Service A? Sure. This is a demo, not scripture. But for now, there is enough of a separate decision-making area to keep it apart.

## An order is not one thing either

Eventually someone buys beer. That gives us an order.

Again, the naive move is to create an Order service. And again, that is probably just hiding the real decisions under a familiar noun.

To calculate what the customer should pay, Service B needs to know which products were ordered, the quantity that should be billed, and the price that applies. The fact that the price may be made up of a base price and a discount is internal to Service B. Other services do not need to know how Finance got there. They need the result only when it is explicitly shared.

So Service B stores the order information it needs to calculate the total.

```d2 theme=200 hide-class-markers
direction: down
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Service A": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
}

"Service B": {
  shape: class
  "**Product Identifier**"
  "Price"
  "Discount"
  " "
  "**Order Identifier**"
  "Product Identifier "
  "Price "
  "Billable Quantity"
}

"Service C": {
  shape: class
  "**Product Identifier**"
  "Untappd rating"
  "Untappd Check Ins"
}
```

But stock is a different kind of decision. If we take items from stock, we need to know how many are available, how many were ordered, and whether we can promise delivery. In a real system this can become wonderfully complicated. There is stock on hand, incoming stock, reserved stock, available stock, available to promise, and probably one more term invented by someone who enjoys spreadsheets a little too much.

For OmNomNom, I kept this much simpler. I only care about what is in stock and how many items were ordered. For demo purposes, I put that stock-related information in Service A together with the catalog information.

```d2 theme=200 hide-class-markers
direction: down
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Service A": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
  "In Stock"
  " "
  "**Order Identifier**"
  "Ordered Quantity	"
}

"Service B": {
  shape: class
  "**Product Identifier**"
  "Price"
  "Discount"
  " "
  "**Order Identifier**"
  "Product Identifier "
  "Price "
  "Billable Quantity"
}

"Service C": {
  shape: class
  "**Product Identifier**"
  "Untappd rating"
  "Untappd Check Ins"
}
```


That is not because stock and catalog are always the same service boundary. They are not. It is a deliberate simplification for the demo. A real webshop may easily have a separate capability around stock, warehouse, or availability.

This is an important point. Service boundaries are not discovered by applying universal rules. They are discovered by understanding authority in a specific business.

## Billable quantity and ordered quantity

This is also where the difference between similar-looking properties becomes important.

It is tempting to say that `BillableQuantity` and `OrderedQuantity` are the same thing. After all, the customer ordered three bottles and we billed three bottles. Why not just call it `Quantity` and be done with it?

Because they answer different questions.

Service B cares about the quantity used to calculate the amount to charge. Service A cares about the quantity used to reduce stock or determine availability. In the simple case, those values are the same. But they do not have the same meaning, and they do not belong to the same authority.

That distinction matters because systems do not stay simple just because we named a property nicely.

Maybe one bottle breaks before shipping. Maybe one item is replaced. Maybe a customer is billed for a bundle but the warehouse picks individual items. Maybe stock reservation and invoicing happen at different times. The moment those rules appear, the fake shared `Quantity` starts causing pain.

Same value is not the same as same meaning.

## Billing address and shipping address

Addresses make this even clearer.

On the OmNomNom website, the user enters an address and can indicate that the billing address and delivery address are the same. From a user interface perspective, that is helpful. Nobody wants to type the same address twice unless a form designer needs to be punished.

But the checkbox is a convenience, not a domain model.

Service B needs a billing address for invoices. However the delivery address doesn't belong into any existing service yet, so let's create Service D. Most of the time, those addresses contain the same street, postal code, and city. That does not make them the same information.

```d2 theme=200 hide-class-markers
direction: down
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Service A": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
  "In Stock"
  " "
  "**Order Identifier**"
  "Ordered Quantity	"
}

"Service B": {
  shape: class
  "**Product Identifier**"
  "Price"
  "Discount"
  " "
  "**Order Identifier**"
  "Product Identifier "
  "Price "
  "Billable Quantity"
  "Billing Address"
}

"Service C": {
  shape: class
  "**Product Identifier**"
  "Untappd rating"
  "Untappd Check Ins"
}

"Service D": {
  shape: class
  "**Order Identifier**"
  "Shipping address"
}

# Invisible edges to push Service D into a row below the existing three.
# ELK only stacks disconnected nodes; with these the engine treats D as
# downstream of A, B, and C and places it under them.
"Service A" -> "Service D": {style.opacity: 0}
"Service B" -> "Service D": {style.opacity: 0}
"Service C" -> "Service D": {style.opacity: 0}
```

A customer might call and ask us to correct the billing address on an invoice. That should not automatically change the delivery address of an order that is already being delivered. Or the delivery address might need a small delivery instruction that has no place on an invoice.

So when the customer says "use the same address", OmNomNom can submit that address to both services. That is not accidental duplication. It is two different services receiving the information they need for two different decisions.

Service B owns the billing address.

Service D owns the shipping address.

Same characters. Different meaning. Different authority.

## Delivery options have two sides

Delivery options are another nice example because they look like one thing until you ask who decides what.

We should provide a list of delivery options to the user. If the delivery address is local, maybe the customer can choose slow, fast, or next-day delivery. If the delivery address is outside the country, next-day delivery may not be possible and different options apply. Since we base this on the delivery address, Service D should likely own that decision, so it can connect the delivery constraints to the delivery address.

```d2 theme=200 hide-class-markers
direction: down
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Service A": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
  "In Stock"
  " "
  "**Order Identifier**"
  "Ordered Quantity	"
}

"Service B": {
  shape: class
  "**Product Identifier**"
  "Price"
  "Discount"
  " "
  "**Order Identifier**"
  "Product Identifier "
  "Price "
  "Billable Quantity"
  "Billing Address"
}

"Service C": {
  shape: class
  "**Product Identifier**"
  "Untappd rating"
  "Untappd Check Ins"
}

"Service D": {
  shape: class
  "**Delivery Option Identifier**"
  "Type"
  "Description"
  "International"
  " "
  "**Order Identifier**"
  "Shipping address"
}

"Service A" -> "Service D": {style.opacity: 0}
"Service B" -> "Service D": {style.opacity: 0}
"Service C" -> "Service D": {style.opacity: 0}
```

But delivery options also have prices.

The price of a delivery option belongs with Service B, because it needs to calculate the order total. Serivce B may also decide that delivery is free when the order total is above a certain amount. Service D does not need to know why Service B made one delivery option free. Service D only needs to know which delivery option the customer selected and whether that option is available for the destination.

```d2 theme=200 hide-class-markers
direction: down
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Service A": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
  "In Stock"
  " "
  "**Order Identifier**"
  "Ordered Quantity	"
}

"Service B": {
  shape: class
  "**Product Identifier**"
  "Price"
  "Discount"
  " "
  "**Order Identifier**"
  "Product Identifier "
  "Price "
  "Billable Quantity"
  "Billing Address"
  "Delivery Option Identifier"
  "  "
  "**Delivery Option Identifier**"
  "Price  "
}

"Service C": {
  shape: class
  "**Product Identifier**"
  "Untappd rating"
  "Untappd Check Ins"
}

"Service D": {
  shape: class
  "**Delivery Option Identifier**"
  "Type"
  "Description"
  "International"
  " "
  "**Order Identifier**"
  "Shipping address"
}

"Service A" -> "Service D": {style.opacity: 0}
"Service B" -> "Service D": {style.opacity: 0}
"Service C" -> "Service D": {style.opacity: 0}
```

So the delivery option exists in two services.

- Service D knows the delivery option as something that can or cannot be used for an address.
- Service B knows the delivery option as something that contributes to the order total.

Those are not competing definitions. They are two partial models of the same real-world thing, each owned by a different authority.

This is exactly the point from the first post. The goal is not to create one perfect definition of DeliveryOption. The goal is to avoid needing one.

## Payment information stands apart

OmNomNom is a demo, so payment information is intentionally simple. The database is seeded with credit card information for the single user that can access the website. There are no screens for adding cards, validating them, replacing them, or going through all the real-world pain payment systems usually involve.

Even then, the information needs to belong somewhere.

It might be tempting to put credit card information into Service B because it already deals with financial information. But that is the wrong question. The question is not whether both things sound financial. The question is whether they are part of the same authority.

Credit card information does not help decide the price of a product. It does not help calculate a discount. It does not influence the price of delivery. It is not modified together with product prices or billing rules.

So it does not belong in Service B.

There is another reason to keep it separate: security. Payment information often has stricter access rules, stricter auditing, and stricter operational requirements than the rest of the system. That alone can be a valid reason to keep the authority small and explicit.

```d2 theme=200 hide-class-markers
direction: down
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Service A": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
  "In Stock"
  " "
  "**Order Identifier**"
  "Ordered Quantity	"
}

"Service B": {
  shape: class
  "**Product Identifier**"
  "Price"
  "Discount"
  " "
  "**Order Identifier**"
  "Product Identifier "
  "Price "
  "Billable Quantity"
  "Billing Address"
  "Delivery Option Identifier"
  "  "
  "**Delivery Option Identifier**"
  "Price  "
}

"Service C": {
  shape: class
  "**Product Identifier**"
  "Untappd rating"
  "Untappd Check Ins"
}

"Service D": {
  shape: class
  "**Delivery Option Identifier**"
  "Type"
  "Description"
  "International"
  " "
  "**Order Identifier**"
  "Shipping address"
}

"Service E": {
  shape: class
  "**CreditCard Identifier**"
  "CardHolder"
  "Last Digits"
  "Expiry Date"
  "Token"
}

"Service A" -> "Service D": {style.opacity: 0}
"Service B" -> "Service D": {style.opacity: 0}
"Service C" -> "Service E": {style.opacity: 0}
```

So payment information becomes Service E.

## Finally naming the services

Only now do I want to name the services.

Service A became Catalog. It owns product information such as name, description, image, brewery, and beer style. For demo purposes, it also owns the simplified stock information.

Service B became Finance. It owns prices, discounts, billable quantities, delivery prices, billing addresses, and the rules needed to calculate the order total.

Service C became Marketing. It owns popularity-related information, such as ratings and the decisions that help promote certain products.

Service D became Shipping. It owns shipping addresses, delivery options, and the rules that decide which delivery options are available.

Service E became PaymentInfo. It owns credit card information and keeps that sensitive part of the system isolated from the rest.

```d2 theme=200 hide-class-markers
direction: down
style.fill: "#16151F"
(* -> *)[*].style.stroke: "#FFFFFF"
(* -> *)[*].style.font-color: "#FFFFFF"

"Catalog": {
  shape: class
  "**Product Identifier**"
  "Name"
  "Description"
  "Brewery"
  "Image"
  "Beer Type"
  "In Stock"
  " "
  "**Order Identifier**"
  "Ordered Quantity	"
}

"Finance": {
  shape: class
  "**Product Identifier**"
  "Price"
  "Discount"
  " "
  "**Order Identifier**"
  "Product Identifier "
  "Price "
  "Billable Quantity"
  "Billing Address"
  "Delivery Option Identifier"
  "  "
  "**Delivery Option Identifier**"
  "Price  "
}

"Marketing": {
  shape: class
  "**Product Identifier**"
  "Untappd rating"
  "Untappd Check Ins"
}

"Shipping": {
  shape: class
  "**Delivery Option Identifier**"
  "Type"
  "Description"
  "International"
  " "
  "**Order Identifier**"
  "Shipping address"
}

"PaymentInfo": {
  shape: class
  "**CreditCard Identifier**"
  "CardHolder"
  "Last Digits"
  "Expiry Date"
  "Token"
}

"Catalog" -> "Shipping": {style.opacity: 0}
"Finance" -> "Shipping": {style.opacity: 0}
"Marketing" -> "PaymentInfo": {style.opacity: 0}
```

These names are not magic. They are labels for the authority we discovered. If we had started with the names, we would probably have made different assumptions and pushed properties into places where they sounded right instead of where they belonged.

That is the danger of naming too early.

## The boundaries are the point

OmNomNom ended up with five service boundaries: Catalog, Finance, Marketing, Shipping, and PaymentInfo.

That does not mean every webshop should have those five boundaries. It does not even mean OmNomNom would keep exactly those boundaries if it grew into a real business. More complexity could reveal a separate Stock service. Marketing could collapse into Catalog. PaymentInfo could become more sophisticated. Shipping could turn into several capabilities if delivery became the interesting part of the business.

There is no one-size-fits-all because every business is unique.

What matters is the reasoning. We did not split by noun. We did not create Product, Order, Customer, and Payment because those were the boxes on the diagram. We followed authority. Who decides how a product is shown? Who decides what it costs? Who decides whether it is popular? Who decides where it can be shipped? Who owns the sensitive payment information?

Once those answers became clearer, the boundaries started to appear.

In the next post, I will show how those boundaries land in code.

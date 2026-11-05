---
id: 20261105
author: Dennis van der Stelt
title: Service boundaries in the UI
description: Finance owns the price, including how it is presented. Following OmNomNom's composed response into its Svelte components shows where business ownership ends and the website shell begins.
pubDate: '2026-11-05T01:00:00'
image: /images/2026/service-boundaries-in-the-ui.png
topic: omnomnom
sources:
  omnomnom: 9c9bad4b13f956d2e8b792402a9526919acd72d7
tags:
  - distributed systems
  - microservices
  - service boundaries
  - UI composition
  - omnomnom
---
The customer opens a beer, looks at the price, and notices a discount. We want to show the original price crossed out, the discounted price beside it, and a small "Save 25%" label.

Who should implement that?

In [the first implementation post](/2026/11/03/one-product-page-three-services/), we established that Finance owns pricing. Its composition component supplies the price and discount. Catalog supplies the beer's description and available stock, while Marketing supplies its rating. [The next post](/2026/11/04/composing-product-lists-with-servicecomposer/) brought those contributions together for a list of beers.

But the customer does not read our JSON. Someone still has to turn those contributions into a page.

If we hand the response to a frontend team and ask them to implement all the display rules, we have introduced another place that needs to understand pricing, stock, and ratings. Every service boundary would stop just before the part the customer actually sees.

In OmNomNom, Finance's responsibility continues into the browser. It owns the component that presents the price too.

## One page, several owners

Look at the product page as a customer would. There is a beer image, a description, a rating, a price, and a stock indication. They appear together, but the decisions behind them belong to different services.

Catalog owns the beer image and description, and decides how to present stock. Marketing owns the stars and review count. Finance owns the price presentation, including the discount label.

These pieces are Svelte components. We call them microviews: small views belonging to a service boundary. They are compiled into the same website and rendered on the same page. They do not need separate frontend applications or separate deployments to have different owners.

Before looking inside one, though, there is an ownership question we have so far left mostly unanswered. Who owns the website that holds them all?

## Who owns the hosts?

OmNomNom's business services need somewhere to run their composition components and somewhere to display their UI components. Those hosts have owners too.

**IT/Ops owns the CompositionGateway host.** It supplies the technical infrastructure: application startup, configuration, the HTTP pipeline, and the integration with ServiceComposer. Catalog, Finance, and Marketing supply the composition components running inside it. IT/Ops does not decide what a beer costs or how products should be ranked.

**Branding owns the Website shell and page layouts.** It supplies the shared appearance, navigation, header, footer, and the page code that binds response fields to UI components. The business services supply those components and own their behavior.

| Host | Host owner | Contributions from business services |
|---|---|---|
| CompositionGateway | IT/Ops | Components that retrieve and compose their own data |
| Website | Branding | Components that present their own information and interactions |

Ownership of a host does not transfer ownership of everything inside it. Finance's composition component remains part of Finance when deployed inside CompositionGateway. Its price component remains part of Finance when compiled into the Website.

This is what we mean when we say service boundaries are not process boundaries. IT/Ops is a technical service whose infrastructure can run alongside business components in many processes. Branding plays a similar supporting role in the UI. Neither needs to be a separately running application named after the service.

The people behind IT/Ops can also help establish and evolve the architecture and its boundaries. That requires conversations with the business service teams, bringing together technical experience and knowledge of the business. In a smaller organization, the same team might maintain both IT/Ops and Branding.

For this series, the important consequence is visible in the code: the host provides the mechanism, while the business services retain their responsibilities. Udi Dahan describes a related arrangement in [Service-Oriented API implementations](https://udidahan.com/2012/12/10/service-oriented-api-implementations/), where components from several services share an endpoint.

## From response to component

The product route requests the composed product data once when the page mounts:

```svelte repo="omnomnom" file="src/website/src/routes/product/[productId]/+page.svelte" lines="26-35"
```

These are the three response sections from the first post: `product`, `pricing`, and `popularity`. The page keeps them available for rendering, and passes the relevant fields to the components:

```svelte repo="omnomnom" file="src/website/src/routes/product/[productId]/+page.svelte" lines="83-86"
```

This is Branding's binding code. It knows that a price component belongs here and which response fields satisfy its inputs. It does not calculate the discount or decide when to display a savings label.

The imports make the ownership visible. `PriceDetail` comes from the `Finance` folder, `ProductRating` from `Marketing`, and `ProductDescription` and `StockBadge` from `Catalog`.

None of these components makes another HTTP request. The page already has their data. Giving each component its own fetch would introduce more requests and loading states without helping us establish ownership.

## Finance's part of the page

Now we can open the component responsible for our discount presentation:

```svelte repo="omnomnom" file="src/website/src/Finance/PriceDetail.svelte"
```

It accepts two inputs: `price` and `discount`. It uses Finance's pricing helpers to determine the displayed price and whether to show the original price and savings percentage.

The component knows nothing about beer styles, stock levels, or review counts. It also does not know that the gateway places its inputs under a section named `pricing`. That is a detail of the page's binding code.

For a price of $8 and a discount of 25, Finance's UI displays $6, the original $8, and "Save 25%". Both the component and its helper live under `Finance`, keeping that presentation behavior with its owner.

There is still a distinction between displaying a price and deciding what the customer will be charged. Browser code is not the authority for charging a customer. The current helper mirrors Finance's backend calculation, so changes to that calculation need to remain consistent in both places.

Suppose we change the savings label to a badge. As long as the component still receives the same inputs, its markup can change without changing the route binding. Catalog and Marketing do not need to understand the change.

If Finance needs a new input, the agreement changes. For example, introducing a currency field would require Finance's composition contribution and UI component to support it, and Branding's binding code to pass it through. Ownership keeps the decision with Finance; it does not remove the need to coordinate a contract change.

## The same component, a different response

The product list from the previous post has a different response shape. Each item contains its own name, price, and rating fields. The detail page instead has separate top-level sections.

Marketing's rating component does not need to care about that difference. On the homepage, the binding is:

```svelte repo="omnomnom" file="src/website/src/routes/+page.svelte" lines="215-216"
```

On the detail page, the same component receives its rating and count from `popularity`. Its inputs stay the same:

```svelte repo="omnomnom" file="src/website/src/Marketing/ProductRating.svelte" lines="1-11"
```

Marketing can change how it presents the rating in one place. The pages know how to supply the inputs; the component knows how to display them.

That gives us two useful agreements. The gateway response is an agreement with the page consuming it. The component's props are an agreement with the page embedding it. They do not have to be the same shape.

## A coherent website

Keeping presentation behavior within services should still result in one coherent website. Finance cannot pick an entirely different visual language for the price and expect it to fit beside Catalog's description.

Branding provides that shared language through global styles and layout. OmNomNom's root layout imports the stylesheet from `Branding/styles/global.css` and wraps the route content in `Branding/Layout.svelte`. That component supplies the common header, navigation, and footer. Business components use the shared styles while retaining responsibility for the information they present.

Moving the price above the rating is a page layout change. Changing when the savings label appears is Finance's presentation behavior. Changing the shared typography is Branding's concern. Those are different reasons to change the same visible page.

The current demo does not enforce every part of this separation. The product route still renders the product name directly and limits the quantity selector using available stock. Other parts of the website import Finance's pricing helper directly. Folder names alone do not prevent business knowledge from spreading into page code.

Those are useful places to inspect when applying this approach to your own application. Ask which decisions a page is making, who owns those decisions, and whether they belong inside a service-owned component. A page will need to know its components and their inputs. It should need progressively less knowledge of the rules behind them.

Our customer still sees one product page. Behind it, Catalog owns the beer and stock presentation, Finance owns the pricing presentation, and Marketing owns the rating presentation. Branding brings them together, just as IT/Ops provides the host where their composition components run.

Next, we will follow the customer into checkout. There, several services need to collect their own information before there is a completed order to process.

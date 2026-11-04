---
id: 20261103
author: Dennis van der Stelt
title: One product page, three services
description: Catalog owns the name, Finance owns the price, and Marketing owns the rating. How does OmNomNom turn those separate contributions into one product page?
pubDate: '2026-11-03T01:00:00'
image: /images/2026/omnomnom-services.png
topic: omnomnom
sources:
  omnomnom: 35920e4d1d1f43c3b54a7174348c13e7295ff170
tags:
  - distributed systems
  - microservices
  - service boundaries
  - UI composition
  - omnomnom
---
The customer clicks on a beer. They expect a picture, a description, a price, and perhaps a rating to help justify buying something that costs far too much for a bottle of beer.

They expect one page.

In [the previous post](/2026/06/04/finding-omnomnoms-service-boundaries/), we put the information for that page into three different services. Catalog owns the name, description, image, and stock information. Finance owns the price and discount. Marketing owns the rating and popularity information.

That separation made sense when we were discussing who gets to decide what. Now we have to build a website, and the browser would quite reasonably like to know where its product is.

This is where I want to start the technical part of the OmNomNom series. We will follow one request for one beer, from the page that needs it to the services that contribute the information. Along the way, we will see how those boundaries become working code.

## A page needs more than one owner knows

Imagine the product page with a different color around each service's contribution:

| Part of the page | Service that owns it |
|---|---|
| Beer name, image, brewery, description, and available stock | Catalog |
| Price and discount | Finance |
| Rating and number of ratings | Marketing |

The page brings these things together because they help the customer make a choice. That does not give Catalog authority over prices, or Finance a reason to start storing beer descriptions.

We could make the browser request each part separately. We could write a controller that retrieves the catalog data, looks up the price, fetches the rating, and assembles everything. Or we could move that work into an API gateway, sometimes built specifically for the frontend and called a BFF, a backend for frontend.

All of those approaches can produce the page. But somewhere, we have introduced code that knows exactly where every piece of information comes from. It knows to ask Catalog for the name, Finance for the price, and Marketing for the rating. Moving that knowledge from the browser to a gateway still leaves us with a component that understands all three services.

That is the knowledge we have been trying to keep out of other boundaries. Each service should know everything it needs about its own information and behavior, and as little as possible about the others. Finance knows how to supply a price. Catalog should not need to know how to ask Finance for one. A central gateway should not need that knowledge either.

For OmNomNom, each service owns the code that contributes its information to the page. The browser makes one request, and those contributions come together in a composition gateway. The gateway itself knows nothing about beers, prices, or ratings. It provides a place for the services' code to run.

That is ViewModel composition.

## A gateway that knows nothing

OmNomNom's `CompositionGateway` is an ASP.NET Core application using the [ServiceComposer](https://github.com/ServiceComposer/ServiceComposer.AspNetCore) NuGet package. There is no product controller in that application with a list of services to call.

Instead, during deployment, each service supplies a .NET assembly containing its composition code. Catalog supplies `Catalog.ServiceComposition`, Finance supplies `Finance.ServiceComposition`, and Marketing supplies `Marketing.ServiceComposition`. In this demo, project references bring those assemblies into the gateway application.

ServiceComposer discovers the composition handlers in the supplied assemblies and uses their route declarations to determine which code to run when a URL is requested. It also connects composition events to the handlers that contribute further information. Each service declares how its code participates. The gateway does not contain a handwritten map saying which service supplies which field.

Those components run inside the gateway process, and each accesses its own service's database:

```d2
direction: down
browser: "Browser"
gateway: "CompositionGateway process" {
  catalog: "Catalog composition"
  finance: "Finance composition"
  marketing: "Marketing composition"
}
catalog_db: "Catalog database" {shape: cylinder}
finance_db: "Finance database" {shape: cylinder}
marketing_db: "Marketing database" {shape: cylinder}

browser -> gateway: "One product request / composed response"
gateway.catalog -> catalog_db: "Reads its own data"
gateway.finance -> finance_db: "Reads its own data"
gateway.marketing -> marketing_db: "Reads its own data"
```

This is an important detail. There are no HTTP calls from the gateway to three backend APIs in this example. The gateway hosts code belonging to three services. Catalog's component can read Catalog's database, Finance's can read Finance's database, and Marketing's can read Marketing's database.

Hosting them together does not mean Catalog gets to read Finance's tables. The separation follows the service that owns the code and data, even though its composition code runs alongside other services' composition code.

We will get to the NServiceBus endpoints when we start processing orders. Reading this product page does not send any NServiceBus messages.

## Following one product request

When the customer opens a product page, the website requests `/product/{productId}` from the gateway, through the website's `/api` proxy. The identifier tells all three contributors which beer we are talking about.

Catalog starts by loading its product information and calculating available stock. It creates an object containing the fields it can supply: the name, image, description, brewery, and so on.

Before returning that object, Catalog raises a composition event saying that the product has been loaded. The event includes the identifier and the object being composed. Finance handles that event and adds pricing information. Marketing handles it and adds rating and popularity information.

After those contributions have completed, the gateway returns the resulting object as JSON.

There is an order to this: Catalog creates the object before the other components enrich it. Finance and Marketing do not need to know about each other's contributions. They each need the product identifier and somewhere to put the fields they own.

Now we have enough context to open the code.

## Catalog starts the response

The entry point for this request is Catalog's `ProductComposer`. Its composition handler attribute and HTTP route are how Catalog tells ServiceComposer that it has code to run for this URL. That declaration lives in Catalog's assembly:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition/Products/ProductComposer.cs" lines="10-18" highlight="13,17"
```

The route supplies the product identifier. `GetComposedResponseModel()` gives the handler the response object for this request. We will eventually put the composed product on that object.

The next part of the handler queries `CatalogDbContext` for the product and available stock. Those are both Catalog's information. There is no join to a price table in Finance's database and no rating column to retrieve from Marketing.

Catalog then maps its data into the object that will represent the product on this page:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition/Products/Mapper.cs" lines="8-21"
```

`ExpandoObject` lets the contributors add properties dynamically. At this point, the object has Catalog's fields. There is no price yet because Catalog does not supply one.

The database entity stays inside Catalog. The object being created here is a ViewModel for the response, with room for the other services' contributions.

## Giving the other services a turn

Catalog does not call a Finance class followed by a Marketing class. It raises `ProductLoaded` through the request's composition context:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition/Products/ProductComposer.cs" lines="31-40" highlight="34-38"
```

The event itself is small:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition.Events/ProductLoaded.cs"
```

`ProductId` establishes which beer this is. `Product` is a reference to the object that Catalog just created. The event gives the other contributors an opportunity to add their fields to that same object.

`RaiseEvent` is awaited. Once the event handlers have completed, Catalog places the enriched product on the response model as `vm.Product`.

Despite the word *event*, this is all happening inside the current HTTP request. `ProductLoaded` is an in-process composition event. It is not a durable business event, it does not travel through a message broker, and it does not announce that something changed in the business. It coordinates the construction of a response.

## Finance supplies the price

Finance has an event handler for `ProductLoaded`. Before looking at it, think about what it needs to do: find Finance's product by the shared identifier, then contribute its price and discount.

That is almost the entire implementation:

```csharp repo="omnomnom" file="src/Finance.ServiceComposition/Products/OnProductLoaded.cs" lines="9-19" highlight="16-17"
```

The constructor takes `FinanceDbContext`. That detail is more significant than the class name. Although this code runs in the gateway, it reads Finance's model from Finance's database.

Finance's product has the pricing fields it needs. It does not need Catalog's description to retrieve a price, and it does not inspect the name already present on the ViewModel. The shared identifier is enough.

Catalog did not need to know the name of this handler or how Finance stores its data. Finance declares that it handles `ProductLoaded`, and ServiceComposer connects the event to the discovered handlers. The gateway does not need to name Finance or Marketing to make those contributions happen.

Marketing contributes in the same way. It uses `MarketingDbContext` to find its product, then adds its fields:

```csharp repo="omnomnom" file="src/Marketing.ServiceComposition/Products/OnProductLoaded.cs" lines="16-19"
```

The product object now contains information from all three services. Each contributor supplied only its own part.

## One response for the browser

The gateway serializes the composed response with camel-case property names. A shortened example, with illustrative values, looks like this:

```json
{
  "product": {
    "productId": "20f42e76-54a2-45d4-8f83-6518c833421b",
    "name": "An unnecessarily expensive stout",
    "inStock": 12,
    "price": 9.50,
    "discount": 0,
    "rating": 4.2,
    "ratingCount": 318
  }
}
```

The page receives this response through `gateway.getProduct(productId)`. It can pass the relevant fields to the components that render them. Here is a small part of the actual product page:

```svelte repo="omnomnom" file="src/website/src/routes/product/[productId]/+page.svelte" lines="79-82"
```

The customer sees a rating, a price, a description, and a stock indicator together. They do not need to know how many services contributed to the page. In the next post, we will look at why these frontend components also belong to different services, and how the page brings them together.

## What we brought together

At this point, it would be reasonable to ask whether we just recreated the shared Product model we spent the previous posts trying to avoid.

We did create an object containing information from several services. The important question is what that object is allowed to do.

It describes what the page should display. It does not decide prices, update stock, or determine which beers are trending. Those decisions still belong to their respective services. Nothing writes this combined object back as a shared database entity.

There is still a contract to maintain. Finance's frontend component expects the pricing fields its backend component supplies. Catalog publishes a composition event that other contributors depend on. Using `dynamic` also means misspelled properties can become runtime problems rather than compiler errors.

And this particular implementation expects all three services to have data for the requested product. Finance and Marketing use `SingleAsync`; a missing record fails the request. An optional contribution would need an explicit choice about what the page should show when that information is unavailable.

Those are real implementation trade-offs. Composition does not remove the need to agree on how a page is assembled. It gives each service a place to contribute without putting every service's data access and presentation rules into one central controller.

For a similar page in your own application, start by identifying who owns each piece of information. Give each owner responsibility for retrieving and presenting its contribution. Then keep the code that hosts the request focused on bringing those contributions together.

The boundaries from the previous post can now serve a customer. Catalog supplies the beer, Finance supplies the price, and Marketing supplies the rating. The result is one product page.

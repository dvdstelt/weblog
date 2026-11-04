---
id: 20261104
author: Dennis van der Stelt
title: Composing product lists with ServiceComposer
description: A product identifier lets services work independently. A product list first needs someone to select the products. How composition events provide that context without a central controller knowing every service.
pubDate: '2026-11-04T01:00:00'
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
One beer was easy. Well, easy enough to spend an entire blog post on it.

In [the previous post](/2026/11/03/one-product-page-three-services/), the customer opened a product page. Catalog, Finance, and Marketing each received the same product identifier from the URL. Each could retrieve its own information immediately, without waiting for another service. ServiceComposer ran their handlers in parallel and returned one response.

Now the customer goes back to the homepage and asks to see the next page of stouts.

There is no product identifier in that request. There is a filter, a page number, and the expectation that we will somehow come back with a collection of beers, each with a name, price, and rating.

Finance knows prices. Marketing knows ratings. Neither knows which beers are stouts, because that information belongs to Catalog.

Before they can contribute, someone has to establish which products we are displaying.

## Which twelve beers?

We could give all three services a handler for `/products`, just as we gave them handlers for `/product/{productId}`. But the matching route alone would not give them enough information to do useful work.

Catalog can filter on beer style. Finance cannot apply that filter to its pricing data, and Marketing cannot apply it to its ratings. Asking each service to return its first twelve products would give us three potentially different collections. Having everyone store beer styles would spread Catalog's information around just to make the queries line up.

We could also let Catalog select twelve products and have the browser call the single-product endpoint twelve times. That would repeat the work of composing a product for every card. Adding another row of cards would add another row of requests.

What we actually need is much smaller: once the products have been selected, give the contributors their identifiers together. Finance can retrieve the prices for that set. Marketing can retrieve the ratings for the same set.

The dependency is on the selection, not on each other's business information.

## First select, then compose

For the default ordering, Catalog filters its products, orders them by name, and selects the requested page. It loads its information for those products and creates a ViewModel for each one, much as it did for the detail page.

At that point, it raises a composition event: `ProductsLoaded`.

Finance and Marketing handle that event. They get the selected identifiers, retrieve their own data in a batch, and add their fields to the corresponding ViewModels. Catalog waits for those contributions before putting the completed list on the response.

```d2
direction: down
request: "GET /products: stouts, page 2"
selection: "Catalog selects the page\nand creates product ViewModels"
event: "ProductsLoaded\nIdentifiers + ViewModels"
finance: "Finance\nLoads prices for the selected IDs"
marketing: "Marketing\nLoads ratings for the selected IDs"
response: "One composed product list"

request -> selection
selection -> event
event -> finance
event -> marketing
finance -> response
marketing -> response
```

This is a change from the previous post. The product detail page could start all three queries from the information in the URL. Here, Finance and Marketing need context that becomes available while Catalog is handling the request.

Catalog still does not call Finance or Marketing. It announces that the products are available for composition. ServiceComposer invokes the discovered handlers for that event, just as it invokes discovered handlers for an HTTP route. The gateway has no list of services to ask for prices and ratings.

The event and its handlers run inside the gateway process, during the current HTTP request. Nothing is sent through NServiceBus. `ProductsLoaded` describes a step in constructing a response; it does not announce a business change that other services must persist.

## Making the selection available

The entry point is Catalog's `ProductsComposer`, which handles `/products`. Its filtering, paging, and stock queries establish the products to show. We will come back to sorting later, because sorting by rating adds another interesting dependency.

For now, we have the selected identifiers in `pageIds` and Catalog's data in `pageRows`. Catalog builds a dictionary keyed by product identifier:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition/Products/ProductsComposer.cs" lines="93-100"
```

`Mapper.MapToViewModel` is the same Catalog mapper we saw in the previous post. It supplies the name, description, image, available stock, and other Catalog-owned fields.

The dictionary gives the other contributors a way to find the ViewModel for each product. They can line up their results by identifier, without assuming their database returned rows in the same order as Catalog's database.

Now Catalog has something useful to make available:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition/Products/ProductsComposer.cs" lines="104-107"
```

`ProductsLoaded` carries that dictionary:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition.Events/ProductsLoaded.cs"
```

This is a contract between composition components. It contains the product identifiers and references to the ViewModels being assembled for this request. It does not contain Catalog's database entities.

The call to `RaiseEvent` is awaited. The list is not ready to return until the event handlers have finished adding their contributions.

## Finance retrieves a set of prices

Think about what Finance now knows. It still does not know what makes a beer a stout. It does not know why this particular set of products was chosen. It knows which identifiers need prices, and that is enough.

Its handler declares that it participates when `ProductsLoaded` is raised:

```csharp repo="omnomnom" file="src/Finance.ServiceComposition/Products/OnProductsLoaded.cs" lines="9-25" highlight="13-16,21-22"
```

The first part takes all the identifiers from the event and uses them in one query against `FinanceDbContext`. The second part matches each result to its ViewModel and adds the price and discount.

The position of `ToListAsync` matters. The database query completes before the loop starts. The `Single` call inside the loop searches the materialized results in memory; it does not make another database query for each product.

If the page contains twelve products, Finance retrieves twelve products' pricing data in one query. If we increase the page size, the amount of data grows, but Finance does not start issuing one query per card.

Catalog does perform several queries to select and load the page, so the entire request is not simply three database queries. The useful property here is that enriching the list does not multiply Finance's queries by the number of displayed products.

Marketing follows the same pattern against `MarketingDbContext`. It retrieves its rows for the selected identifiers in one query and adds its fields:

```csharp repo="omnomnom" file="src/Marketing.ServiceComposition/Products/OnProductsLoaded.cs" lines="18-25"
```

Finance and Marketing both wait for Catalog's selection. Neither needs the other's contribution to do its work. The event establishes the point after which their independent contributions can run.

## Returning the list

When `RaiseEvent` completes, the dictionary contains the product ViewModels with contributions from all three services. Catalog then builds the response array in the selected order:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition/Products/ProductsComposer.cs" lines="116-123"
```

The explicit `pageIds` list preserves the intended order. Matching data from different databases by position would be asking for a very convincing page with the wrong prices on it.

There is also a small difference in response shape compared with the single-product page. There, the three handlers wrote separate top-level sections: `product`, `pricing`, and `popularity`. Here, the event handlers enrich each product ViewModel in the list. Each card's object contains the fields needed to display that card.

The homepage passes those fields to its service-owned components:

```svelte repo="omnomnom" file="src/website/src/routes/+page.svelte" lines="215-216"
```

As before, bringing the fields together for display does not transfer authority over them. Finance still supplies prices. Marketing still supplies ratings. Catalog's code does not inspect those values to make pricing or popularity decisions.

## What if the customer sorts by rating?

So far, we have followed the default ordering. But the homepage also lets the customer select top-rated beers, top sellers, or trending beers.

We cannot take twelve products, add their ratings, and then sort those twelve. That would produce the highest-rated beers on an arbitrarily selected page. The customer expects the highest-rated beers from the whole matching set.

Selection has to respect the sort before we take a page.

That creates a second use for a composition event, earlier in the same request. Catalog first filters on the attributes it owns and collects the candidate identifiers. It raises `ProductCandidatesAvailable`, carrying those identifiers and the requested page and size:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition/Products/ProductsComposer.cs" lines="60-67"
```

Marketing handles this event and reads the `sort` query parameter itself. If the requested ordering is one it owns, it ranks the candidates using its own data, selects the requested page, and writes the ordered identifiers back onto the event. The full handler is linked from the snippet below; these are its supported orderings:

```csharp repo="omnomnom" file="src/Marketing.ServiceComposition/Products/OnProductCandidatesAvailable.cs" lines="27-33"
```

Catalog does not contain that switch. It does not need to know that `trending` is a Marketing concept or how Marketing calculates it. It uses the returned identifiers if a handler supplied them, and otherwise falls back to its own name ordering and paging:

```csharp repo="omnomnom" file="src/Catalog.ServiceComposition/Products/ProductsComposer.cs" lines="69-75"
```

Only after this selection does Catalog load the page's product information and raise the `ProductsLoaded` event we followed earlier. Ranking the candidates and enriching the selected products are two distinct stages.

## The agreements still matter

This implementation has contracts to maintain. Other contributors reference Catalog's composition events, agree on the meaning of the identifiers, and own particular fields on the ViewModels. The use of `dynamic` makes that last agreement something the compiler cannot fully check. Composition gives us a way to cooperate; it does not make cooperation free.

The current demo also expects Finance and Marketing to have a row for every product being composed. Their in-memory `Single` calls fail the request if a row is missing. Choosing whether a rating may be absent, or whether a product without pricing can be displayed, would require an explicit decision about the page's behavior.

There are limits to the selection logic too. Catalog currently materializes all matching candidate identifiers, and it removes sold-out products after selecting a page. A page can therefore contain fewer products than the requested size, while the totals still reflect the earlier candidate set. That is the behavior of this demo, rather than a complete solution to searching a large catalogue.

The part to take into your own application is the dependency we uncovered. When every contributor already knows the identifiers, the route handlers can start independently. When one component determines the set, make that set available before asking the others to enrich it, and retrieve each contribution in a batch.

One product page gave us independent contributions. A product list adds a point where those contributors need context. ServiceComposer's composition events provide that point while leaving each service responsible for its own data and the gateway unaware of which services contribute to the page.

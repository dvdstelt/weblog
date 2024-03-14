# Share database? Of course not!

Whenever I hear developers or architects talk about it, almost always everyone agrees that services shouldn't share their database. It's something that is so widely known that everyone tries to avoid it. In this article we'll discuss why *we think* it's a bad idea but how looking at it from a different angle, we might come to different opinions than we currently have.

***Unfortunately, it's not always possible. Due to time pressure or some of the (architectural) patterns don't allow it and a database is shared. We know it's an issue and promise ourselves we'll fix it in the future when we get rid of some technical debt. But it is also widely known that these are great plans, but it'll likely never happen.***

> [!TIP]
>
> Before you read on, try to think for a while why it's actually such a bad idea to have services share their database.

## Why not share a database?

#### Coupling

A common conception is that a shared databases massively increases coupling. Adding or modifying features of a system often results in modifying the database schema. As a result, other services that depend on that schema, immediately break. Every service now needs to be verified if it won't break because of the dependency on that schema.

As you might now, I'm an advocate for looking at your architecture through different lenses. The [4+1 architectural view model](https://bloggingabout.net/2020/08/07/41-architectural-view-model/) provides this. In the below image, you can see a logical view of the system on the left and a physical view of the system on the right. In the logical view you can see that each service has its own database and is logically separated from any other service. However, 



#### Versioning



### 

Er is koppeling tussen microservices als ze data delen, ongeacht of dat via een directe verbinding is naar de data in een database, of naar data via een zelfgebouwde API.

### Consistency

Als je caching gebruikt, heb je eventual consistency.

Als je direct naar database gaat, heb je grootste kans dat consistency overeind blijft. Dat lukt echter alleen als je bijv. de order, orderdetails, inventory, shipping status en meer tegelijkertijd bijwerkt. Met microservices zijn meer van deze zaken verdeeld over meerdere microservices en meerdere databases. Hoe houd je dan je database consistent? Met een API heb je hetzelfde probleem, maar velen merken dit aan als voordeel van direct naar databases gaan. Dat is dus niet haalbaar in een echt microservices systeem.

### Versioning

Het is lastiger met database om versioning toe te passen dan met een andere API, zoals REST.

### Data synchronization

Sowieso een slecht idee. Eventual consistency is al iets wat niet eenvoudig is om mee om te gaan, laat staan als data verspreid moet worden over meerdere microservices en hun database en het probleem verergert.



https://www.techtarget.com/searchapparchitecture/tip/Can-you-really-use-a-shared-database-for-microservices

https://www.linkedin.com/advice/0/what-benefits-drawbacks-using-shared-database-microservices

https://thegreatapi.com/blog/why-sharing-a-database-between-microservices-is-a-bad-idea/#:~:text=In%20conclusion%2C%20sharing%20a%20database,the%20risk%20of%20security%20concerns.

https://medium.com/@benlugavere/why-microservices-shouldnt-share-a-database-a48216ba26d5

https://microservices.io/patterns/data/shared-database.html
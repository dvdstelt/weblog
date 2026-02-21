---
id: 578637
author: Dennis van der Stelt
title: Autonomous Business Components
description: In my article on High Availability I mentioned business components. The most often as...
pubDate: '2014-02-19T12:31:08'
image: /images/autonomous-business-components/header.png
tags:
  - Architecture and Design
  - NServiceBus
  - architecture
  - eda
  - nservicebus
  - soa
redirect_from:
  - /dennis/2014/02/19/autonomous-business-components
  - /blogs/dennis/archive/2014/02/19/autonomous-business-components.aspx
---
In my article on [High Availability](https://bloggingabout-linux.azurewebsites.net/2012/09/19/high-availability/) I mentioned business components. The most often asked question is what these business components exactly are. How big or small they are and what these business components contain. Before I can go into details, I’ll first try to explain how these business components relate to each other and how they are disconnected and truly autonomous.

[![](/images/autonomous-business-components/1.png)](/wp-content/uploads/2014/02/1.png)As an image still says more than a thousands words, I’ll provide one that gives an overview of what business components are. On the right you can see a single autonomous service with two business components. Every business component holds one or more autonomous components. A business component represents business requirements, whereas an autonomous component provides more fine-grained and detailed instructions on how to process these business requirements, based on specific needs.

In the image you can see a data store per business component, but there are many variations possible. Like a data store per service or even a data store per autonomous component. This is often based on how big your system is, how much coupling there is between business requirements. But it can also be based on partitioning of your database and whether or not you can have multiple disconnected instances.

## Autonomous services

One of Don Box his tenets of service orientation is that services are autonomous. Many people (including initially myself) kind of assumed that this was solved by not having a binary reference to an assembly from another service. On paper this always looked very good, but at runtime your service could not live without the other, as they send messages to each other.

When trying to solve this, you need to introduce event driven architecture. This way you can tell another service about business events that have happened, before it even needs this information. For example when a customer did not pay its invoice in time. A business rule can be that a customer can never checkout a shopping cart when it has invoices overdue. We should notify, in advance, the service that is the technical authority of your shopping cart. This way when a customer wants to check out their shopping cart, that service doesn’t need to do a request to the service that is the technical authority of paid or unpaid invoices. It simply already knows. With the minimal amount of information, which is described in my previous article on [partitioning data](https://bloggingabout-linux.azurewebsites.net/2013/07/30/partitioning-data-through-events/), is what makes each service really autonomous. Both design-time and run-time.

[![](/images/autonomous-business-components/soa.png)](/wp-content/uploads/2014/02/soa.png)It is extremely important to remember that services are the technical authority of a specific business capability. They are the implementation of business processes. They’re not webservices, they’re not WCF, they’re not REST. These are all implementation details. The implementation is technical, because that’s what the business requests of us. To automate their processes. So we can conclude that we can talk about services without referring to anything technical related.

## Business components

It’s impossible to define services without knowing what they are responsible for. Udi Dahan advises to not name your services too early. Define business processes in them initially. Shift processes around until you’re certain they’re in the right service. Then you can name your services. Personally my services are often named after departments, like ‘finance’ and ‘sales’. But they don’t necessarily map one to one to these actual departments. It’s fun even to have one department think they are responsible for a business processes, but put this process in a service of another department, sort of speak. Feels like you’re smarter than the business itself, which might actually be the case. But be very careful with this at the same time, because you might be the one that is actually wrong.

[pullquote-right] A service is the technical authority of a specific business capability [/pullquote-right]After defining business processes, a lot of these business processes can span multiple services. But it is always a single service that is actually the authority of the business processes. For example the ability to only check out your shopping cart when your invoices are not overdue. One service is responsible for gathering payment behavior, and the other is responsible for checking out the shopping cart. The latter one is influenced by the first, but it is not responsible for it. I hope this makes sense.

Now the best part is that this makes them completely autonomous. We can change business rules, change database schema or switch to a NoSql datastore. The other service will never know, as long as we keep publishing the same event. When you have technical debt, this always needs to be fixed in a small part of the system. But normally the entire system is influenced by this component. Not any longer.

## Conclusion

I hope I made the relationship between services and business components a bit more clear. Udi Dahan his Advanced Distributed Systems Design course doesn’t take full five days for nothing. There’s a lot to talk about and it’s a lot to learn and understand. If you ever have the chance, you should follow it. [Here’s how you can register](http://www.udidahan.com/training/).

Feel free to contact me personally if you need a hand or an introduction on the subject. First chance to see me present is [February 27th at Blaak Selectie](http://www.blaakselectie.nl/overige-berichten/donderdag-27-februari-distributed-systems-design-met-dennis-van-der-stelt/) and on March 19th I’ll be presenting on Avans Hogeschool in ‘s-Hertogenbosch for an Inter Process Communication class.

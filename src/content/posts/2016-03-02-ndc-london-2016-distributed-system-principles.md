---
id: 578812
author: Dennis van der Stelt
title: NDC London 2016 Distributed System Principles
description: In the eight fallacies, there’s one that says the topology never changes. Isn’t that ...
pubDate: '2016-03-02T11:07:09'
image: /images/ndc-london-2016-distributed-system-principles/header.png
tags:
  - architecture
  - azure
  - distributed systems
  - presenting
redirect_from:
  - /dennis/2016/03/02/ndc-london-2016-distributed-system-principles
  - /blogs/dennis/archive/2016/03/02/ndc-london-2016-distributed-system-principles.aspx
---
> In the eight fallacies, there’s one that says the topology never changes. Isn’t that covered by the other fallacies? Because we kind of try to use the network in a way that abstracts us from the topology usually. So we don’t even know what the topology is in the first place. We usually don’t care about the topology of the network.

This was a question that was asked at the end of my presentation on [distributed system principles](http://www.slideshare.net/DennisvanderStelt/distributed-systems-pricinples) at NDC London 2016.
I didn’t fully understand the question and I deferred it, to avoid a boring going back and forth and be able to understand the question better. During the session however, I did reply that with current cloud options, topology changes might become less of an issue. I want to get back on the initial question and the comment I provided. I had the impression I answered the question to his satisfaction, after the session. However…

## The 8th fallacy in the cloud

Looking again at the question, I still don’t fully understand the intention of it. How can other fallacies ‘cover’ for the eighth fallacy on topology? Another remark was that ‘the network is abstracted away’, that I don’t fully grasp. The cloud abstracts certain parts of the network away. But this can also be said about on-premise networks, or even things like ADO.NET where I can execute queries against SQL Server using the SqlAdapter, without ever knowing how that SqlConnection was set up, let alone know how my application can magically connect to some SQL Server, tell it to execute a task and receive a response containing rows of data.

But abstracted away doesn’t result in never-changing topology. To put it bluntly, your virtual machine might be taken down from under you, without you knowing or even noticing. Hardware can fail, your virtual machine might be on shared hardware and needs to move, or it is decided that it needs to be near your other services. Your cloud provider is able to move virtual machines around at its own discretion. The topology also changes when you change transports, enhance security, make routing changes, etc. Microsoft Azure even has some of its services marked ‘classic’, which makes you wonder what the changes are between the ‘classic’ and newer versions. And when they abandon the ‘classic’ version, will your system be deployable again without any change? Believing there’s just one administrator is another fallacy. The other administrator can make some smart changes to the firewall without anyone else ever knowing, your not working correctly as a result. I’ve stated before that the worst coupling is hidden in your database. The same applies to the settings of your topology. There might be some setting specifically for your system, but without anyone remembering the exact reason, it might change. These result in hard to find issues.

## Some examples

In the past, I worked at a company that had a system with a lot of technical debt. Several developers were working on fixing performance issues and whatnot. Until someday a large number of boxes were delivered to the front door by a hardware vendor. As most developers working here were geeks and love good hardware, we were curious about what the hardware was for. The operations team told us they had decided to build a new infrastructure from scratch. I can go on forever on their lack of communication with the development team and that rebuilding anything rarely helps, but that’s not the point. They just changed almost every aspect of the topology without us knowing. One of the funniest incidents was a request to add a second connectionstring to our applications, so that one connection could read and the other connection could write to the database. Obviously adding a random string in the configuration isn’t going to change the behavior of the system. Even more surprising was that the DBA was unaware of transactional and concurrency issues we would run into.

A more subtle example is when the operations team changed the firewall and suddenly various HTTP headers were missing, that the development team heavily relied on.

[In my #NoDeadlines article](https://www.kpit-recruitment.nl/blog/nodeadlines/), I explained how Microsoft worked in the past with the trade-off matrix. They changed this strategy since Azure. Suddenly Microsoft did not announce features in advance, they just delivered them and announced they were available. This is great for a lot of people who like experimenting with what is new, but also has an impact on your system. New features can be released that you wished you had access to when you starting building your system. But the rapid change with Azure can also result in changing APIs you rely on.

## Conclusion

Microsoft Azure and other cloud providers, make it easier to develop highly available and scalable applications. It abstracts away a lot of technical details we’re not interested in dealing with, especially with the services they offer. Still, the fallacies of distributed computing apply and are maybe even more important than before.

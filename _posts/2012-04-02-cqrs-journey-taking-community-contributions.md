---
layout: post
id: 577442
author: Dennis van der Stelt
date: 20120402 073625
title: CQRS Journey taking community contributions
description: Microsoft Patterns & Practices team has started a journey to CQRS with the idea to cr...
categories:
    - Architecture and Design
    - CQRS
redirect_from:
  - "/dennis/2012/04/02/cqrs-journey-taking-community-contributions"
  - "/blogs/dennis/archive/2012/04/02/cqrs-journey-taking-community-contributions.aspx"
---

Microsoft Patterns & Practices team has started a journey to CQRS with the idea to create a guidance document to provide developers with a map that will help them find a way with the Command and Query Responsibility Segregation (CQRS) and Event Sourcing (ES) patterns and related techniques. Everything is extremely public and a lot of information about the journey [can be found here on GitHub](http://cqrsjourney.github.com/).

As a member of the [Advisory Board](http://cqrsjourney.github.com/advisors/) it’s been a journey of my own. It’s really great to see a lot of opinions and discussions happen during the conference calls with the advisory board. The journey is really taking form and more [documentation](https://github.com/mspnp/cqrs-journey-doc) is put online every two week sprint. Also [code is available for download](https://github.com/mspnp/cqrs-journey-code) so you can see what is happening over time. Every sprint is also shortly documented on the github site, so you get an idea what was achieved.

Last meeting a discussion was started by Udi Dahan that too little effort was put in thinking properly about the domain so that BC’s (be it Bounded Contexts in DDD, Services in SOA or Business Components by others) weren’t properly modelled. He wrote a [lengthy post](http://www.udidahan.com/2012/03/29/a-cqrs-journey-with-and-without-microsoft/) about it with some additional information in [another post](http://www.udidahan.com/2012/03/30/pp-cqrs-journey-post-clarification/). When you’ve been to his [Advanced Distributed Systems Design](http://www.udidahan.com/training/#Advanced_Distributed_System_Design) course you will understand his problems with this, as it’s a very crucial part of the architecture he proposes. This isn’t a silver bullet architecture from a technical perspective, as you have all kinds of technical options to solve every single Business Component and Autonomous Component as you see fit. But it’s very important from a functional perspective and helps solve a whole lot of problems related to coupling of information. Which in turn should make things a whole lot easier to solve when maintaining the system or adding new features to it.

After trying to enhance our current system at [Tellus](http://www.tellus.com/) and making steps to enhance it according to these ideas, I’m still very, very enthusiastic about this approach. If you ever want to talk about the possibilities or ideas, please don’t hesitate to contact me. I’d love to come by or invite you over to the Van Nelle factory to talk about it and show you what we’re doing. Of course I am equally interested in how other companies solve problems like ours. Let me know via the [contact form](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/contact.aspx).

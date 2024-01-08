---
layout: post
id: 577526
author: Dennis van der Stelt
image: '/images/the-11th-fallacy-of-enterprise-computing/header.png'
date: 20120426 071107
title: The 11th Fallacy of Enterprise Computing
description: This is an old article by Ted Neward that I’ve been trying to find for ages, as the o...
categories:
    - Architecture and Design
redirect_from:
  - "/dennis/2012/04/26/the-11th-fallacy-of-enterprise-computing"
  - "/blogs/dennis/archive/2012/04/26/the-11th-fallacy-of-enterprise-computing.aspx"
---

This is an old article by Ted Neward that I’ve been trying to find for ages, as the original website isn’t online anymore. Until I remember the WayBackMachine and found [the original article](http://web.archive.org/web/20051107004144/http://neward.net/ted/weblog/index.jsp?date=20040517). As the WayBackMachine doesn’t always remember (or keeps remembering) everything, I’m reposting the article here for safekeeping. If the owner ever decides that it should be up here but somewhere else, let me know. ![Smile](/images/the-11th-fallacy-of-enterprise-computing/1362_wlemoticon_2d00_smile_5f00_66c75085.png)
* * * As many of you know, I’ve leveraged and extended "The Eight Fallacies of Distributed Computing" originally created by Peter Deutsch (and extended by James Gosling) to add two more and call them "The Ten Fallacies of Enterprise Computing" for the Effective Enterprise Java book. At the Reston, VA No Fluff Just Stuff Symposium, though, an attendee suggested, in response to an answer I gave, that perhaps I was missing one more, the 11th Fallacy:
**11.Business logic can and should be centralized.** The reason this is a fallacy is because the term "business logic" is way too nebulous to nail down correctly, and because business logic tends to stretch out across client-, middle- and server- tiers, as well as across the presentation and data access/storage layers.

This is a hard one to swallow, I’ll grant. Consider, for a moment, a simple business rule: a given person’s name can be no longer than 40 characters. It’s a fairly simple rule, and as such should have a fairly simple answer to the question: Where do we enforce this particular rule? Obviously we have a database schema behind the scenes where the data will be stored, and while we could use tables with every column set to be variable-length strings of up to 2000 characters or so (to allow for maximum flexibility in our storage), most developers choose not to. They’ll cite a whole number of different reasons, but the most obvious one is also the most important–by using relational database constraints, the database can act as an automatic enforcer of business rules, such as the one that requires that names be no longer than 40 characters. Any violation of that rule will result in an error from the database.

Right here, right now, we have a violation of the "centralized business logic" rule. Even if the length of a person’s name isn’t what you consider a business rule, what about the rule stating that a person can have zero to one spouses as part of a family unit? That’s obviously a more complicated rule, and usually results in a foreign key constraint on the database in turn. Another business rule enforced within the database.

Perhaps the rules simply need to stay out of the presentation layer, then. But even here we run into problems–how many of you have used a website application where all validation of form data entry happens on the server (instead of in the browser using script), usually one field at a time? This is the main drawback of enforcing presentation-related business rules at the middle- or server-tiers, in that it requires round trips back and forth to carry out. This hurts both performance and scalability of the system over time, yielding a poorer system as a result.

So where, exactly, did we get this fallacy in the first place? We get it from the old-style client/server applications and systems, where all the rules were sort of jumbled together, typically in the code that ran on the client tier. Then, when business logic code needed to change, it required a complete redeploy of the client-side application that ended up costing a fortune in both time and energy, assuming the change could even be done at all–the worst part was when certain elements of code were replicated multiple times all over the system. Changing one meant having to hunt down every place else a particular rule was–or worse, wasn’t–being implemented.

This isn’t to say that trying to make business logic maintainable over time isn’t a good idea–far from it. But much of the driving force behind "centralize your business logic" was really a shrouded cry for "The Once and Only Once Rule" or the "Don’t Repeat Yourself" principle. The problem is that we just lost sight of the forest for the trees, and ended up trying to obey the letter of the law, rather than its spirit and intentions.

Now, the question remains, is this a fallacy of all enterprise systems, worthy of inclusion in the fallacies list? Or is this just a fragment of something more? Much as I hate to admit it, I’m leaning towards the idea that it’s worthy of inclusion (which means Addison-Wesley is going to kill me for trying to make a change this late in the game).

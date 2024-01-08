---
layout: post
id: 578818
author: Dennis van der Stelt
image: '/images/no-deadlines/header.jpg'
date: 20160314 050540
title: #NoDeadlines
description: Delivering an immutable set of features, within a fixed deadline and with a set amoun...
categories:
    - Miscellaneous
tags:
  - deadlines
  - estimates
redirect_from:
  - "/dennis/2016/03/14/no-deadlines"
  - "/blogs/dennis/archive/2016/03/14/no-deadlines.aspx"
---

Delivering an immutable set of features, within a fixed deadline and with a set amount of developers. It was not unusual for the projects I’ve worked on for a long period of my career. For quite some time I wasn’t even aware that it could be done differently, until I learned about the trade-off triangle or trade-off matrix. Read on to see how you can work without deadlines and focus on quality instead.

This was originally [a guest post](https://www.kpit-recruitment.nl/blog/nodeadlines/) at [Kreischer & Partners](https://www.kpit-recruitment.nl/).

## Back in the days

It was even some sort of a game, way back then. After my team and I estimated a project to be around 100 hours. In the proposal for the customer the hours were cut down to 75.If we were lucky. So next time we’d estimate an additional 20%, because we were quick learners. But so were the managers, reducing our estimates by 30% cut. Until we came to an unwritten and unspoken agreement, in which we’d estimate 50% additional time and they’d cut it down by just 50%. So instead of 100 hours, we’d estimate 140 and the customer would be offered 70 hours. And for some reason this seemed like a proper negotiation between developers and managers. Whereas you can clearly see it’s a total loss for development. And as always, it was quality that suffered severely.

There are probably many to blame for this type of software development. Our project managers because they force us to drop quality and make us work overtime over and over again. Our manager or boss because he’s allowing for this behavior. We ourselves are also to blame, simply because we accept this behavior. Maybe we struggled to get better planning schedules and better quality software. We tried to convince project managers to take proper time to include unit testing. Eventually we start to believe we can never win the fight. And we simply accept it as fact, or quit our job to find an employer that actually does value its developers and its own products under development. And we took the easy way out.

But is there actually a simple answer to the problem? Can we change people to think differently about software development? Maybe not. However, I do believe we can create awareness. And awareness might lead to the light side, where there is this understanding of how schedules, resources and budget are bound together. And to help create awareness, I find the trade-off matrix to be invaluable.

## Trade-off matrix

The first time I came into contact with the trade-off matrix was while learning about the Microsoft Solution Framework. It was presented as an actual matrix, where the team and the customer would have to agree on the default priorities when making tradeoff decisions early in the project.

![trade-off-matrix](/images/no-deadlines/trade-off-matrix.png)

In projects, there is a well-known relationship between the project variables of resources, schedule and features. Also known as money & people, time and scope. The customer is the allowed to put one checkmark in every row, but is not allowed to put two checkmarks in the same column. And I’ve seen a lot of times where the first reaction is to put everything on fixed. After explaining the rules again and trying a second time, it is suddenly very hard to make a good decision.  
 Sometimes there are the obvious decisions. Most of us will remember the millennium bug, where a lot of computers would crash and civilization would end because of global chaos and panic unless companies would pay IT consultants a lot of money to fix the problem. On these projects, schedule would probably be fixed. There’s no way to change the moment in time when the next millennium would start. So then we must choose to have resources or features on optimize, meaning we will do everything in our power to not let it get out of control. And the other one would go on accept, which basically means we accept anything that could happen. Not without thought, but when we need to choose, the matrix guides us in our decisions.

![](/images/no-deadlines/bb497039.ump0203_big(l=en-us).gif)With security devices to login to systems, buildings, etc. the features will most likely be fixed, as we can’t compromise on security. The image above shows the typical trade-off matrix used by Microsoft product teams. Teams consist of a fixed set of people and deadlines do exist, but they’re a bit flexible. However, when features aren’t finished on time, they might very well never make it to release. Remember WinFS, the transactional file system for example? This very matrix is what caused a lot of grief for developers and customers who saw promising features being dropped just before released of a new version of Windows. Perhaps now we can better understand the reasoning behind this.

Instead of using a matrix, you can also use a triangle. On the internet there’s much more information to be found on the trade-off triangle, as shown on the side. The idea is the same; there are three interconnected elements and constraining or enhancing one of the elements, requires trade-offs for the others. Most of the time I use the triangle in communication with developers and the matrix in communication with managers. The matrix is more strict and gives less room for discussions. And there will be discussions. I can’t count the number of times that managers want to add a fourth element: quality. This is ridiculous because you should never compromise on quality. And that’s why Scrum is so great, because with Scrum we get autonomous teams who never compromise on quality. Right?

## Working without deadlines

Then why do so many of our projects lack proper test coverage. Or much worse, projects overflowing with spaghetti code, simply because we did not have the proper time to refactor. Even with Scrum, developers will occasionally make the suggestion to rewrite a certain part of the system, because a rewrite will solve everything. Bugs will be gone, spaghetti code will vanish and it will be cheap to add new features again. Which is never true. Ever. Even worse, from the business perspective, you failed at your job. Why is there spaghetti code? Why did you not write clean code? Business blames developers for this and can’t understand why they’re demanding rewrites for code they wrote themselves.

The root cause of this is deadlines. Everything we do is deadline driven. Deadlines might slide, but rarely to achieve of higher amount of quality in our code. We might think quality is a vital, but hidden part in the trade-off matrix, but it’s not. Worse yet, the business has a huge influence on quality, but it’s not visible; they make trade-offs when working with the other elements.

So imagine a world where deadlines don’t exist and we are no longer bound by deadlines, but focus on quality instead. Instead of deadline driven, we’re quality driven. And quality is the highest goal in your product, its features and the way it is build. We live in an IT world where this is almost unthinkable. But it is not. It is however a decision that a company has to make. Do you want cheap products that can break easily, or do you want to build the highest quality products? We all know products that take the same approach, are of the highest quality, with the added benefit that everyone knows them for this quality. They have a name to uphold. Apple, Tesla, Toyota, Cisco, Gillette, Coca-Cola, Lego – they don’t compromise on quality. And we love them! So why can’t our software be loved?

When quality driven, we define what we do by looking at scope, instead of deadlines. Of course we want to deliver a new product or system as fast as possible. So what do we build first, that provides the most value? Our product backlog is likely full of features to build, so with the current resources assigned, what should we pick up first that will make our customers happy? And when something new comes up, we should ask ourselves if is this is really what we need right now. Is it the most important feature that we want in the next release? How many customers will get additional benefit out of this feature? [Semantic Versioning](http://semver.org/) is a really good push-back mechanism for this. If a feature will single handedly result in bumping up a major or minor version, we really need to think if it’s something we need for the version we’re currently building.

And with every feature we deliver or issue we fix, we focus on quality. That way we won’t have a product or system, nor will we have code, that we do not fully support and aren’t proud of. Because not having quality in our product is a disease that will eventually hurt us. Hard. It’s the technical debt so many of us speak about, but we all have to live with. And if developers recommend we rebuild a component from scratch, you know that you’ve seriously compromised on quality.

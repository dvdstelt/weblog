---
layout: post
id: 578863
author: Dennis van der Stelt
image: '/images/concurrency-and-feyenoord/header.jpg'
date: 20171016 090635
title: Concurrency and Feyenoord Rotterdam
description: I just read a great article by Richard Wellum on Eventual Consistency and Concurrency...
categories:
    - Architecture and Design
redirect_from:
  - "/dennis/2017/10/16/concurrency-and-feyenoord"
  - "/blogs/dennis/archive/2017/10/16/concurrency-and-feyenoord.aspx"
---

I just read a great article by Richard Wellum on [Eventual Consistency and Concurrency in the real world](http://richardwellum.com/2017/10/eventual-consistency-and-concurrency-in-the-real-world/). In it he provides two excellent examples on issues in the real world, that we mostly try to solve in code. But if they exist in the real world, without computers, how should we be able to solve every single issue in our code? That’s impossible. During presentations or training, I often refer to issues like these as business issues, rather than technical issues. The business should provide alternate options, instead of us trying to solve them. After which the developers in the audience will start to smile, hopefully because they like the idea, instead of thinking I’ve stated something that is impossible.

## Concurrency at Amazon and Feyenoord

An often used example is Amazon, which has so many users that it is impossible to achieve consistency of data by placing locks on all the data you’re working with and still have a performant system. So an item can go out of stock while people are still ordering the item. The result is that you might get a coupon or are informed of a back order, whatever solution the business seems fit.

At a presentation recently I was asked about the same issue. I recently heard from someone about the [ordering process at the Feyenoord ticket shop](https://www.feyenoord.nl/nieuws/nieuwsoverzicht/kaartverkoop-klassieker-zaterdag-van-start-1718) for the upcoming classic Feyenoord vs Ajax. The two biggest rivals in football in my country. Of which I like to think Feyenoord is the best football club there is!

The way ordering goes is that first people with a season pass can order a ticket, after which people that are member of the official supporter organization “Het Legioen” can order a ticket. You read it right, “a” ticket. Because you’re only allowed a single ticket per person. I was told so that everyone has an equal chance to visit the match. Which is of course ridiculous. Because if I want to go with a friend, the chance isn’t high we both can get a ticket, as demand is very, very high. Or if your connection is only a little slower than others, you’re unable to buy a ticket.

What if this is a concurrency issue? That the ticket shop does place actual locks on rows and that the issue was solved in such a way that the developers think they can only solve this by allowing a single ticket per person. One might think of a record in a table for every single ticket and you ‘get’ a ticket by placing a lock on a single row. Interesting scenario, but hopefully there are better solutions.

## An alternate solution

The club could come up with a reservation system, where people try to reserve tickets and provide preferences. You would be allowed to specify a preference for two or three different types of seats, including the number of people you’d like to enter and perhaps more details like if you’re joining with kids and what not. That would make it a kind of lottery to see if you could get in, but the ticket shop would have much more control over how seats are divided. For example families could better be placed together. Or you could specify you’d like seats that are less in demand, to get a better chance of getting at least a seat. Families and friends would have a better chance to sit next to eachother. If someone was at a previous classic match between Feyenoord and Ajax, they would get less of a chance to buy tickets compared to people who didn’t have a chance to buy a ticket in the past. The options are endless and ‘the business’ could go wild with ideas.

## Summary

Try to think of alternatives if you’re trying to deal with concurrency and race conditions. Most of the time those issues should not be dealt with in making code faster. Instead, you should be able to discuss them with the business and think of alternative approaches to the issue. There’s never a single option to choose from.

Have a great match and may the best team win. Because Feyenoord definitely should!

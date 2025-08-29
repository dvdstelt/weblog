---
layout: post
id: 20250830
author: Dennis van der Stelt
image: '/images/2025/serializable/header.jpg'
date: 20250830 010000
title: serializable transactions in your distributed system
description: Foreign keys, serializable transactions, and why they won't save your distributed system
tags:
  - transactions
  - consistency
  - distributed systems
---
Developers often lean on foreign keys to enforce consistency. That works fine in a single, monolithic database—but once you start scaling out into a distributed system, foreign keys don’t reach across database boundaries. They simply can’t guarantee data consistency when every component owns its own database. I wrote more about this in a post for Particular Software: [Foreign keys slow you down](https://particular.net/blog/foreign-keys-slow-you-down).

At one of my talks, an attendee came up afterward and confidently told me: “All those problems you’re solving with messaging and eventual consistency? Already solved. Just use serializable transactions.” Then he walked away as if that was the mic drop.

Here’s the problem: most teams already struggle to get acceptable performance out of their database at the read committed isolation level. Locking too many tables for too long forces other transactions to wait. Now crank that up to serializable, and it’s a whole different beast. Under serializable isolation, even reads take locks.

If you’re reading a single row, it might seem fine. But the lock isn’t held just for the read—it stays until you finish processing the data in your code and commit the transaction. That lock duration explodes compared to a simple update. Performance tanks, and troubleshooting becomes a nightmare.

So no—upping your isolation level is not the silver bullet. In fact, if you build your system around serializable transactions, performance issues will be nearly impossible to solve.

Instead, step back. Identify the natural boundaries of your subdomains and allow them to communicate using events. Embrace eventual consistency where it makes sense. It may feel harder at first, but it leads to scalable systems that don’t grind to a halt under load.

Want to learn how? I run a hands-on workshop where you’ll practice finding those boundaries and apply event-driven architecture with real exercises. More details here: [compilesoftware.nl](https://compilesoftware.nl/)

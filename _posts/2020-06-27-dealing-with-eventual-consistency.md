---
layout: post
id: 578911
author: Dennis van der Stelt
image: '/images/dealing-with-eventual-consistency/header.jpg'
date: 20200627 113046
title: Dealing with eventual consistency
description: Last year during Øredev I presented on how to deal with eventual consistency. Quite a...
categories:
    - Architecture and Design
    - ASP.NET
redirect_from:
  - "/dennis/2020/06/27/dealing-with-eventual-consistency"
  - "/blogs/dennis/archive/2020/06/27/dealing-with-eventual-consistency.aspx"
---

<iframe src="https://www.youtube.com/embed/jTz74m1KbBs" frameborder="0" allowfullscreen></iframe>

Last year during Øredev I presented on how to deal with eventual consistency.

Quite a few people I talk to, tell me they can’t use eventual consistency, because they can’t have people looking at data that is stale. However, they don’t blink an eye when they’re adding caching into their system, which is never 100% in-sync with their persisted data and thus returns stale data. But even data that is showing inside your browser is already stale. While your application is retrieving the data, sending it to the browser and it’s being rendered, it’s not unlikely the data is already updated in the database.

I’ll be blogging more about eventual consistency in the near future. For now, be sure to watch the video and check out the [demo I’ve built](https://github.com/dvdstelt/EventualConsistencyDemo) to show how a movie theater website should deal with high traffic load on their webserver.

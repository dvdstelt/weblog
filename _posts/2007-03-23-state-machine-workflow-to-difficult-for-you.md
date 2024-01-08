---
layout: post
id: 144457
author: Dennis van der Stelt
date: 20070323 041229
title: State machine workflow to difficult for you?
description: Recently Anko Duizer started a discussion inside ClassA about Windows Workflow Found...
categories:
    - .NET Framework 3.0
    - Architecture and Design
redirect_from:
  - "/dennis/2007/03/23/state-machine-workflow-to-difficult-for-you"
  - "/blogs/dennis/archive/2007/03/23/state-machine-workflow-to-difficult-for-you.aspx"
---

Recently [Anko Duizer](http://blogs.class-a.nl/blogs/anko/) started a discussion inside Class-A about Windows Workflow Foundation, specifically about state machine workflow vs. sequential workflow. One point of discussion was why in (almost) every presentation out there, the sequential workflow is being demonstrated.

Sequential workflows are pretty easy to understand and probably most used in design documents. However, I’ve implemented Workflow Foundation on several projects and have always used a state machine workflow, simply because it was the best possible solution to the problem at hand. And although I never actually thought about it, the discussion internally made me wonder myself if sequential workflow has any use. I’ve used them inside the different states of my state machine, but never have I used a sequential workflow on its own.

Is this because they don’t represent anything but simple *[if statements](http://en.wikipedia.org/wiki/If_statement)* in your code? And everything that spans over time is implemented using a state machine? Are state machines so hard to explain to people, or do the presenters just don’t get them? Anko also proves [in his article](http://blogs.class-a.nl/blogs/anko/archive/2007/03/06/why-not-using-state-machine-workflow.aspx) that the workflow of the expense demo, published on MSDN, is much easier to draw, implement and query the state with a state machine workflow.

I’m curious if people have implemented sequential workflows in their applications and could explain the why and how? Leave a comment here or on [Anko’s weblog](http://blogs.class-a.nl/blogs/anko/archive/2007/03/06/why-not-using-state-machine-workflow.aspx).

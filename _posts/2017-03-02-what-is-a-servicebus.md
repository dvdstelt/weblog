---
layout: post
id: 578852
author: Dennis van der Stelt
image: '/images/what-is-a-servicebus/header.png'
date: 20170302 080025
title: What is a servicebus?
description: The first time I read about the concept of a servicebus and saw the images, I could n...
tags:
  - servicebus queue transport broker
redirect_from:
  - "/dennis/2017/03/02/what-is-a-servicebus"
  - "/blogs/dennis/archive/2017/03/02/what-is-a-servicebus.aspx"
---

The first time I read about the concept of a servicebus and saw the images, I could not figure out how it was supposed to work. The abstract perspective is like any component could just send messages to something that looked like a pipeline. Anyone interested could pick up random messages as it would seem fit. So what is a servicebus?

## Abstract servicebus

[![](/images/what-is-a-servicebus/servicebus-1.png)](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2017/03/servicebus-1.png) The abstract concept shows like the image on the right. There are *sources* and *sinks*, which are respectively senders and receivers of messages. The idea is that *sources* and *sinks* are completely decoupled. This is achieved by making use of the publish/subscribe pattern. A *source*, the publisher, publishes a message and has no idea about the *sinks*, the subscribers. Any *sink* can then subscribe to a message and receive the message. This isn’t magic though.

A publisher has no clue who will subscribe to the message, especially during design-time. It depends on the queuing technology used, how subscribers tell a publisher they are interested in a certain magic. But there definitely is some knowledge needed with the subscriber which messages are published. Let’s get a little bit more concrete.

## Federated queues

[![](/images/what-is-a-servicebus/servicebus-3.png)](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2017/03/servicebus-3.png)In the Microsoft world, an old but very stable and reliable queueing technology is MSMQ. When you want to send a message to a component on another machine, MSMQ will first locally persist the message to disk. This way it guarantees the message doesn’t get lost when the node crashes. The executing code can continue, while MSMQ tries to send the message to the other machine. The other machine will receive the message and immediately persist the message to disk. Only then will the code on the other machine be able to read the message from the queue.

Even when a machine is down, the message is persisted. MSMQ will keep trying to send the message as long as the machine is down. This all assumes that you’ve set up transactional queues to achieve this kind of reliability. You can add a SAN for additional storage reliability.

## Brokered queues

[![](/images/what-is-a-servicebus/servicebus-2.png)](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2017/03/servicebus-2.png)A lot of queueing technologies are not running locally on every machine, but rather centrally located. Think of a relational database as being a central component to a lot of applications, that have the need to persist information. Examples of a brokered queue is RabbitMQ, Azure Service Bus or Amazon SQS.

The drawback is that, because it’s centrally located, it can be a single point of failure. For this reason you might want to set up a cluster. This can turn out to be very complex. Especially when networking issues cause a partition within the cluster and you have to [solve the issues that a brokered queue can’t solve for you](https://insidethecpu.com/2014/11/17/load-balancing-a-rabbitmq-cluster/). Another option is to turn to the cloud with Azure Service Bus or Amazon SQS. Although that can lead to availability issues due to network issues. Too many times I’ve seen companies unable to send messages because they could not reach the cloud. Hosting your entire system in the cloud might help. Most of the time the connectivity within a single datacenter isn’t compromised. And when your brokered queue is offline, your website likely is offline as well.

### Scaling out

A benefit of brokered queues is that it is very easy to scale out, using the [competing consumer pattern](http://www.enterpriseintegrationpatterns.com/patterns/messaging/CompetingConsumers.html). When designed and developed properly, it’s just a matter of adding another instance of an endpoint and you’ve basically scaled out your system. With federated queues you’ll need a [message dispatcher](http://www.enterpriseintegrationpatterns.com/patterns/messaging/MessageDispatcher.html) or another way to distribute messages over workers, for example using round-robin.

## Broker vs buses

[![](/images/what-is-a-servicebus/servicebus-4.png)](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2017/03/servicebus-4.png)There’s a difference between brokered queues and message brokers. It is important to recognize that brokered queues are basically just infrastructure and contain no logic. Whereas message brokers differ from a servicebus in the fact that they can contain (content based) routing, transformations and logic and can aggregate and decompose messages. This can be very handy for integrating with third-party systems, like SAP, SalesForce, etc. The issue is that it is too easy to have too many responsibilities in a broker. Especially when business logic is centralized, [which is a fallacy](https://bloggingabout-linux.azurewebsites.net/2012/04/26/the-11th-fallacy-of-enterprise-computing/).

## Summary

When choosing a message transport for your system, be aware of the drawbacks of each of them. Think about connectivity, availability and the ability to scale. And especially be aware of adding any logical centrally, because you shouldn’t.

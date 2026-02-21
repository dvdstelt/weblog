---
id: 90390
author: Dennis van der Stelt
title: WCF Part 7  Bindings
description: "As I’ve been pretty busy, it’s been a while since my last post in the WCF\_series. But..."
pubDate: '2007-01-05T12:40:03'
tags:
  - .NET Framework 3.0
  - Development
  - WCF
  - Windows Communication Foundation
redirect_from:
  - /dennis/2007/01/05/wcf-part-7-bindings
  - /blogs/dennis/archive/2007/01/05/wcf-part-7-bindings.aspx
---
As I’ve been pretty busy, it’s been a while since my last post in the WCF series. But let’s have a look at bindings now. A binding will tell a client what’s necessary to connect to the service. In other words, how we connect is described by the binding. As you can see in the image, this is composed from the protocols selected, the chosen encoder and chosen transport.

![](/images/wcf-part-7-bindings/wcfarchitecture5b75d.png) 

The image also shows the architecture of WCF. The service-host initiates one or more dispatchers. In configuration you setup the protocols, encoder and transport to use, per endpoint. At the client side you do this as well. When a message is send from client to service, it first goes through the (generated) proxy, through configured protocols, encoder and finally will be send over a transport layer. On the other end, the same happens, but the other way around.
1. **Protocols** These can be anything, but some of the default delivered with WCF are, for example, reliable messaging or transactions. When the message should be encrypted, it’s done in this layer.
2. **Encoder** This is text/xml for HTTP bindings, but binary xml for the TCP binding.
3. **Transport** This can be HTTP or TCP, NamedPipes or MSMQ.

Depending on what you actually want and need, you’d normally decide which binding is best for your situation. Using the decision chart I’ve shown in [this post](https://bloggingabout.net/2006/12/01/WCF-Binding-decision-chart), you can see what bindings are available and when to choose what. In the following table you can see some abilities and which binding supports them.

![](/images/wcf-part-7-bindings/bindings.png) 

First you see interop. If you choose a transport other than HTTP, WCF cannot interop with another platform as these just don’t support them. With basicHttpBinding your service can communicate with clients that conform to the WS-Basic Profile. Everyone understanding webservices can communicate with basicHttpBinding. wsHttpBinding can be seen as a basic profile webservice with WSE 3.0 included. So while it’s still interoperable, with many more abilities, it’s harder for external platforms to setup and communicate with your service, although if those external platforms are conform to the WS-* specs, they *should* be able to communicate with you. I’ve already seen this working with ASMX/WSE3.0, Java, etc.

All bindings but one support both transport (T) and message (S) security. We’ll get back to that in another post. But it basically means if you choose basicHttpBinding, your only possible option to secure your service is, for example, via SSL, meaning you’ll get an HTTPS:// address.

Bindings that have a cross-mark at sessions, support… well, sessions. The same goes for transactions. I’ll get back to all this later in the series. Duplex means the service and client can send messages back and forth, for example to give status updates during long running requests.

Of course the above list can be altered by extending WCF. I probably won’t go into details, as extending WCF gets a lot of attention all over the internet. An example extension could be creating a new transport-layer to support sending messages over SMTP, FTP or whatever you can think of. Microsoft uses the example to add transport and encoding layers so clients will be able to talk directly to external systems that don’t know anything about WCF. But I think it’s far more likely that a service-interface will be created on top of these systems, exposing it through WCF using the default and regular bindings.

The great thing about WCF and these bindings is, that in theory you can deploy a service and afterwards add, offer and support other endpoints. For example start with basicHttpBinding and add netTcpBinding later. With the demos used in my previous articles, this is possible without any modification to the code.

Although this article discusses bindings, we’ll definitely get back to things like security, transactions, etc. But these are all topics on their own and deserve one or more posts in this WCF series.

[[Go to the WCF series article index](https://bloggingabout.net/2006/10/18/WCF-Part-0-_3A00_-Introduction)]



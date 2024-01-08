---
layout: post
id: 35768
author: Dennis van der Stelt
date: 20061018 051800
title: WCF Part 1  Services ABC
description: I want to begin with a conceptual explanation about services. A service always has at...
categories:
    - .NET Framework 3.0
    - WCF
redirect_from:
  - "/dennis/2006/10/18/wcf-part-1-services-abc"
  - "/blogs/dennis/archive/2006/10/18/wcf-part-1-services-abc.aspx"
---

I want to begin with a conceptual explanation about services. A service always has at least one endpoint, but can have multiple. A client normally communicates with only one endpoint. A plain-old-webservice only has one endpoint and communicates via HTTP and Text/XML. The picture below shows a service with three endpoints. Notice the ABC.

![wcfabc.png](/images/wcf-part-1-services-abc/wcfabc.png)

 There are a few articles about the WCF ABC’s ([1](http://msdn2.microsoft.com/en-us/library/aa480190.aspx), [2](http://en.wikipedia.org/wiki/Windows_Communication_Foundation))but the short story is that you always have to remember:
1. **A** stands for Address  
2. **B** stands for Binding  
3. **C** stands for Contract

I’ll try to explain them, they’ll get more sense once we advanced in posts.
1. **Address** Every website and webservice has an address, like [https://bloggingabout-linux.azurewebsites.net/](/) or [http://mydomain.com/stockquote.asmx](http://mydomain.com/stockquote.asmx). Our WCF services also must have an address. WCF can provided addresses for the following protocols:  
    1. HTTP  
    2. TCP  
    3. NamedPipe  
    4. Peer2Peer  
    5. MSMQ
2. **Binding** A binding specifies how a service is accessible. Think transport protocol (see the previous list that shows the basic list), encoding (text, binary, etc) and WS-* protocols like transactional support or reliable messaging.  
3. **Contract** The contract is something you completely specify by yourself. The contract is used to specify what your service can do. For example give you the correct streetname and city when providing a zipcode.

In the next articles I’ll explain how you can build a service while using the ABC.

[[Go to the WCF series article index](/blogs/dennis/archive/2006/10/18/WCF-Part-0-_3A00_-Introduction.aspx)]

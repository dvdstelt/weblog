---
layout: post
id: 481215
author: Dennis van der Stelt
date: 20090223 125251
title: Cloud service in Azure  Speedtraps
description: For the 828 event next Thursday I’m developing some examples. One of them is where I ...
categories:
    - Azure
    - PDC08
redirect_from:
  - "/dennis/2009/02/23/cloud-service-in-azure-speedtraps"
  - "/blogs/dennis/archive/2009/02/23/cloud-service-in-azure-speedtraps.aspx"
---

For the 828 event next Thursday I’m developing some examples. One of them is where I get all speed traps (Flitsers in Dutch) from [http://www](http://www)… a source that I won’t mention here. I then want to expose these via WCF via SOAP and REST. Of course this will be so extremely popular, that I have to use Windows Azure and be able to scale immensely so you folks won’t miss out on the latest speed traps.

Anyway, after first writing “w00t” in the cloud, I now got my first WCF service in the cloud which actually does something.

You can find the REST version here:

[http://flitsservice.cloudapp.net/speedtraps.svc/Flitsers](http://flitsservice.cloudapp.net/speedtraps.svc/Flitsers "http://flitsservice.cloudapp.net/speedtraps.svc/Flitsers")   
[http://flitsservice.cloudapp.net/speedtraps.svc/Status](http://flitsservice.cloudapp.net/speedtraps.svc/Status "http://flitsservice.cloudapp.net/speedtraps.svc/Status")

And the root location, including MEX and WSDL stuff right here:   
[http://flitsservice.cloudapp.net/speedtraps.svc](http://flitsservice.cloudapp.net/speedtraps.svc "http://flitsservice.cloudapp.net/speedtraps.svc")

Unfortunately you won’t be able to add a reference (proxy class) because of some [internal stuff going wrong](http://blogs.msdn.com/davidlem/archive/2009/01/07/windows-azure-and-web-services.aspx) inside Azure. But maybe I’ll supply you in the future with that as well, and even a client application. Maybe I’ll create an syndicated version of it, but for now you can read the REST version and use it in your own apps. I have no idea how long this will run though.

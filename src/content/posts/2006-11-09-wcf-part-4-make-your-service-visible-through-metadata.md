---
id: 44595
author: Dennis van der Stelt
title: WCF Part 4  Make your service visible through metadata
description: Last time we saw how we could create an instance of our service by hosting it using s...
pubDate: '2006-11-09T12:39:30'
tags:
  - .NET Framework 3.0
  - Development
  - WCF
  - Windows Communication Foundation
  - MEX
  - MetadataExchange
redirect_from:
  - /dennis/2006/11/09/wcf-part-4-make-your-service-visible-through-metadata
  - /blogs/dennis/archive/2006/11/09/wcf-part-4-make-your-service-visible-through-metadata.aspx
---
[Last time](/2006/11/09/WCF-Part-3-_3A00_-Hosting-the-service/) we saw how we could create an instance of our service by hosting it using some configuration in our app.config. We still need to have it exposed using metadata though. We’ll do this by adding an endpoint that exposed this, using our WCF ABC again. This endpoint is called a MEX endpoint, from **M**etadata **EX**change.

For this we don’t have to create any code, just configuration again. Open the Service Configuration Editor again on our app.config. Open the folder “Advanced”, then “Service Behaviors” and choose to add a new service behavior. We’ll change the name *NewBehavior* to *HelloServiceBehavior*. Now click the Add button and select the ‘ServiceMetadata’ option.

![Our added service behavior for the MEX endpoint.](/images/wcf-part-4-make-your-service-visible-through-metadata/wcf_mexbehavior01_thumb.png) 

Now we’ll configure our new behavior in and endpoint. Select your service again in the tree. This is something you’ll probably forget a lot in the future, but you’ll have to bind the just configured behavior to your service. You should be able to select it from the list in the BehaviorConfiguration property on your service.

Now let’s actually add our MEX endpoint. Select the “Endpoints” folder under our service and right-click it, then choose to add a new endpoint. Set the address to [http://localhost:8080/HelloService/MEX/](http://localhost:8080/HelloService/MEX/), select for binding the “mexHttpBinding” and for contract fill in “IMetadataExchange”. Now save, exit the configuration editor and you should have the following configuration.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: blue"><?</span><span style="color: maroon">xml</span><span style="color: blue"> </span><span style="color: red">version</span><span style="color: blue">=</span>"<span style="color: blue">1.0</span>"<span style="color: blue"> </span><span style="color: red">encoding</span><span style="color: blue">=</span>"<span style="color: blue">utf-8</span>"<span style="color: blue"> ?></span>

<span style="color: blue"><</span><span style="color: maroon">configuration</span><span style="color: blue">></span>

<span style="color: blue">    <</span><span style="color: maroon">system.serviceModel</span><span style="color: blue">></span>

<span style="color: blue">        <</span><span style="color: maroon">behaviors</span><span style="color: blue">></span>

<span style="color: blue">            <</span><span style="color: maroon">serviceBehaviors</span><span style="color: blue">></span>

<span style="color: blue">                <</span><span style="color: maroon">behavior</span><span style="color: blue"> </span><span style="color: red">name</span><span style="color: blue">=</span>"<span style="color: blue">HelloServiceBehavior</span>"<span style="color: blue">></span>

<span style="color: blue">                    <</span><span style="color: maroon">serviceMetadata</span><span style="color: blue"> /></span>

<span style="color: blue">                </span><span style="color: maroon">behavior</span><span style="color: blue">></span>

<span style="color: blue">            </span><span style="color: maroon">serviceBehaviors</span><span style="color: blue">></span>

<span style="color: blue">        </span><span style="color: maroon">behaviors</span><span style="color: blue">></span>

<span style="color: blue">        <</span><span style="color: maroon">services</span><span style="color: blue">></span>

<span style="color: blue">            <</span><span style="color: maroon">service</span><span style="color: blue"> </span><span style="color: red">behaviorConfiguration</span><span style="color: blue">=</span>"<span style="color: blue">HelloServiceBehavior</span>"<span style="color: blue"> </span><span style="color: red">name</span><span style="color: blue">=</span>"<span style="color: blue">Classa.Wcf.Samples.Hello</span>"<span style="color: blue">></span>

<span style="color: blue">                <</span><span style="color: maroon">endpoint</span><span style="color: blue"> </span><span style="color: red">address</span><span style="color: blue">=</span>"<span style="color: blue">http://localhost:8080/HelloService/</span>"<span style="color: blue"> </span><span style="color: red">binding</span><span style="color: blue">=</span>"<span style="color: blue">basicHttpBinding</span>"

<span style="color: blue">                    </span><span style="color: red">bindingConfiguration</span><span style="color: blue">=</span>""<span style="color: blue"> </span><span style="color: red">contract</span><span style="color: blue">=</span>"<span style="color: blue">Classa.Wcf.Samples.IHello</span>"<span style="color: blue"> /></span>

<span style="color: blue">                <</span><span style="color: maroon">endpoint</span><span style="color: blue"> </span><span style="color: red">address</span><span style="color: blue">=</span>"<span style="color: blue">http://localhost:8080/HelloService/MEX/</span>"<span style="color: blue"> </span><span style="color: red">binding</span><span style="color: blue">=</span>"<span style="color: blue">mexHttpBinding</span>"<span style="color: blue"> </span><span style="color: red">bindingConfiguration</span><span style="color: blue">=</span>""

<span style="color: blue">                    </span><span style="color: red">contract</span><span style="color: blue">=</span>"<span style="color: blue">IMetadataExchange</span>"<span style="color: blue"> /></span>

<span style="color: blue">            </span><span style="color: maroon">service</span><span style="color: blue">></span>

<span style="color: blue">        </span><span style="color: maroon">services</span><span style="color: blue">></span>

<span style="color: blue">    </span><span style="color: maroon">system.serviceModel</span><span style="color: blue">></span>

<span style="color: blue"></span><span style="color: maroon">configuration</span><span style="color: blue">></span>

</span></div>

Run your service with F5.You’ll notice no difference, but now you can create a proxy with the service util. Open the Visual Studio Command Prompt (in your start menu under Visual Studio 2005/Visual Studio Tools) and execute the following command:

svcutil.exe /o:client.cs /config:app.config [http://localhost:8080/HelloService/MEX/](http://localhost:8080/HelloService/MEX/)

If you’re interested, take a look at the generated files. Especially the generated app.config, which should contain an ABC reference to your service.

[[Go to the WCF series article index](/2006/10/18/WCF-Part-0-_3A00_-Introduction/)]



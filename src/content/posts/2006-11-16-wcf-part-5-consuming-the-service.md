---
id: 49353
author: Dennis van der Stelt
title: WCF Part 5  Consuming the service
description: Last time we generated the client and configuration file. Whereas in the asmx world w...
pubDate: '2006-11-16T01:10:55'
tags:
  - .NET Framework 3.0
  - Development
  - WCF
  - Windows Communication Foundation
redirect_from:
  - /dennis/2006/11/16/wcf-part-5-consuming-the-service
  - /blogs/dennis/archive/2006/11/16/wcf-part-5-consuming-the-service.aspx
---
[Last time](/2006/11/09/WCF-Part-4-_3A00_-Make-your-service-visible-through-metadata/) we generated the client and configuration file. Whereas in the asmx world we had a proxy class, the WCF team renamed this in the June CTP to client. For us to use the generated files, we need a new console application and add the files. Don’t forget to add the System.ServiceModel reference to the project. Once this is done, it should compile without errors.

We’ll have to create an instance of the client. At that point, the application configuration on the client will be read. However, there won’t be a connection until the first call has been made. After creating the instance, we can call the HelloWorld operation. Notice that the HelloComputer operation isn’t exposed, as we didn’t apply the OperationContractAttribute in the interface. Besides the generated files, not much code is needed to execute the call.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: #2b91af">    1</span> <span style="color: blue">static</span> <span style="color: blue">void</span> Main(<span style="color: blue">string</span>[] args)

<span style="color: #2b91af">    2</span> {

<span style="color: #2b91af">    3</span>   <span style="color: teal">Console</span>.WriteLine(<span style="color: maroon">"Press any key when the service is available..."</span>);

<span style="color: #2b91af">    4</span>   <span style="color: teal">Console</span>.ReadKey();

<span style="color: #2b91af">    5</span> 

<span style="color: #2b91af">    6</span>   <span style="color: teal">HelloClient</span> client = <span style="color: blue">new</span> <span style="color: teal">HelloClient</span>();

<span style="color: #2b91af">    7</span> 

<span style="color: #2b91af">    8</span>   <span style="color: blue">string</span> msg = client.HelloWorld();

<span style="color: #2b91af">    9</span> 

<span style="color: #2b91af">   10</span>   <span style="color: teal">Console</span>.WriteLine(<span style="color: maroon">"The message is : {0}"</span>, msg);

<span style="color: #2b91af">   11</span>   <span style="color: teal">Console</span>.WriteLine(<span style="color: maroon">"Press any key to quit..."</span>);

<span style="color: #2b91af">   12</span>   <span style="color: teal">Console</span>.ReadKey();

<span style="color: #2b91af">   13</span> }

</div>

On line 6 the instance is created, on line 8 we call the service. Line 10 shows the message in the console window. Notice line 3 and 4.When we start (or execute) both assemblies at the same time, we need to be able to wait and allow the service to get up and running.

There are two methods to execute the assemblies. You can right-click a project in Visual Studio 2005, choose *Debug* and *Start new instance*. Or you can right-click the solution, choose *Set StartUp Projects…* and select the radiobutton *Multiple startup projects*. Then specify ‘Start’ for both projects. After hitting the F5 key, both projects will be started at the same time.
**Consumer configuration** You can examine the configuration of the consumer, in our case our console application that’s calling the service. You’ll see a lot of info on the basicHttpBinding, but that’s not really important right now. Just stuff on timeouts, message encoding, etc. that’s all default. What is (kind of) important however, is everything in the client element.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: blue"><</span><span style="color: maroon">client</span><span style="color: blue">></span>

<span style="color: blue">    <</span><span style="color: maroon">endpoint</span><span style="color: blue"> </span><span style="color: red">address</span><span style="color: blue">=</span>"<span style="color: blue">http://localhost:8080/HelloService/</span>"<span style="color: blue"> </span><span style="color: red">binding</span><span style="color: blue">=</span>"<span style="color: blue">basicHttpBinding</span>"

<span style="color: blue">        </span><span style="color: red">bindingConfiguration</span><span style="color: blue">=</span>"<span style="color: blue">BasicHttpBinding_IHello</span>"<span style="color: blue"> </span><span style="color: red">contract</span><span style="color: blue">=</span>"<span style="color: blue">IHello</span>"

<span style="color: blue">        </span><span style="color: red">name</span><span style="color: blue">=</span>"<span style="color: blue">BasicHttpBinding_IHello</span>"<span style="color: blue"> /></span>

<span style="color: blue"></span><span style="color: maroon">client</span><span style="color: blue">></span>

</div>

Again you’ll notice the WCF ABC, address, binding and contract. All this has been imported by the Service Utility (svcutil.exe) and is now inside the client class as well.

We’ve setup our first (have we? 😉 running service and client application and we’re talking in text/xml over http with each other. We’re running this on the same computer, but you could place either one of these applications on the other side of the world and wouldn’t notice a difference, but perhaps some delay because of the distance.

You can [download the complete solution here](https://bloggingabout-linux.azurewebsites.net/userFiles/dennis%20van%20der%20Stelt/file/wcf/Classa.Wcf.Samples.HelloService.zip), to see how I’ve set everything up. Before we take further steps into the world of Windows Communication Foundation and get beyond the WCF ABC, we’ll examine what we’ve done exactly.
**<font color="#ff0000">Update</font> :** Be sure to <u>have the WCF/WF extensions installed</u>! You don’t need the >1GB SDK installed.

[[Go to the WCF series article index](/2006/10/18/WCF-Part-0-_3A00_-Introduction/)]



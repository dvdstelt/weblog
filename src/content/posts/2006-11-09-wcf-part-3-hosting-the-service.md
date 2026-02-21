---
id: 44591
author: Dennis van der Stelt
title: WCF Part 3  Hosting the service
description: Finally .NET Framework 3.0 RTM’d, so I don’t have to run in my VMWare anymore. A good...
pubDate: '2006-11-09T12:38:57'
tags:
  - .NET Framework 3.0
  - Development
  - WCF
  - Windows Communication Foundation
redirect_from:
  - /dennis/2006/11/09/wcf-part-3-hosting-the-service
  - /blogs/dennis/archive/2006/11/09/wcf-part-3-hosting-the-service.aspx
---
Finally .NET Framework 3.0 [RTM’d](https://bloggingabout-linux.azurewebsites.net/blogs/mglaser/archive/2006/11/07/.NET-Framework-3.0-has-been-released_2100_.aspx), so I don’t have to run in my VMWare anymore. A good time to see if everything works and create the host for the service contract [we’ve created last time](/2006/10/31/WCF-Part-2-_3A00_-Defining-contract/). We’ll do this using a C# console application, as those just rock in simplicity.

We need a ServiceHost object to host our service. It implements IDisposable, so we’ll use the using statement to create one.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: blue">using</span> (<span style="color: teal">ServiceHost</span> host = <span style="color: blue">new</span> <span style="color: teal">ServiceHost</span>(<font color="#ff0000">xxx</font>))

{

}

</div>

You’ll hopefully immediately notice the three red x characters. That’s where we have to insert a parameter, our servicetype. For us this is our Hello contract. We also need to open the host we created, before it’s actually brought alive by WCF.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: teal">Type</span> type = <span style="color: blue">typeof</span>(<span style="color: teal">Hello</span>);

<span style="color: blue">using</span> (<span style="color: teal">ServiceHost</span> host = <span style="color: blue">new</span> <span style="color: teal">ServiceHost</span>(type))

{

  host.Open();

  <span style="color: teal">Console</span>.WriteLine(<span style="color: maroon">"The service is available. Press any key to continue..."</span>);

  <span style="color: teal">Console</span>.ReadKey();

  host.Close();

}

</div>

In the above final sample I first declare a type variable, assign our Hello service contract type to it and pass it into the constructor of our ServiceHost instance. I then open the service, show this in the console window and ask the user to press a key to close the service. Else the service would close immediately.

WCF however needs some information from configuration. It can all be done through code, but of course we like our app.config much better. We need to specify our WCF ABC. We’ve already created our contract, but we have to let WCF know what contract belongs to what binding on which address. First, compile your application. Then, in your project you can add the app.config, right-click it and select ‘Edit WCF Configuration…’ and you’ll see the Service Configuration Editor. Select ‘Create a New Service…” and you’ll be presented with a nice wizard.

The first step we need to tell it what service we’ll want to use, where the implementation of the service is. Select to browse and lookup your console application it’s executable and select it. You’ll see your Hello class, which you’ll have to select. The next page of the wizard will now just know that IHello is the contract we’ve used. Now we’ll have to select the first part of our binding, the protocol we’ll start using. Leave it at default. In the next step we’ll also choose the default setting. The difference between these two can roughly be described as standard ASP.NET ASMX webservices, where the second means WSE 3.0 extension.

Last thing of the WCF ABC is to select the address. You might want to choose http://localhost:8080/HelloService/. We’ll then get an overview of our selections and you can press the finish button. Be sure to check out what the wizard has changed inside the Service Configuration Editor. You’ll only have to research the “Services” folder as we did not yet change the others. After saving and looking at our app.config, we should find the following.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: blue"><?</span><span style="color: maroon">xml</span><span style="color: blue"> </span><span style="color: red">version</span><span style="color: blue">=</span>"<span style="color: blue">1.0</span>"<span style="color: blue"> </span><span style="color: red">encoding</span><span style="color: blue">=</span>"<span style="color: blue">utf-8</span>"<span style="color: blue"> ?></span>

<span style="color: blue"><</span><span style="color: maroon">configuration</span><span style="color: blue">></span>

<span style="color: blue">    <</span><span style="color: maroon">system.serviceModel</span><span style="color: blue">></span>

<span style="color: blue">        <</span><span style="color: maroon">services</span><span style="color: blue">></span>

<span style="color: blue">            <</span><span style="color: maroon">service</span><span style="color: blue"> </span><span style="color: red">name</span><span style="color: blue">=</span>"<span style="color: blue">Classa.Wcf.Samples.Hello</span>"<span style="color: blue">></span>

<span style="color: blue">                <</span><span style="color: maroon">endpoint</span>

<span style="color: blue">                  </span><span style="color: red">address</span><span style="color: blue">=</span>"<span style="color: blue">http://localhost:8080/HelloService/</span>"

<span style="color: blue">                  </span><span style="color: red">binding</span><span style="color: blue">=</span>"<span style="color: blue">basicHttpBinding</span>"<span style="color: blue">                  </span>

<span style="color: blue">                  </span><span style="color: red">contract</span><span style="color: blue">=</span>"<span style="color: blue">Classa.Wcf.Samples.IHello</span>"

<span style="color: blue">                  </span><span style="color: red">bindingConfiguration</span><span style="color: blue">=</span>""<span style="color: blue"> /></span>

<span style="color: blue">            </span><span style="color: maroon">service</span><span style="color: blue">></span>

<span style="color: blue">        </span><span style="color: maroon">services</span><span style="color: blue">></span>

<span style="color: blue">    </span><span style="color: maroon">system.serviceModel</span><span style="color: blue">></span>

<span style="color: blue"></span><span style="color: maroon">configuration</span><span style="color: blue">></span>

</span></div>

Notice that we have one service. In the above configuration you can see my namespace <span style="color: blue"><font face="Lucida Console" size="2">Classa.Wcf.Samples</font></span>. which I added extra. In the attachment I’ve included you can see where exactly this comes from. Also the bindingConfiguration attribute isn’t really necessary right now. What is important that we see our WCF ABC return again. Address, binding and contract!

You can run this and your service *will* run and be live, but noone can tell how to communicate with it. For this, we need metadata! But that’s for the next post.

[[Go to the WCF series article index](/2006/10/18/WCF-Part-0-_3A00_-Introduction/)]



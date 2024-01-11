---
layout: post
id: 483603
author: Dennis van der Stelt
date: 20100619 082400
title: WCF Simple Example in Visual Studio 2010 – part 2
description: This topic is covered in multiple posts Creating simplest solution with default endpo...
categories:
    - .NET Framework 2.0
    - .NET Framework 4.0
    - WCF
    - WCF4
redirect_from:
  - "/dennis/2010/06/19/wcf-simple-example-in-visual-studio-2010-part-2"
  - "/blogs/dennis/archive/2010/06/19/wcf-simple-example-in-visual-studio-2010-part-2.aspx"
---

This topic is covered in multiple posts

* [Creating simplest solution with default endpoints](/2010/06/16/wcf-simple-example-in-visual-studio-2010/)
* Manually adding and configuring the endpoints (you’re reading it right now)
* More to come…

The previous post was the most [simple example](/2010/06/16/wcf-simple-example-in-visual-studio-2010/) of creating a WCF service and calling it from a client application. In this post you can read how you can achieve the exact same behavior, but now manually adding every bit of configuration. So we’ll basically override the default endpoints, configure our won, resulting in exactly the same behavior.

The idea behind this is that you understand what WCF does and that you can do it yourself. Besides that, the previous .NET Framework versions don’t support the default endpoints, meaning that the solution at the end of this article also works in Visual Studio 2008.

What will we do?

1. Add BasicHttpBinding endpoint
2. Add MEX endpoint
3. Add Metadata behavior

### Metadata behavior

We’ll start with bullet three, simply because almost everything is already in place. The solution from the previous weblog post ended with this in the application configuration from the *ConsoleHost* application.

```csharp
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <system.servicemodel>
        <behaviors>
            <servicebehaviors>
                <behavior>
                    <servicemetadata httpgetenabled="True"></servicemetadata>
                </behavior>
            </servicebehaviors>
        </behaviors>
    </system.servicemodel>
</configuration>
```

The service behavior has no name, making it the default for all services in WCF4.All we have to do is give it a name. Change line 6 into the following.

```csharp
<behavior name="MyBehavior">
```

### Adding BasicHttpBinding endpoint

We’ll now add the first endpoint using the BasicHttpBinding. Right under `<system.servicemodel>` we’ll add the `<services></services>` tag and add our service. Completely empty this will result in the following.

```csharp
<services>
    <service name="">
        <endpoint address="" binding="" contract=""></endpoint>
    </service>
</services>
```

Now we have to fill in the blanks. More information can be found in the articles about the [WCF ABC](/2006/10/18/wcf-part-1-services-abc/) and [hosting the service](/2006/11/09/wcf-part-3-hosting-the-service/).

* Name  
  This is a bit misleading, as you can’t just enter any name, it’s actually the type of the service.  
  This must be the fully qualified name of the implementation of our service. This means not the interface, but the class. Its name is `EmailValidator` but its full name includes the namespace, resulting in `EmailService.EmailValidator`.
* Address  
  The address we don’t have to fill in, because the base address in our code already defines it. You can also define this in configuration as you can read in the post [Address](/blogs/dennis/archive/2006/11/29/WCF-Part-6-_3A00_-Address.aspx). 
* Binding  
  The binding is simply basicHttpBinding. Note the camelCasing. 
* Contract  
  Here we should enter the contract, which is our interface. As with the name attribute, we need to enter the fully qualified name, resulting in `EmailService.IEmailValidator`.

You can view the end result at the end of this article and in the download, also at the end of this article.

### Adding MEX endpoint

The MEX endpoint needs the metadata behavior configured, but we’ll get back to that. First we need to add the endpoint. Again the WCF ABC, an address, binding and contract.

* Address  
  Because we cannot have this endpoint at the same address as the BasicHttpBinding endpoint, we need to enter “mex” here. 
* Binding  
  This is simple, it’s just `mexHttpBinding`
* Contract  
  This is simple as well, although a bit weird, it HAS to be `IMetadataExchange`. Not the fully qualified name or anything, it has to be just this.
  
### Enabling the metadata behavior

Now all we have to do is add the metadata behavior. This is done at the root of the service, where we first entered the name. There’s another attribute there called `behaviorConfiguration`. We have to enter the name of our behavior configuration there, which is `MyBehavior`.

### End result

This results in the following configuration.

```csharp
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <system.servicemodel>
        <services>
            <service name="EmailService.EmailValidator" behaviorconfiguration="MyBehavior">
                <endpoint address="" binding="basicHttpBinding" contract="EmailService.IEmailValidator"></endpoint>
                <endpoint address="mex" binding="mexHttpBinding" contract="IMetadataExchange"></endpoint>
            </service>
        </services>
        <behaviors>
            <servicebehaviors>
                <behavior name="MyBehavior">
                    <servicemetadata httpgetenabled="True"></servicemetadata>
                </behavior>
            </servicebehaviors>
        </behaviors>
    </system.servicemodel>
</configuration>
```
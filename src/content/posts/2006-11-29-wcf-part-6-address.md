---
id: 60839
author: Dennis van der Stelt
title: WCF Part 6  Address
description: We’ll return once again to the WCF ABC and in this part we’ll examine what we can do ...
pubDate: '2006-11-29T05:33:02'
tags:
  - .NET Framework 3.0
  - Development
  - WCF
  - Windows Communication Foundation
redirect_from:
  - /dennis/2006/11/29/wcf-part-6-address
  - /blogs/dennis/archive/2006/11/29/wcf-part-6-address.aspx
---
We’ll return once again to the WCF ABC and in this part we’ll examine what we can do with the address of our service. There are many options on how to specify the address of your service, especially when you start combining options. But I’ll discuss the three main options. Don’t be scared by the size of this article, it’s easy to understand. 🙂
**Explicitly  
**As seen in [part 3](/2006/11/09/WCF-Part-3-_3A00_-Hosting-the-service/) about configuration, we configured the address of our service explicitly in the address attribute of our service’s endpoints; one for our service itself and one for metadata. What we haven’t done is setup an endpoint for WSDL discovery. If we want to enable http discovery, we need to set this up at the serviceMetadata behavior. Because we’re not using relative addresses, we need to set it explicitly as well.


```csharp
<servicebehaviors>
  <behavior name="MyServiceBehavior">
    <servicemetadata httpgetenabled="true" httpgeturl="http://localhost:8080/Hello/"></servicemetadata>
  </behavior>
</servicebehaviors>
```

Now the wsdl is immediately accessible from the root of our service or by adding /?wsdl to the url.
**Relative (preferred option)  
**You’re better of using relative addresses though, for various reasons. One of them is administration, as all addresses aren’t scattered throughout your config and application. To support relative addresses, the WCF team introduced base addresses to the configuration, after a lot of requests from users. Using a base address, you’d get the following.


```csharp
<system.servicemodel>
  <behaviors>
    <servicebehaviors>
      <behavior name="MyServiceBehavior">
        <servicemetadata httpgetenabled="true"></servicemetadata>
      </behavior>
    </servicebehaviors>
  </behaviors>
  <services>
    <service behaviorconfiguration="MyServiceBehavior" name="Hello">
      <endpoint address="Hello" binding="basicHttpBinding" contract="IHello"></endpoint>
      <endpoint address="MEX" binding="mexHttpBinding" contract="IMetadataExchange"></endpoint>
      <host>
        <baseaddresses>
          <add baseaddress="http://localhost:8080/"></add>
        </baseaddresses>
      </host>
    </service>
  </services>
</system.servicemodel>
```

As you can see, the *host* node was added with one base address. Next article we’ll introduce other bindings and have multiple base addresses. Both the service endpoint, the MEX endpoint and the WSDL document (enabled with httpGetEnabled) don’t need an address anymore. Their addresses are respectively:
* http://localhost:8080/Hello/
* http://localhost:8080/MEX/
* http://localhost:8080/?wsdl
**Programmatically  
**This is the option that was used in the past, before the base address was introduced. When creating a ServiceHost object, you can pass in the base addresses for it. Of course you can do this hardcoded, but we just don’t do that anymore in 2006 as we all know it’d take a recompile and redeploy to change the address. So we grab it from our configuration file. Here’s the config.


```csharp
<appsettings>
  <add key="httpBindingAddress" value="http://localhost:8080/"></add>
</appsettings>
```

And then we can use it in our code and pass it into our ServiceHost constructor, like this.


```csharp
Type type = typeof(Hello);

string httpBindingAddress = ConfigurationManager.AppSettings["httpBindingAddress"];
Uri[] baseAddresses = new Uri[] { new Uri(httpBindingAddress) };

using (ServiceHost host = new ServiceHost(type))
{
  host.Open();
}
```
**Multiple base addresses  
**Although we’re not going to talk about bindings and need multiple addresses, we *are* talking about addresses, so I want to show you how this is done. First, we’ll use the programmatic version. Of course our config file holds these addresses under different keys. The code would be this.


```csharp
string httpBindingAddress = ConfigurationManager.AppSettings["httpBindingAddress"];
string nettcpBindingAddress = ConfigurationManager.AppSettings["nettcpBindingAddress"];

Uri httpUri = new Uri(httpBindingAddress);
Uri nettcpUri = new Uri(nettcpBindingAddress);

Uri[] baseAddresses = new Uri[] { httpUri, nettcpUri };

using (ServiceHost host = new ServiceHost(type, baseAddresses))
{
```

So we can do this in config too? Of course. In the relative addresses method, the code doesn’t have to change. Isn’t that just great? Look at the changes between the configuration below and the one from the relative paragraph. And please note, that the MEX endpoint has information for *both* http and net-tcp endpoints.


```csharp
<service behaviorconfiguration="MyServiceBehavior" name="Hello">
  <endpoint address="httpHello" binding="basicHttpBinding" contract="IHello"></endpoint>
  <endpoint address="nettcpHello" binding="netTcpBinding" contract="IHello"></endpoint>
  <endpoint address="MEX" binding="mexHttpBinding" contract="IMetadataExchange"></endpoint>

  <host>
    <baseaddresses>
      <add baseaddress="http://localhost:8080/"></add>
      <add baseaddress="net.tcp://localhost:8090/"></add>
    </baseaddresses>
  </host>

</service>
```

[[Go to the WCF series article index](/2006/10/18/WCF-Part-0-_3A00_-Introduction/)]



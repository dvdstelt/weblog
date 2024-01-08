---
layout: post
id: 483568
author: Dennis van der Stelt
date: 20100616 063600
title: WCF Simple Example in Visual Studio 2010
description: This topic is covered in multiple posts Creating simplest solution with default endpo...
categories:
    - .NET Framework 3.0
    - .NET Framework 4.0
    - WCF
    - WCF4
redirect_from:
  - "/dennis/2010/06/16/wcf-simple-example-in-visual-studio-2010"
  - "/blogs/dennis/archive/2010/06/16/wcf-simple-example-in-visual-studio-2010.aspx"
---

This topic is covered in multiple posts
* Creating simplest solution with default endpoints (you’re reading it right now)
* [Manually adding and configuring the endpoints](/blogs/dennis/archive/2010/06/19/wcf-simple-example-in-visual-studio-2010-part-2.aspx)
* More to come…

It’s been a long, long time since I wrote the original [WCF Simple Example](/blogs/dennis/archive/2007/04/20/wcf-simple-example.aspx) post. It was even before Visual Studio 2008 and since then, a lot of things changed. As still a lot of folks place comments and questions to that post, let’s have a look at what we currently have to do to get a service up and running and consume it in a client.

This time we’ll start with a class library assembly (a .dll) and we’ll host the service inside a console application. The client will use a Windows Forms application again. Although we do everything in Visual Studio 2010, most will be usable in VS2008.I will mention it when it isn’t and provide an alternative. I’ll be a bit more descriptive about what we have to do, so this post is a little longer than the original.
**Create Project  
** First create a new “class library”, this will become the implementation of our service. Choose New Project and select the *Class Library* as project template. At the bottom, set as name for the project “EmailService” and the solution name “WCFSimpleExample2010”. If you can’t set the solution name, check the *Create directory for solution* box.

[![createnewproject](/images/wcf-simple-example-in-visual-studio-2010/2308_createnewproject_5f00_thumb_5f00_555cee4d.png)](/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/0284.createnewproject_5F00_2128C507.png)
**Create the contract  
** We’ll first create the contract with only one method; or *operation* as they are called in WCF. The “class library” should have added a class called “Class1”, you should rename it to IEmailValidator.cs and make it an interface with the same name.

Now add a single method signature called ValidateAddress that takes one string argument called emailAddress and returns a boolean. This is a normal interface, nothing fancy and the end result is as follows:


```csharp
public interface IEmailValidator
{
    bool ValidateAddress(string emailAddress);
}
```

Now we need to tell WCF that this is our contract. We do that by adding attributes, but first we need to add a reference to System.ServiceModel. Right-click the project and select *Add reference* and select System.ServiceModel from the list. I’m using the [Visual Studio 2010 Pro Power Tools](http://visualstudiogallery.msdn.microsoft.com/en-us/d0d33361-18e2-46c0-8ff2-4adea1e34fef) so my screen might look different from yours, but the idea is the same.

[![AddReference in solution explorer](/images/wcf-simple-example-in-visual-studio-2010/6175_addreference1_5f00_thumb_5f00_07548ed8.png)](/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/8737.AddReference1_5F00_6E58BE92.png) [![AddReference2](/images/wcf-simple-example-in-visual-studio-2010/8750_addreference2_5f00_thumb_5f00_6739821a.png)](/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/0243.AddReference2_5F00_4E3DB1D5.png)

Now you can add the attributes to your interface. On top of the interface place the [ServiceContract](http://msdn.microsoft.com/en-us/library/system.servicemodel.servicecontractattribute.aspx) attribute and on the operation place the [OperationContract](http://msdn.microsoft.com/en-us/library/system.servicemodel.operationcontractattribute.aspx) attribute. Add the using System.ServiceModel at the top of your codefile, or let Visual Studio do it for you by having your cursor in on of the attribute names. When you typed it in correctly and case sensitive, you can press CTRL + . and a context menu should appear to let you add the using automatically. Your interface should finally look like this:* ```csharp
[ServiceContract]
public interface IEmailValidator
{
    [OperationContract]
    bool ValidateAddress(string emailAddress);
}
```
**Create the service implementation** Now that we’ve created the contract we need to write code for the service to actually do what we want it to do. Create a new class and make it implement the interface. After that, use a regular expression to verify the email address and return true value if it’s correct. You should have something like the following code, or make up your own. 🙂


```csharp
public class EmailValidator : IEmailValidator
{
    public bool ValidateAddress(string emailAddress)
    {
        Console.WriteLine("Validating: {0}", emailAddress);

        string pattern = @"^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-w]*[0-9a-zA-Z])*.)+[a-zA-Z]{2,9})$";
        return Regex.IsMatch(emailAddress, pattern);
    }
}
```

Now you have the two most important classes for your service. You don’t actually have to use an interface, but it’s a best practice. That way you can inherit multiple interfaces for or do versioning with different interfaces.
**Creating the host** As said, for our host we’ll initially use a console application. Choose to add a new project and now have a *Console Application* as project template. Name it “ConsoleHost”.

[![CreateConsoleHost](/images/wcf-simple-example-in-visual-studio-2010/2746_createconsolehost_5f00_thumb_5f00_471e755d.png)](/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/7633.CreateConsoleHost_5F00_2E22A518.png)

Add the reference to *System.ServiceModel* again and also to your *EmailService* project. In your Main method, create a ServiceHost object and give it the correct arguments in the constructor, as shown below.


```csharp
Type serviceType = typeof(EmailValidator);
Uri serviceUri = new Uri("http://localhost:8080/");

ServiceHost host = new ServiceHost(serviceType, serviceUri);
host.Open();
```

On line 4 is the creation of the ServiceHost object. As first argument it receives the implementation of our service as a type. And a base address as second argument. Read [more about base addresses here](/blogs/dennis/archive/2006/11/29/WCF-Part-6-_3A00_-Address.aspx) and [more about hosting here](/blogs/dennis/archive/2006/11/09/WCF-Part-3-_3A00_-Hosting-the-service.aspx). The type is defined on line 1 and the base address on line 2.Finally on line 5 our host is started.
**WCF4 : Default endpoints** Now here’s a difference in .NET Framework 4.0 because this is not possible in previous version of .NET. Currently the default endpoints are used, which is a new feature to make configuration of your services less of a hassle. I like to explicitly define everything in detail so everyone knows what happens. But for our example, this works quite well. If you’re not using .NET 4.0 you might want to continue to[ part 2](/blogs/dennis/archive/2010/06/19/wcf-simple-example-in-visual-studio-2010-part-2.aspx) of this weblog post, which will be posted later.

You could add the default endpoints yourself by adding host.AddDefaultEndpoints(); to the code, right before the host.Open(); statement.

How can we see what endpoints are configured by default? I have a little script from [way back](/blogs/dennis/archive/2006/11/28/Display-WCF-host-details_3B00_-code-snippet.aspx) that displays everything currently running. I won’t go into details, just paste the following after the host.Open(); part.


```csharp
#region Output dispatchers listening
foreach (Uri uri in host.BaseAddresses)
{
    Console.WriteLine("t{0}", uri.ToString());
}

Console.WriteLine();
Console.WriteLine("Number of dispatchers listening : {0}", host.ChannelDispatchers.Count);
foreach (System.ServiceModel.Dispatcher.ChannelDispatcher dispatcher in host.ChannelDispatchers)
{
    Console.WriteLine("t{0}, {1}", dispatcher.Listener.Uri.ToString(), dispatcher.BindingName);
}

Console.WriteLine();
Console.WriteLine("Press &lt;ENTER&gt; to terminate Host");
Console.ReadLine();
#endregion
```

Now you should be able to see the endpoints like in the first following screenshot. You can use a browser like Internet Explorer to go to the service uri and look at the default [MEX endpoint](/blogs/dennis/archive/2006/11/09/WCF-Part-4-_3A00_-Make-your-service-visible-through-metadata.aspx).

[![ConsoleHostWithoutConfig](/images/wcf-simple-example-in-visual-studio-2010/6471_consolehostwithoutconfig_5f00_thumb_5f00_06e85be3.png)](/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/7853.ConsoleHostWithoutConfig_5F00_0E07985B.png) [![mexendpointwithoutconfig](/images/wcf-simple-example-in-visual-studio-2010/1200_mexendpointwithoutconfig_5f00_thumb_5f00_7fc91f6a.png)](/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/0068.mexendpointwithoutconfig_5F00_1FE42C28.png)

As you can see it’ll tell you that a MEX endpoint (aka metadata) isn’t configured yet. Now an easy way would be to do this via the new default endpoints. My first impression was that this would work.


```csharp
Type serviceType = typeof(EmailValidator);
Uri serviceUri = new Uri("http://localhost:8080/");

ServiceHost host = new ServiceHost(serviceType, serviceUri);
host.AddDefaultEndpoints();
// This actually doesn't just simply work.
host.AddServiceEndpoint(new ServiceMetadataEndpoint());
```

On line 5 you can see that we add the default endpoints and line 7 adds the ServiceMetadataEndpoint, or the MEX endpoint. Unfortunately it cannot add the Metadata behavior itself, so you still have to do this yourself. The other way it to specify in configuration that you want metadata enabled. Also new in WCF4 is that you can inherit configuration. You can specify in either the machine.config or in your local configuration what should be enabled by default for WCF services. I recommend you don’t do this in machine.config, but that’s just my opinion. Here’s how I enabled it in my project configuration, the app.config of our console host. Remember that in the follow up post to this, we’ll do this the old fashioned way, which will work in Visual Studio 2008 and has my preference.


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

As you can see, I have not specified a name for the behavior so in WCF4 this means it’ll be used by all services. This also means that every service needs a base address for http endpoints.

For reference, here’s the code for our console host:


```csharp
static void Main(string[] args)
{
    Type serviceType = typeof(EmailValidator);
    Uri serviceUri = new Uri("http://localhost:8080/");

    ServiceHost host = new ServiceHost(serviceType, serviceUri);
    host.Open();

    #region Output dispatchers listening
    foreach (Uri uri in host.BaseAddresses)
    {
        Console.WriteLine("t{0}", uri.ToString());
    }

    Console.WriteLine();
    Console.WriteLine("Number of dispatchers listening : {0}", host.ChannelDispatchers.Count);
    foreach (System.ServiceModel.Dispatcher.ChannelDispatcher dispatcher in host.ChannelDispatchers)
    {
        Console.WriteLine("t{0}, {1}", dispatcher.Listener.Uri.ToString(), dispatcher.BindingName);
    }

    Console.WriteLine();
    Console.WriteLine("Press &lt;ENTER&gt; to terminate Host");
    Console.ReadLine();
    #endregion
}
```
**Accessing the metadata  
** Because we now have enabled our service and our metadata endpoint, the MEX endpoint, we can view it through Internet Explorer or another browser. Execute the console host (it has to be alive or the endpoints won’t be accessible) and browse to the URI of your service : [http://localhost:8080/](http://localhost:8080/)

If this shows a nice screen with a link to the WSDL you’re very likely done with the service.
**Create client application  
** We’ll now add another project that will consume the service and will be able to verify if entered email addresses are valid, or at least according to our regular expression.

Add a new console application like before and this time call it ConsoleClient. Make sure your service (the host) is running, but don’t have it running in debug mode. Easiest way is to set the ConsoleHost project as startup project en press CTRL + F5 to run it without debugging turned on.

We now need a proxy class that sits between our client and service. There are two ways to create a proxy for our service. I have a preference for doing it manually, so you know what exactly is happening. I’ll show that first.
**Manually create proxy** First start up a Visual Studio 2010 (or Visual Studio 2008) Command Prompt and move to the location of the *ConsoleClient*. Because it’s a Visual Studio command prompt you should have access to the proxy generator svcutil.exe. Input the following commandline

<span style="font-family: Courier New;">svcutil http://localhost:8080/ /o:ServiceProxy.cs /config:App.Config /n:*,ConsoleClient</span>

This should generated two files, the service proxy and an application configuration file. Go back to Visual Studio and in your ConsoleClient application make all files visible through the icon at the top of the *Solution Explorer*, as seen in the right screenshot. The App.Config and ServiceProxy.cs should become available and you can include these.  
 <span style="font-size: xx-small;">**Update** : The console window screenshot shows ConsoleHost as namespace, this is incorrect and should be ConsoleClient as the full commandline statement above states.</span>

[![CreateProxy1](/images/wcf-simple-example-in-visual-studio-2010/8321_createproxy1_5f00_thumb_5f00_0d9b6566.png)](/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/7268.CreateProxy1_5F00_46B24268.png) [![CreateProxy2](/images/wcf-simple-example-in-visual-studio-2010/0361_createproxy2_5f00_thumb_5f00_6d8058a8.png)](/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/2210.CreateProxy2_5F00_54848863.png)

When we ran svcutil.exe the first argument was the location of our service as specified in the host. This is the base address. The second argument is what the tool should output, our proxy. The third argument is that we also want it to update our application configuration and if it’s not available, create it. The last argument is the namespace our proxy should be placed in (or should have), which should now be the same as our application itself.
**Call the service** Now we can finally start consuming the service. When you go to your *Main* method in your *Program* class again, you can access the proxy class, which is the name of your service with *Client* suffixed. So ours is *EmailValidatorClient*.


```csharp
EmailValidatorClient svc = new EmailValidatorClient();
bool result = svc.ValidateAddress("dennis@bloggingabout-linux.azurewebsites.net");
```

In line 1 you can see the proxy being initialized. Does doesn’t mean the connection is set up, this is done on first call. Line 2 shows the calling of the service and getting the result back.

This is our entire method *Main* which will continue to ask for email addresses until you enter none.


```csharp
static void Main(string[] args)
{
    while (true)
    {
        Console.WriteLine("Enter an email address or press [ENTER] to quit...");
        string emailAddress = Console.ReadLine();

        if (string.IsNullOrEmpty(emailAddress))
            return;

        EmailValidatorClient svc = new EmailValidatorClient();
        bool result = svc.ValidateAddress(emailAddress);

        Console.WriteLine("Email address is valid : {0}", result);
    }
}
```
**Creating proxy through Visual Studio, the easy way.  
** Instead of creating the service proxy manually, via svcutil.exe, you can also let Visual Studio create it for you. Just right-click the project and select ‘Add Service Reference…’ You’ll get a dialog window where you enter the address of your service and the namespace.

[![CreateServiceReference](/images/wcf-simple-example-in-visual-studio-2010/2311_createservicereference_5f00_thumb_5f00_4d654beb.png)](/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/4784.CreateServiceReference_5F00_34697BA6.png)

Now we entered *ConsoleClient* as namespace, but it concatenates this to the already existing namespace. So now you can access the *EmailValidatorClient* via *ConsoleClient.ConsoleClient.EmailValidatorClient*. One of the reasons I don’t like to use this automatically generated proxy class. You should now not forget to add a using statement to this namespace at the top of your class. Probably a better solution is to set the namespace to *Proxies* or something, in the dialog, so the complete namespace makes more sense.
**Run the client** While the service is still running (of not, restart it) you can right-click your ConsoleClient and select *Debug* and *Start new instance* and you’re done.
**What next?** Next we’ll extend this blogpost with at least two more, step-by-step blogposts explaining how to manually add endpoints and how to host your service in IIS. You can [read more about it here](/blogs/dennis/archive/2010/06/19/wcf-simple-example-in-visual-studio-2010-part-2.aspx).
**Download** Here’s the [download for VIsual Studio 2010](/files/WCFSimpleExample2010.zip). In the follow up article a Visual Studio 2008 solution is available.

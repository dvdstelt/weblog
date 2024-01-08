---
layout: post
id: 457968
author: Dennis van der Stelt
date: 20080228 085255
title: Hosting a WCF service in a Windows Service
description: In my last post I explained how you could use WCF and MSMQ to respond to messages asy...
categories:
    - .NET Framework 3.0
    - WCF
redirect_from:
  - "/dennis/2008/02/28/hosting-a-wcf-service-in-a-windows-service"
  - "/blogs/dennis/archive/2008/02/28/hosting-a-wcf-service-in-a-windows-service.aspx"
---

In my last post I explained how you could use WCF and MSMQ to respond to messages asynchronously. We’ve setup a class library with our service, a console application for our host and a console application for our client. In this post I’ll explain how we can use the class library again for hosting our WCF service in a Windows Service.
**1: Add the Windows Service** Add a new Windows Service project. Right-click the solution, choose “Add” -> “New Project…” and select “Windows” from the tree on the left. Then select “Windows Service” from the project templates. Call it “MailServiceHost” for example. It’ll create the project with a file (class) called ‘Service1.cs”. Rename it to ‘MailService.cs’ using the solution explorer.
**2: Implement OnStart and OnStop methods** When you look into your MailService class, you’ll see that it’s derived from ServiceBase and that two methods are already defined. We’ll first implement the OnStart method. Here we’ll do exactly the same as in the console application created in the previous article.
1. Create the message-queue of it does not exist yet.
2. Create and open the ServiceHost

The only difference now is that it’s a private member variable (defined on class level) because the OnStop method must have access to it as well.


```csharp
ServiceHost _host = null;

protected override void OnStart(string[] args)
{
  string queueName = ConfigurationManager.AppSettings["SendMailQueueName"];

  Trace.WriteLine("Starting Class-A E-mail Service...");

  if (!MessageQueue.Exists(queueName))
  {
    Trace.WriteLine("Creating queue : " + queueName);
    MessageQueue.Create(queueName, true);
  }

  _host = new ServiceHost(typeof(SendMailService));
  _host.Open();
}
```

Here’s a quick overview
* Line 1 declares the ServiceHost as member variable.
* Line 5 retrieves the queue name from your configuration file.
* Line 9 & 12 create the queue if it doesn’t exist yet.
* Line 15 & 16 instantiate and open the host.
* I’ve also added a few trace messages. The easiest way to see these is to get [DebugView](http://technet.microsoft.com/en-us/sysinternals/bb896647.aspx) from [SysInternals](http://technet.microsoft.com/en-us/sysinternals/default.aspx).

Now we have to implement the OnStop method.


```csharp
protected override void OnStop()
{
  Trace.WriteLine("Shutting down Class-A E-mail Service...");
  if (_host != null)
  {
    _host.Close();
    _host = null;
  }
}
```

Note that the above code does not do any error handling or check if the ServiceHost its state is actually open, etc, etc.
**3: Configuration** Now we have to add configuration. Add a new Application Configuration file and just copy & paste the entire configuration file from our previous Console Application host project.
**4: ProjectInstaller** We’ve created our service, but aren’t done yet. For Windows Services it’s best if you add a ProjectInstaller so the service can easily be installed. Choose to add a new item to the project and select the “General” category and then the “Installer Class” template.


```csharp
[RunInstaller(true)]
public partial class ProjectInstaller : Installer
{
  public ProjectInstaller()
  {
    InitializeComponent();
    ServiceProcessInstaller processInstaller= new ServiceProcessInstaller();
    ServiceInstaller serviceInstaller = new ServiceInstaller();
    processInstaller.Account = ServiceAccount.LocalSystem;
    serviceInstaller.StartType = ServiceStartMode.Automatic;
    serviceInstaller.ServiceName = "Class-A E-Mail MSMQ Service";
    Installers.Add(serviceInstaller);
    Installers.Add(processInstaller);
  }
}
```

In the above code we’ve added a [ServiceProcessInstaller](http://msdn2.microsoft.com/en-us/library/system.serviceprocess.serviceprocessinstaller.aspx) and a [ServiceInstaller](http://msdn2.microsoft.com/en-us/library/system.serviceprocess.serviceinstaller.aspx). The ServiceProcessInstaller is used by InstallUtil.exe and we’re using it to specify that we want to use the Local System account to run our service. If you specify ServiceAccount.User and don’t provide a username and password, it’ll request these during installation of the service. With the ServiceInstaller we’re specifying that our service has to start automatically on Windows startup and the name of our service.

That’s it, our WCF service is now running inside a Windows (Managed) Service.

Download [the solution](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2014/06/MSMQ-Example.zip "the solution") for a complete view on what we’ve done.

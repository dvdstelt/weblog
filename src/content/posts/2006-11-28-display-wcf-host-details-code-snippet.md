---
id: 59778
author: Dennis van der Stelt
title: Display WCF host details; code snippet
description: "Because I’m doing presentations, demos and the\_WCF article series, I host a lot of WC..."
pubDate: '2006-11-28T04:31:03'
tags:
  - .NET Framework 3.0
  - Development
  - Utilities
  - WCF
  - Windows Communication Foundation
  - Visual Studio 2005
redirect_from:
  - /dennis/2006/11/28/display-wcf-host-details-code-snippet
  - /blogs/dennis/archive/2006/11/28/display-wcf-host-details-code-snippet.aspx
---
Because I’m doing presentations, demos and the [WCF article series](/2006/10/18/WCF-Part-0-_3A00_-Introduction/), I host a lot of WCF services inside a console application. Console applications are great for demonstrating something really quickly. When hosting a WCF service in a console application, you require a pause so that your client applications can use the service. Preferably a user closes the service. I know Michele Leroux Bustamante was using some code to display basic information about the services and have used this to create myself a Visual Studio 2005 C# snippet. It shows the base addresses as well as dispatchers listening with their binding.

When you place the snippet into the appropriate folder (depends on which version of Windows you’re using 😉 you can press either CTRL-K, CTRL-X and select it manually, or you use the intellisense version and type “host” into Visual Studio 2005 and press the TAB key twice. You can then supply the name of your host object and run your service.

Unfortunately C# cannot add namespaces, so the snippet presumes you have System.ServiceModel referenced.

Here’s the code, place save it under “host.snippet”.


```csharp
<?xml version="1.0" encoding="utf-8" ?>
<codesnippets xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet">
  <codesnippet format="1.0.0">

      <shortcut>host</shortcut>
      <description>Code snippet for displaying WCF ServiceHost details in a console application.</description>
      <author>Dennis van der Stelt</author>
      <snippettypes>
        <snippettype>Expansion</snippettype>
      </snippettypes>

    <snippet>
      <references>
        <reference>
          <assembly>System.ServiceModel</assembly>
        </reference>
      </references>
      <declarations>
        <literal>
          <id>host</id>
          <tooltip>The host object</tooltip>
          <default>host</default>
        </literal>
      </declarations>
      <code language="csharp">
        <![CDATA[Console.WriteLine("Number of base addresses : {0}", $host$.BaseAddresses.Count);
        foreach (Uri uri in $host$.BaseAddresses)
        {
          Console.WriteLine("t{0}", uri.ToString());
        }

        Console.WriteLine();
        Console.WriteLine("Number of dispatchers listening : {0}", $host$.ChannelDispatchers.Count);
        foreach (System.ServiceModel.Dispatcher.ChannelDispatcher dispatcher in $host$.ChannelDispatchers)
        {
          Console.WriteLine("t{0}, {1}", dispatcher.Listener.Uri.ToString(), dispatcher.BindingName);
        }

        Console.WriteLine();
        Console.WriteLine("Press <ENTER> to terminate Host");
        Console.ReadLine();]]>
      </code>
    </snippet>
  </codesnippet>
</codesnippets>
```


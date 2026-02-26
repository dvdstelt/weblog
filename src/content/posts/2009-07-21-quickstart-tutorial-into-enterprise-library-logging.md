---
id: 481951
author: Dennis van der Stelt
title: Quickstart tutorial into Enterprise Library logging
description: How do you go about logging with Enterprise Library with the following line Logger.Wr...
pubDate: '2009-07-21T01:26:25'
tags:
  - Enterprise Library
redirect_from:
  - /dennis/2009/07/21/quickstart-tutorial-into-enterprise-library-logging
  - /blogs/dennis/archive/2009/07/21/quickstart-tutorial-into-enterprise-library-logging.aspx
---
How do you go about logging with Enterprise Library with the following line


```csharp
Logger.Write("Hello world");
```

I came up with this post because I explain Enterprise Library logging to a lot of people, in a very short time. You can probably talk about logging and Enterprise Library for a long, long time. But I just want to introduce the very basics of logging. When a new developer starts working at a customer or students in my class want to know, this is the shortest possible story I tell them. That’s why I decided to write this down, as it’s still information people tend to forget easily.

I’m talking about Enterprise Library 4.1 and this is what I’ll explain:
* Adding the necessary resources (assemblies, dll files) 
* Adding and understanding minimal configuration. 
* Logging information with and without a specific category. 

Again, I could talk about priorities and more, but this is just the basics. For more information I’d redirect you to the [Enterprise Library](http://msdn.microsoft.com/en-us/library/dd203099.aspx) manual on [logging](http://msdn.microsoft.com/en-us/library/dd139916.aspx).

### Adding necessary resources

When you’ve installed Enterprise Library 4.1 correctly, you should have the assemblies in your “Add Reference…” dialog under the .NET tab. If not, you can always add them from the folder *C:Program FilesMicrosoft Enterprise Library 4.1 – October 2008Bin* or from *C:Program Files (x86)Microsoft Enterprise Library 4.1 – October 2008Bin* if you’re running on a 64bit machine.
**Sidenote** : It’s always best to copy the necessary assemblies to a project specific lib folder so that everyone can use your logging solution without installing Enterprise Library. This also goes for the build server, which should obtain the assemblies from source control.

![addreferencedialog](/images/quickstart-tutorial-into-enterprise-library-logging/0777_addreferencedialog_5f00_thumb_5f00_6397a9a0.png)

In the above image you can see the “Enterprise Logging Application Block” we should add. In Visual Studio this is the only reference you <u>need</u> to add. After you’ve compiled your project however, you’ll notice additional assemblies being added to the /bin/ folder. It’s out of the scope of this article, what these assemblies do. But the following assemblies are the minimum you need to use Enterprise Library logging. If you have /lib/ folder in source control, put these assemblies in, for the build server to correctly build your projects.
* Microsoft.Practices.EnterpriseLibrary.Common.dll 
* Microsoft.Practices.EnterpriseLibrary.Logging.dll 
* Microsoft.Practices.ObjectBuilder2.dll![EditConfiguration](/images/quickstart-tutorial-into-enterprise-library-logging/7624_editconfiguration_5f00_thumb_5f00_7169ef9b.png) 
* Microsoft.Practices.Unity.dll 

### Adding minimal configuration

If you haven’t, first add a web.config or app.config to your application. If installed correctly, right-click your configuration file and select “*Edit Enterprise Library Configuration*” as shown on the right in image 2.

![InitialConfig](/images/quickstart-tutorial-into-enterprise-library-logging/4571_initialconfig_5f00_thumb_5f00_514ee2de.png)The Enterprise Library configuration tool will be opened. If not, run the tool from the start menu or locate it in the above mentioned folder. After opening it, you should see the empty configuration, as shown in image 3.There’s already a connectionstring in the Data Access block, which is ‘inherited’ from machine.config.

In image 3 you can see an arrow where you should right-click and select “New” and “Logging Application Block”. When the configuration is added, these are the folders that are added
1. **Filters** I won’t discuss these, but they’re not too difficult to understand either. 
2. **Category sources** Everything you log in your application, falls under a category. When you don’t specify a category while logging, the default category is used. You can see the default category added right now is called “General”. 
3. **Special sources** When Enterprise Library tries to log something but it doesn’t work (for example you try to log to the database, but it can’t find the database) or it can’t find a category you specified, this is the place to configure what should happen then. 
4. **Trace Listeners  
**If you want to log to the database, a file, eventlog or anything else, you need trace listeners. By default trace listeners are added for logging to database, file, email, eventlog, msmq, wmi and more… 
5. **Formatters** You need formatters to… well, format your logging messages. 

We’ll start with these. 

#### Formatters

![FormatterTemplateProperties](/images/quickstart-tutorial-into-enterprise-library-logging/2437_formattertemplateproperties_5f00_thumb_5f00_3133d621.png)Open up the “Formatters” folder and select “Text Formatter”. In the properties pane (press F4 if it’s not there or select from the menu “View” and “Properties Window”. In the properties pane (or window) there’s a property called “Tempalte”. Select its value and press the button on the site as shown on the right.

A new dialog window should open with the current message template. As you can see there’s a lot of data there. The minimum message you can use should probably be something like below. When logging to, for example, a database or you’re tracing a lot of messages for some reason, this is probably easier to digest. You can use a cool tool like [baretail](http://www.baremetalsoft.com/baretail/) to read the messages while they’re being written to the logfile on the server. When you’re logging exceptions or other information, you probably want much more detail. At the bottom of the dialog or the possible tokens you can insert. For now, leave it like it is.

![FormatterTemplateEditor](/images/quickstart-tutorial-into-enterprise-library-logging/0383_formattertemplateeditor_5f00_thumb_5f00_1118c964.png)

However, do rename the formatter from “Text Formatter” to “My Formatter”. Now right-click any node in the configuration editor and select “Validate”. You’ll see everything validates, even though you just changed the name of the formatter. That’s how cool Enterprise Library is. 😉

#### Trace Listeners

We’ll add a new trace listener as the “Formatted EventLog TraceListener” can give problems on a server because the account that’s trying to log messages isn’t authorized to write into the eventlog. Right-click the “Trace Listeners” folder and select “New” and “Rolling Flat File Trace Listener”. In the properties pane, rename it to “Rolling Flat File”. Change the filename so that it will log to a specific directory. I normally use something like “C:LoggingProjectName"”. You can already specify a filter here, but we’ll leave it at “All”.

For the formatter property you’ll have to select “My Formatter”, which is the text formatter you just renamed. Also notify the other properties available. You can specify to use a time interval to create a new logfile, or a size interval. Set it to a small size, something like 1Kb so you can easily test what will happen.

#### Categories

Let’s add a new category and set that category as default one. If you do so, it’s probably best to remove the “General” category, as most people will think that will be the default. Create a new category called “DefaultCategory”. Select the “Logging Application Block” folder and in the properties pane select your new category to be the default one.

Right-click your new “DefaultCategory” category and select “New” and “Trace Listener Reference”. In the properties pane, change the “ReferencedTraceListener” to be your “Rolling Flat File” trace listener.

### Logging information

You’re now done with the configuration. Save it and go to your code. Enter the following line somewhere in your code:


```csharp
Logger.Write("Hello world");
```

Now go check your configured folder for the file. If it’s not that, check the eventlog anyway, as Enterprise Library might have failed and maybe has written the info there. This worked for me, as I ran into this [read or write protected memory error](/2009/06/08/attempted-to-read-or-write-protected-memory-in-a-net-application/) when creating this article.

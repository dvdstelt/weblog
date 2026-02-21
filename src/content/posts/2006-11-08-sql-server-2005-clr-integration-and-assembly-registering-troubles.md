---
id: 44031
author: Dennis van der Stelt
title: SQL Server 2005 CLR integration and assembly registering troubles
description: For the first time in my life I’m playing around with the new SQL Server 2005 .NET CL...
pubDate: '2006-11-08T05:15:00'
tags:
  - Development
  - SQL Server 2005
  - .NET
  - Management Studio
redirect_from:
  - /dennis/2006/11/08/sql-server-2005-clr-integration-and-assembly-registering-troubles
  - /blogs/dennis/archive/2006/11/08/sql-server-2005-clr-integration-and-assembly-registering-troubles.aspx
---
For the first time in my life I’m playing around with the new SQL Server 2005 .NET CLR integration. A mouth full, as everything with Microsoft.

The most easy way is to start a new DatabaseSQL Server Project. You then right-click the project and select to add a “Stored Procedure…”. In your newly created class you can produce something like this: 

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

[Microsoft.SqlServer.Server.<span style="color: teal">SqlProcedure</span>]

<span style="color: blue">public</span> <span style="color: blue">static</span> <span style="color: blue">void</span> MyFirstStoredProcedure()

{

  <span style="color: teal">SqlContext</span>.Pipe.Send(<span style="color: maroon">"dude!"</span>);

}

</div>

After that, look in the “Test Scripts” directory and find the Test.sql script. In it you’ll want exactly one line.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: blue">exec </span>MyFirstStoredProcedure

</div>

If you haven’t done so already, enable CLR integration in SQL Server 2005.
<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

sp_configure <span style="color: maroon">'clr enabled'</span>, 1

GO

RECONFIGURE

GO

</div>

Next step is just hit F5, but only when you have SQL Server 2005 on the machine you’re working on. On my machine, it sometimes completely locks up, but comes back after a minute or so. Great huh?

In your output window you should see the “dude!” message. Let’s see how we can enable this on a server that’s not locally run. With Management Studio you connect to the remote server. If you haven’t changed the name of your project, it’ll be ‘SqlServerProject1’. Let’s register it.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

IF EXISTS (SELECT * FROM sys.assemblies WHERE [name] = <span style="color: maroon">'SqlServerProject1'</span>)

DROP ASSEMBLY [SqlServerProject1]

GO

CREATE ASSEMBLY SqlServerProject1 

FROM <span style="color: maroon">'C:projectsSqlServerProject1binDebugSqlServerProject1.dll'</span>

WITH PERMISSION_SET = SAFE;

GO;

</div>

Now in the above code, you can see the exact command to remove the assembly if it already existed (which isn’t very likely 😉 and to register it. However, when creating this post, at some point this didn’t work anymore. I’ll come back to this, but in the meanwhile while you get an error, it’s also possible to register your assembly in Management Studio. When you go to your database, open the “Programmability” folder, and then “Assemblies”. Right-click it and choose to add your assembly.

Now let’s register our Stored Procedure.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

CREATE PROCEDURE StoredProcedure1

AS EXTERNAL NAME SqlServerProject1.[SqlServerProject1].MyFirstStoredProcedure;

</div>

When you go look for your StoredProc, you can see a little lock symbol in the icon. That’s because we registered the assembly with permission to safe, so the asssembly can’t access the drive, registry, etc.

Now you have a C# Stored Procedure in SQL Server 2005.However, that’s not why I was initially writing this post. I just kept getting errors registering my assembly and could not figure out why. The error was :

<font color="#800000">**Could not impersonate the client during assembly file operation**</font>

After searching Google, it should have something to do with not being able to access the file or something. But it happened to me all the time when I was trying to register my assembly on the remote SQL Server. Even when I used an incorrect path to my assembly. I started to think they used the following code to register assemblies.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: blue">public</span> <span style="color: blue">void</span> RegisterAssembly(<span style="color: blue">string</span> fullPath)

{

  <span style="color: blue">try</span>

  {

    <span style="color: green">// code to register assembly</span>

  }

  <span style="color: blue">catch</span> 

  {

    <span style="color: green">// Console.WriteLine("Dude, something went wrong!");</span>

    <span style="color: teal">Console</span>.WriteLine(<span style="color: maroon">"Could not impersonate the client during assembly file operation"</span>);

  }

}

</div>

 For some reason it works now and the error doesn’t return, hopefully.

If you want more info on SQL CLR integration, download some samples [here](http://msdn2.microsoft.com/en-us/sql/aa336343.aspx).



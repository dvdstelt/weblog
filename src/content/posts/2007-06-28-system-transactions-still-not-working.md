---
id: 283402
author: Dennis van der Stelt
title: System.Transactions still not working
description: "UPDATE  It seems the SQL team actually have build a solution.\_ A while ago I wrote s..."
pubDate: '2007-06-28T01:25:00'
tags:
  - .NET Framework 3.5
  - SQL Server 2005
  - SQL Server 2008
  - Visual Studio 2005
  - Visual Studio 2008
  - Orcas
  - SQL Server
  - Transactions
redirect_from:
  - /dennis/2007/06/28/system-transactions-still-not-working
  - /blogs/dennis/archive/2007/06/28/system-transactions-still-not-working.aspx
---
**UPDATE : It seems the SQL team actually have [build a solution](http://blogs.msdn.com/adonet/archive/2008/03/26/extending-lightweight-transactions-in-sqlclient.aspx).** A while ago I wrote some articles on System.Transactions and the fact that [it’s almost impossible to use the Lightweight Transaction Manager](https://bloggingabout.net/2006/03/20/11748) (LTM) and not get bumped up to a distributed transaction and use MSDTC.

When you look at the sourcecode it’s easy to see what’s happening
1. Open a connection to MyServer with *using* keyword  
2. Execute an insert statement to TestTable  
3. Close *using*, but the connection stays open in the background to reply to ready-to-commit question.  
4. Open a new connection to MyServer with *using* keyword  
5. We’re already using a distributed transaction

<div>  

<span>string</span> ConnectionString = <span>@”Data Source=MyServer;Initial Catalog=Test;Integrated Security=SSPi;”</span>;

<span>using</span> (<span>TransactionScope</span> scope = <span>new</span> <span>TransactionScope</span>())

{

  <span>using</span> (<span>SqlConnection</span> conn1 = <span>new</span> <span>SqlConnection</span>(ConnectionString))

  {

    <span>SqlCommand</span> cmd1 = <span>new</span> <span>SqlCommand</span>(<span>“insert into TestTable([value]) Values (‘This creates a new row’)”</span>, conn1);

    conn1.Open();

    cmd1.ExecuteNonQuery();

    <span>Console</span>.WriteLine(<span>“DistributedID : {0}”</span>, System.Transactions.<span>Transaction</span>.Current.TransactionInformation.DistributedIdentifier);

  }

  <span>using</span> (<span>SqlConnection</span> conn2 = <span>new</span> <span>SqlConnection</span>(ConnectionString))

  {

    <span>SqlCommand</span> cmd2 = <span>new</span> <span>SqlCommand</span>(<span>“insert into TestTable([value]) Values (‘This creates a new row’)”</span>, conn2);

    conn2.Open(); <span>// Promotion to MSDTC occurs!</span>

    cmd2.ExecuteNonQuery();

    <span>Console</span>.WriteLine(<span>“DistributedID : {0}”</span>, System.Transactions.<span>Transaction</span>.Current.TransactionInformation.DistributedIdentifier);

  }

}
</div>  

When you look at [this thread](http://forums.microsoft.com/MSDN/ShowPost.aspx?PostID=626675&SiteID=1) on MSDN Forums, Pablo Castro said that it’s a server-side (SQL Server) fix. Florin Lazar replies that this issue will likely not be addressed in Visual Studio Orcas (VS2008 by now).

Florin is right, **<font color="#ff0000">it still doesn’t work in Visual Studio 2008</font>**.  
Even worse, **<font color="#ff0000">it’s also not addressed in SQL Server 2008</font>**.
**Update : Or is** [**this the solution**](http://blogs.msdn.com/adonet/archive/2008/03/26/extending-lightweight-transactions-in-sqlclient.aspx) **we’ve been waiting for? ** So my question is, when is Microsoft going to address this issue?! When will System.Transactions work like it’s supposed to?



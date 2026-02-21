---
id: 25173
author: Dennis van der Stelt
title: System.Transactions  What to choose?
description: I’ve blogged about the .NET 2.0 System.Transactions namespace before (toc at the bott...
pubDate: '2006-09-27T05:39:00'
tags:
  - Development
redirect_from:
  - /dennis/2006/09/27/system-transactions-what-to-choose
  - /blogs/dennis/archive/2006/09/27/system-transactions-what-to-choose.aspx
---
I’ve blogged about the .NET 2.0 System.Transactions namespace before (toc at the bottom of this post), letting you know that in almost no circumstances, the Lightweight Transaction Manager (LTM) will be used. When you can’t use distributed transactions for some reason, or don’t want the performance penalty, System.Transactions isn’t a choice. It’s really sad so little people mention this when talking about the TransactionScope.  

Here’s example code again on when your transaction gets promoted to MSDTC:  

<div>  

<span>string</span> ConnectionString = <span>@”data source=.;datasource=Logs;integrated security=SSPI;”</span>;

<span>using</span> (<span>TransactionScope</span> scope = <span>new</span> <span>TransactionScope</span>())

{

  <span>using</span> (<span>SqlConnection</span> conn1 = <span>new</span> <span>SqlConnection</span>(ConnectionString))

  {

    <span>SqlCommand</span> cmd1 = <span>new</span> <span>SqlCommand</span>(<span>“insert into LogFile(Message) Values (‘This creates a new row’)”</span>, conn1);

    conn1.Open();

    cmd1.ExecuteNonQuery();

  }

  <span>using</span> (<span>SqlConnection</span> conn2 = <span>new</span> <span>SqlConnection</span>(ConnectionString))

  {

    <span>SqlCommand</span> cmd2 = <span>new</span> <span>SqlCommand</span>(<span>“insert into LogFile(Message) Values (‘This creates a new row’)”</span>, conn2);

    conn2.Open(); <span>// **Promotion to MSDTC occurs!**</span>

    cmd2.ExecuteNonQuery();

  }

}
</div>  

Now for the performance part, recently I found [a post by Nate Moch](http://blogs.msdn.com/natemoch/archive/2005/07/22/442064.aspx) about the difference between ADO.NET and System.Transactions. He says using the TransactionScope on SQL-Server 2005 with a local transaction delivers 94% of the performance of an ADO.NET transaction. When you’re promoted to a distributed transaction, “you **should be able** to get System.Transactions to perform at **56%** of the performance of ADO.Net transactions directly.”  

Mind the bold part “should be able”.  

So what are your other options if you don’t want or can’t use System.Transactions?  
 1.Enterprise Services  
For many not really an option. On class level you have to configure if you want to join the running transaction and your class has to inherit from the SerivcedComponent class.  
 2.T-SQL Transactions  
Of course you can always start transactions in your Stored Procedure with BEGIN TRANSACTION. Not very flexible though and in your code you have no idea what’s happening in your database. Other dbms have of course their own ways of achieving this. Delivers best performance.  
 3.ADO.NET Transactions  
Within ADO.NET you can create connections with your SqlConnection object with the BeginTransaction method. Normally however you’d be using multiple classes and methods to execute commands on your database. Enlisting all these commands in the created transaction, you’ll have to pass either the connection or Transaction object to every method. This doesn’t deserve a price for best design.  
In the background, this is exactly the same as option 2, the T-SQL Transaction. The difference is that you can use the transaction over multiple Stored Procedures (or inline queries). Performance is great, as in option 2.  
4.Your own implementation  
Of course you can always implement something yourself, but this is much more complex and might not always be a good solution.   

But what are the benefits of the TransactionScope?
1. Anywhere in your code you can start the transaction. It’s also a very clean and clear solution.  
2. Within a using statement, your transaction will always be rolled back when an error occurs and the Complete() method hasn’t been reached.  
3. Database code doesn’t have to be aware of the transaction code. If required, it still can.  
4. Multiple DBMS can easily enlist in the transaction.  
5. A lot more than your database actions can enlist in the transaction. Think files, registry, variables, etc.  
6. The problem with promotion to MSDTC with the exact same connectionstring [will be fixed](http://forums.microsoft.com/MSDN/ShowPost.aspx?PostID=626675&SiteID=1). No one can tell when however.  
7. Microsoft and especially Windows Communication Foundation use System.Transactions heavily. It’s really the way to go for the future.
**Conclusion** So when you don’t have to worry about the 50% performance loss, or you know you (might) need distributed transactions, System.Transactions is the right choice. When you really have to care about performance, it might not be the right choice.

For everyone else, I advice to setup some test project and see what has to be done for the four above mentioned alternatives. When you need to inherit from a specific class, or you can’t pass along the connection object, System.Transactions is probably your only good alternative.

When in doubt, just use System.Transactions. When looking at the last list, I think it’s a good option. Especially considering the alternatives.

Table of contents  
 1.[An introduction](/2006/02/09/11011/)  
 2.[Unit Testing](/2006/02/10/11017/)  
 3.[Promotable Enlistment](/2006/03/20/11748/)  
 4.What to choose?

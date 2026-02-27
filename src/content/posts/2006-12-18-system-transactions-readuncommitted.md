---
id: 78225
author: Dennis van der Stelt
title: System.Transactions  ReadUncommitted
description: Download code & sql scripts here I got a question today about setting the isolationle...
pubDate: '2006-12-18T12:13:08'
tags:
  - architecture
  - Development
  - SQL Server 2005
  - System.Transactions
  - Transactions
  - .NET
redirect_from:
  - /dennis/2006/12/18/system-transactions-readuncommitted
  - /blogs/dennis/archive/2006/12/18/system-transactions-readuncommitted.aspx
---
[Download code & sql scripts here](https://bloggingabout-linux.azurewebsites.net/userfiles/dennis%20van%20der%20stelt/file/IsolationLevelTest.zip) 

I got a question today about setting the isolationlevel on a transaction to ReadUncommitted. The question was why the transaction still locked the row it was updating, when isolationlevel is set to ReadUncommitted. It was expected that using ReadUncommitted on the transaction allowed other requests (on a different connection) to read the data, even when it wasn’t committed. When we take a look at the [SQL Server 2005 Books Online](http://msdn2.microsoft.com/en-US/library/ms173763.aspx) you can read the following: 

> Specifies that statements can read rows that have been modified by other transactions but not yet committed.

When you read this real fast, you might think that statements can read rows that have been modified by transactions, but not yet committed. But it doesn’t say that. It says, “*rows that have been modified by **<u>other</u>** transactions…”* So what’s the difference? Let’s look at it through code. 

![](/images/system-transactions-readuncommitted/systx011.png) I’ve setup a simple table with two columns. The table is called [MyTable] with a primary key called [MyTableId] of type integer. Also a column called [value] of type varchar(50). I’ve added five rows which you can see on the left. 

I’ve got some examples in which I’ll create a transaction, update the 5th row with a new value. In every example I’ve added wait statements so that another connection can try to read the changed value of this 5th row. It’ll either fail because of a lock, or not if done correctly. 

The following T-SQL code will setup the transaction’s isolation level to Read Uncommitted (line 1), start a new transaction (line 4) and try to update the table (lines 6-8). It than waits for 15 seconds (line 10) and finally rollback the transaction (line 12). Within these 15 seconds you’ll have time to execute another query in another query-window. For example “*select * from MyTable where MyTableId = 5*“. You’ll notice it’ll lock-up for 15 seconds. 

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 10pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: #2b91af">    1</span> SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

<span style="color: #2b91af">    2</span> GO

<span style="color: #2b91af">    3</span> 

<span style="color: #2b91af">    4</span> BEGIN TRANSACTION

<span style="color: #2b91af">    5</span> 

<span style="color: #2b91af">    6</span> UPDATE  MyTable

<span style="color: #2b91af">    7</span> SET    Value = <span style="color: #a31515">‘changed’</span>

<span style="color: #2b91af">    8</span> WHERE  MyTableId = 5

<span style="color: #2b91af">    9</span> 

<span style="color: #2b91af">   10</span> WAITFOR DELAY <span style="color: #a31515">’00:00:15′</span>

<span style="color: #2b91af">   11</span> 

<span style="color: #2b91af">   12</span> ROLLBACK TRANSACTION

</div>

Why is this happening when IsolationLevel is set to Read Uncommitted? The answer lies in the single word “other”, as stated above. When setting IsolationLevel to Read Uncommitted, you can read rows from *another* transaction. But you’ll have to set the isolation level on *this* connection. On the connection you’re reading with! For this you don’t need a new transaction, but you do need to copy line 1 from the T-SQL code above. 

Or you can use a [table hint.](http://msdn2.microsoft.com/en-us/library/ms187373.aspx) “Hint’ is actually a [misnomer](http://en.wiktionary.org/wiki/misnomer), because it’s not a *hint*. It overrules the currently set isolation level. In our case, we could use the table hint as follows.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 10pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

SELECT  Value

FROM  MyTable WITH (READUNCOMMITTED)

WHERE  MyTableId = 5

</div>

We can achieve the same result(s) in .NET. I’m written my examples using .NET 2.0 but I’m (pretty) sure the first example can be used in .NET 1.x as well.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 10pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: #2b91af">    1</span> <span style="color: blue">const</span> <span style="color: blue">string</span> connectionString = <span style="color: #a31515">“server=dennisvista;database=laboratory;integrated security=sspi;”</span>;

<span style="color: #2b91af">    2</span> 

<span style="color: #2b91af">    3</span> <span style="color: blue">const</span> <span style="color: blue">string</span> query1 = <span style="color: #a31515">“update mytable set value = ‘changed’ where myTableId = 5”</span>;

<span style="color: #2b91af">    4</span> <span style="color: blue">const</span> <span style="color: blue">string</span> query2 = <span style="color: #a31515">“select value from myTable where myTableId = 5”</span>;

<span style="color: #2b91af">    5</span> <span style="color: blue">const</span> <span style="color: blue">string</span> query3 = <span style="color: #a31515">“select value from myTable with (readuncommitted) where myTableId = 5”</span>;

<span style="color: #2b91af">    6</span> <span style="color: blue">const</span> <span style="color: blue">string</span> setIsolationLevel = <span style="color: #a31515">“SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED”</span>;

<span style="color: #2b91af">    7</span> 

<span style="color: #2b91af">    8</span> <span style="color: #2b91af">SqlConnection</span> con1 = <span style="color: blue">new</span> <span style="color: #2b91af">SqlConnection</span>();

<span style="color: #2b91af">    9</span> <span style="color: #2b91af">SqlConnection</span> con2 = <span style="color: blue">new</span> <span style="color: #2b91af">SqlConnection</span>();

<span style="color: #2b91af">   10</span> 

<span style="color: #2b91af">   11</span> con1.ConnectionString = connectionString;

<span style="color: #2b91af">   12</span> con2.ConnectionString = connectionString;

<span style="color: #2b91af">   13</span> 

<span style="color: #2b91af">   14</span> con1.Open();

<span style="color: #2b91af">   15</span> con2.Open();

<span style="color: #2b91af">   16</span> 

<span style="color: #2b91af">   17</span> <span style="color: #2b91af">SqlTransaction</span> trans = con1.BeginTransaction(System.Data.<span style="color: #2b91af">IsolationLevel</span>.ReadUncommitted);

<span style="color: #2b91af">   18</span> 

<span style="color: #2b91af">   19</span> <span style="color: #2b91af">SqlCommand</span> cmd1 = <span style="color: blue">new</span> <span style="color: #2b91af">SqlCommand</span>();

<span style="color: #2b91af">   20</span> cmd1.Connection = con1;

<span style="color: #2b91af">   21</span> cmd1.Transaction = trans;

<span style="color: #2b91af">   22</span> cmd1.CommandText = query1;

<span style="color: #2b91af">   23</span> 

<span style="color: #2b91af">   24</span> <span style="color: #2b91af">SqlCommand</span> cmd2 = <span style="color: blue">new</span> <span style="color: #2b91af">SqlCommand</span>();

<span style="color: #2b91af">   25</span> cmd2.Connection = con2;

<span style="color: #2b91af">   26</span> cmd2.CommandText = query2;

<span style="color: #2b91af">   27</span> 

<span style="color: #2b91af">   28</span> cmd1.ExecuteNonQuery();

<span style="color: #2b91af">   29</span> 

<span style="color: #2b91af">   30</span> <span style="color: green">// Uncomment the following line to set the ReadUncommited isolation level</span>

<span style="color: #2b91af">   31</span> <span style="color: green">// new SqlCommand(setIsolationLevel, con2).ExecuteNonQuery();</span>

<span style="color: #2b91af">   32</span> 

<span style="color: #2b91af">   33</span> <span style="color: green">// Timeout will occur because of the lock</span>

<span style="color: #2b91af">   34</span> <span style="color: blue">string</span> value = cmd2.ExecuteScalar().ToString();

<span style="color: #2b91af">   35</span> 

<span style="color: #2b91af">   36</span> trans.Rollback();

<span style="color: #2b91af">   37</span> 

<span style="color: #2b91af">   38</span> con1.Close();

<span style="color: #2b91af">   39</span> con2.Close();

</div>

We’ve got two connections set up. On line 17, we set the IsolationLevel to ReadUncommitted. Again this doesn’t make sense for the result we want to achieve at line 34.We execute query1 on line 28, which will create a transactional lock on line 34. 
At line 31 however you can see in a single line that we set the IsolationLevel to Read Uncommitted, on the second connection! So if you uncomment line 31, you’ll actually read the data that line 28 is trying to update. Of course it’s not yet committed, but that’s what Read Uncommitted does. In this example we’re not using query3, but it would produce the same result as setting the isolation level. The difference is with query3 we’re not setting Read Uncommitted on the entire connection. Instead we’re only using it with a single query. 
**Using TransactionScope** So we finally get to using System.Transactions. In the example below we’re using the exact same queries as above. You can see we wrap the TransactionScope around both connections. But we first set up the IsolationLevel in line 2, then pass this to the TransactionScope constructor on line 4.Now both connections automatically enlist in our transaction and also both have the IsolationLevel set to Read Uncommitted.  

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 10pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: #2b91af">    1</span> <span style="color: #2b91af">TransactionOptions</span> transOptions = <span style="color: blue">new</span> <span style="color: #2b91af">TransactionOptions</span>();

<span style="color: #2b91af">    2</span> transOptions.IsolationLevel = System.Transactions.<span style="color: #2b91af">IsolationLevel</span>.ReadUncommitted;

<span style="color: #2b91af">    3</span> 

<span style="color: #2b91af">    4</span> <span style="color: blue">using</span> (<span style="color: #2b91af">TransactionScope</span> scope = <span style="color: blue">new</span> <span style="color: #2b91af">TransactionScope</span>(<span style="color: #2b91af">TransactionScopeOption</span>.RequiresNew, transOptions))

<span style="color: #2b91af">    5</span> {

<span style="color: #2b91af">    6</span>   <span style="color: blue">using</span> (<span style="color: #2b91af">SqlConnection</span> con1 = <span style="color: blue">new</span> <span style="color: #2b91af">SqlConnection</span>(connectionString))

<span style="color: #2b91af">    7</span>   {

<span style="color: #2b91af">    8</span>     con1.Open();

<span style="color: #2b91af">    9</span>     <span style="color: #2b91af">SqlCommand</span> cmd = <span style="color: blue">new</span> <span style="color: #2b91af">SqlCommand</span>(query1, con1);

<span style="color: #2b91af">   10</span>     cmd.ExecuteNonQuery();

<span style="color: #2b91af">   11</span>   }

<span style="color: #2b91af">   12</span> 

<span style="color: #2b91af">   13</span>   <span style="color: blue">using</span> (<span style="color: #2b91af">SqlConnection</span> con2 = <span style="color: blue">new</span> <span style="color: #2b91af">SqlConnection</span>(connectionString))

<span style="color: #2b91af">   14</span>   {

<span style="color: #2b91af">   15</span>     con2.Open();

<span style="color: #2b91af">   16</span>     <span style="color: green">//con2.EnlistTransaction(null);</span>

<span style="color: #2b91af">   17</span>     <span style="color: #2b91af">SqlCommand</span> cmd = <span style="color: blue">new</span> <span style="color: #2b91af">SqlCommand</span>(query2, con2);

<span style="color: #2b91af">   18</span>     <span style="color: blue">string</span> value = cmd.ExecuteScalar().ToString();

<span style="color: #2b91af">   19</span>   }

<span style="color: #2b91af">   20</span> }

</div>

The problem here is however that we’ll [automatically get bumped up to a distributed transaction](/2006/09/27/System.Transactions-_3A00_-What-to-choose_3F00_/). So make sure the MSDTC service is running. 
**Conclusion** Now you know how you can read uncommitted data that’s being updated in <u>other</u> transactions. Be sure to know however that this is called a “dirty read”. You’re reading data that in 99% of the time is data you don’t want. It’s not being updated for nothing! The person who asked me the question actually had a valid reason to choose this, although the initial design of the application might not be the best. But it wasn’t his, so he wasn’t to blame. 

[Sahil Malik](http://blah.winsmarts.com/) once made a weblog post about [why the heck](http://codebetter.com/blogs/sahil.malik/archive/2005/07/24/129770.aspx) (old weblog) we would want to use ReadUncommitted. He couldn’t think of a single reason to use it. I now know one reason, but I still agree with him. I’m sorry if I wasted your time with this long weblog post, with a final conclusion that you shouldn’t use ReadUncommitted. 😉  

Table of contents 
1. [An introduction](https://bloggingabout.net/2006/02/09/11011)
2. [Unit Testing](https://bloggingabout.net/2006/02/10/11017)
3. [Promotable Enlistment](https://bloggingabout.net/2006/03/20/11748)
4. [What to choose?](/2006/09/27/System.Transactions-_3A00_-What-to-choose_3F00_/)



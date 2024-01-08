---
layout: post
id: 11748
author: Dennis van der Stelt
date: 20060320 011900
title: System.Transactions  Promotable Enlistment
description: In two previous posts, I told how great the TransactionScope of the System.Transactio...
categories:
    - Development
redirect_from:
  - "/dennis/2006/03/20/system-transactions-promotable-enlistment"
  - "/blogs/dennis/archive/2006/03/20/system-transactions-promotable-enlistment.aspx"
---

<div>In two previous posts, I told how great the TransactionScope of the System.Transactions namespace is. And while preparing another post, I tried to prove some points via example code. But for some reason, the example code would not do what I wanted it to. Let me explain from the beginning.</div>
<div> </div>
<div>[As said](https://bloggingabout.net/2006/02/09/11011), your transaction can enlist within the TransactionScope, if some conditions are met. The first one is that the resource manager your transaction is using, supports single phase transactions. SQL-Server 2005 does, but SQL-Server 2000 doesn’t. This means transactions in SQL2000 are always MSDTC transactions, when using the TransactionScope. Another scenario is when your transaction spreads across multiple app domains. The third scenario is when another durable resource manager shows up in the same transaction.</div>
<div> </div>
<div>In MSDN there’s a great example for this. I’ve come up with my own example, for which we need the following method, which I’ll use in the second example as well.</div>
<div> 
<div>

<span>private</span> <span>static</span> <span>void</span> InsertUser(<span>string</span> loginName, <span>string</span> password, <span>SqlConnection</span> conn)

{

  <span>SqlCommand</span> cmd = <span>new</span> <span>SqlCommand</span>(<span>"Insert into Users (LoginName, Password) Values (@LoginName, @Password)"</span>, conn);

  cmd.Parameters.AddWithValue(<span>"@LoginName"</span>, loginName);

  cmd.Parameters.AddWithValue(<span>"@Password"</span>, password);

  conn.Open();

  cmd.ExecuteScalar();

}

</div>
</div>
<div> </div>
<div>As you can see, the above method tries to insert a single user into our database. Now let’s have a look at the following code.</div>
<div> </div>
<div> 
<div>

<span>public</span> <span>static</span> <span>void</span> ExecuteTest()

{

  <span>using</span> (<span>TransactionScope</span> scope = <span>new</span> <span>TransactionScope</span>())

  {

    <span>// Open first connection</span>

    <span>using</span> (<span>SqlConnection</span> conn1 = <span>new</span> <span>SqlConnection</span>(ConnectionString))

    {

      InsertUser(<span>"dennis"</span>, <span>"<span>pa$$word</span>"</span>, conn1);

      <span>Console</span>.WriteLine(<span>"DistributedID : {0}"</span>, System.Transactions.<span>Transaction</span>.Current.TransactionInformation.DistributedIdentifier);

      <span>// Open second connection</span>

      <span>using</span> (<span>SqlConnection</span> conn2 = <span>new</span> <span>SqlConnection</span>(ConnectionString))

      {

        InsertUser(<span>"anko"</span>, <span>"<span>pa$$word</span>"</span>, conn2);

        <span>Console</span>.WriteLine(<span>"DistributedID : {0}"</span>, System.Transactions.<span>Transaction</span>.Current.TransactionInformation.DistributedIdentifier);

      }

    }

  }

  <span>Console</span>.Write(<span>"Press enter…"</span>);

  <span>Console</span>.ReadLine();

}

</div>
</div>
<div> </div>
<div>To tell if we’re inside a MSDTC transaction, we’re looking at the DistributedIdentifier inside the transaction, courtesy of [Sahil Malik](http://codebetter.com/blogs/sahil.malik/archive/2005/06/24/65141.aspx). When this property is filled with anything but all zero’s, we know we’re inside a distributed transaction. For this example to work, you’ll have to enable the MSDTC using “net start msdtc” on your computer/server.</div>
<div> </div>
<div>When we look at the example above, it’s easy to see that a second connection is opened inside the codeblock where we’ve opened the first connection. The first is still open, so another durable resource manager shows up and the transaction is promoted to an MSDTC transaction. Remember that this is an [actual MSDN example](http://msdn2.microsoft.com/en-us/library/system.transactions.transactionscope(VS.80).aspx).</div>
<div> </div>
<div>As I was reading this, I immediately presumed the following block of code would actually work within the LTM.</div>
<div> </div>
<div>
<div>

<span>public</span> <span>static</span> <span>void</span> ExecuteTest()

{

  <span>using</span> (<span>TransactionScope</span> scope = <span>new</span> <span>TransactionScope</span>())

  {

    <span>// Open first connection</span>

    <span>using</span> (<span>SqlConnection</span> conn1 = <span>new</span> <span>SqlConnection</span>(ConnectionString))

    {

      InsertUser(<span>"dennis"</span>, <span>"pa$$word"</span>, conn1);

      <span>Console</span>.WriteLine(<span>"DistributedID : {0}"</span>, System.Transactions.<span>Transaction</span>.Current.TransactionInformation.DistributedIdentifier);

    }

    <span>// Open second connection        </span>

    <span>using</span> (<span>SqlConnection</span> conn2 = <span>new</span> <span>SqlConnection</span>(ConnectionString))

    {

      InsertUser(<span>"anko"</span>, <span>"pa$$word"</span>, conn2);

      <span>Console</span>.WriteLine(<span>"DistributedID : {0}"</span>, System.Transactions.<span>Transaction</span>.Current.TransactionInformation.DistributedIdentifier);

    }

  }

  <span>Console</span>.Write(<span>"Press enter…"</span>);

  <span>Console</span>.ReadLine();

}

</div>
</div>
<div> </div>
<div>As you can see, the first connection is opened via the using statement, which means it’s closed and disposed when that block is closed. The second connection is opened when the first one is closed. Or at least it seems so. Because what actually happens, is that the connection is kept open, for obvious reasons. The transaction hasn’t been committed yet! This also means however, that again the second durable resource manager enlists in the transaction, automatically making it an MSDTC transaction. The technology behind it is great, but the actual use of the TransactionScope suddenly fades away.</div>
<div> </div>
<div>The question is, why doesn’t the TransactionScope notice the first connection still being open, using it for the second execution of the command? It seems I’m not the only one asking this question, because Alazel Acheson has created a ‘simple’ class to help with this exact problem. He’s calling it the ConnectionScope class, and you can use it within your own project. You can [find it here](http://blogs.msdn.com/dataaccess/archive/2006/02/14/532026.aspx).</div>
<div> </div>
<div>Although we now have an option to bypass the shortcomings of the TransactionScope class, I’m still wondering about the real use of it. Perhaps it’s something we can enjoy in the future, but that’s not what I want. I want to use it now, and know about all possibilities, or in this case, impossibilities.</div>
<div> </div>
<div>Table of contents</div>
1. [An introduction](https://bloggingabout.net/2006/02/09/11011) 
2. [Unit Testing](https://bloggingabout.net/2006/02/10/11017) 
3. Promotable Enlistment

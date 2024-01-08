---
layout: post
id: 11011
author: Dennis van der Stelt
date: 20060209 121200
title: System.Transactions  An introduction
description: If you’re using .NET 2.0 together with SQLServer 2005, you’re in for a treat. The Tr...
categories:
    - Development
redirect_from:
  - "/dennis/2006/02/09/system-transactions-an-introduction"
  - "/blogs/dennis/archive/2006/02/09/system-transactions-an-introduction.aspx"
---

If you’re using .NET 2.0 together with SQL-Server 2005, you’re in for a treat. The TransactionScope. A lot of people have written about it already, and most people are raving about it. Most, because there seem to be some drawbacks about the new System.Transactions namespace. But before I’ll start talking about those, let’s hear the good parts first. I’ll explain what TransactionScope is, for those who might not yet know, and in another post explain the difficulties you might have with it.

The good part is that we can create a transaction extremely easy, and include complete codeblocks. If you take a look at the codeblock below, you can see that we’re including the new System.Transactions namespace. And in the InsertUser method, we’re starting a TransactionScope. Everything within the brackets { and } can enlist in the transaction. When something goes wrong, the scope.Complete() is skipped and at the closing of the bracket, the transaction is rolled back.

<div>

<span></span>

<span><font color="#0000ff"></font></span>

<span>using <font color="#000000">System.Transactions</font><font color="#000000">;  
 </font>  
 public void</span><span> InsertUser(<span>string</span> userName, <span>string</span> password)  
 </span><span>{  
 </span><span><span>       </span><span>using</span> (<span>TransactionScope</span> scope = <span>new</span> <span>TransactionScope</span>())  
 </span><span><span>       </span>{  
 </span><span><span>              </span><span>using</span> (<span>SqlConnection</span> conn = <span>new</span> <span>SqlConnection</span>())  
 </span><span><span>              </span>{  
 </span><span><span>                     </span>conn.Open();  
 </span><span><span>                     </span><span>// do some saving  
 </span></span><span><span>                     </span>scope.Complete();  
 </span><span><span>              </span>}  
 </span><span><span>       </span>}  
 </span><span>}</span>

</div>

Everything within the TransactionScope, that’s handled by a Resource Manager (RM), will be enlisted in the transaction. In our case it’s the connection to SQL-Server 2005.And the transaction manager (TM), is in this case, the Lightweight Transaction Manager (LTM). It’s a new TM so your transactions don’t need the heavy-weight Microsoft Distributed Tranasction Coordinator (MSDTC). This makes your transactions much lighter and faster. But you need to meet certain criteria before this can be true. If not, you’ll still need MSDTC for your transactions. The cool part however is, that your transactions are automatically escalated to the MSDTC, without you knowing. It’s all happening in the background. This is called <u>promotable enlistment</u>. And at the same time, that’s a bad thing. Because when it happens, and you’re not expecting it, your transaction will be much slower.

So when will your transactions be promoted to an MSDTC coordinated transaction? When the transaction spreads multiple app domains, two durable RMs show up in the same transactions, or a durable RM is used that does not support single phase notifications. more 

This list is courtesy of [Sahil Malik](http://codebetter.com/blogs/sahil.malik/), who inspired me to write this blog entry, and the next few. Inspired, because I don’t share his opinion on this subject in every way. Also because I had about 15 explorer windows open searching for the right information, of which 10 were different articles on his weblog. I’ll explain what the above list means, in the near future. You might want to check out the [TransactionScope](http://msdn2.microsoft.com/en-us/library/system.transactions.transactionscope.aspx) class yourself.

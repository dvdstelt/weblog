---
layout: post
id: 11017
author: Dennis van der Stelt
date: 20060210 020900
title: System.Transactions  Unit Testing
description: In my previous post, I gave a small introduction into System.Transactions and the Tra...
categories:
    - Development
redirect_from:
  - "/dennis/2006/02/10/system-transactions-unit-testing"
  - "/blogs/dennis/archive/2006/02/10/system-transactions-unit-testing.aspx"
---

<div>In [my previous post](https://bloggingabout.net/2006/02/09/11011), I gave a small introduction into [System.Transactions](http://msdn2.microsoft.com/en-us/library/ms149812.aspx) and the [TransactionScope](http://msdn2.microsoft.com/en-us/library/system.transactions.transactionscope.aspx) object. You might already know about it, but I noticed a lot of people still don’t, while they really should. It’s really easy to use and understand, and can solve a lot of problems.</div>
<div> </div>
<div>For example, how about using it for your unit tests? While your tests should test small units, it’s also wise to have integration tests, and see if your application is still accessing the database correctly. Common practice is to do this on a daily build server, where you setup the database before you start the test-run.</div>
<div> </div>
<div>Another practice is that you cannot assume that your tests run serially. If that was the case, you’d insert a user into some table, and in the second test use that same user. But tests can run parallel or in a different sequence. So it’s wiser to setup some method that will insert a user, and have one test check if that’s working. We’ll call that InsertUserTest. Another test can than use the method to insert a user, and see if it can update that user. We’ll cat this one UpdateUserTest.</div>
<div> </div>
<div>When the InsertUserTest breaks, the UpdateUserTest will automatically break also. But you can then track it down pretty fast to the InsertUserTest test, fix that one, and the UpdateUserTest will probably also run.</div>
<div> </div>
<div>Now transactions come into scope, because at the end of every test, you want that inserted user to be rolled back. This is done very easily with the TransactionScope object. First, let’s look at the InsertUser method. This method must run in our transaction, but the method itself doesn’t have to know about it. We don’t have to close the connection, because the using statement will take care of it, as it calls the Dispose() method on the SqlConnection.</div>
<div> </div>
<div>
<div><span>
<div>

<span>///</span><span> </span><span><summary></summary></span>

<span>///</span><span> Inserts a user</span>

<span>///</span><span> </span><span></span>

<span>///</span><span> </span><span><returns></returns></span><span>Returns the primary key value</span><span></span>

</div>

</span>

<span>private</span> <span>int</span> InsertUser()

{

  <span>int</span> identityValue = 0;

  <span>using</span> (<span>SqlConnection</span> conn = <span>new</span> <span>SqlConnection</span>())

  {

    conn.Open();

    <span>// Insert user, get the primary key value</span>

    <span>// for the example, we’ll set it here:</span>

    identityValue = 1;

  }

  <span>return</span> identityValue;

}

</div>
</div>
<div> </div>
<div>Next is the insert test, which calls the InsertUser. If the above method throws an exception, or the insert fails, the Assert in this method will also fail. Because the call to InsertUser lies within the TransactionScope block, the inserted user will be rolled back.</div>
<div> </div>
<div>
<div>

[<span>Test</span>]

<span>public</span> <span>void</span> InsertUserTest()

{

  <span>int</span> identityValue = -1;

  <span>using</span> (<span>TransactionScope</span> scope = <span>new</span> <span>TransactionScope</span>())

  {

    identityValue = InsertUser();

  }

  <span>Assert</span>.AreNotEqual(-1, identityValue);

}

</div>
</div>
<div> </div>
<div>The last one is the update test. You can see it also calls the top InsertUser method, but also tries to update the user. Both will fall under the same transaction, and both will be rolled back, because we don’t call the scope.Complete() method.</div>
<div> </div>
<div>
<div>

[<span>Test</span>]

<span>public</span> <span>void</span> UpdateUserTest()

{

  <span>int</span> identityValue = -1;

  <span>int</span> rowsUpdated = 0;

  <span>using</span> (<span>TransactionScope</span> scope = <span>new</span> <span>TransactionScope</span>())

  {

    identityValue = InsertUser();

    <span>using</span> (<span>SqlConnection</span> conn = <span>new</span> <span>SqlConnection</span>())

    {

      conn.Open();

      <span>// update user, using the retrieve pk value.</span>

      <span>// set rowsUpdated; again, for the example, we’ll set it here:</span>

      rowsUpdated = 1;

      <span>// Do NOT call scope.Complete()</span>

      <span>// The transaction will rollback.</span>

    }

  }

  <span>Assert</span>.AreNotEqual(-1, identityValue);

  <span>Assert</span>.AreEqual(1, rowsUpdated);

}

</div>
</div>
<div> </div>
<div>This shows how easy it is to unit test your application, without having to worry a bit about the data inserted.</div>
<div> </div>
<div>
<div>Table of Contents</div>
1. [An introduction](https://bloggingabout.net/2006/02/09/11011) 
2. Unit Testing<span></span> 

</div>

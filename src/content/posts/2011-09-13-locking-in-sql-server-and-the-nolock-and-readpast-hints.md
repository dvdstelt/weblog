---
id: 574467
author: Dennis van der Stelt
title: Locking in SQL Server and the nolock and readpast hints
description: I’ve written about transactions, the TransactionScope in .NET before. System.Transact...
pubDate: '2011-09-13T02:25:30'
tags:
  - Development
  - SQL Server 2005
  - SQL Server 2008
redirect_from:
  - /dennis/2011/09/13/locking-in-sql-server-and-the-nolock-and-readpast-hints
  - /blogs/dennis/archive/2011/09/13/locking-in-sql-server-and-the-nolock-and-readpast-hints.aspx
---
I’ve written about transactions, the TransactionScope in .NET before.

* [System.Transactions : An introduction](https://bloggingabout.net/2006/02/09/11011)
* [System.Transactions : Unit Testing](https://bloggingabout.net/2006/02/10/11017)
* [System.Transactions : Promotable Enlistment](https://bloggingabout.net/2006/03/20/11748)
* [System.Transactions still not working](https://bloggingabout.net/2007/06/28/system-transactions-still-not-working)
* [System.Transactions : Read Uncommitted](https://bloggingabout.net/2006/12/18/system-transactions-readuncommitted)
* [System.Transactions : What to choose?](https://bloggingabout.net/2006/09/27/System.Transactions-_3A00_-What-to-choose_3F00_)

Still I was recently surprised with the comment that I had to use the READPAST in my queries. So I started investigating and felt I had to blog about this. First of all, I’m not going to discuss every option here, just a few basics so you get what the differences are. If you want to know more, check out the BOL/MSDN documentation. Here’s a good [starting point](http://msdn.microsoft.com/en-us/library/aa213037(v=SQL.80).aspx).

I’ve created a demo to show locking mechanisms. The database I used was the only one at hand at the time I wrote this, and it’s the Cookbook database from [Dennis Doomen](http://www.dennisdoomen.net/) his [Silverlight Cookbook example](http://www.dennisdoomen.net/2011/03/introducing-silverlight-cookbook.html). It only has one table and a full select outputs the following result in my case.

### Shared Locks

First I want to tell about Shared Locks. Normally when you start a transaction like the code below, you place a shared lock until the transactions is over. A shared lock means someone else is still able to read the data you’ve locked, they just now allowed to update it. Because you want to be sure that the data you read, is still the same at the time you commit a transaction (to update data, for example).

```csharp
SqlCommand cmd = new SqlCommand();
cmd.Connection = GetConnection();
cmd.CommandText = "select * from Recipes with (readpast)";
var reader = cmd.ExecuteReader();
```

The GetConnection() method initiates and opens a connection to my database.

### ReadCommitted transaction

A regular transaction is done with isolation level ‘ReadCommitted’. This means that you cannot read data that has an exclusive lock on it. This is achieved when you update a row and another transaction tries to read it while you still have your transaction open. Here’s the update code.

```csharp
TransactionOptions transactionOptions = new TransactionOptions();
transactionOptions.IsolationLevel = IsolationLevel.ReadCommitted;

using (TransactionScope scope = new TransactionScope(TransactionScopeOption.RequiresNew,transactionOptions))
{
    SqlConnection con = new SqlConnection();
    con.ConnectionString = ConnectionString;
    con.Open();

    SqlCommand cmd = new SqlCommand();
    cmd.Connection = con;
    cmd.CommandText = "update Recipes set Description = 'ChangedDescription' where Id = 1";                
    cmd.ExecuteNonQuery();
}
```

And here’s the code in another transaction that tries to read it.

```csharp
SqlCommand cmd = new SqlCommand();
cmd.Connection = GetConnection();
cmd.CommandText = "select * from Recipes";
var reader = cmd.ExecuteReader();

while (reader.Read())
{
    Console.WriteLine("Description : {0}", reader["Description"].ToString());
}
```

The second method should not be able to retrieve data from the table until the transactions is closed. The original transaction can place multiple kinds of locks, including a lock that concerns the entire table. The select query I wrote just simply retrieves everything, and as the first row (at least) is locked, it’s not able to retrieve anything. If you add a where clause to filter out just the second row, it should be able to load the data anyway.

### NOLOCK hint

So with the NOLOCK / READUNCOMMITTED hint/isolation-level, you tell your transaction (or query) that you want to read dirty data. Even though the transaction hasn’t been committed yet, you still want to read its data. A problem can occur that when the other transaction is rolled back, you’ve loaded data that isn’t there anymore. Worse yet, when SQL Server decides to shift data between different pages, you might simply loose a lot of data because it’s not there!

```csharp
SqlCommand cmd = new SqlCommand();
cmd.Connection = GetConnection();
cmd.CommandText = "select * from Recipes with (nolock)";
var reader = cmd.ExecuteReader();
```

The result is that you get the change from the update statement. But because we never commit anything, everything is rolled back and we’ve read a dirty state.

```csharp
Description : ChangedDescription
Description : Description2
Description : Description3
Description : Description4
```

### READPAST hint

Now with the READPAST hint you’re telling SQL Server you do NOT want to read dirty data. Instead, it skips the rows that are locked.

```csharp
SqlCommand cmd = new SqlCommand();
cmd.Connection = GetConnection();
cmd.CommandText = "select * from Recipes with (readpast)";
var reader = cmd.ExecuteReader();
```

Result is first row not being shown at all! So when we change the update query to ‘where Id = 1 or Id = 2’ we get one row less in the other select query.

```csharp
Description : Description2
Description : Description3
Description : Description4
```

### Conclusion

Be very, very aware of the problems you might introduce when using these table hints!

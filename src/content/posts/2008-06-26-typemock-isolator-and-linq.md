---
id: 461575
author: Dennis van der Stelt
title: TypeMock Isolator and LINQ
description: I’m doing some work with TypeMock and I start to love it more and more. For example, ...
pubDate: '2008-06-26T09:18:49'
tags:
  - Agile
  - TypeMock
  - Visual Studio 2008
redirect_from:
  - /dennis/2008/06/26/typemock-isolator-and-linq
  - /blogs/dennis/archive/2008/06/26/typemock-isolator-and-linq.aspx
---
I’m doing some work with TypeMock and I start to love it more and more. For example, how about removing your database completely from your continuous tests? Sure you can do some database testing during the nightly build, but please keep the tests as fast as possible.
**A little story about a build** [![table](/images/typemock-isolator-and-linq/table_5f00_thumb.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/table_5F00_2.png)Just a few days ago on a Friday my colleague [Alex Thissen](http://www.alexthissen.nl/blogs/main/) and I were planning to leave the building. Unfortunately after checking in some code, a few unit tests failed in Alex’s project. It were some really minor changes, but as it was 20:00 hours already, we weren’t as sharp anymore. After 4 trial-and-error sessions getting the test to work, we could go home. The code changes took only a few seconds, running the build took much, much longer. Mainly because Visual Studio 2008 for DB Professionals was deploying the database every time. What if we only needed that during the nightly build and actually had the continuous build running much faster?

Imagine a nice little table like the one on the right. Just some Class-A trainers in there. Imagine some code retrieving the trainers.


```csharp
public List<mytrainer> GetTrainers()
{
  List<mytrainer> trainers = new List<mytrainer>();

  using (SqlConnection con = new SqlConnection())
  {
    con.ConnectionString = @"Server=.sqlexpress;database=courses;integrated security=sspi;";
    con.Open();

    SqlCommand cmd = new SqlCommand();
    cmd.Connection = con;
    cmd.CommandText = "select * from trainers";

    SqlDataReader rdr = cmd.ExecuteReader();
    while (rdr.Read())
    {
      MyTrainer t = new MyTrainer();
      t.Name = rdr["Name"].ToString();
      trainers.Add(t);
    }
  }

  return trainers;
}
</mytrainer></mytrainer></mytrainer>
```

Normal ADO.NET code for retrieving trainers and adding them to a collection of MyTrainer objects. We could just test this with a special test database so that we always get the same results. We could create a very easy test where we just execute the *GetTrainers* method and see what data it returns. But as this accesses the database you might want to do this in a nightly batch. To be a little more sure you don’t break the build at night, you can always run these tests from your local machine.


```csharp
[TestMethod]
public void GetTrainers_DBAccessed_Return7Trainers()
{
  DAL dal = new DAL();
  List<mytrainer> trainers = dal.GetTrainers();

  Assert.IsNotNull(trainers);
  Assert.AreEqual(7, trainers.Count());
  Assert.AreEqual("Anko Duizer", trainers[0].Name);
}
</mytrainer>
```

But we really want to test the code without actually connecting to the database. You could stub out a lot, but that’s **a lot of work**. Especially because the datareader is very hard to stub out. I’ve once used a [datareader that was running on a dataset](http://haacked.com/archive/2006/05.aspx) with one ore more tables in it. Pretty nice, but still took a whole lot of code to fill the datareader initially.

When we want to use a mocking framework like TypeMock, it still requires some code. We need to actually mock out three objects and create expectations for them. Here’s the code.


```csharp
[TestMethod, VerifyMocks]
public void GetTrainers_NoDBAccess_Return2Trainers()
{
  using (RecordExpectations rec = RecorderManager.StartRecording())
  {
    using (SqlConnection con = new SqlConnection())
    {
      con.ConnectionString = "";
      con.Open();

      SqlCommand cmd = new SqlCommand();
      cmd.Connection = con;
      cmd.CommandText = "";

      SqlDataReader fakeReader = RecorderManager.CreateMockedObject<sqldatareader>();
      rec.ExpectAndReturn(cmd.ExecuteReader(), fakeReader);
      rec.ExpectAndReturn(fakeReader.Read(), true).Repeat(2);
      rec.ExpectAndReturn(fakeReader["name"].ToString(), "Dennis van der Stelt");
      rec.ExpectAndReturn(fakeReader["name"].ToString(), "Alex Thissen");
    }
  }

  DAL dal = new DAL();
  List<mytrainer> trainers = dal.GetTrainers();

  Assert.AreEqual("Dennis van der Stelt", trainers[0].Name);
  Assert.AreEqual("Alex Thissen", trainers[1].Name);
}
</mytrainer></sqldatareader>
```

As you can see we set up a recorder and created expectations for the values that should be returned. The *reader.Read* method should return true twice so we can fill two MyTrainer objects with data. We then set expectations for the two times the *name* column is accessed using the reader. When finished recording, we actually execute the code we’re testing and mocking. Of course this is a very simple implementation, but it’s to show how to mock things out. For more advanced scenarios you should check the TypeMock manual.

Now let’s see how we would retrieve the same data with LINQ.


```csharp
public List<trainer> GetTrainersViaLINQ()
{
  CoursesDataContext db = new CoursesDataContext();

  var query = from t in db.Trainers
              select t;

  return query.ToList();
}
</trainer>
```

This is a lot less code. When we want to mock this out, we again use a recorder and just use the same code. However LINQ to SQL returns an IQueryable collection of Trainer objects. You can’t use *recorder.Return(someList.AsQueryable())* inside the recording-block because then the AsQueryable would be mocked out as well. So we have to prepare the collection of trainers in advance.

<div style="font-family: Lucida Console;font-size: 10pt;color: black;background: white;border-top: windowtext 1pt solid;border-top-color: #CCCCCC;padding-top: 1pt;border-left: windowtext 1pt solid;border-left-color: #CCCCCC;padding-left: 1pt;border-right: windowtext 1pt solid;border-right-color: #CCCCCC;padding-right: 1pt;border-bottom: windowtext 1pt solid;border-bottom-color: #CCCCCC;padding-bottom: 1pt;width: 100%;overflow: auto;background-color: #F5F5F5">

[<span style="color: #2b91af">TestMethod</span>, <span style="color: #2b91af">VerifyMocks</span>]

<span style="color: blue">public</span> <span style="color: blue">void</span> GetTrainersViaLINQ_NoDBAccess_Return2Trainers()

{

  <span style="color: blue">var</span> fakeTrainers = 

    (<span style="color: blue">new</span> [] { 

      <span style="color: blue">new</span> <span style="color: #2b91af">Trainer</span>() { Name = <span style="color: #a31515">“Dennis van der Stelt”</span> }, 

      <span style="color: blue">new</span> <span style="color: #2b91af">Trainer</span>() { Name = <span style="color: #a31515">“Alex Thissen”</span> } }

    ).AsQueryable();

  <span style="color: blue">using</span> (<span style="color: #2b91af">RecordExpectations</span> rec = <span style="color: #2b91af">RecorderManager</span>.StartRecording())

  {

    <span style="color: #2b91af">CoursesDataContext</span> db = <span style="color: blue">new</span> <span style="color: #2b91af">CoursesDataContext</span>();

    <span style="color: blue">var</span> query = <span style="color: blue">from</span> t <span style="color: blue">in</span> db.Trainers

                <span style="color: blue">select</span> t;

    rec.Return(fakeTrainers);

  }

  <span style="color: #2b91af">DAL</span> dal = <span style="color: blue">new</span> <span style="color: #2b91af">DAL</span>();

  <span style="color: #2b91af">IEnumerable</span><<span style="color: #2b91af">Trainer</span>> trainers = dal.GetTrainersViaLINQ();

  <span style="color: #2b91af">Assert</span>.AreEqual(2, trainers.Count());

  <span style="color: #2b91af">Assert</span>.AreEqual(<span style="color: #a31515">“Dennis van der Stelt”</span>, trainers.ElementAt(0).Name);

  <span style="color: #2b91af">Assert</span>.AreEqual(<span style="color: #a31515">“Alex Thissen”</span>, trainers.ElementAt(1).Name);

}

</div>

You can see I prepared the *fakeTrainers* collection in advance, start recording and set the return value to the prepared collection. I then actually execute the code inside my tested class and assert that everything’s as expected.

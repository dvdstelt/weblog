---
id: 15719
author: Dennis van der Stelt
title: DataBinding in ASP.NET 2.0 and the RowUpdating event
description: For a while now I’m trying to figure out why my method, triggered by the GridView.Row...
pubDate: '2006-08-24T05:43:00'
tags:
  - ASP.NET
  - Development
redirect_from:
  - /dennis/2006/08/24/databinding-in-asp-net-2-0-and-the-rowupdating-event
  - /blogs/dennis/archive/2006/08/24/databinding-in-asp-net-2-0-and-the-rowupdating-event.aspx
---
For a while now I’m trying to figure out why my method, triggered by the GridView.RowUpdating event, doesn’t work as all samples say it should do. All samples of course assume you’re doing everything in your .aspx page, but I have to do everything in my code-behind, because on forehand I don’t know what I’ll be binding to my GridView. Check out what I’m trying to do, maybe you can help?

First, I load up some data:

<div>  

<span>DataSet</span> ds = <span>new</span> <span>DataSet</span>();

<span>SqlConnection</span> con = <span>new</span> <span>SqlConnection</span>(<span>“somestring”</span>);

<span>SqlCommand</span> cmd = <span>new</span> <span>SqlCommand</span>(<span>“select * from sometable”</span>, con);

<span>SqlDataAdapter</span> adap = <span>new</span> <span>SqlDataAdapter</span>(cmd);

adap.Fill(ds);
</div>  

After that, I’m doing some work to make my GridView look beautifull, adding all columns by hand. But for this demo, I’ll show you the simple version, that also doesn’t work 🙂  
Let’s bind the data to our GridView and have it autogenerate our columns, as well as an edit button.

<div>  

GridView1.AutoGenerateColumns = <span>true</span>;

GridView1.AutoGenerateEditButton = <span>true</span>;

GridView1.DataSource = ds;

GridView1.DataBind();
</div>  

Now I’ve tried a lot of places to setup subscription to the events. Currently I’m in the OnInit method, but it doesn’t matter where you place this code.

<div>  

<span>protected</span> <span>override</span> <span>void</span> OnInit(<span>EventArgs</span> e)

{

  <span>base</span>.OnInit(e);

  GridView1.RowUpdating += <span>new</span> <span>GridViewUpdateEventHandler</span>(GridView1_RowUpdating);

  GridView1.RowUpdated += <span>new</span> <span>GridViewUpdatedEventHandler</span>(GridView1_RowUpdated);

  GridView1.RowEditing += <span>new</span> <span>GridViewEditEventHandler</span>(GridView1_RowEditing);    

}
</div>  

So now everything’s setup, let’s create a method for the RowEditing event.

<div>  

<span>void</span> GridView1_RowEditing(<span>object</span> sender, <span>GridViewEditEventArgs</span> e)

{

  GridView1.EditIndex = e.NewEditIndex;

  GridView1.DataBind();

}
</div>  

Been there, done that… Okay, now the part that <u>doesn’t work</u>!

<div>  

<span>void</span> GridView1_RowUpdated(<span>object</span> sender, <span>GridViewUpdatedEventArgs</span> e)

{

  <span>// This method is never even touched!</span>

}

<span>void</span> GridView1_RowUpdating(<span>object</span> sender, <span>GridViewUpdateEventArgs</span> e)

{

  <span>// e.Keys.Count == 0</span>

  <span>// e.NewValues.Count == 0</span>

  <span>// e.OldValues.Count == 0</span>

}
</div>  

When we edit a row in our GridView and press the “Update” button, at some time it’s received in the RowUpdating method. But as I noted in the comments in that method, some collections that should contain the columns (names, old values and new values) are always empty. Always. And the RowUpdated method is never even touched!!!

Okay, so I’ve read on the [ASP.NET Forums](http://forums.asp.net/search/SearchResults.aspx?q=RowUpdating+sectionid%3a24&o=Relevance) that [I need to use a DataSource](http://forums.asp.net/thread/1178168.aspx) control. For example a SqlDataSource, which is automatically added to your WebForm if you drag-n-drop your way around Visual Studio 2005.The problem is, I’d very much like to do so, if ASP.NET 2.0 requires this. But I can’t set a DataSource property or anything on the SqlDataSource!!!

So if you have any solution to my problem… I probably have to read the cells on the GridView of the selected row, find the controls, get the values from those and insert those into my DataSet. Which means I won’t make my 70% code reduction Microsoft has always promised me. Bah!

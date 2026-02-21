---
id: 476311
author: Dennis van der Stelt
title: Best PDC session so far  Lap around “Oslo”
description: I’m at the “Lap around ‘Oslo’” talk together with Alex Thissen and Paul Gielens. This...
pubDate: '2008-10-28T10:38:02'
tags:
  - M Language
  - Oslo
  - PDC08
  - Textual DSL
redirect_from:
  - /dennis/2008/10/28/best-pdc-session-so-far-lap-around-oslo
  - /blogs/dennis/archive/2008/10/28/best-pdc-session-so-far-lap-around-oslo.aspx
---
I’m at the “Lap around ‘Oslo’” talk together with [Alex Thissen](http://www.alexthissen.nl/) and [Paul Gielens](http://weblogs.asp.net/pgielens/). This is by far the best session I’ve seen so far!

The talk began about models. We were looking at modeling and modeling domains, but what is a model? We have…
* **Drawings** Models used to communicate with others, for example DataFlow or Use Case. See [UML as Sketch](https://bloggingabout.net/2005/10/13/9767). 
* **Model-Assisted          
**Models used to understand or manipulate code, for example StaticStructure or Sequence 
* **Model-Driven** Models executed by runtimes directly, for example HTML, CSS, XAML, BPEL 

According to Douglas Purdy, Don Box says we’re on a 30 year journey and we’re 15 years in. We had COM(+), .NET 1.0, Web Services, .NET 3.0 and now we’re entering the next phase. Oslo is the next level for a model-driven platform. We’ve been heading there via configuration, attributes and doing more and more declarative instead of typing everything out. A great example for declarative development is of course LINQ.

Why is this happening? Transparency (better understand your application), flexibility (add changes to your application faster) and productivity. We need models
**So what is Oslo?   
**It is *the platform* for model-driven development. Microsoft will bring us Oslo with the following components:
* “M”        
The language for authoring models & DSLs 
* “Quadrant”        
The tool for interacting with models & DSLs 
* Repository        
The database for storing & sharing models, this will be SQL Server. 

“M” gives you the modelling and textual DSLs. According to [Douglas Purdy](http://douglaspurdy.com/) and to [Don Box](http://www.pluralsight.com/community/blogs/dbox/archive/2008/10/08/talks-i-want-to-see-pdc.aspx), this is going to be the next big thing. I could not agree more. I am **SO** excited about what I just saw. Take the example they’ve shown.


```csharp
Module Microsoft.Samples
{
  // MusicItem is the schema
  type MusicItem
  {
    // Primary key
    Id : Integer64 = AutoNumber();
    Album : Text; // Album is constraint by type
    Artist : Text;
    // Rating is constraint and expression
    Rating : Integer32 where value <= 3;
  } where identity Id;

  // * is 0..n multiplicity
  MusicLibrary : MusicItem*;
}
```

The above declares a schema named “MusicItem” and a collection of those in a “MusicLibrary”. We compile this and than populate the result in the database.


```csharp
// M compiler
// Repository is the database. When choosing -t:xml we generate XML
m.exe myfile.m /p:image -t:Repository
// Populating
mx.exe /i:myfile.mx /db:repository /ig /f
```

mx uses the compiled “binary” (this is a zip archive actually) and generates T-SQL.


```csharp
create table [Microsoft.Samples].[MusicLibrary]
(
  — the rest
)
```

You can fill the database with the following


```csharp
Module Microsoft.Samples
{
  MusicLibrary
  {
    {
      Album = "Slippery when wet",
      Artitst = "Bon Jovi",
      Rating = 3
    },
    {
      Album = "Into the dark",
      Artitst = "Europe",
      Rating = 2
    }    
  }  
}
```

This creates two rows in the table MusicLibrary. But this is all the language “M”. How about a **textual DSL**? How’s this for coding:


```csharp
"SomeAlbum" by "Led Zeppelin" is awesome!
"Back in Black" by "AC/DC" is so so.
"Bad" by "Michael Jackson" is terrible.
```

The above code can be transformed into the exact same code-block as above, where we filled the database with two records. How is this achieved? Take a look at the following code.


```csharp
module Microsoft.Samples
{
  import Language;

  language MusicLibraryLanguage
  {
    syntax Main = s:Statement+ => MusicLibrary(valuesof(s){l

    syntax Statement = al:Grammar.TextLiteral "by" ar:Gramar.TextLiteral "is" ?????
    => { Album {al}, Artist {ar}, Rating

    @{(Classification["keyworkd"]} // colorize "awful"
    token Rating1 = "terrible" | "awful";
    token Rating2 = "so so";
    token Rating3 = "awesome";

    syntax Rating = Rating1 => 1 | Rating2 => 2 | Rating3 => 3;

    interleave skippable = Base.Whitespace
  }
}
```

I lost the code where it says “????”. The above code tells to look at *by* and *is* and takes the text there and parse it. It than looks at the rating and gives it an actual number. The *Classification* keyword makes the words “terrible” and “awful” become **bold** in the editor.

Now is this awesome or what? I’m so excited by this. This is one of the biggest steps in my history of developing software. You can now write code like

Give me a table called “Customers” with a primary key called “Id” and make it an integer with identity on, seeding from 1.
The best thing is, if you can think of a way to make that sentence shorter or more self-explaining, go ahead! Use MGrammer to define your own textual DSL.
**MService** Another great demo was when they showed MService. With only a few lines of code (my battery ran flat, so I could not copy the code, but I photographed it and it *will* come in this blog!) they created a WCF service where they could upload an image and request it again, using a WF workflow. In about 38 lines of code, { and } on empty lines included!!! 

Courtesy of Paul Gielens, I got the code from his weblog. The following starts a REST enabled WCF Service with a WF Writeline activity. Not a Console.Writeline, but a real WF activity.


```csharp
module Service25 
{ 
  service Service 
  { 
    operation Echo(str : text) : Text 
    { 
      .UriTemplate = "echo/{str}"; 
      WriteLine { Text = "Message : " + str } 
      return str; 
    } 
  } 
}
```
**Debugging** At first I thought this was an awesome code generator. But boy was I wrong. They showed debugging and hitting breakpoints inside the textual DSL!!! The stack and locals windows showed the WCF channels and WF activities active. Can you believe it? Probably not, you just have to watch the stream on Channel9.
I’m now going to follow Don Box, hold on for more!

Loving it, loving it, loving it, as Don Box would say!

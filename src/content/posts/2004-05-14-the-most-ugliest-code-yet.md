---
id: 860
author: Dennis van der Stelt
title: The most ugliest code yet
description: In your carreer as professional developer you come across some ugly code, many would ...
pubDate: '2004-05-14T06:38:00'
tags:
  - Development
redirect_from:
  - /dennis/2004/05/14/the-most-ugliest-code-yet
  - /blogs/dennis/archive/2004/05/14/the-most-ugliest-code-yet.aspx
---
In your carreer as professional developer you come across some ugly code, many would not believe if you told them. Once on a project (hi Ernst) I saw some pretty ugly code in one line. It was C# and was something like this:

public void DoSomething()  
{  
  Order order = new Order();  
}

This code can be your thing, but I really dislike this kind of coding and always name my objects in a more readable style. For example, take myOrder or completeOrder or anything else thats more appropriate for the object. But I never use the name of the class and change some capital and use it as a name for my object.

Until yesterday, when I give class with another collegue to some other collegues who weren’t that familiar with .NET. Then I saw the most ugliest code in my life, crammed togehter in one line.

Public Function DoSomething()  
  Dim Order as Order = new Order  
End Function

Here we have something even worse, the name of the class and the name of its instantiated object have exactly the same name! I didn’t even know this was possible.

Maybe we shall have us a little contest. If you can provide me with code in one line that’s even more ugly then this, I’ll give you a free copy of… of… Oh, I don’t have anything to give away. Nevermind, we’ll have a contest with the prize : everlasting fame, or something…

Anyway, just had to let you know this… 🙂

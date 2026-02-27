---
id: 460252
author: Dennis van der Stelt
title: Unit tests are for functionality, not code!
description: Marco mailed me this morning with the following sentence Unit tests are meant to test...
pubDate: '2008-06-13T09:30:48'
tags:
  - agile
redirect_from:
  - /dennis/2008/06/13/unit-tests-are-for-functionality-not-code
  - /blogs/dennis/archive/2008/06/13/unit-tests-are-for-functionality-not-code.aspx
---
[Marco](https://bloggingabout-linux.azurewebsites.net/blogs/marco/) mailed me this morning with the following sentence

> Unit tests are meant to test functionality, NOT code! That means if you write your unit tests after the fact, you’re probably not focusing on the functionality.

This comes from two weblogs that have some unit testing comments. [Jason Young](http://www.ytechie.com/2008/06/unit-tests-are-for-functionality-not-code.html) posted the sentence and he refers to [Obishawn](http://blog.obishawn.com/2008/06/why-you-should-have-100-code-test.html) who also has something to say. Why I’m writing this post is for two reasons. Or three actually. The first reason is that I liked the quote. The second reason is that Obishawn tries to prove that you should even test properties, something not many people do. But his argument is that it can grow to something that you definitely would want to test, so you should have a test in place to test the functionality. He also states that you should not trust your framework and although he’s probably right, I wouldn’t test my properties because I don’t trust the framework. If that’d be the case, it’d probably be enough to test a single property because with that I’d have tested them all. I know the .NET Framework has its bugs, but I hope to find these when writing tests that target my own <strike>code</strike> functionality.

Anyway, Obishawn also provides a few lines of code to prove you should test properties. I have written a small piece of code to expands on this a bit. There are three errors in it and maybe you can spot them. Although these are extremely simple (once you know which ones I mean) it’s an example of why you should seriously consider writing tests for all your <strike>code</strike> functionality.


```csharp
public class CoD4 : Game
{
  private List<string> _redPlayers;
  private List<string> _bluePlayers;
  private string _name;

  public CoD4()
  { 
    this.Name = "Call of Duty 4"; 
  }

  public List<string> BluePlayerCount
  {
    get { return BluePlayers.Count(); }
  }

  public string Name
  {
    get { return Name; }
  }

  public void AddPlayer(string name)
  {
    base.AddPlayer(name);

    if (_redPlayers.Count <= _bluePlayers.Count)
      _bluePlayers.Add(name);
    else
      _redPlayers.Add(name);
  }
}
</string></string></string>
```

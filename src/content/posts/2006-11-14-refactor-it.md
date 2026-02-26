---
id: 48010
author: Dennis van der Stelt
title: Refactor it!
description: Now this is a great initiative! Billy McCafferty is doing a weekly contest where he u...
pubDate: '2006-11-14T11:58:07'
tags:
  - Agile
  - Development
  - Utilities
  - refactoring
  - agile
  - tdd
redirect_from:
  - /dennis/2006/11/14/refactor-it
  - /blogs/dennis/archive/2006/11/14/refactor-it.aspx
---
Now this is a great initiative! Billy McCafferty is doing a weekly contest where he uploads a Visual Studio 2005 solution of a C# project with a specific [code smell](http://en.wikipedia.org/wiki/Code_smell). You must refactor the solution so that the code smell is removed and so it still passes the supplied unit tests. Winners are randomly drawn by his two year old daughter, because he doesn’t trust the randomness of Math.Random. 🙂 I think the initiative is cool because people will hopefully learn what refactorings are about. I hope he’ll post some of the best solutions and that the winner will get a long review post where Billy will explain all the refactorings that took place.

> *Refactoring has been widely adopted as a vital technique for producing high quality software.  It is important that we each embrace this practice into our development work.  This contest will serve to present an overview of common smells found within code and discuss techniques to correct those smells for creating better software.* The first challenge is already online for a few days. Read info on [Refactor It!](http://devlicio.us/blogs/billy_mccafferty/archive/2006/11/13/refactor-it-the-weekly-book-giveaway.aspx) and the [first challenge here](http://devlicio.us/blogs/billy_mccafferty/archive/2006/11/14/refactor-it-challenge-1.aspx). I’ve taken a look at the code and there is are some beautiful codesmells in there. This is code that could’ve been extracted from a lot of applications that are currently in production, maintained by developers who have to study the code to understand it. The refactorings should make a lot of sense in there. This could also be a great way to learn [Refactor! Pro](http://www.devexpress.com/Products/NET/IDETools/Refactor/) by DevExpress, the tool to use for this kind of stuff.

Oh, Alex, sorry mate, but the tests are written for NUnit. Of course I immediately ran NCover over it and NCoverExplorer produced this result:

![](/images/refactor-it/refactoritcodecoverage_thumb5b35d.png) 

There’s one line of code that throws an error when you pass in a null value into the method. Meaning this probably wasn’t written using Test-Driven Development. Not the worst case, but it would be nice to show people how good the tests could be when TDD was used. Besides that, I again have to say I love the initiative and will keep an eye out for the results.



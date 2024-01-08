---
layout: post
id: 9053
author: Dennis van der Stelt
date: 20050822 100000
title: Smells to Refactoring
description: Today I was browsing a site about Java. Don’t get me wrong, I’m not switching, but I ...
categories:
    - Agile
    - Development
redirect_from:
  - "/dennis/2005/08/22/smells-to-refactoring"
  - "/blogs/dennis/archive/2005/08/22/smells-to-refactoring.aspx"
---

Today I was browsing a site about Java. Don’t get me wrong, I’m not switching, but I found something interesting there. And the fact that the url was [www.java**.net**](http://www.java.net) made me go look. 😉

We’ve all seen code that smells. Code that smells like [refactoring](http://en.wikipedia.org/wiki/Refactoring). On this Java website they created [a rather extensive list of smells](http://wiki.java.net/bin/view/People/SmellsToRefactorings), with proposals on how to remove the smell and create [ridiculously good looking](http://www.imdb.com/title/tt0196229/) code.

The first one is about comments in your code. As the description says, it "should only be used to clarify ‘why’, not ‘what’". One example given is the [Extract Method](http://www.refactoring.com/catalog/extractMethod.html), which I both like and dislike. I know about the SRP, but just refactoring everything in its own class and/or method somethings feels like going a bit too far. Although with the example given, you at least get an idea. The [Rename Method](http://www.refactoring.com/catalog/renameMethod.html) is also one to remember if you don’t already do so, but the [Introduce Assertion](http://www.refactoring.com/catalog/introduceAssertion.html) I’ve never used it like that. Normally I just check for null references with if statements, and this is indeed shorter but might take a little longer to read.

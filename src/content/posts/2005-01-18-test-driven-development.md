---
id: 1950
author: Dennis van der Stelt
title: Test Driven Development
description: I’m becoming pretty interested in DDD (Domain Driven Design) and TDD (Test Driven Dev...
pubDate: '2005-01-18T07:57:00'
tags:
  - Architecture and Design
redirect_from:
  - /dennis/2005/01/18/test-driven-development
  - /blogs/dennis/archive/2005/01/18/test-driven-development.aspx
---
I’m becoming pretty interested in DDD (Domain Driven Design) and TDD (Test Driven Development). Via [Steve Eichert](http://dotnetjunkies.com/WebLog/seichert/archive/2005/01/17/45120.aspx) I found a link to a post on Keith Ray’s blog, with [a short explanation about TDD](http://homepage.mac.com/keithray/blog/2005/01/16#TestDrivenIsFaster), and why TDD is faster then writing unit tests after you’re done coding your functionality.

He describes in short how TDD works, and it kind of reminds me of the old asp days. Because it was so difficult to test the functionality in our layers in asp, we used to write windows forms code on top of our layers, before writing the asp code. It contained very basic what the web gui was supposed to do, so we could easily test our layers and our sql.

But in TDD we wouldn’t write the windows gui, but instead write the unit tests of what we’d expect the gui would require, before ever touching our layers behind it. After writing the tests, you’d write the layers beneath the gui and tests and every little circle would eventually turn green. When I look at it that way, it’s (for me) much easier to understand and could really work faster then anything else. Of course I’m not touching everything that is TDD, not even close, but it’s a start.

It’s just too bad that at most project, both client, project leader and developers don’t see the huge benefits of unit tests. I’m currently at a medium size project, 3 to 4 developers. But it’s already running for over a year and it’s unbelievable how many bugs would’ve turned up with unit tests, that we now only discover weeks after we added new functionality that broke code that was already there for ages!

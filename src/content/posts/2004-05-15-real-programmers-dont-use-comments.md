---
id: 870
author: Dennis van der Stelt
title: Real programmers don’t use comments
description: This is nice. Jay Kimble talked to some senior DBA’r who claimed that comments are us...
pubDate: '2004-05-15T08:49:00'
tags:
  - Development
redirect_from:
  - /dennis/2004/05/15/real-programmers-dont-use-comments
  - /blogs/dennis/archive/2004/05/15/real-programmers-dont-use-comments.aspx
---
This is nice. [Jay Kimble](http://dotnetjunkies.com/WebLog/jkimble/archive/2004/05/14/13638.aspx) talked to some senior DBA’r who claimed that comments are useless. If you can’t read his code and understand it, you shouldn’t be in it.

Jay asked us how we feel about this and should post our feelings on our blogs. I’ve gotten the link from [Steve Eichert](http://dotnetjunkies.com/WebLog/seichert/archive/2004/05/15/13676.aspx) and already have given my opinion there, but I’ll repost some here.

About the “I prefer no comments over bad comments”. I come across comments like the next one all the time! 

// Begin loop   
while ( … 

There’s another thing to the “no comments over bad comments”, because the type of comments I just mentioned irritate the @)#$*#^& out of me and I start throwing with keyboards, books and sometimes even monitors when I see something like that.   
As if I don’t understand we’re going into a loop of some kind. You (#&$(# moron! 

Please people, describe what the loop is for!!! Or any other code, for that matter.

I really do think comments can add **a lot** to your code. If written in what it does functionally. I can see we’re going into a loop, do some if’s or a switch or that we’re loading a document or something. But why, **why** are we doing this? Explain!

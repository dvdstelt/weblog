---
id: 2066
author: Dennis van der Stelt
title: .Text 0.96 and bringing it further
description: Currently we’re using .Text 0.95 at BloggingAbout.NET. On some sites however, like we...
pubDate: '2005-01-26T10:14:00'
tags:
  - BloggingAbout.NET
redirect_from:
  - /dennis/2005/01/26/text-0-96-and-bringing-it-further
  - /blogs/dennis/archive/2005/01/26/text-0-96-and-bringing-it-further.aspx
---
Currently we’re using .Text 0.95 at BloggingAbout.NET. On some sites however, like [weblogs.asp.net](http://weblogs.asp.net/), they’re using a newer version, which has some added features, like the comment moderation feature. Comments must first be approved before visitors can see them. We want these features as well!

I noticed Dave Burke was blogging about .Text 0.96 and how it’s possible to [download the sources](http://dbvt.com/blog/archive/2005/01/25/788.aspx). Somewhere around there I read that Thomas Freudenberg already [upgraded his blog to 0.96](http://thomasfreudenberg.com/blog/archive/2004/02/05/337.aspx) a year ago! Multiple people have several ideas on how to [add more features to .Text](http://thomasfreudenberg.com/blog/archive/2004/02/05/337.aspx), or already have done so.

If I can find the time tonight, I’ll try and get the 0.96 code working at home. I also want to take a look at [CS Beta 3](http://www.communityserver.org/), to see what features it has. But I have the same problem as Thomas has, I’m not looking for a full blown product which also includes a forum and a gallery. I just want my blog. And if Telligent Systems decides to release the code, it’ll probably much harder to add features to it, as there’s so much code. As said, I’ll have a look at both.

First thing I want to implement, is something to fight the comment spamming. Chrissy LeMaire has already created [some](http://netnerds.net/articles/462.aspx) [really](http://netnerds.net/articles/492.aspx) [great](http://netnerds.net/chrissy/blogspamcount.asp) [addons](http://netnerds.net/archive/2005/01/23/451.aspx) by updating stored procedures and triggers and creating a page which shows all rejected comments. I was thinking of using her input, add the page to the admin section and be able to reset some flag on banned comments, so they’ll show up as real comments again.  
I think this is better then the moderation queue, as most comments should show up immediatly. The blogger should be able to flag comments as bad, and reset the flag on good comments.

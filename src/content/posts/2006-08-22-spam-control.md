---
id: 14882
author: Dennis van der Stelt
title: Spam control
description: We’re getting some serious comment spam at the moment. Just today I’ve already receiv...
pubDate: '2006-08-22T06:02:00'
tags:
  - Blogging
  - BloggingAbout.NET
  - Community Server
redirect_from:
  - /dennis/2006/08/22/spam-control
  - /blogs/dennis/archive/2006/08/22/spam-control.aspx
---
We’re getting some serious comment spam at the moment. Just today I’ve already received a couple of hundred comments that Community Server marked as spam. Although none of them pass the great spam filter(s), it’s still very irritating. Here are some tips that can help people that use Community Server, and of course our own bloggers.
1. The first thing you have to do, if it’s not already setup, is make every (anonymous) comment a moderated comment. This way you as the weblog owner, have to moderate these posts.  
You can set this up at your weblog dashboard ([found here](/controlpanel/blogs)), in the left menu choose “Global Settings” and “Default Post Settings”. Mark “Allow Comments on my blog” (or no one would be able to comment), and set comment moderation on “Only anonymous comments require approval”. You can of course also set it to “All comments require approval”. With the email notification setting you can setup wether you want to be emailed if a comment is placed.  

When reviewing comments, you can filter comments on “no spam”, “possible spam” and “spam” (or “ignore” to view all comments). That way it’s pretty easy to moderate (and publish) all good comments and ignore the spam.  
2. One of the most easy suggestions is to turn of comments for old blogposts. It’s also a shame you have to do this, as normal people also can’t comment on these. But for me personally, I’ve got blogposts of almost three years old and those are getting spammed like there’s no tomorrow. Especially this one : [First Post!](/blogs/dennis/archive/2003/10/21/145.aspx)  
This option can be found under your weblog dashboard, in the left menu choose “Global Settings” and “Advanced Post Settings”. You can configure the “Comment day limits”, where I’ve set it up for 90 days.  
3. Another thing you can do is check the default spam blocking configuration and override it for your personal weblog. Check your dashboard again, choose “Global Settings” and “Spam, ping and Cross-Posting”. Mark the checkbox to override custom spam scores. I believe it’s currently set to the default, 5 points for moderation, and 10 for spam. I’m not going to tell you exactly how Spam Blocking works in Community Server, because you can read more about it [here](http://jaysonknight.com/blog/archive/2006/08/20/CS-Tidbits-_2300_21_3A00_-Exploring-The-CS-Spam-Blocker.aspx). But it counts url’s in the comment, bad words and how many times someone posts a comment in the last x seconds. These negative penalty points are ‘awarded’ and punished based on thresholds in our configuration. When you reach 10 points, your comment is marked as spam. After checking the “Use custom spam scores” you can lower these numbers, if too much spam comes through the spam blocker and are marked as ‘normal’ comments.  
4. The last thing you can do is to not allow anonymous users to comment your posts. Under “Advanced Post Settings” again, you can set “Allow anonymous users to comment” to no. Everyone will have to register to place a comment. But people who might have really good comments, might choose to not bother anymore because of the required registration.  
5. You don’t have to delete comments that are marked as being spam. They are automatically deleted after a certain configured number of days.

Well, good luck in fighting spam.

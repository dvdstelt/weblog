---
id: 17978
author: Dennis van der Stelt
title: Someone placed a new comment!
description: At this community with some beautiful members who like to blog here, we had a serious...
pubDate: '2006-08-31T02:22:00'
tags:
  - BloggingAbout.NET
  - Community Server
redirect_from:
  - /dennis/2006/08/31/spam-someone-placed-a-new-comment
  - /blogs/dennis/archive/2006/08/31/spam-someone-placed-a-new-comment.aspx
---
At this community with some beautiful members who like to blog here, we had a serious problem. Spam comments. I’ve blogged about it [before](/2006/08/22/Spam-control/) and others as well. So when reading the [article about the CS Spam Blocker](http://jaysonknight.com/blog/archive/2006/08/20/CS-Tidbits-_2300_21_3A00_-Exploring-The-CS-Spam-Blocker.aspx) by [Jayson Knight](http://jaysonknight.com/), I read that comments marked as spam would be deleted automatically. So I tried to figure out how this was working. But still, for every comment-spam I received, I also got an email. Resulting in a flooded mailbox from time to time.

So when I saw J-O Eriksson talk about the [spam comments being deleted by an automated job](http://joeriksson.com/archive/2006/08/30/Deleting-Auto_2D00_Deleted-Spam-comments.aspx), I asked myself what Jasyon Knight actually ment. So I asked, and as you can see in the replies in the J-O Eriksson post, it’s solved! 🙂

One last time, what can you as a blogger do?
1. Go to your weblog’s dashboard.  
2. Go to default post settings at [https://bloggingabout-linux.azurewebsites.net/ControlPanel/Blogs/DefaultPostSettings.aspx](/ControlPanel/Blogs/DefaultPostSettings.aspx)  
Remember these settings are post settings, and can be changed on each individual post. These are just the default.  
    1. Set “Allow Comments on my blog” to “yes”  
    2. Set “Comment Moderation” to “Only anonymous comments require approval”  
In the future, if you no longer receive comments, you can set this to “Comments are published immediatly”  
    3. Set “Send me email notifications” to “All Feedback”  
You’ll receive email when someone posts a comment, or a trackback is created.
3. Go to Advanced Post Settings at [https://bloggingabout-linux.azurewebsites.net/ControlPanel/Blogs/PostOptions.aspx](/ControlPanel/Blogs/PostOptions.aspx)  
Remember these settings are global, and overrule the settings on individual posts.  
    1. Set “Allow Anonymous Users to Comment” to “Yes”  
    2. Set “Comment Moderation” to “Ignore”  
    3. Set “Allow comments on my blog” to “Yes”  
    4. Set “Comment Day Limits” to “Always”
4. **Now the beautiful part!** Go to My Email Settings at [https://bloggingabout-linux.azurewebsites.net/ControlPanel/Blogs/GeneralOptions.aspx](/ControlPanel/Blogs/GeneralOptions.aspx)  
5. Check the option “Do not send email notifications for comments rated as spam”

Now everyone will still be able to post spam, but it’ll be marked as spam, you won’t get any email about it, and it’ll be deleted after a certain number of days. In other words, you won’t notice it even if you get a million spam comments per day.
**Notice:** * If you still get spam-comments that get *through* the spam-blocker, notify me and forward the email you receive about the comment. Only then can I take actions like adding the words to the bad-word filter, if they aren’t already in.  
* There are two levels of spam. Spam that the system is 99% sure of that it is spam, and spam that is marked as “possible-spam”. You’ll still get e-mails of those, as Community Server can’t be too carefull about marked comments as spam.

Again, good luck fighting spam.

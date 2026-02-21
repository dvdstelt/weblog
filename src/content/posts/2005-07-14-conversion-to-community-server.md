---
id: 8534
author: Dennis van der Stelt
title: Conversion to Community Server
description: As you have probably noticed, Blogging About .NET has been ‘upgraded’ to Community Se...
pubDate: '2005-07-14T02:16:00'
tags:
  - BloggingAbout.NET
redirect_from:
  - /dennis/2005/07/14/conversion-to-community-server
  - /blogs/dennis/archive/2005/07/14/conversion-to-community-server.aspx
---
As you have probably noticed, Blogging About .NET has been ‘upgraded’ to [Community Server](http://www.communityserver.org/). It was pretty painful, because of various reasons. For one, I had to do a complete testrun at a local machine. It took several hours converting the database and some time setting up Community Server. I immediatly noticed that the application name was used as display name. My applicationname is Dennis, is it says in the url. That and some other problems, made me do some fix runs on the (copy of the) original database, before doing another testrun.

After getting it setup, I wanted to have another frontpage, as the original is to basic. So I used the templates from [CodeBetter](http://www.codebetter.com/) and implemented them here. They have some additional changes that I want to implement in here as well.

Then I got a new host and finally I was ready to try and get Community Server up and running there. But when uploading the converted database onto the new domain, all objects had the wrong owner. So I had to fix some things here and there as well. Finally I thought I had everything as it should be, but it kept refusing to show the errors, even though I had customErrors=”Off” in my web.config. After a struggle I decided to wipe everything clean and start over with a clean Community Server install, without my database. Only then I noticed the error turned up again, right after I had updated my web.config. I dragged it into Internet Explorer and it showed me same bad characters. As I can see now, Wordpad screwed up my web.config. After loading it in Notepad and editting it, everything worked fine. I then uploaded the database and the new BloggingAbout.NET worked flawelessly!

Then it was time to transfer the domainname to the new DNS servers, which took about 2 days to complete. I always thought it would just transfer me to either the old or new file, but now I know it keeps transferring you back and forth, depending on what route you get send to. This goes for a lot of files, so sometimes I was looking at the new site, but with the old cascading stylesheet (.css). Everything should now be okay though.

A few things I have to complain about Community Server.
* The frontpage, they really need to make me able to add some interesting stuff there.  
* Logging in is a bitch currently. You always have to go the specific pages to be able to login, because no blog currently offers the functionality.  
* The version of FreeTextBox that’s implemented is very limited. I’ll have a try at [FCKEditor](http://www.fckeditor.net/) as [described here](http://ddenet.com/blogs/devans/archive/2005/06/28/4.aspx). Not sure if that’ll work for us though. I can’t have people browsing over the entire server, I just want to give them access to specific directories.  
* Redirection to new urls. It’s not really friendly of Telligent not to provide (optional) redirection to the new url’s of everything from .Text ot CS. Especially since the categories no longer work as in .Text. When you’ve had a link to an old category, you get a nice and clean error now.  
* The way the setup screen for (as an example) links is now, is kind of unhandy. The .text way was much more pleasant to work with.  
* Categories again. I have to click open “Advanced Settings” to be able to specifiy the category some posts belong to. That’s not how it worked in .Text. Why change a working formula into something it’s now?  
* Setting up your current profile by clicking on your name in the top-right corner isn’t very transparent. It took me some time in the old version, to find out why everything in the forum (on the official site) was in Dutch. Now I know, click your name and you’ll see.  
* Images in a disabled Gallery still turn up in the /photos/ directory. I thought I’d upload some picture to use it in a post, but it also turned up in /photos/. Kind of strange.

I’ll have a look if I can add and/or change some functionality to the way me and our users want it. But it’ll probably be a lot of work when a new version of CS is released. I’ll have to implement all changes again with a good possibility that they’ve broken some interfaces in the internals of CS, like with 1.1 happened.

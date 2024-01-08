---
layout: post
id: 474729
author: Dennis van der Stelt
date: 20080918 071313
title: FinalBuilder  Action lists
description: As I’ve said before, years ago on some project I first got the opportunity to work wi...
categories:
    - Agile
    - Utilities
redirect_from:
  - "/dennis/2008/09/18/finalbuilder-action-lists"
  - "/blogs/dennis/archive/2008/09/18/finalbuilder-action-lists.aspx"
---

As I’ve said before, years ago on some project I first got the opportunity to work with FinalBuilder. After years of silence I picked it up again at version 5 and recently switched to the latest version 6.
Have you ever had the feeling that some developer around you suffered from the [NIH syndrome](http://en.wikipedia.org/wiki/Not_Invented_Here)? Like myself on the [pdf creation](https://bloggingabout.net/2008/07/30/what-s-a-good-library-to-create-pdf-documents)?! And that they’re wasting a humongous amount of time building it themselves instead of using some $300 tool?
***If you still work with MSBuild, you’re suffering from the NIH syndrome*** Setting up a FinalBuilder script can take some time, especially for the first time, but not as much as with MSBuild. And when you’re done, it so extremely easy to change the script real fast. Seriously, try it out. It’ll enhance your daily life.

But back to action lists. Today I found out about them. FinalBuilder is so chuck-full of actions and possibilities that you can’t learn them all at once. But that’s where the [blogosphere](http://en.wikipedia.org/wiki/Blogosphere) comes to the rescue.

[![actionlist](/images/finalbuilder-action-lists/actionlist_5f00_thumb.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/actionlist_5F00_2.png) Ever noticed the two tabs “Main” and “OnFailure”? The first one is where your actions are and the second one is executed on failure. It’s awesome to use for sending an e-mail or creating TFS workitems when something went wrong.

But looking at the image on the right you might already noticed I’ve created a third and custom action list. This is like a subroutine you can execute, just like in your code. You can even provide it with a set of parameters that you can set from the “Run Action List” action, as shown in the image. Right-click the tab to rename it or specify the available parameters. I’ve added a “MessageBox_Message” parameter so I can show a MessageBox with a custom message.

[![actionlist2](/images/finalbuilder-action-lists/actionlist2_5f00_thumb.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/actionlist2_5F00_2.png) 

After you’ve specified some parameters, you can set them within the mentioned “Run Action List” action, as shown below.

[![actionlist3](/images/finalbuilder-action-lists/actionlist3_5f00_thumb.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/actionlist3_5F00_2.png) 

When I get back to work tomorrow, I really have to implement this in one of our most complex build scripts.
1. It cleans up the “General” action list 
2. It takes parameters without having the need to specify extra project variables/properties.

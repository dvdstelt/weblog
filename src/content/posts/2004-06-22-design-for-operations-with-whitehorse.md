---
id: 1053
author: Dennis van der Stelt
title: Design for Operations with Whitehorse
description: There’s a nice article from the MSDN Mag put online on MSDN. It’s about Whitehorse, w...
pubDate: '2004-06-22T07:04:00'
tags:
  - architecture
redirect_from:
  - /dennis/2004/06/22/design-for-operations-with-whitehorse
  - /blogs/dennis/archive/2004/06/22/design-for-operations-with-whitehorse.aspx
---
There’s a nice article from the [MSDN Mag](http://msdn.microsoft.com/msdnmag/) put online on MSDN. It’s about Whitehorse, which I’m very interested in. It explains what Whitehorse is, what it does and what you can do with it. I’ve already seen the [web cast ](http://msdn.microsoft.com/msdntv/episode.aspx?xml=episodes/en/20040129VSTUDIOAT/manifest.xml)where they show the graphical designer for design and validation of your (enterprise) applications. What they didn’t show, as far as I can remember, was the class designer that comes with it.
**Class designer** I had no idea a class designer was included in Whitehorse and now I’m even more eager to start testing it then before. With the class designer, you can create classes graphically and let the designer create your code, but this is also able the other way around. You can create code, drag the file onto the graphical designer and let Whitehorse create the graphical representation of your class. When you edit one of both representations, the other side immediately synchronises! As you can see in the picture below, inheritance (or generalisation) and everything else is included. Even the new friend and internal scopes from VB.NET and C# are included, which don’t exist in former UML. I have no idea if it’s included in UML 2.0, but it is in Whitehorse.

Currently I use Visio with the great [Visio UML Stencils](http://www.phruby.com/stencildownload.html) from Pavel Hruby to just sketch my UML and create the code myself. I really hope Whitehorse delivers the goods so I’ll be able to use it, when released with Visual Studio 2005.I hope Microsoft will add functionality to create lots of other diagrams as well, like sequence and everything else, or create a stand-alone case modelling tool. I don’t really like the current available ones! 😉

![](/images/design-for-operations-with-whitehorse/fig07.gif)
**So what is Whitehorse in a few words?  
**Okay, for everyone who’s interested or just doesn’t know, I’ll try to explain what Whitehorse is in a few words. You might want to call it *Whitehorse for dummies, an introduction.* Normally, you create a really big app, multiple assemblies, web-services, asp.net and/or winforms, etc, etc. All the works. When deploying, lots of different problems occur. With Whitehorse, Microsoft tries to show and solve these problems, while developing or even before development starts. You can design projects/solutions within Whitehorse. The article takes an ASP.NET app, a web-service and a database as an example. They create these “logical nodes”, bind them together and set properties for the nodes, like using Windows authentication, impersonation and SSL for the ASP.NET server and connectionstring and such for the connection to the database.

After this they create the actual server types for the database and the webservers (for the web-app and the webservices). After this, they map the logical nodes, the projects, onto the servers. Now you can just implement this all and create real projects in Visual Studio 2005.Then you can test your complete setup by pressing F5 and Whitehorse will report all (possible) problems that will occur when you deploy your complete app on real servers. The cool thing is, you can setup different servers. One for development and one for final deployment, etc.

Then, in the article, the class designer comes in and you get a good picture of what Whitehorse actually is. A solution to problems that may very well occur after you successfully delivered your entire product, but stumble across a lot of problems while testing integration.

---
layout: post
id: 481333
author: Dennis van der Stelt
date: 20090313 030534
title: Best developer tools
description: Because of the nature of my work, coaching people onsite and training people in clas...
categories:
    - Agile
    - TypeMock
    - Utilities
redirect_from:
  - "/dennis/2009/03/13/best-developer-tools"
  - "/blogs/dennis/archive/2009/03/13/best-developer-tools.aspx"
---

Because of the nature of my work, coaching people on-site and training people in classes, I talk to a lot of developers and managers about the way people work. Unfortunately a lot of companies still don’t unit test their software and don’t setup an automated build. At times that’s specifically what we at Class-A are hired for. But if it’s not, we try to convince our customers that they gain by working with these practices.

Most companies want to professionalize and create better (quality) software. But for some reason, this can’t cost them anything. And I’m not talking about development time or learning curve, that’s a different story. I’m talking about the licensing cost of the tools you want or even need. For some reason people can’t lay down a few hundred dollars for something that will save them immense amounts of time, and thus money.

People rather spend countless number of hours on creating their own grid, whereas for a small amount of money you can buy a grid that has it all and can do it all, before you started thinking about it. People rather spend countless number of hours writing extra code, just to make it testable. People rather spend countless number of hours doing stuff that can be automated, generated or in some other way be helped with. I’m not sure about you, dear reader, but on my part this is unacceptable.

This blogpost is about my top 3 favorite products for developing software. Each one of them costs money, while there are free alternatives. But they’re in this list because they make developing software so much easier, that they pay back the investment within a matter of weeks or sooner.
1. [![FinalBuilderMainScreenshot](/images/best-developer-tools/finalbuildermainscreenshot_5f00_thumb_5f00_51012d74.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/FinalBuilderMainScreenshot_5F00_3BD327CC.png) **FinalBuilder** This is a tool to setup automated builds via a really great user interface. It has over 600 actions to perform, like copy files, compile projects, source repository actions, archiving, flow control, etc, etc.

With FinalBuilder you can setup these actions as steps and use advanced flows to guide builds through your steps. Work with variables, action panes with arguments that kind of behave like methods and much more. When a customer uses FinalBuilder, we try to automate everything; from build to deploying applications, services, databases and more. 

The best part is that everything works with a great user interface, instead of the XML files that MSBuild & TeamBuild use. It’s really easy to track down what happened if things go wrong as FinalBuilder includes (historical) logs, also visualized. And if you’re using Team Foundation Server 2008, there’s a great integration so you can start using FinalBuilder from within TFS. And if you don’t have TFS or a useful Continuous Integration server, you can use FinalBuilder Server. 

If you still setup a build without FinalBuilder, I urge you to download the trial and see for yourself how powerful and user friendly it is. And if you need help, you know where to find me. 

[http://www.finalbuilder.com/](http://www.finalbuilder.com/) 
2. **Typemock Isolator** [![typemock](/images/best-developer-tools/typemock_5f00_thumb_5f00_49098b12.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/typemock_5F00_4975BE07.png) More and more people start writing unit tests and eventually start using a mocking framework. Although there are more frameworks and they’re even free, in my experience it’s unbelievable how powerful Typemock Isolator is.

A great feature about Typemock Isolator is also that you don’t specifically have to design your code to be testable. Of course it’s a good practice to decouple using interfaces and what else. But if you need to decouple, using IoC and such *just because* else your code would not be testable, it’s not a good thing. You need those things for a good design, not a testable design. That’s where Typemock Isolator can help, simply because of its power. A few examples: 
    1. You can swap out instances you normally can’t control from the outside and even use [duck-type](http://blog.typemock.com/2008/10/typemock-isolator-511-is-out.html) swapping. 
    2. The SharePoint object model is extremely large, but Typemock Isolator makes it easy to create fakes by using a feature called *Recursive Fakes*. More info [here](http://blog.typemock.com/2008/09/testing-sharepoint-now-easier-with-new.html). 
    3. Scott Hanselman believes in it as well, as you can read in this [case study](http://www.typemock.com/files/TypeMock_Corillian_CaseStudy.pdf). 

[http://www.typemock.com/](http://www.typemock.com/) 
3. **Refactor! Pro** [![refactor](/images/best-developer-tools/refactor_5f00_thumb_5f00_14f4ebbf.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/refactor_5F00_3654915B.png) There are multiple, so called, productivity tools. One of the most well known is Resharper, which I have a dislike for. First of all, it messes up my Visual Studio completely, which means my students won’t know when Resharper is doing something and when Visual Studio is doing something. You also have DevExpress CodeRush, one I like far better, but also changed Visual Studio a lot.

Refactor! Pro is a tool, also by DevExpress. This tool doesn’t invade into Visual Studio too much, but has a great power for refactoring. You have to learn how to use the tool, as there still aren’t many small tips on the DevExpress website, which I think is a shame. The fact that you not only have to know which refactorings are available, but also where to place the cursor to enable the refactoring. But when you do learn, it gives you great advantage, especially when doing Test Driven Development where you have to refactor a lot of code. 

Again, a great tool to enhance productivity which eventually pays itself. 

[http://devexpress.com/refactor/](http://devexpress.com/refactor/ "http://devexpress.com/refactor/") 

Again, if you really want to <u>gain in productivity</u> and think this is worth money, buy these tools.

If you want to <u>lag behind</u>, have <u>less control</u> over what you’re doing and don’t think <u>quality</u> is something your customers need, don’t…

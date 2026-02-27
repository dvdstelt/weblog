---
id: 13794
author: Dennis van der Stelt
title: Beat up your team members with the Continuous Integration Token
description: "While writing his upcoming book\_The Art of Agile Development, James Shore is posting ..."
pubDate: '2006-08-18T12:29:00'
tags:
  - agile
  - Development
redirect_from:
  - /dennis/2006/08/18/beat-up-your-team-members-with-the-continuous-integration-token
  - /blogs/dennis/archive/2006/08/18/beat-up-your-team-members-with-the-continuous-integration-token.aspx
---
While writing his upcoming book *[The Art of Agile Development](http://www.jamesshore.com/Agile-Book)*, James Shore is posting a lot of chapters on his website to be reviewed by visitors. He just posted [a great chapter](http://www.jamesshore.com/Agile-Book/continuous_integration.html) on how he thinks [Continuous Integration](http://en.wikipedia.org/wiki/Continuous_integration) should take place. He mentions the Integration Token; a physical object like a rubber chicken or a stuffed toy. Whenever you’re busy on updating the CI server, you should take this token from the server so everyone knows you’re busy with the application/project.

He describes this in three steps:
1.    
Check that the integration token is available. If it isn’t, somebody is checking in unproven code and you need to wait until they’re done.
2.    
Get the latest changes from the repository. Others can get changes at the same time, but don’t let anybody take the integration token until you’re done.
3.    
Run a full build and make sure everything builds and passes tests.

In the distant past I was working on a project with a few people where we all had our own database and local webserver. This isn’t a problem, until people start to continuously check-in code that uses something that’s in their database or configuration file. When you get the latest files from your source repository and get their new sourcecode, you miss their new database objects and/or configuration updates. We didn’t even have tests to check this, but the application just kept crashing multiple times a day because of this. When asking the person who checked in the code, you’d get some vague answer about what to do with it, and were left in the dark. Believe me, they weren’t loved by me for this. Heck, at that project, there wasn’t much love at all, so perhaps that was the root of all the problems. 😉

Anyway, the way James Shore describes it in his book is a great way to handle suchs problems. And when there’s no love and people still break the build, there’s probably enoug interest from other team members to beat up the responsible member with the Integration Token!

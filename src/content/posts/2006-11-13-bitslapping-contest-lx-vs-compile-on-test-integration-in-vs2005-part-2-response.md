---
id: 46572
author: Dennis van der Stelt
title: Bitslapping contest  LX vs Compile on Test integration in VS2005, part 2 response
description: Well, it seems Alex took things seriously and is slapping his bitstick around. Think...
pubDate: '2006-11-13T04:49:59'
tags:
  - agile
  - Development
  - Miscellaneous
  - personal
  - Team System
  - Utilities
  - NUNit
  - NCover
  - NCoverExplorer
  - Visual studio 2005
  - unit testing
redirect_from:
  - /dennis/2006/11/13/bitslapping-contest-lx-vs-compile-on-test-integration-in-vs2005-part-2-response
  - /blogs/dennis/archive/2006/11/13/bitslapping-contest-lx-vs-compile-on-test-integration-in-vs2005-part-2-response.aspx
---
Well, it seems Alex took things seriously and is slapping his bit-stick around. Thinks he can just slap me around and walk away with a smile, huh? Well, I’m not done with round 1 Alex.

# Round 1
1. Reflector integration  
Thank you for the point, Alex.  
**+1 Dennis** 2. Code coverage  
Alex should’ve checked out the tools I’m using before he wants to slap me around. When you just take a look at [this animated gif](http://www.kiwidude.com/dotnet/ncoverrunner.gif), I don’t need to explain myself any further. However, I will, just because I know Alex likes that slap in the face. Not sure if he likes 10 slaps though
    1. Instrument any assembly? Of course NCover does that!
    2. Watch code with color highlighting? NCoverExplorer does that as well!
    3. Code coverage results? Ha! Alex, where are your status-bars? I can only see numbers. How about that quick-scan through hundreds of methods?  
![](/images/bitslapping-contest-lx-vs-compile-on-test-integration-in-vs2005-part-2-response/ncoverexplorer_1_3_5_functioncoverag5b15d.png)
    4. Oh, don’t forget the code coverage reports based on number of visits? And coverage based on sequence points? And the satisfactory threshold you can set!
    5. Alex, can you generate MSBuild and Nant scripts with the click of a button, so we can include these in our daily build scripts and create separate reports for those?
    6. A feature I also love is that I can look at my code coverage in NCoverExplorer, while continue to develop in my favorite; not having to rerun my code coverage every time just saves me so much time.
    7. Options are there to exclude assemblies, namespaces or classes from the report.
    8. For all you complete junkies out there, NCoverExplorer supports regular expressions to create complex queries in the coverage exclusions dialog.
    9. NCoverExplorer also supports saving in both XML and HTML, where the native html can be directly attached to e-mails to send to your colleagues, who just like to look at your great coverage report. Have I mentioned status-bars yet?
    10. And last but not least, can I get VS2005 code coverage with Visual Studio Express?

Oooh, I so love my NCover and NCoverExplorer.  
This cannot be anything else than a point for me.  
**+1 Dennis** 3. Repeat Test Run  
Alex has got me there with his arbitrary set of tests.  
**+1 Alex** 4. Test with .NET 1.1 from within Visual Studio 2005  
**+1 Dennis**. No comments.
5. Pluggable unit testing frameworks  
Irrelevant I think not. Mike Glaser did indeed mention Data Driven unit tests in Visual Studio 2005, and that’s where MBUnit comes in, specialized in data driven unit tests. However, I’ll accept no points as we both support data driven unit tests. I’ll have to come up with a winner to get a point.  
**No points** 6. TypeMock.NET integration  
Irrelevant? Again I think not! How could you use unit testing without a mocking framework? This *is* part of my testing framework. Alex decided to not make it count, because Visual Studio 2005 doesn’t support this or any other mocking framework. But because VS2005 doesn’t support it, doesn’t make it irrelevant.  
But again, I’m not the worst guy in the world  
**No points** So the score isn’t a tie now, it’s 3 for me and 1 for Alex. However…

…Alex comes back with a [part 2](http://www.alexthissen.nl/weblog/PermaLink.aspx?guid=ab63ce2b-4bda-4b67-92a7-d6ebea77af1a).

# Round 2
1. Three frameworks for testing? If I can’t bring along my mocking framework, you can’t bring along your load testing. 🙂  
However, I can’t beat his web testing framework. I could bring in NUnitAsp but that can’t be compared with VS2005 web testing  
**+1 Alex** 2. Attribute goodness  
That’s a matter of opinion on what attributes you like best. Of course I can guess why they brought in the timeout attribute; VS2005 unit testing is so slow, you don’t want it to run forever. NUnit doesn’t need a timeout attribute! 🙂 NUnit has Platform, Category, Explicit and other attributes I like far better than the VS2005 attributes Alex mentions.  
**No points** 3. Integration with Team Foundation Server  
Again the rule applies that this is about unit testing frameworks. You can’t bend the rules that way Alex, we’re not inside The Matrix.  
**No points** *Still no tie*. Alex (LX) has 2 points, I have 3.And the score would be even uglier if I wasn’t that friendly the first round with bullets 5 and 6.Only because I was friendly. Again I say “However…”

# Round 3

…I’ll come back with a response. To be continued… 🙂



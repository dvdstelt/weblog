---
id: 399024
author: Dennis van der Stelt
title: Wat zegt Dennis?
description: I’ve been a little busy with Mobile Development lately, focusing on Windows Mobile Po...
pubDate: '2007-10-17T11:42:53'
tags:
  - .NET Compact Framework 3.5
  - Development
  - Personal
redirect_from:
  - /dennis/2007/10/17/wat-zegt-dennis
  - /blogs/dennis/archive/2007/10/17/wat-zegt-dennis.aspx
---
I’ve been a little busy with Mobile Development lately, focusing on Windows Mobile PocketPC and .NET Compact Framework 3.5 development. Mostly because of the [Summer Class](http://www.class-a.nl/index.aspx?id=82) and [Winter Class](http://www.class-a.nl/index.aspx?id=12&catID=16&sid=22), and the [Mobile Development training](http://www.class-a.nl/index.aspx?id=12&catID=12&sid=20) for Class-A. I have however built a .NET Compact Framework 2.0 application I want to share.

I hate it when I just missed the information about traffic jams and have to wait until the next full half hour. And besides that I have a really heavy right-foot that sometimes, occasionally, makes my car go much faster than I want. For this I need information on speed-controls by the police, also called “Flitsers”. I decided to write my own mobile application for my gorgeous HTC Tytn.

[Mike Glaser](https://bloggingabout-linux.azurewebsites.net/blogs/mglaser/) test-drove (pun not intended) it for me and his wife would use to say “What does Dennis say?” (or in Dutch, “Wat zegt Dennis?”) before checking my application. For that reason, I named the application
**<font size="4">Dennis</font>** Now when people ask themselves how fast they can go, they can start up “Dennis” and see what it/he has to say.
**Description  
**“Dennis” is an application that will show ‘Flitsers’ and ‘Files’ (traffic jams) in The Netherlands.

![dennis1](/images/wat-zegt-dennis/dennis1_thumb.png)  ![dennis2](/images/wat-zegt-dennis/dennis2_thumb.png) 

You can start it up via an icon in the ‘Programs’ folder, it’s called ‘Wat zegt Dennis’.

Navigation through the application can be done entirely by the cursor keys. Up and down will make you scroll through the lists, left and right will make you flip the tab-pages.

On the options screen, you can set your favorite highways. As shown in the screenshot, separate them with semicolons. Marking the “Toon standaard alleen favorieten” will make the application show your favorites on startup. Don’t forget to save your settings.

The ‘Refresh’ button will get the latest information about traffic-jams and speed-controls. The right hardware button will make you switch between all information and your favorites.

The application uses screenscraping to gather the information. This means it loads a webpage and retrieves the needed information from it. Once the owner of the webpage changes its layout, the application probably won’t work anymore. Check here regularly for information and updates.
**Requirements** A PocketPC with Windows Mobile 5 or 6  
Preferably 240×320 resolution.  
.NET Compact Framework 2.0  
180kb of free diskspace for the application, 1kb extra for settings file.
**Download  
**[You can download the application here](/files/DennisSetup.msi).  
Double-click the installer on your desktop and it’ll install itself onto your mobile device.
**Roadmap** I have some ideas on what the application should do. Most of them don’t even fit in the current application, so probably a complete rewrite is coming up.
* <div align="left">Optional Auto-refresh that refreshes the information automatically on a given interval.</div>
* <div align="left">Better support for different resolutions. It’s somewhat build in, but might fail as I didn’t do much testing.</div>
* <div align="left">Remove screenscraping and introduce WCF for gathering data.  
This would mean porting the application to .NET 3.5.Would give me LINQ though. 😉</div>
* <div align="left">Plugins  
This is probably the biggest part I’m thinking of. I want some plugin or provider model that enables people to write their own components to retrieve data and make “Dennis” usable for people outside The Netherlands. This also means…</div>
* <div align="left">Multilanguage</div>
* <div align="left">The ability to enter the speed you would’ve went through the speed-camera, so that it can calculate what fine you just saved yourself. Even better would be that it’d save this information and maybe even send it make to a webserver to gather statistics. According to Mike, you should pay 10% of the fine you just saved yourself from. Good idea, I’ll setup an account for you folks! 😉</div>
**Questions, remarks, new features  
**If you have anything to share, [contact me](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/contact.aspx)!!!  
I’d really like to know what you think of the application or if you have any suggestions, new features, etc.

Have fun and drive safely!!!

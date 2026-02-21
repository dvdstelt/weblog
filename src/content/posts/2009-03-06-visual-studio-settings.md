---
id: 481275
author: Dennis van der Stelt
title: Visual Studio settings
description: I regularly forget, after reinstalling my desktop or laptop, what settings I had con...
pubDate: '2009-03-06T12:19:28'
tags:
  - Visual Studio 2008
redirect_from:
  - /dennis/2009/03/06/visual-studio-settings
  - /blogs/dennis/archive/2009/03/06/visual-studio-settings.aspx
---
I regularly forget, after re-installing my desktop or laptop, what settings I had configured in Visual Studio. Today I was looking for another one and decided to blog about it, for a personal reference. More will probably come to my mind or I get some cool tips from others, so I’ll update this post whenever this happens.
**<u>Tabs instead of spaces</u>** As everyone knows, you need to setup tabs in Visual Studio and not have spaces inserted. The two main reasons is that every developer can decide for him/herself how many positions each tab will take from the side. The other reason is that tools to compare code will go nuts on spaces, thinking every line is changed.

![tabs](/images/visual-studio-settings/tabs_5f00_thumb_5f00_688e0d6a.png)<u>**Track items in solution explorer   
**</u>When you’re inside some code, you’re not always sure which file in the solution explorer you’re working with, because jumping all files with the best shortcut keys might result in me getting lost. With this setting on, the solution explorer selects the file you’re working in.

[![track-item-solution-explorer](/images/visual-studio-settings/trackitemsolutionexplorer_5f00_thumb_5f00_52777c0b.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/trackitemsolutionexplorer_5F00_004544D1.png) 
**<u>XAML Viewer, no designer   
</u>**Most of the time I don’t work with the designer and I only want to see the XAML. Also because the designer takes a while to load, especially the first time. This makes sure the XAML is full screen when you click a WPF/Silverlight file.

[![xaml-viewer](/images/visual-studio-settings/xamlviewer_5f00_thumb_5f00_69c2807c.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/xamlviewer_5F00_0396B6AC.png) 
**<u>Double-click failed test takes you to failing line in code   
</u>**This option is very useful if you’re doing unit testing and your test fails. Instead of multiple clicks, one click on the error (the row in the testresults pane) take you immediately to the failing line.

[![failed-test-clickable](/images/visual-studio-settings/failedtestclickable_5f00_thumb_5f00_6811b4a8.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/failedtestclickable_5F00_3B68FACF.png)

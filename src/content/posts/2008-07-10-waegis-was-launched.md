---
id: 464513
author: Dennis van der Stelt
title: Waegis was launched
description: Keyvan Nayyeri has launched his project today, something he calls “The Web Cleaner”. ...
pubDate: '2008-07-10T09:04:08'
tags:
  - blogging
  - Community Server
redirect_from:
  - /dennis/2008/07/10/waegis-was-launched
  - /blogs/dennis/archive/2008/07/10/waegis-was-launched.aspx
---
![waegis](/images/waegis-was-launched/waegis_5f00_3.png) Keyvan Nayyeri has launched his project today, something he calls “[The Web Cleaner](http://nayyeri.net/blog/waegis-ndash-the-web-cleaner/)”. The official name is [Waegis](http://waegis.com/) and it’s a service to filter out spam.

### Alpha testing

[BloggingAbout.NET](https://bloggingabout-linux.azurewebsites.net/) joined the alpha process and we were extremely happy with the results of Waegis. To start with, installation is a breeze. This is also because of Community Server 2008 (CS2008), but you just have to copy two binaries onto the webserver and configure the Waegis spam blocker. Each CS2008 spam blocker rates every comment with some points and based on your own configuration decides if it’s possible spam or should be automatically deleted. During alpha we initially didn’t let Waegis rate comments too high, but after only a few weeks of testing we decided that if Waegis thought it was spam, it should be auto deleted.

I just installed the latest version and am keeping a close eye on what Waegis does, but if everything goes as smooth as it did, Waegis is going to change the lives (or at least the mail inbox) of our bloggers.

### API

You can [download](http://waegis.com/download/) ‘custom’ clients for multiple Community Server versions and GraffitiCMS. But there’s also an [API available on CodePlex](http://www.codeplex.com/waegislibrary) to code against. This way you could write spam blockers for every other blog engine or even Exchange server and/or Outlook.

### Conclusion

We tried Akismet before but weren’t too happy about the results. Comments that were obviously spam weren’t rate by Akismet that way, but Waegis seems to do it’s job perfectly. We’ll see what the future brings, but for now [Waegis is definitely worth looking into](http://waegis.com/) if you have any problems with (comment) spam.

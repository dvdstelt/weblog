---
id: 936
author: Dennis van der Stelt
title: WindowsXP SP2 is coming… and bring some troubles along the way
description: Microsoft is about to release Service Pack 2 for WindowsXP in a few months, if I’m no...
pubDate: '2004-05-31T11:11:00'
tags:
  - Miscellaneous
redirect_from:
  - /dennis/2004/05/31/windowsxp-sp2-is-coming-and-bring-some-troubles-along-the-way
  - /blogs/dennis/archive/2004/05/31/windowsxp-sp2-is-coming-and-bring-some-troubles-along-the-way.aspx
---
Microsoft is about to release Service Pack 2 for WindowsXP in a few months, if I’m not mistaken en Microsoft doesn’t delay again. There’s [an article for web developers](http://msdn.microsoft.com/asp.net/using/understanding/security/default.aspx?pull=/library/en-us/dnwxp/html/xpsp2websites.asp) in which you can read what the changes are. To sum a few…
* Websites starting downloads without the user initiating the download himself, will be blocked. Well, not the site, but the download. A LOT of websites use this feature, where you have to wait a few seconds and your download will start. I have no idea why they do this, but from what I read here, that won’t work anymore.
* Popups will in most cases be blocked!!!  
Now this sucks big time. I believe users can see popups that are being blocked, to open them after all, if they please, but most users I know won’t bother watching for those popups and just start calling me, their family IT specialist (yak!), why their favorite websites aren’t working anymore.  
Windows will only popup, when created with the *window.createPopup()* method, but only one at a time. Now does this mean I can’t open a popup from my popup as well?

There’s more, maybe you ought to read it, as a lot of websites might be getting into problems.

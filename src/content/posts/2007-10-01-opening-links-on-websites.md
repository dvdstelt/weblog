---
id: 381631
author: Dennis van der Stelt
title: Opening links on websites
description: First, let me tell you how I open my websites in Internet Explorer 7 andor Firefox. ...
pubDate: '2007-10-01T08:07:02'
tags:
  - asp.net
  - blogging
  - personal
redirect_from:
  - /dennis/2007/10/01/opening-links-on-websites
  - /blogs/dennis/archive/2007/10/01/opening-links-on-websites.aspx
---
First, let me tell you how I open my websites in Internet Explorer 7 and/or Firefox.

<div align="center">
<table cellspacing="0" cellpadding="2" width="400" align="center" border="0">
<tbody>
<tr>
<td valign="top" width="200">

Open link in new window

</td>
<td valign="top" width="200">

SHIFT + Mouse-click

</td>
</tr>
<tr>
<td valign="top" width="200">

Open link in new tab window

</td>
<td valign="top" width="200">

CTRL + Mouse-click

</td>
</tr>
<tr>
<td valign="top" width="200">

Open link in same window

</td>
<td valign="top" width="200">

Drag link to tab

</td>
</tr>
<tr>
<td valign="top" width="200">

Refresh post-back page without re-posting

</td>
<td valign="top" width="200">

Drag icon from address bar to tab

</td>
</tr>
</tbody>
</table>
</div>

Because I’m used to this myself, some time ago I stopped using the “target” attribute in the links I post in my blogs. Because users now have so much control over how they want to open links, I think it’s time to forget about that target attribute and let the user decide for itself. Using this attribute seems to be something from the past, and more and more websites seem to adopt this. It’s probably already well known under true website designers and/or developers, but as I don’t do that much web development myself anymore, it might also be a well-known but unwritten rule that exists since some time.

This has effect on my behavior in clicking on links. When I actually want to leave a website and follow a link, I just click it. And it always bothers me when sites still use the *target=”new”* attribute. I then have to close the new window and drag the just clicked link to the tab.

This also reminds me a benefit that Firefox has. You can drag your links to any opened tab, while with IE7 you can only drag the link to the currently active tab. The same goes for the icon in the address bar. When you’ve submitted some info to a post (did a post-back) you can refresh that page without resubmitting everything by dragging the icon from the address bar to a tab. In IE7, just the active tab.

So perhaps I can persuade you to lose the “target” attribute in your href tags from now on…

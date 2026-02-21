---
id: 274381
author: Dennis van der Stelt
title: Silverlight controls suite
description: Currently SilverLight doesn’t support a lot of controls. Via Tim Sneath I found Netik...
pubDate: '2007-06-25T10:53:50'
tags:
  - Silverlight
  - SilverLight
redirect_from:
  - /dennis/2007/06/25/silverlight-controls-suite
  - /blogs/dennis/archive/2007/06/25/silverlight-controls-suite.aspx
---
![goa_winforms](/images/silverlight-controls-suite/goa_winforms_1.png)Currently SilverLight doesn’t support a lot of controls. Via Tim Sneath I found Netika Tech whom build this suite of controls called GOA WinForms for SilverLight and Flash. It has over 40 standard controls and components to use Windows like controls in your SilverLight application. Skinning seems to be possible, although I believe this is only possible via code.

There’s also a professional version with even more controls, but you’ll have to pay for this package. The demos are a bit slow, but as Tim Sneath points out, these are alpha controls running on an alpha SilverLight.

It’s a bit weird what they’re doing though, because your SilverLight “form” has to start inheriting from System.Windows.Forms.Form. I haven’t had the change, but it should be interesting taking a look at them with Reflector.

Although they’re worth checking out, because they look great, it’s a bit of a shame if people start using controls like this too often. SilverLight should bring a much richer user experience.



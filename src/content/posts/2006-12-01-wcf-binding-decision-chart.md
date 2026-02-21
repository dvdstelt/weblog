---
id: 63016
author: Dennis van der Stelt
title: WCF Binding decision chart
description: A while ago I saw this decision chart to help choose a WCF default binding. Unfortuna...
pubDate: '2006-12-01T01:02:32'
tags:
  - .NET Framework 3.0
  - WCF
  - Windows Communication Foundation
redirect_from:
  - /dennis/2006/12/01/wcf-binding-decision-chart
  - /blogs/dennis/archive/2006/12/01/wcf-binding-decision-chart.aspx
---
A while ago I saw this decision chart to help choose a WCF default binding. Unfortunately I cannot remember where it came from. The problem I had with it was that you could only reach wsHttpBinding if you had to use interop. But you might need to use HTTP for a transport. Also the local option came too soon, where answering yes ruled out MSQM and P2P. So I had to change the original chart a bit. If there are any errors, please make a suggestion in the comments and I’ll try to fix the chart.

[![](/images/wcf-binding-decision-chart/wcfdecisionchart.png)](/wp-content/uploads/2006/12/wcfdecisionchart.png)

Class-A logo in there because it’s from our training material. You can use the chart for whatever you like though.



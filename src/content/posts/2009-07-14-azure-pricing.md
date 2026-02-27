---
id: 481934
author: Dennis van der Stelt
title: Azure pricing
description: So finally they released some information on Azure pricing, or the Azure Business Mod...
pubDate: '2009-07-14T09:37:57'
tags:
  - azure
redirect_from:
  - /dennis/2009/07/14/azure-pricing
  - /blogs/dennis/archive/2009/07/14/azure-pricing.aspx
---
So finally they released some information on Azure pricing, or the Azure Business Model as it’s called…

First, it’ll be commercially available from PDC09 in LA this year.


<div class="table-container">
<table>
<tr>
<th>Windows Azure</th>
<th>SQL Azure</th>
<th>.NET Services</th>
</tr>
<tr>
<td>Compute @ $0.12 / hour</td>
<td>Web Edition – 1GB @ $9.99</td>
<td valign="top" rowspan="3" width="203">Messages @ $0.15/100K message operations , including Service Bus messages and Access Control tokens</td>
</tr>
<tr>
<td>Storage @ $0.15 / GB</td>
<td>Business – 10GB @ $99.99</td>
</tr>
<tr>
<td>Transactions @ $0.01 / 10K</td>
<td></td>
</tr>
</table>
</div>

Bandwith on all three will be charged at $0.10 in and $0.15 out per GB.

Customers have said that consumption based pricing as stated above might give unpredictable results. I can already imagine us opening up the slider and spend tons of computing hours, storage, etc. At PDC09 other options should be presented.

With going prices, if I would host BloggingAbout.NET on Azure, that would probably mean around $ 350,00 per month. With one VM we’d use 24 computing hours a day; our database hasn’t reached the 10GB yet, but is way over the 1GB limit of the web edition. Although I can guess other companies find $ 350 a month pretty cheap, considering they don’t need infrastructure people running around, I think I’ll stick with my own server! 🙂

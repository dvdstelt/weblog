---
id: 1416
author: Dennis van der Stelt
title: DropDownList and the ViewState
description: I have no idea if I’m an idiot or not, but I did not know the DropDownList needs the ...
pubDate: '2004-09-29T08:43:00'
tags:
  - Development
redirect_from:
  - /dennis/2004/09/29/dropdownlist-and-the-viewstate
  - /blogs/dennis/archive/2004/09/29/dropdownlist-and-the-viewstate.aspx
---
I have no idea if I’m an idiot or not, but I did not know the DropDownList needs the viewstate to provide the SelectedValue.

Most of the time, I turn off viewstate for controls that hold large amounts of data. DataGrids are a good example. But also the DropDownList is a control that might hold larger amounts of data and all values and their keys are probable all inserted into the viewstate. Not something I’d want.

But when I had a problem with getting the selected item on postback of the webform, the member SelectedValue was always empty. I searched some sites, including Google, only to find this is not an unknown problem. The answer is pretty unknown, because no one can provide an answer.

I tried some colleagues at work, and one asked something about sessions state. This reminded me I had turned of the viewstate of my dropdownlist. Turned it on again, and it worked. *Sigh*.

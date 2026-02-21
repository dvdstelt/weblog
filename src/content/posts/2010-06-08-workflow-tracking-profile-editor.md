---
id: 483473
author: Dennis van der Stelt
title: Workflow Tracking Profile Editor
description: For those using Windows Workflow Foundation 4 (WF4) this might be a very interesting ...
pubDate: '2010-06-08T06:09:33'
tags:
  - .NET Framework 4.0
  - AppFabric
  - WF4
redirect_from:
  - /dennis/2010/06/08/workflow-tracking-profile-editor
  - /blogs/dennis/archive/2010/06/08/workflow-tracking-profile-editor.aspx
---
For those using Windows Workflow Foundation 4 (WF4) this might be a very interesting tool. I was messing a bit with creating a Tracking Profile for my WF4 workflows, but wasn’t succeeding very much. Until the Workflow Tracking Profile Editor was mentioned on the [AppFabric forums](http://social.msdn.microsoft.com/Forums/en-SG/dublin/threads).

This tool makes it dead easy to create a tracking profile. It allows you to load up a WF4 XAMLX file. It then shows the editor and you’re allowed to browse through all (composite) activities. After right-clicking an activity (with a blue circle on it) you can specify what you exactly want to track. It even knows everything about arguments and (scoped) variables so you can use checkboxes to turn them on or off.

 [![wf4tracking](/images/workflow-tracking-profile-editor/8233_wf4tracking_5f00_thumb_5f00_3a268d90.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/5282.wf4tracking_5F00_4F8442F8.png)  [![wf4tracking2](/images/workflow-tracking-profile-editor/4188_wf4tracking2_5f00_thumb_5f00_2efd0346.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/6562.wf4tracking2_5F00_16013301.png) 

This way you can track what arguments go in, come out, what the value of variables was before and after you executed the activity. Very handy and probably a lot of work if you had to enter all the details by hand.

[Download the tool here](http://blogs.technet.com/b/chriscraft/archive/2010/05/01/a-sample-net-4-wf-tracking-profile-editor.aspx).

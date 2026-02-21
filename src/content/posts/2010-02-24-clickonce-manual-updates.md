---
id: 482870
author: Dennis van der Stelt
title: ClickOnce manual updates
description: I’ve written some tutorials in the past to help people with manually updating their C...
pubDate: '2010-02-24T03:41:39'
tags:
  - .NET Framework 2.0
  - Development
redirect_from:
  - /dennis/2010/02/24/clickonce-manual-updates
  - /blogs/dennis/archive/2010/02/24/clickonce-manual-updates.aspx
---
I’ve written some tutorials in the past to help people with manually updating their ClickOnce deployed applications.
1. [Manual check for updates with ClickOnce](https://bloggingabout.net/2007/11/05/manual-check-for-updates-with-clickonce)
2. [Turn off automatic updates with ClickOnce](https://bloggingabout.net/2007/11/28/turn-off-automatic-updates-with-clickonce)
3. [ClickOnce automated build and pfx file](https://bloggingabout.net/2008/10/10/clickonce-deployment-signed-manifests-and-automated-builds-and-resolvekeysource-failing)
4. [Creating ClickOnce deployment files using an automated build and FinalBuilder](https://bloggingabout.net/2008/11/26/deploying-clickonce-applications-automated-using-finalbuilder)

[![clickonce_autoupdate_3[1]](/images/clickonce-manual-updates/0601_clickonce_5f00_autoupdate_5f00_31_5f00_thumb_5f00_6ef866b3.gif)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis.metablogapi/3823.clickonce_5F00_autoupdate_5F00_31_5F00_287B76AB.gif) 

Miscellaneous users still had problems with the updates not checking very well. Joe responded with a solution. I’m writing it down here so more people might benefit from it as well, especially since the comment didn’t contain any linebreaks! 🙂

As Joe mentions the methods CheckForUpdate() and CheckForDetailedUpdate() persist the information retrieved to disk. This way when performing the check for update again, the information is retrieved from disk. If you’ve chosen to skip the update, it won’t ask you again.

You can override this behavior by using an overloaded method of the above mentioned methods and specify that you don’t want the information to be persisted to disk.


```csharp
ApplicationDeployment updateCheck = ApplicationDeployment.CurrentDeployment;
UpdateCheckInfo info = updateCheck.CheckForDetailedUpdate(false);

//
if (info.UpdateAvailable)
{
    updateCheck.Update();
    MessageBox.Show("The application has been upgraded, and will now restart.");
    Application.Restart();
}
```

Check the second line with the method CheckForDetailedUpdate where I pass a ‘false’ to specify that it should not persist the update information.

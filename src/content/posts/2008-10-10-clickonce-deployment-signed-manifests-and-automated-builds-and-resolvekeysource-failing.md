---
id: 475336
author: Dennis van der Stelt
title: ClickOnce deployment, signed manifests and automated builds and ResolveKeySource failing…
description: I love ClickOnce, automated builds and a lot more Microsoft stuff. Unfortunately not ...
pubDate: '2008-10-10T01:35:06'
tags:
  - .NET Framework 2.0
  - .NET Framework 3.0
  - .NET Framework 3.5
  - Development
redirect_from:
  - /dennis/2008/10/10/clickonce-deployment-signed-manifests-and-automated-builds-and-resolvekeysource-failing
  - /blogs/dennis/archive/2008/10/10/clickonce-deployment-signed-manifests-and-automated-builds-and-resolvekeysource-failing.aspx
---
I love ClickOnce, automated builds and a lot more Microsoft stuff. Unfortunately not for everything there is a simple solution. I ran into a new problem today. I was playing around with certificates, signed manifests and all of this in an automated build. I needed to make some application deployable via ClickOnce and instead of everyone else on the project, I used a certificate with a password in it.

Hence that I was the first to run into the problem when you deploy your beautiful little app into the automated build script. Without adding ClickOnce enabled deployment in the build script, when compiling it gave the following error:

> ERROR MSB4018 in C:WindowsMicrosoft.NETFrameworkv3.5Microsoft.Common.targets(1805,7) : The "ResolveKeySource" task failed unexpectedly.

Something about popping up a dialog box. You get on guess why…

The problem lies in the fact that at first compilation of the project, the certificate needs to be installed into the users personal store. Again, the users <u>personal</u> store. This means that our build user needs to have it in its own store.

You should start looking for your problem on the internet. Try [this one](http://www.google.nl/search?hl=nl&q=clickonce+certificate+supply+password+automated+build). See how many MVP’s you can count that’ll tell you to login under the build user, open Visual Studio and build the project. That’s not a solution, it’s a work around. And a bad one. I don’t want to login under the build user and definitely not have Visual Studio build the project.

I’ve search and search, but there seems to be no simple solution. My solution was as follows
1. Download “Run as…” from Sysinternals [here](http://technet.microsoft.com/en-us/sysinternals/cc300361.aspx).        
Some Windows versions enable “Run as” when holding the SHIFT key before clicking on a tool.
2. Run it as ShellRunas /reg       
Or run ShellRunas.exe cmd.exe
3. Fill in the credentials for your build user
4. Now type “mmc” (without quotes)
5. Press CTRL+M
6. Select the “Certificates” snap in
7. Choose “My user account”
8. Press OK
9. Open “Personal” –> “Certificates”
10. Right-click “Certificates” and choose “All tasks” –> “Import…”
11. Find the .pfx file
12. Do **NOT** enable the strong private key protection.
13. Finish the wizard

Try your build again.

Now we did not log into Windows as the build user. We went via cmd.exe because mmc.exe needs elevation and you can’t run it immediately via ShellRunas.

Hopes this helps some users…

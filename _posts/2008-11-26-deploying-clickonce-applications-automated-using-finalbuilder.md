---
layout: post
id: 477173
author: Dennis van der Stelt
date: 20081126 101624
title: Deploying ClickOnce applications automated using FinalBuilder
description: Remark  If you’re not using FinalBuilder but plain MSBuild, you can most likely bene...
categories:
    - Utilities
redirect_from:
  - "/dennis/2008/11/26/deploying-clickonce-applications-automated-using-finalbuilder"
  - "/blogs/dennis/archive/2008/11/26/deploying-clickonce-applications-automated-using-finalbuilder.aspx"
---

Remark : If you’re not using FinalBuilder but plain MSBuild, you can most likely benefit from the tutorial below as well.

In this tutorial I’ll try to explain what I’ve done to automate the build for a ClickOnce application. I’m using [FinalBuilder](http://www.finalbuilder.com/) because this is the best tool I know to automate your build. What MSBuild requires you to do in huge XML files, FinalBuilder lets you do in an excellent GUI where you can set breakpoints, step through, etc, etc. I’ve used it since ages and can’t live without it anymore. So should you!

ClickOnce uses two manifests, the application manifest and the deployment manifest. I won’t go into details, read more [here on MSDN](http://msdn.microsoft.com/en-us/library/6ae39a7c.aspx). Visual Studio normally does all magic for us, but as I’m a control freak, I want to do everything myself using the command line tools Microsoft provides. How you manually deploy a ClickOnce application is described step by step [here on MSDN](http://msdn.microsoft.com/en-us/library/xc3tc5xx.aspx). But from the comments to that article, you already might expect some stuff is missing.

Here are the complete steps to ClickOnce deployment
**Copy files to version location** After building your application, you want to copy the files to a specific location.         
In this tutorial, I’m picking the version info from Assembly.cs and reuse it as version number for my ClickOnce deployment. ClickOnce can have different versioning, but we chose to do it this way. So after every build, I create a folder named after the version and copy all related files into this folder. 
**Generate application manifest          
**After this we need mage.exe to generate us an application manifest. This is specific to this version, so we’ll add it in the same folder as the compiled project files. We also immediately sign the manifest with a certificate. [Here is information](http://blogs.msdn.com/maximelamure/archive/2007/01/24/create-your-own-pfx-file-for-clickonce.aspx) on how to manually create it.

You can find mage.exe in the folder C:Program FilesMicrosoft SDKsWindowsv6.0ABinmage.exe 

<font face="Lucida Console" size="2">mage.exe –New Application –Name “MyDemo” –Version “1.0.0.0” –CertFile whatever.pfx –Password “test12” –ToFile “C:InetpubwwwrootMyDemoApp1.0.0.0MyDemoApp.manifest” –FromDirectory “C:InetpubwwwrootMyDemoApp1.0.0.0”</font> 
**Generate deployment manifest          
**Now we need a deployment manifest. This is specific to the application. It holds version information, but cannot be recreated every time again or we’ll loose vital identity information and the application won’t update. The first time it should be created however. We won’t sign the manifest just yet.

<font face="lucida cons" size="2">mage.exe –New Deployment –Name “MyDemo” –Version “1.0.0.0” –ToFile “C:InetpubwwwrootMyDemoAppMyDemoApp.application” –FromDirectory “C:InetpubwwwrootMyDemoApp1.0.0.0”   
</font>   
However, if the deployment manifest already exists, we need to update the manifest to the latest version. 

<font face="lucida cons" size="2">mage.exe –Update “C:InetpubwwwrootMyDemoAppMyDemoApp.application” –Version “1.0.1.0” –AppManifest “C:InetpubwwwrootMyDemoApp1.0.1.0MyDemoAp.manifest”</font> 
**Add .deploy extension          
**Now comes the fun part. When you deploy your application on IIS, it’s most likely the .config and .dll files won’t get downloaded as IIS plainly forbids it! 🙂

The idea is to add the .deploy extension to every file, but of course not the manifest files. After that the hard part comes, to update the deployment manifest and add the mapFileExtensions to the deployment element. Don’t forget any resources that you have like images, xml or xsl files, etc, etc. 
**Sign the deployment manifest          
**After we changed the deployment manifest, we still need to sign it.

<font face="lucida cons" size="2">mage.exe –sign “C:InetpubwwwrootMyDemoAppMyDemoApp.application” –CertFile whatever.pfx –Password “test12”</font> 

If you repeat this 100 times and increase the version number a bit every time, you should have an automated ClickOnce application deployment. Remember that if you perform this from your source repository like Team Foundation Server, you should not provide your end-users with this build. This is the integration build. You should create a production build as well, but store it in a folder from where you can deploy everything once you’re done developing.
**So how is this done in FinalBuilder?** I’m using version 6.x, although I think version 5.x will do just fine.
**Increase version number** I’ll first show you how we increased the version number of all AssemblyInfo.cs files.

[![increaseversion](/images/deploying-clickonce-applications-automated-using-finalbuilder/increaseversion_5f00_thumb_5f00_48c64d33.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/increaseversion_5F00_694D8CE5.png)  

First you need to define a PropertySet and select the type “.NET Assembly Numbers”. I gave the PropertySet the name “VersionInfo”. 
Next we need to have the current version and update all AssemblyInfo.cs files. We load a specific AssemblyInfo.cs which we’ve specified as leading. We can manually increase minor and major build whenever we want. Use the “PropertySet Load” action. 
With a “PropertySet increment value” action we increment the BuildVersion by 1. We use a “AssemblyInfo Updater” to save the file again, but now we select the folder where our .sln file resides and add a wildcard in it and <u>set the recursive checkbox</u>.

C:ProjectsMyDemoAppAssemblyInfo.* Now the AssemblyInfo.cs of every single project will be updated. 

Next we compile the project(s) and execute unit tests. 
We need to copy the files to the destination folder, using the VersionInfo PropertySet.       
(Side node : I have my ClickOnce deployment in another ActionList and I did not want per package configuration in there, therefor I first change the configuration in the binrelease folder. After that I copy the files to the right location. That’s not what we’re doing here.)

[![copyprojectfiles](/images/deploying-clickonce-applications-automated-using-finalbuilder/copyprojectfiles_5f00_thumb_5f00_3611537c.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/copyprojectfiles_5F00_2F5E49F9.png)  

We first create the folder which is hosted in IIS. Since FinalBuilder 6.1 there are actions for IIS6 <u>and</u> IIS7 so you can create the website if it doesn’t exist yet as well. But ClickOnce works well from normal folders, so it’s optional.
We define a FileSet and include all files that are necessary for our ClickOnce application deployment. 
We copy the files to a version specific folder.            
Imagine the folder we created in step 3.1 was C:InetpubwwwrootMyDemoApp then the target folder would be C:InetpubwwwrootMyDemoApp%VersionInfo% 

Now we need to create the application manifest. Two tab pages need configuration.

[![clickoncefb01](/images/deploying-clickonce-applications-automated-using-finalbuilder/clickoncefb01_5f00_thumb_5f00_67308e1c.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/clickoncefb01_5F00_55C02D44.png)  [![clickoncefb02](/images/deploying-clickonce-applications-automated-using-finalbuilder/clickoncefb02_5f00_thumb_5f00_7e7b928d.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/clickoncefb02_5F00_540F6170.png) 

Project Path is where your .exe and .dll are located.
Project Version is the version number you gave your assemblies in step 1.Again, this can be any number, I chose to use the same as the assemblies.
With Certificate Path you should provide the certificate to use, as explained in step 2 of the previous list. If you don’t set a password, of course don’t supply it.
On the second tab you first specify the location and name of the application manifest. Again, this is version specific so every folder that holds a version number, holds the executable, any other assemblies, configuration, etc.
The Application Files should point to the folder from step 4.It’s possible to put the application manifest and files in other locations, but this way it’s much more easy.         
Side note : Do **<u>not</u>** put a trailing slash to the end of this folder. This will not work and result in strange behavior.

Now we’ve created the application manifest, we should create the deployment manifest. As explained in step 3 of the previous list, we cannot recreate this file every time, so we need to do some extra work.

[![clickoncefb03](/images/deploying-clickonce-applications-automated-using-finalbuilder/clickoncefb03_5f00_thumb_5f00_1ce5d377.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/clickoncefb03_5F00_643B2969.png) 

First we need to check if the deployment manifest (the .application file) already exists.
If it doesn’t exist, we need to create one.

[![clickoncefb04](/images/deploying-clickonce-applications-automated-using-finalbuilder/clickoncefb04_5f00_thumb_5f00_62f6908a.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/clickoncefb04_5F00_6A81FFF7.png)    [![clickoncefb05](/images/deploying-clickonce-applications-automated-using-finalbuilder/clickoncefb05_5f00_thumb_5f00_7a4194fb.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/clickoncefb05_5F00_36D99399.png) 

In the tab “Mage Options” the project path again points to the original location of the assemblies.
Do not fill in a certificate yet, we’ll do this later.
In the tab “Manifest Options” you have to enter the location and filename for the deployment manifest. This is the manifest that ends with .application.
The deployment manifest needs to know exactly what to deploy and it can of course find this in the application manifest. This is also a reference for later manifest signing.
Enter the location where your deployment manifest will be found on the internet/intranet.
I always enable Local Install so an icon is placed in the start menu.

Now comes the hard part, which isn’t available with default FinalBuilder actions.         
If the deployment manifest already existed, we need to update it.        

Add an action “Execute Program”.
In the “Program File” textbox, enter the location to Mage. By default this is:           
<font face="Lucida Console">C:Program FilesMicrosoft SDKsWindowsv6.0ABinmage.exe</font>
For paramters you need to enter

The location to the deployment manifest             
-update “C:BuildsMyProjectmyproject.application”
The version             
-Version %VersionInfo%
The location to the application manifest             
-AppManifest “C:Builds%VersionInfo%myproject.manifest”

Add all these behind each other, don’t forget the double-quotes if you use spaces in folder names.

Now we need to add the .deploy extension in the deployment manifest and than sign it.

Add an action ‘XML Document Define’           
Set the location to the deployment manifest (the .application file) and give the XML document a proper name.
Now we need to add the new attribute. This is how it’s done:

[![clickoncefb06](/images/deploying-clickonce-applications-automated-using-finalbuilder/clickoncefb06_5f00_thumb_5f00_0c3db2bc.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/clickoncefb06_5F00_2D9D5858.png) 

After that, save the XML file to the same location with a ‘Save XML Document’ action.
Sign the deployment manifest by using and ‘Execute Program’ action.           
Set the location to mage.exe as in step 5.3.2 (this is step 5.4.4)            
For the parameters you need to enter:

Sign the deployment manifest             
-sign “C:BuildsMyProjectmyproject.application”
Point to the certificate             
-CertFile “C:ProjectMyProjectmykey.pfx”
Supply a password             
-pwd [password]

Of course replaced the [password] with your own password.   
Now when you don’t use a password, **don’t supply the parameter**, because mage.exe might return an internal error.   
This isn’t really handy, because if you want to make all these steps more generic, in FinalBuilder you need to explicitly check if there’s a password and if it is, do it this way. If there’s no password, create a new Execute Program action and supply exactly the same details, but leave the password out. All because of mage.exe.

Now we’ve setup the deployment manifest so it’ll support files with the .deploy extension, we actually need to rename all the files.       
Again, this isn’t hard, but it takes some actions in FinalBuilder.

[![clickoncefb07](/images/deploying-clickonce-applications-automated-using-finalbuilder/clickoncefb07_5f00_thumb_5f00_29cf8dbb.png)](https://bloggingabout-linux.azurewebsites.net/cfs-file.ashx/__key/CommunityServer.Blogs.Components.WeblogFiles/dennis/clickoncefb07_5F00_0A8CE6E8.png) 

Define a fileset with all files. You can most likely include all files in the “C:BuildsMyProject%VersionInfo%” folder, but exlude the *.manifest files.
Add a FileSet Iterator. Select the just defined FileSet and store the result in a variable named “ClickOnceDeployableFileFullPath”. Mark the checkbox “Include Path when setting variable”.
Now add a ‘Path Manipulation’ acton.         
As input parameter you take the “ClickOnceDeployableFileFullPath” variable and as output (create and) use the “ClickOnceDeployableFile” variable.          
Under the tab-page “Path Functions” you set the option to extract the filename.
Add another action called ‘Rename File or Directory’.         
Choose to rename a file and set the %ClickOnceDeployableFileFullPath% variable.          
As new name, set it to "%ClickOnceDeployableFile%.deploy”

You can see that we’ve taken the filename with full path, rename it to exactly the same filename, but with .deploy added to it.

We’re done, you should now have a package that’s ready to deploy.

If there are any questions, don’t hesitate to ask them. Please do so in the comments below so other readers will know what has been playing and how we solved the problems. 

REMEMBER : No trailing slash with “Application files” folder!!!

REMEMBER : When you don’t have a password on your certificate, don’t supply the parameter to mage. It might return an internal error.

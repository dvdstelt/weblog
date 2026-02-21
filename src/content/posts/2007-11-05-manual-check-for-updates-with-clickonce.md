---
id: 418879
author: Dennis van der Stelt
title: Manual check for updates with ClickOnce
description: I really love [wikipediaClickOnce], because it removes the necessity to build a web ...
pubDate: '2007-11-05T08:40:00'
tags:
  - .NET Framework 2.0
  - .NET Framework 3.0
  - .NET Framework 3.5
  - Development
  - Visual Studio 2005
  - Visual Studio 2008
  - ClickOnce
redirect_from:
  - /dennis/2007/11/05/manual-check-for-updates-with-clickonce
  - /blogs/dennis/archive/2007/11/05/manual-check-for-updates-with-clickonce.aspx
---
I really love [wikipedia:ClickOnce], because it removes the necessity to build a web application. In my years as a developer, I can’t count the projects that were web based, simply because of the deployment model. And then ClickOnce came around. Now I can’t count the times that I’ve explained during a training what ClickOnce is and why everyone should love it!

![clickonce_autoupdate](/images/manual-check-for-updates-with-clickonce/clickonce_autoupdate_3.gif)

Most people use the default behavior of ClickOnce, which presents a dialog window, checking for updates, as shown in the dialog above. I discourage people to use this default behavior because of two reasons. The first reason is that it’s plain ugly and annoying. The second reason is that when an update *is* available but people skip the update process, they’re not asked again for installation of the update, until a new version is deployed. We can solve this by manually checking for updates and this is even more interesting when doing it asynchronously.

Here’s the simplest code for checking for an update. Be sure to include a reference to System.Deployment and a using to System.Deployment.Application.


```csharp
ApplicationDeployment updateCheck = ApplicationDeployment.CurrentDeployment;
UpdateCheckInfo info = updateCheck.CheckForDetailedUpdate();
//
if (info.UpdateAvailable)
{
  updateCheck.Update();
  MessageBox.Show("The application has been upgraded, and will now restart.");
  Application.Restart();
}
```
<div><span style="line-height: 1.5em;">Here you can see we gather information. There’s also a property </span><span style="font-family: 'Lucida Console'; font-size: small;">IsUpdateRequired</span><span style="line-height: 1.5em;"> which you can use to force users to upgrade (which is happening in this example, normally you’d give users a choice to update). In the default ClickOnce behavior, this results in automatic update, instead of being asked to update the application.</span></div>

Of course we can add error checking and a BackgroundWorker to make things a little more pretty. We’ll start out with the <span style="font-family: 'Lucida Console'; font-size: small;">BackgroundWorker</span>, bind the events for when it should perform work and for when it’s completed and then start it up.  
 **<span style="text-decoration: underline;">Note</span>** : In this example, we’ll be adding everything in the main form, but it’s better to apply the [wikipedia:Single_responsibility_principle] and delegate this to some helper classes.


```csharp
BackgroundWorker bgWorker = new BackgroundWorker();
bgWorker.DoWork += new DoWorkEventHandler(bgWorker_DoWork);
bgWorker.RunWorkerCompleted += new RunWorkerCompletedEventHandler(bgWorder_RunWorkerCompleted);
bgWorker.RunWorkerAsync();
```
<div><span style="line-height: 1.5em;">Now we’ll have to add the code to peform the check. It’s partially the code from code-sample #1, without the updating part.</span></div>

```csharp
private enum UpdateStatuses
{
  NoUpdateAvailable,
  UpdateAvailable,
  UpdateRequired,
  NotDeployedViaClickOnce,
  DeploymentDownloadException,
  InvalidDeploymentException,
  InvalidOperationException
}

/// <summary>
/// Will be executed when works needs to be done
/// </summary>
/// <param name="sender">
/// <param name="e">
void bgWorker_DoWork(object sender, DoWorkEventArgs e)
{
  UpdateCheckInfo info = null;

  // Check if the application was deployed via ClickOnce.
  if (!ApplicationDeployment.IsNetworkDeployed)
  {
    e.Result = UpdateStatuses.NotDeployedViaClickOnce;
    return;
  }

  ApplicationDeployment updateCheck = ApplicationDeployment.CurrentDeployment;

  try
  {
    info = updateCheck.CheckForDetailedUpdate();
  }
  catch (DeploymentDownloadException dde)
  {
    e.Result = UpdateStatuses.DeploymentDownloadException;
    return;
  }
  catch (InvalidDeploymentException ide)
  {
    e.Result = UpdateStatuses.InvalidDeploymentException;
    return;
  }
  catch (InvalidOperationException ioe)
  {
    e.Result = UpdateStatuses.InvalidOperationException;
    return;
  }

  if (info.UpdateAvailable)
    if (info.IsUpdateRequired)
      e.Result = UpdateStatuses.UpdateRequired;
    else
      e.Result = UpdateStatuses.UpdateAvailable;
  else
    e.Result = UpdateStatuses.NoUpdateAvailable;
}
```

The first thing you’ll notice is that I’ve added an enumeration. This is for passing a result back to the method that’s called when we’re done.  
 **<span style="text-decoration: underline;">Note</span>** : This can be done more gracefully, but it’ll do for now without a lot of extra code. And it’s not even real ugly! 😉

In the <span style="font-family: 'lucida co'; font-size: small;">bgWorker_DoWork</span> method we first check if the application is deployed via ClickOnce. Then we gather the detailed information about a possible update and perform some error handling if things don’t go the way we expect. Finally we check if an update is available and wether or not it’s a required update. We pass this information into the result and end this method.

Now we’re in need of the method when the work is done…


```csharp
/// <summary>
/// Will be executed once it's complete...
/// </summary>
/// <param name="sender">
/// <param name="e">
void bgWorder_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
{
  switch ((UpdateStatuses)e.Result)
  {
    case UpdateStatuses.NoUpdateAvailable:
      // No update available, do nothing
      MessageBox.Show("There's no update, thanks...");
      break;
    case UpdateStatuses.UpdateAvailable:
      DialogResult dialogResult = MessageBox.Show("An update is available. Would you like to update the application now?", "Update available", MessageBoxButtons.OKCancel);
      if (dialogResult == DialogResult.OK)
        UpdateApplication();
      break;
    case UpdateStatuses.UpdateRequired:
      MessageBox.Show("A required update is available, which will be installed now", "Update available", MessageBoxButtons.OK);
      UpdateApplication();
      break;
    case UpdateStatuses.NotDeployedViaClickOnce:
      MessageBox.Show("Is this deployed via ClickOnce?");
      break;
    case UpdateStatuses.DeploymentDownloadException:
      MessageBox.Show("Whoops, couldn't retrieve info on this app...");
      break;
    case UpdateStatuses.InvalidDeploymentException:
      MessageBox.Show("Cannot check for a new version. ClickOnce deployment is corrupt!");
      break;
    case UpdateStatuses.InvalidOperationException:
      MessageBox.Show("This application cannot be updated. It is likely not a ClickOnce application.");
      break;
    default:
      MessageBox.Show("Huh?");
      break;
  }
}
```

Here you’ll see responses to most error messages and them just showing up in a message box. Interesting is the NotDeployedViaClickOnce status, as this pops up every time you’re debugging your application from Visual Studio. You might want to remove that message box. You also might want to remove the messagebox for when no update is available, as users aren’t really interested in that. The final default switch should never occur.

Interesting are the switches for when there is an update, and when it’s required. In the first case the user can ignore the update which he can’t in the case it’s required. You might think of something so the user won’t be asked dozens of times every time the application is started.

Now we only need the <span style="font-family: 'lucida cons'; font-size: small;">UpdateApplication</span> method.


```csharp
private void UpdateApplication()
{
	try
	{
		ApplicationDeployment updateCheck = ApplicationDeployment.CurrentDeployment;
		updateCheck.Update();
		MessageBox.Show("The application has been upgraded, and will now restart.");
		Application.Restart();
	}
	catch (DeploymentDownloadException dde)
	{
		MessageBox.Show("Cannot install the latest version of the application. nnPlease check your network connection, or try again later. Error: " + dde);
		return;
	}
}
```

Here we again do some error checking for when things go wrong. But all we’re doing here is update the application and restart it.

This is now all happening in the background without the users being notified when there’s no update and without the annoying popup dialog. It’s also really easy to create your own “Check for updates” button or menu option now.

Have fun with ClickOnce and forget about those awful web based applications! 😉
**UPDATE :** Here’s how you can [turn off automatic updates with ClickOnce](/2007/11/28/turn-off-automatic-updates-with-clickonce/).
**UPDATE 2 :** Here’s [an example solution](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2007/11/ClickOnceDemo.zip), without the BackgroundWorker.



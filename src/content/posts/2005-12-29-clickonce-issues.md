---
id: 10693
author: Dennis van der Stelt
title: ClickOnce issues
description: I’m having a fair amount of trouble with ClickOnce, now I’m actually using it. I’m re...
pubDate: '2005-12-29T05:10:00'
tags:
  - Development
redirect_from:
  - /dennis/2005/12/29/clickonce-issues
  - /blogs/dennis/archive/2005/12/29/clickonce-issues.aspx
---
<div>I’m having a fair amount of trouble with ClickOnce, now I’m actually using it. I’m researching how updates can be user initiated. Some problems are simply solved be restarting Visual Studio 2005.One problem however is a bit less obvious.</div>
<div> </div>
<div>**UpdateLocation**</div>
<div>It’s real easy to reproduce the error. Create a new project, preferably a Windows Application. Now add a new reference to System.Deployment and add the following using statement to your form.</div>
<div> </div>
<div><span>using</span><span> System.Deployment.Application;

</span>Add a button to the new form, double click it and add the following code.</div>
<div> </div>
<div>

<span>if</span><span> (<span>ApplicationDeployment</span>.IsNetworkDeployed)</span>

<span></span><span>{</span>

<span></span><span><span>      </span><span>ApplicationDeployment</span> appDeploy = <span>ApplicationDeployment</span>.CurrentDeployment;</span>

<span></span><span><span>      </span><span>if</span> (appDeploy.CheckForUpdate())  
 </span><span><span>      </span>{</span>

<span></span><span><span>            </span><span>MessageBox</span>.Show(<span>"Updating app, when done, I’ll restart."</span>);</span>

<span></span><span><span>            </span>appDeploy.Update();</span>

<span></span><span><span>            </span><span>Application</span>.Restart();</span>

<span></span><span><span>      </span>}</span>

<span></span><span>}  
 </span> 

</div>
<div>Now go to your project properties, to the *Publish* tab and choose the *Updates* button. Then disable the “The application should check for updates” checkbox. This way, we can specify when the application should update ourselves.</div>
<div> </div>
<div>Now publish the application, install it from the webpage and it’ll run automatically. Press the button and you’ll be presented with a great dialog box, but not our own!</div>
<div> </div>
<div>Application cannot be updated programmatically unless the deployment manifest includes the <deploymentprovider> element.</deploymentprovider></div>
<div> </div>
<div>That’s the error you’ll be presented with. To fix it, go to the publish tab in your project configuration again, press the *Updates* button and specify an update location. This location should only be specified if the publish location is different, but specify the exact same location, publish, install via web page, run the app and press the button again. You’ll see your problem is fixed.</div>
<div> </div>
<div>In another post I’ll talk a bit more about security issues in ClickOnce, as this puzzled me a bit as well. Although there’s extensive documentation, most just lightly touched the subject I wanted more info about.</div>

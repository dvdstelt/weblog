---
layout: post
id: 7408
author: Dennis van der Stelt
date: 20050628 032300
title: Community Server & Redirect of old urls
description: We’ve been running on .Text for quite a while, but continue to find bugs in it. Espec...
categories:
    - BloggingAbout.NET
    - Development
redirect_from:
  - "/dennis/2005/06/28/community-server-redirect-of-old-urls"
  - "/blogs/dennis/archive/2005/06/28/community-server-redirect-of-old-urls.aspx"
---

We’ve been running on .Text for quite a while, but continue to find bugs in it. Especially the fact that randomly, people cannot edit the items they have just placed on their blog is an annoying one.

We are hoping to solve a lot of problems by upgrading to [Community Server](http://www.communityserver.org/) from Telligent Systems. The reason why we haven’t upgraded in the past, is because of the new location of the pages. Version 1.1 has become more flexible on the location of the community site and I’ve found a very small but excellent component for url rewriting. I’ve done some of the coding myself at first, but with this component I don’t have to reinvent the wheel as it has all functionality I want.

Via [Mischa Kroon](https://bloggingabout-linux.azurewebsites.net/mischa/archive/2005/04/17/3487.aspx) I’ve found the link to this [url rewriting component](http://weblogs.asp.net/fmarguerie/archive/2004/11/18/265719.aspx). It reads settings from your web.config to see what page(s) it has to redirect and whereto. This is very flexible as it also works with regular expressions. For all Community Server junkies or people that are afraid to upgrade (like I was), here’s what I did.

<u>Remember, these instructions are for CS 1.1 but should work anywhere.  
 </u>I’ll first explain the current and new situations. In the current situation, the url is like <font face="Courier New" size="2">bloggingabout.net/username/</font> whereas the new situation will be <font face="Courier New" size="2">bloggingabout.net/blogs/username/</font>. There are a lot of possible directories and files behind those urls, so it should definitly be solved by a regular expression. Here’s how I did it.

First, [download](http://madgeek.com/Samples/RedirectModule.041119.zip) the component, unzip it and in the directory /demo/bin/ you can find two .dll files. Copy those to the /bin/ directory on your website.  
 Now you have to edit your web.config and you are done! First, find the <httpmodules> tag. If you haven’t added anything, make it look like this.

<div class="csharpcode">

<span class="lnum">   1:  </span><span class="kwrd"><</span><span class="html">httpModules</span><span class="kwrd">></span>

<span class="lnum">   2:  </span>    <span class="kwrd"><</span><span class="html">add</span> <span class="attr">name</span><span class="kwrd">="RedirectModule"</span> <span class="attr">type</span><span class="kwrd">="Madgeek.Web.RedirectModule, Madgeek.RedirectModule"</span> <span class="kwrd">/></span>

<span class="lnum">   3:  </span>    <span class="kwrd"><</span><span class="html">add</span> <span class="attr">name</span><span class="kwrd">="CommunityServer"</span> <span class="attr">type</span><span class="kwrd">="CommunityServer.CSHttpModule, CommunityServer.Components"</span> <span class="kwrd">/></span>

<span class="lnum">   4:  </span>    <span class="kwrd"><</span><span class="html">add</span> <span class="attr">name</span><span class="kwrd">="Profile"</span> <span class="attr">type</span><span class="kwrd">="Microsoft.ScalableHosting.Profile.ProfileModule, MemberRole (...) 7562"</span><span class="kwrd">/></span>

<span class="lnum">   5:  </span>    <span class="kwrd"><</span><span class="html">add</span> <span class="attr">name</span><span class="kwrd">="RoleManager"</span> <span class="attr">type</span><span class="kwrd">="Microsoft.ScalableHosting.Security.RoleManagerModule, M (...) 7562"</span> <span class="kwrd">/></span>

<span class="lnum">   6:  </span><span class="kwrd"></span><span class="html">httpModules</span><span class="kwrd">></span>

</div>

At line 2 you can see the line I added. I’ve truncated some of the content (in line 4 and 5) so it won’t be that long.  
 Now you add another line to your configSections.

<div class="csharpcode">

<span class="lnum">   1:  </span><span class="kwrd"><</span><span class="html">configSections</span><span class="kwrd">></span>

<span class="lnum">   2:  </span>    <span class="kwrd"><</span><span class="html">sectionGroup</span> <span class="attr">name</span><span class="kwrd">="memberrolesprototype"</span><span class="kwrd">></span>        

<span class="lnum">   3:  </span>        <span class="kwrd"><</span><span class="html">section</span> <span class="attr">name</span><span class="kwrd">="membership"</span> <span class="attr">type</span><span class="kwrd">="Microsoft.ScalableH (...) 7562"</span><span class="kwrd">/></span>

<span class="lnum">   4:  </span>        <span class="kwrd"><</span><span class="html">section</span> <span class="attr">name</span><span class="kwrd">="roleManager"</span> <span class="attr">type</span><span class="kwrd">="Microsoft.ScalablH (...) 7562"</span><span class="kwrd">/></span>

<span class="lnum">   5:  </span>        <span class="kwrd"><</span><span class="html">section</span> <span class="attr">name</span><span class="kwrd">="profile"</span> <span class="attr">type</span><span class="kwrd">="Microsoft.ScalableHost (...) 7562"</span><span class="kwrd">/></span>

<span class="lnum">   6:  </span>        <span class="kwrd"><</span><span class="html">section</span> <span class="attr">name</span><span class="kwrd">="anonymousIdentification"</span> <span class="attr">type</span><span class="kwrd">="Micros (...) 7562"</span><span class="kwrd">/></span>            

<span class="lnum">   7:  </span>    <span class="kwrd"></span><span class="html">sectionGroup</span><span class="kwrd">></span>

<span class="lnum">   8:  </span>    <span class="kwrd"><</span><span class="html">section</span> <span class="attr">name</span><span class="kwrd">="redirections"</span> <span class="attr">type</span><span class="kwrd">="Madgeek.Configuration.XmlSerializerSectionHandler, Madgeek.RedirectModule"</span> <span class="kwrd">/></span>

<span class="lnum">   9:  </span><span class="kwrd"></span><span class="html">configSections</span><span class="kwrd">></span>

</div>

This time you can see the added section at line 8.
Now all you have to do is add your redirection part. Mine looks like this:

<div class="csharpcode">

<span class="lnum">   1:  </span><span class="kwrd"><</span><span class="html">redirections</span> <span class="attr">type</span><span class="kwrd">="Madgeek.Web.ConfigRedirections, Madgeek.RedirectModule"</span><span class="kwrd">></span>

<span class="lnum">   2:  </span>    <span class="kwrd"><</span><span class="html">add</span> <span class="attr">permanent</span><span class="kwrd">="true"</span> <span class="attr">ignoreCase</span><span class="kwrd">="true"</span> <span class="attr">targetUrl</span><span class="kwrd">="^/MainFeed.aspx"</span> <span class="attr">destinationUrl</span><span class="kwrd">="/blogs/MainFeed.aspx"</span> <span class="kwrd">/></span>

<span class="lnum">   3:  </span>    <span class="kwrd"><</span><span class="html">add</span> <span class="attr">permanent</span><span class="kwrd">="true"</span> <span class="attr">ignoreCase</span><span class="kwrd">="true"</span> <span class="attr">targetUrl</span><span class="kwrd">="^/(dennis|rj|patrick)/(.*).aspx??(.*)"</span> <span class="attr">destinationUrl</span><span class="kwrd">="~/blogs/$1/$2.aspx"</span> <span class="kwrd">/></span>

<span class="lnum">   4:  </span><span class="kwrd"></span><span class="html">redirections</span><span class="kwrd">></span>

</div>

In line two the main rss feed is redirected to the new location. This only concerns one file and is, as it looks, very easy. But now the current blogs to their new location. The third line tells that it should look for directories starting with either *dennis*, *rj*, or *patrick* and forward those to the destination url. I will have to include all bloggers currently in our community in the final version though. The regex will place the found user-directory at the $1 location and the complete directory structure after that and the file behind it at the $2 location. It should forward every .aspx file.

You can also see the parameter *permanent* which is set to true. This will make the component send an error 303.This tells the search engines like Google that it’s a permanent move of the file. The search engine will then update its index, which was very important for us.

I’ll do some additional tests soon and hope to be able to upgrade [BloggingAbout.NET](https://bloggingabout-linux.azurewebsites.net/) without any problems.</httpmodules>

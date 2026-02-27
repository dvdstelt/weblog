---
id: 5331
author: Dennis van der Stelt
title: Refactoring For Your Code Base
description: A few days ago I’ve watched a webcast by Brian Button on refactoring. For the most pa...
pubDate: '2005-06-03T09:06:00'
tags:
  - agile
  - Development
redirect_from:
  - /dennis/2005/06/03/refactoring-for-your-code-base
  - /blogs/dennis/archive/2005/06/03/refactoring-for-your-code-base.aspx
---
<font face="Arial" size="2">A few days ago I’ve watched a webcast by [Brian Button](http://www.agileprogrammer.com/oneagilecoder/archive/2005/05/26/3480.aspx) on refactoring. For the most part, he introduces refactoring to the viewer and gives some good examples of why you should refactor and how it’s done. He uses [Resharper](http://www.jetbrains.com/resharper/) and the examples really make you want to use the tool. Too bad I’m still using VS.NET 2001 at my current project.</font>

<font face="Arial" size="2">Anyway, the reason why I decided to blog about it is because of some code I just ran into.</font>

.csharpcode  
 {  
 font-size: 10pt;  
 color: black;  
 font-family: Courier New , Courier, Monospace;  
 background-color: #ffffff;  
 /*white-space: pre;*/  
 }  
 .csharpcode pre { margin: 0px; }  
 .rem { color: #008000; }  
 .kwrd { color: #0000ff; }  
 .str { color: #006080; }  
 .op { color: #0000c0; }  
 .preproc { color: #cc6633; }  
 .asp { background-color: #ffff00; }  
 .html { color: #800000; }  
 .attr { color: #ff0000; }  
 .alt  
 {  
 background-color: #f4f4f4;  
 width: 100%;  
 margin: 0px;  
 }  
 .lnum { color: #606060; }

<div class="csharpcode">

<span class="kwrd">public</span> <span class="kwrd">string</span> AddData(DataRow dr, DateTime date)

{

    <span class="kwrd">string</span> msg = <span class="str">“”</span>;

    <span class="kwrd">try</span>

    {

        SqlParameter[] paramColl = <span class="kwrd">new</span> SqlParameter[30];

        paramColl[0] = <span class="kwrd">new</span> SqlParameter(<span class="str">“@date”</span>,SqlDbType.DateTime);

        paramColl[0].Value = date;

        paramColl[3] = <span class="kwrd">new</span> SqlParameter(<span class="str">“@z_1d”</span>,SqlDbType.Decimal);

        paramColl[3].Value = dr[<span class="str">“1d”</span>];

        paramColl[4] = <span class="kwrd">new</span> SqlParameter(<span class="str">“@z_1w”</span>,SqlDbType.Decimal);

        paramColl[4].Value = dr[<span class="str">“1w”</span>];

    (…)

    }

    <span class="kwrd">catch</span>(Exception ex)

    {

        ExceptionManager.Publish(ex);

        <span class="kwrd">throw</span> ex;

    }

    <span class="kwrd">return</span> msg;

}
</div>  

<font face="Arial" size="2">I simplified the name of the method to add to the effect. But as you can see, there’s room for refactoring. You might want to start with the naming if your variables. As a developer you immediatly can see the parameter *date* is of type datetime. So you don’t really need to specifiy this concerns a date, as that’s crystal clear! I’d rather know the function this parameter has. Why do I have to supply a date to this method? And what data should the DataRow *dr* contain? Something you have much less worrying about when using objects. Heck, this would have not been written if an O/R Mapper had been used! 😉</font>

<font face="Arial" size="2">Go view the webcast if you’re haven’t got that much experience with refactoring. You’ll learn a lot. Find the [replay of the webcast here](http://msevents.microsoft.com/CUI/EventDetail.aspx?EventID=1032273124&Culture=en-US).</font>
<!-- Posted by Bloggie - https://bloggingabout-linux.azurewebsites.net/rj -->

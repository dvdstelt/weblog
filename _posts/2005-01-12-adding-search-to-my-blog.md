---
layout: post
id: 1880
author: Dennis van der Stelt
date: 20050112 072400
title: Adding Search to my Blog
description: UPDATE!People (on other websites) have implemented this search feature, without addin...
categories:
    - BloggingAbout.NET
redirect_from:
  - "/dennis/2005/01/12/adding-search-to-my-blog"
  - "/blogs/dennis/archive/2005/01/12/adding-search-to-my-blog.aspx"
---

**<font color="#ff0000">UPDATE!</font>  
**People (on other websites) have implemented this search feature, without adding the appropriate (uneditted) Google logo on their website, as described mandatory in [this](http://www.google.com/services/terms_free.html), [this](http://www.google.com/stickers.html) and [this](http://www.google.com/stickers.html) document. It seems that for some, all indexed pages on Google have been removed because of this!  
What other websites decide, is up to them. Here on BloggingAbout.NET we’ve decided it’s no longer allowed to add Google search, so there’s no doubt we’ll never run into ‘troubles’.

David Cumps has created [javascript code to add search](http://weblogs.asp.net/cumpsd/archive/2005/01/11/350909.aspx) to his weblog. It’s a simple but very effective solution, and I always wanted search on my blog. So until the next version of .Text is released (or CommunityServer :: Blogs) I have ‘implemented’ David’s search.

As David’s code is for weblogs.asp.net I changed the bit for our own blogs. If bloggers here also want to use it, follow these steps:
* Go to your blog’s Admin section  
* Go to the tab Options  
* Select Configure  
* At the bottom of the page, add the following code to the box Static News

<div>

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

 <span class="kwrd"><</span><span class="html">h3</span><span class="kwrd">></span>Search<span class="kwrd"><span><span class="html">h3</span><span class="kwrd">></span>  
 <span class="kwrd"><</span><span class="html">input</span> <span class="attr">class</span><span class="kwrd">=”BlogSearch”</span> <span class="attr">type</span><span class="kwrd">=”text”</span> <span class="attr">name</span><span class="kwrd">=”searchBox”</span> <span class="attr">id</span><span class="kwrd">=”blogSearchText”</span> <span class="attr">value</span><span class="kwrd">=””</span> <span class="attr">onkeypress</span><span class="kwrd">=”return blogSearch(event, this);”</span><span class="kwrd">></span>  
 <span class="kwrd"><</span><span class="html">input</span> <span class="attr">type</span><span class="kwrd">=”button”</span> <span class="attr">value</span><span class="kwrd">=”Search”</span> <span class="attr">onclick</span><span class="kwrd">=”return blogSearch2(‘blogSearchText’);”</span> <span class="attr">class</span><span class="kwrd">=”BlogSearchButton”</span><span class="kwrd">></span>  
 <span class="kwrd"><</span><span class="html">script</span> <span class="attr">type</span><span class="kwrd">=”text/javascript”</span><span class="kwrd">></span> <p><span class="preproc">function</span> blogSearch(<span class="preproc">event</span>, oInput) {  
 <span class="preproc">var</span> keyCode = (<span class="preproc">event</span>) ? <span class="preproc">event</span>.keyCode : keyStroke.which;  
 <span class="preproc">if</span> (keyCode == 13) {  
 top.location = <span class="str">‘http://www.google.com/search?q=’</span> + escape(oInput.value) + <span class="str">‘+inurl%3Adennis+site%3Awww.bloggingabout.net’</span>;  
 <span class="preproc">return</span> <span class="preproc">false</span>;  
 } <span class="preproc">return</span> <span class="preproc">true</span>;  
 } </p> <p><span class="preproc">function</span> blogSearch2(oInputId) {  
 <span class="preproc">var</span> oInput = document.getElementById(oInputId);  
 top.location = <span class="str">‘http://www.google.com/search?q=’</span> + escape(oInput.value) + <span class="str">‘+inurl%3Adennis+site%3Awww.bloggingabout.net’</span>;  
 <span class="preproc">return</span> <span class="preproc">false</span>;  
 }  
 <span class="kwrd"><span><span class="html">script</span><span class="kwrd">></span>  
 </span></span></p></span></span> 
</div>  
* Don’t forget to change **dennis** into your own blog url directory.  
* Save  
* Admire your new search

All credits of course go to [David](http://weblogs.asp.net/cumpsd/) and apperently [Geoff](http://dotnetjunkies.com/WebLog/fredd/).

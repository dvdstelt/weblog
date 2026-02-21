---
id: 1937
author: Dennis van der Stelt
title: RSS & Readers – Which to choose?
description: Because of the interest in our company in our weblogs and the fact that still not a l...
pubDate: '2005-01-17T02:57:00'
tags:
  - Blogging
redirect_from:
  - /dennis/2005/01/17/rss-readers-which-to-choose
  - /blogs/dennis/archive/2005/01/17/rss-readers-which-to-choose.aspx
---
Because of the interest in our company in our weblogs and the fact that still not a lot of (non-techie) people know what exactly they are and how to use the rss feeds, I thought of writing an article on rss and the readers. First I want to explain a bit what rss is, where to get rss feeds on these blogs and how to consume them with rss readers.
**RSS** RSS is an acronym for *[Really Simple Syndication](http://en.wikipedia.org/wiki/RSS_%28protocol%29)*. It’s mainly used by news websites and weblogs. A program that uses RSS is called an RSS aggregator or feed reader. These programs check the RSS-enabled webpages on behalf of a user and displays any new and updated article it can find. The benefit of this is that users don’t have to repeatedly visit every site they want to check for new items, and most readers notify the user of new items with a small popup from the system tray, near the clock in Windows.

RSS itself is plain XML with predefined tags that describe the text, which the reader knows how to use. A little difficult however, because there are multiple standards, although a new standard is developed called ATOM.

Below is a short example of an RSS message from this blog:

<div>
<div class="csharpcode">

<span class="lnum">   1: </span><span class="kwrd"><</span><span class="html">item</span><span class="kwrd">>  

</span><span class="lnum">   2:  </span><span class="kwrd"><</span><span class="html">dc:creator</span>    <span class="kwrd">></span>Dennis v/d Stelt<span class="kwrd">SPAN class=html>dc:creator</span><span class="kwrd">></span>  

<span class="lnum">   3:  </span><span class="kwrd"><</span><span class="html">title</span><span class="kwrd">></span>New .Text version?<span class="kwrd">SPAN class=html>title</span><span class="kwrd">></span>  

<span class="lnum">   4:  </span><span class="kwrd"><</span><span class="html">link</span><span class="kwrd">></span>/2005/01/12/1887/<span class="kwrd">SPAN class=html>link</span><span class="kwrd">></span>  

<span class="lnum">   5:  </span><span class="kwrd"><</span><span class="html">pubDate</span><span class="kwrd">></span>Wed, 12 Jan 2005 13:17:00 GMT<span class="kwrd">SPAN class=html>pubDate</span><span class="kwrd">></span>  

<span class="lnum">   6:  </span><span class="kwrd"><</span><span class="html">guid</span><span class="kwrd">></span>/2005/01/12/1887/<span class="kwrd">SPAN class=html>guid</span><span class="kwrd">></span>  

<span class="lnum">   7:  </span><span class="kwrd"><</span><span class="html">description</span><span class="kwrd">><</span><span class="html">P</span><span class="kwrd">></span>Well, seems telligent systems themselves are already blogging ...  

<span class="lnum">   8:  </span><span class="kwrd">SPAN class=html>description</span><span class="kwrd">></span>  

<span class="lnum">   9:  </span><span class="kwrd">SPAN class=html>item</span><span class="kwrd">></span>

</div>
</div>
**Where to get RSS on these weblogs?  
** That’s easy, wherever you see this little xml image (![](/images/rss-readers-which-to-choose/missing.jpg)), you know where the rss is. Right-click the image, choose copy shortcut and use that in your favorite rss reader. From that moment on, your reader will notify you when a new item has been placed, or one has been updated.

On these weblogs, the [main page](https://bloggingabout-linux.azurewebsites.net/) aggregates all feeds from all weblogs. So if you want to get notified of every single weblog at once, use that feed, it can be found in the upper left, right under to sponsor logo. Don’t get confused with the opml list there, however.

Some bloggers however, choose to write posts or artciles and not include these in the main aggregated feed. Like Carlo who occasionly writes about his efforts to run a marathon, or here on my blog, where I try to put some effort in making people like [demos](https://bloggingabout-linux.azurewebsites.net/dennis/category/114.aspx)! 😉  
 Because these posts don’t show up in the aggregated feed, it’s sometimes not a total loss to subscribe to bloggers there personal feed!

A list of main blogs on BloggingAbout.NET:
* [Main Feed](https://bloggingabout-linux.azurewebsites.net/MainFeed.aspx) 
* [Dennis’ Blog](https://bloggingabout-linux.azurewebsites.net/dennis/Rss.aspx) 
* [CaPo’s Integration adventures](https://bloggingabout-linux.azurewebsites.net/carlo/Rss.aspx) 
* [Mischa Kroon](https://bloggingabout-linux.azurewebsites.net/mischa/Rss.aspx) 
**Which RSS reader to choose?  
** There are multiple readers, I will discuss a few here. Two are stand alone products, one is an integration into Outlook and the last one is a free online reader.

<u>*RSSBandit* </u>([download](http://www.rssbandit.org/))  
 RSSBandit is my favorite reader because a version compiled under .NET 1.0 was available. At my current project, we still develop under 1.0, and although Microsoft says 1.0 and 1.1 can run side by side, I can’t create unknown problems by doing so. Besides that, it opens links in every feed in an external browser (by choice) instead of in the reader itself, like SharpReader does. However, I’ve never seen RSSBandit update a post, that wás updated on the weblog itself. So that’s a small problem there.   
 Another benefit is that it can read comments from the blogs and show them internally.
*<u>SharpReader</u>* ([download](http://www.sharpreader.net/))  
 SharpReader always was my favorite, until I had to run it under .NET 1.0.It’s a very easy, straightforward reader. Only problem I had with it, was that it sometimes messed up some feeds and made a dozen items or so unread, as if they were updated.
*<u>NewsGator Outlook Edition</u>* ([download trial](http://www.newsgator.com/outlook.aspx))  
 NewsGator Outlook Edition is also a very popular reader. It integrates into Outlook 2000 or later and it looks just like you would normally read your email. One problem however, it’ll cost you money! You can tial it for 14 days however.
*<u>BlogLines</u>* ([website](http://www.bloglines.com/))  
 BlogLines is a website that works as an online feed reader, for free! A great solution if you want to read all subscribed feeds everywhere you go.  
 My problem with it, is that I copy all my subscribed feeds into my memory stick and bring it to my next client. I also think they graphical design of BlogLines is really ugly, and not user friendly.

I hope I could bring you up to speed on weblogs and their RSS feeds. If you still have questions, don’t hesitate to [contact me](https://bloggingabout-linux.azurewebsites.net/dennis/contact.aspx).

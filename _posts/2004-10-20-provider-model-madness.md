---
layout: post
id: 1497
author: Dennis van der Stelt
date: 20041020 125900
title: Provider Model Madness
description: Ofcourse we have all read about the Provider Model (part 1, part 2), which Microsoft ...
categories:
    - Architecture and Design
    - Development
redirect_from:
  - "/dennis/2004/10/20/provider-model-madness"
  - "/blogs/dennis/archive/2004/10/20/provider-model-madness.aspx"
---

Ofcourse we have all read about the Provider Model ([part 1](http://msdn.microsoft.com/library/en-us/dnaspnet/html/asp02182004.asp), [part 2](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dnaspnet/html/asp04212004.asp)), which Microsoft claims is their invention. Ryan Whitaker has [made a post](http://weblogs.asp.net/RyanW/archive/2004/10/17/243754.aspx) in which he explains you should not use it when you don’t need it, although it looks very cool. Which it does, as it seems, as with everything Microsoft overhypes. As like [Yukon and Whidbey](http://weblogs.asp.net/fbouma/archive/2004/10/19/244654.aspx).

Anyway, from experience I can say he’s right! We did however need it, or a version of it. Our project had to support multiple databases, multiple mail servers and multiple geographical systems. As it was a product our company sells, clients aren’t too happy about buying your product when it only supports SQL-Server, for example. The license isn’t the problem, but when you got a few Oracle admins, it’ll cost a lot to upgrade one to SQL-Server or get yourself a new admin ;-).

Anyway, it was fun while implementing it in the proof of concept, but I already knew the other developers would not like it. Most developers already have problems with simple GUI, Business Layer and Data Layer, the provider model introduced another three ‘layers’. One class which defines everything and should be inherited, one class which (we’ll call) reroutes every call to the (dynamically loaded) provider and one class for it’s implementation. And don’t forget the other implementations you write (mostly) afterwards when you’re done with the first.  
So that’s three new ‘layers’ every developer has to go through. But more’s to come.

I had one example to look at, [DotNetNuke](http://www.dotnetnuke.com/). If you look at the way they implemented it there, you’ll see every call to the database has a separate method, as you most of the time would have. But DotNetNuke uses a lot, so a few hundred methods are defined in <u>one class</u>, as is the rerouting part and the implementation. Although it’s not only really ugly, it’s also practically unusable when working in a team of developers. Only begin to wonder what’ll happen if every developer wants to add his/her method. Although we used the same method for the defining and rerouting, we used a different method for the implementation. One class the provider would call, and this class would call an internal method, in a class specifically for one piece of functionality. So if we’d have customers and products, the implementation class would reroute all calls to either customers.cs or products.cs. This introduces <u>another, the forth class</u>.

To get back to our project, we also had interfaces for every layer, except gui ofcourse, which made out of 3 layers, 2 interfaces, 4 classes for provider model a grand total of 9 classes to go through before we could get anything out of SQL-Server.

But hey, if the customer requested it, we could also get it from Oracle! 😉

Just remember, use [YAGNI](http://c2.com/cgi/wiki?YouArentGonnaNeedIt) before using the Provider Model!  
I never heard of the term, but the following made me laugh my a$$ of!

<div class="code">*“OK, Sam, why do you want to add it now?”  
“Well, Ron, it will save time later.”  
* Unless your <u>universe</u> is very different from mine, you can’t save time.</div>

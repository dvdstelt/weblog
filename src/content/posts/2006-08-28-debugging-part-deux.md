---
id: 17237
author: Dennis van der Stelt
title: Debugging – part deux
description: In the not so distant past I was bold enough to call Jan and Patrick whiners. But cur...
pubDate: '2006-08-28T05:21:00'
tags:
  - Development
  - Personal
redirect_from:
  - /dennis/2006/08/28/debugging-part-deux
  - /blogs/dennis/archive/2006/08/28/debugging-part-deux.aspx
---
In the not so distant past I was bold enough to call [Jan](/blogs/jschreuder/archive/2006/08/16/This-thing-is-huge_2C00_-refactoring.aspx) and [Patrick](/blogs/patrick/archive/2006/08/17/I-agree-Jan_2E002E00_.aspx) whiners. But currently I have to extend an application with some functionality and I’ve been debugging it for a few hours now. Overall it’s not *that* bad, but the things you can come across really make you wonder.

<div>  

<span>Dim</span> Active <span>As</span> <span>Integer</span>

Active = 10

<span>Select</span> <span>Case</span> Active

    <span>Case</span> TriState.UseDefault        <span>‘ -2</span>

        <span>‘ Do Something</span>

    <span>Case</span> TriState.True              <span>‘ -1</span>

        <span>‘ Do Something else</span>

    <span>Case</span> TriState.False            <span>‘ 0</span>

        <span>‘ Do Something else</span>

<span>End</span> <span>Select</span>
</div>  

As you can see in the code above, someone decided to use *Active* as a variable to store some number. After passing it through some methods, they match it against this weird enumeration from the [Microsoft.VisualBasic](http://msdn2.microsoft.com/en-us/library/microsoft.visualbasic.aspx) [namespace](http://addressof.com/blog/archive/2003/10/31/242.aspx). Even though it’s an enumeration, it’s still totally unclear what it stands for.

My problem was, that this little (cut-down) piece of code was in a method that was adding SqlParamaters into an array. But as you can see in my example, when you insert the number 10 into *Active*, it won’t get processed, and thus the array will have a SqlParameter that’s null. When some more methods later this is added into the Microsoft Data Access Application Block (yes, the old one), it throws some [weird error](/blogs/dennis/archive/2006/08/28/Debugging.aspx).

Part of the problem was the setup of the solution. I first tried to figure out what was happening with Reflector, but didn’t get it. So I rearranged the solutions (yes, multiple), added the Data Access Block and debugged my way through. Only to find out that in my array, SqlParameter number 7 was empty. So after too much time, I could not resist but make the following comment in the code. Although the original developer probably will never read it, it still feels good to get it out of my system this way! 😉

<div>  

<span>‘ Comment : Any idea why this doesn’t always work?!</span>

<span>‘           Any idea how long it took me to figure out the fault was in here?</span>

<span>‘           So I added a Case Else here, only hoping the UseDefault really</span>

<span>‘           is some sort of weird default, and that it now always works. >-(</span>
</div>

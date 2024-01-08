---
layout: post
id: 13476
author: Dennis van der Stelt
date: 20060815 051500
title: Advanced usage of the ?? operator
description: P.J. van de Sande from the (Dutch) weblog Born 2 Code .NET has two posts about the in...
categories:
    - Development
redirect_from:
  - "/dennis/2006/08/15/advanced-usage-of-the-operator"
  - "/blogs/dennis/archive/2006/08/15/advanced-usage-of-the-operator.aspx"
---

P.J. van de Sande from the (Dutch) weblog [Born 2 Code .NET](http://born2code.net/) has two posts about the in .NET 2.0 new ?? operator. In the [first post](http://born2code.net/go.php?http://born2code.net/?p=49) he explains what it does and why he likes it. After some comments, he decided to write [another post](http://born2code.net/?p=50) about it, trying to explain even further why he likes it so much. But now he pulls some code from his sleeve I really had to take a good look at.

<div>  

<span>public</span> Brush BackgroundBrush

{

  <span>get</span>

  {

    <span>return</span> _backgroundBrush ??

    (

        _backgroundBrush = GetBackgroundBrushDefault()

    );

  }

}
</div>  

You have to know how this is evaluated to understand it. Before it returns anything, it first evaluates the ?? operator, which is probably understood much better by the following code block.

<div>  

<span>public</span> Brush BackgroundBrush

{

  <span>get</span>

  {

    <span>if</span> (_backgroundBrush == <span>null</span>)

    {

      _backgroundBrush = GetBackgroundBrushDefault();

    }

    <span>return</span> _backgroundBrush;

  }

}
</div>  

But still, it’s some lovely code. You decide for yourself if you want to see code like that in your project. Perhaps Jan Schreuder would be more happy to see code like this instead of the code in [his latest post](/blogs/jschreuder/archive/2006/08/15/This-thing-is-huge.aspx)! 😉

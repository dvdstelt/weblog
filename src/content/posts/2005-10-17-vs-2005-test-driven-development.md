---
id: 9856
author: Dennis van der Stelt
title: VS 2005 TestDriven Development?
description: Unfortunately Visual Studio 2005 RTM isn’t online, as Jeffrey Palermo ‘promised‘. Str...
pubDate: '2005-10-17T10:47:00'
tags:
  - Agile
  - Team System
redirect_from:
  - /dennis/2005/10/17/vs-2005-test-driven-development
  - /blogs/dennis/archive/2005/10/17/vs-2005-test-driven-development.aspx
---
![Test-Driven Software](/images/vs-2005-test-driven-development/logotdsoft.png)Unfortunately Visual Studio 2005 RTM [isn’t online](https://bloggingabout.net/2005/10/12/9696), as Jeffrey Palermo ‘[promised](http://codebetter.com/blogs/jeffrey.palermo/archive/2005/10/11/132969.aspx)‘. Strange enough his post has been removed from his blog.

In his last post, [he talks](http://codebetter.com/blogs/jeffrey.palermo/archive/2005/10/17/133235.aspx) about [what MSDN says about Test-Driven Development](http://msdn2.microsoft.com/en-us/library/ms182521). Microsoft advises people to draw classes and interfaces with the class designer. As we know, the code is then automatically added to your projects. Then Microsoft advises to generate test classes from your designed classes and interfaces, and then the TDD process begins.

Jeffrey says, Microsoft isn’t creating the tool to fit the process, but redefines the process to fit the tool, as it seems. This is indeed a bit strange, especially when you believe one of the main reasons to use Test-Driven Development is so you’ll have a better (loosely coupled) design. When you first design all your classes and interfaces, and generate tests from these, it’s totally the other way around again. But I’m a little confused by what Microsoft says in their guideline here.

I’m currently preparing a presentation for a meeting within our company, to explain Test-Driven development to my colleagues. I’m also using Visual Studio 2005 and I’m loving the refactoring support in it. I (unfortunately) haven’t used [Resharper](http://www.jetbrains.com/resharper/) a lot in the past, but Jeffrey says VS2005 won’t generate production method stubs from a test, while Resharper can do this in VS2003.I however have used this and it works (almost<sup>1</sup>) great. What I did is create two projects, one for my implementation classes and one for my tests. I’ve just drawn (dragged ‘n’ dropped) some classes in the designer, which were than generated into my project. I did **not** create any properties or methods, just the empty classes. Then I added a reference from my test-project to my implementation-project. I added a TestMyImplementationClass testclass (confusing yet?) and wrote a test method. VS2005 immediately began to make noise that it could not find the methods I was referring to. This is correct, because I had not written any code inside my newly designed classes. I hovered over the method I tried to call, and this little refactoring icon appeared. I hit the "Create method stub" option and the method appeared in my implementation class, with a beautiful *NotImplementedException* inside the method. That’s it! It hit the execute tests button and I got a red light, and no compile errors.

I then implemented the code, ran the test again and the test succeeded, green light!

Isn’t this exactly what Microsoft is saying in their [guideline](http://msdn2.microsoft.com/en-us/library/ms182521)? I am however a bit confused by the fact that even Microsoft states: 

> The traditional TDD process does not contain this step. Instead, it advises that you create tests first. This step is included here so that, while creating tests, you can take advantage of two features in Visual Studio 2005 Team System: the GUI design capabilities of the Class Designer, and the automatic test-generation capabilities of Team Edition for Testers.

  As Uncle Bob says, in Agile/XP we don’t do BDUF, but [we definitely do think about design and/or specifications](http://butunclebob.com/ArticleS.UncleBob.JoelOnXp). And the Microsoft guideline doesn’t tell you to write a lot of code (or do BDUF), but to *add a minimum of code, just enough to compile*. Isn’t that what we’re supposed to do, just write the minimum amount of code so we don’t get compilation errors? We have to be able to run the tests, or else we don’t get the red light we need.

The Microsoft guideline is a little vague, but in my opinion not (totally) wrong.

<sup>1</sup> <font size="2">Almost great, because VS2005 sometimes gets a little bit confused. In one test, I called two methods that weren’t there yet. The first I could generate via refactoring, the other I couldn’t, because the option just didn’t came up. After screwing around, it did however.</font>

<font size="2">**[update]** : I got one bit wrong, and that was that you indeed cannot draw <u>a lot of classes</u> and then start your Test-Driven Development, even less while generating tests for you from the IDE. I still think the designer can come in handy though, when you’re more ‘drawing’ out some options, playing with patterns perhaps, etc. Test-Driven Development however is about design, and when you first design something and then do TDD, you got it all wrong. 🙂</font>

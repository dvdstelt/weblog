---
id: 457859
author: Dennis van der Stelt
title: Refactor! Pro
description: I just finished the two day Professional Agile Programming course in which I introduc...
pubDate: '2008-02-04T08:18:28'
tags:
  - Agile
  - Utilities
redirect_from:
  - /dennis/2008/02/04/refactor-pro
  - /blogs/dennis/archive/2008/02/04/refactor-pro.aspx
---
I just finished the two day Professional Agile Programming course in which I introduced developers to some best practices and such, including a view over some good practices from methodologies (XP/Scrum/MSF). For this course I’ve been in contact with DevExpress about a tool I wanted to show; Refactor! Pro. Another tool is FinalBuilder, but that’s for another post.

It’s unbelievable what you can do with Refactor! Pro and how easy it can make your life, when you know how to use the tool. Not only in this training, but in others as well, I explain people the [wikipedia:Single responsibility principle] and how to use the [wikipedia:Extract Method] refactoring to achieve this. Or how you can remove [wikipedia:Duplicate code] using the Extract Method refactoring. Take for example this simple for-loop.


```csharp
for (int i = 0; i < 20; i++)
      {
        CheckSomeThing(i, 12);
      }
```

In a demo I used this loop multiple times, but with different numbers. Now imagine you select this code and perform the Extract Method refactoring. You’ll end up with this.


```csharp
private static void ExtractedMethod()
    {
      for (int i = 0; i < 20; i++)
      {
        CheckSomeThing(i, 12);
      }
    }
```

But I want the numbers 20 and 12 passed as parameters. With normal Visual Studio, you’d have to undo this. Then create two integer variables and replace the numbers 20 and 12 with those integers. Then extract it to a method and replace the variables (which are passed into the ExtractedMethod method) with the actual numbers again. Not with Refactor! Pro, because it has two additional refactorings
* Introduce local
* Promote to parameter

With the first one we can extract the number 20 from the loop by selecting it and performing the refactoring.

[![introduce_local](/images/refactor-pro/introduce_local_thumb.png)](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/WindowsLiveWriter/RefactorPro3_A7CE/introduce_local_2.png) 

After that you can promote the variable to a parameter.

[![promote_parameter](/images/refactor-pro/promote_parameter_thumb.png)](https://bloggingabout-linux.azurewebsites.net/blogs/dennis/WindowsLiveWriter/RefactorPro3_A7CE/promote_parameter_2.png) 

The original call the the extracted method will also be synchronized, meaning that the number 20 will be passed as an argument into the extracted method. If you do the same for the number 12, you end up with the following code. The first line is the calling method.


```csharp
private void SomeMethod() { ExtractedMethod(20, 12); }

private static void ExtractedMethod(int numberOfTimes, int number)
{
  for (int i = 0; i < numberOfTimes; i++)
  {
    CheckSomeThing(i, number);
  }
}
```

---
id: 578743
author: Dennis van der Stelt
title: Unit test code snippet for Visual Studio
description: Every single time I reinstall Visual Studio I have to search for my unit test code sn...
pubDate: '2015-04-10T01:22:54'
image: /images/unit-test-code-snippet-visual-studio/header.png
redirect_from:
  - /dennis/2015/04/10/unit-test-code-snippet-visual-studio
  - /blogs/dennis/archive/2015/04/10/unit-test-code-snippet-visual-studio.aspx
---
Every single time I reinstall Visual Studio I have to search for my unit test code snippet again. So for my own reference, here it is as an attachment, which you’ll have to put in the following folder:
* C:\Users\[username]\Documents\Visual Studio 2013\Code Snippets\Visual C#\My Code Snippets  

or
* %UserProfile%\Documents\Visual Studio 2013\Code Snippets\Visual C#\My Code Snippets

It outputs the following code

[test-snippet](https://bloggingabout-linux.azurewebsites.net/wp-content/uploads/sites/2/2015/04/test-snippet.zip)


```csharp
[TestMethod]
public void FunctionName_Should_ExpectedResult_When_Condition()
{
	// Arrange

	// Act

	// Assert

}
```

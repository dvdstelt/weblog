---
id: 445143
author: Dennis van der Stelt
title: Unit testing in Visual Studio 2008 tips
description: I blogged about new Unit Testing features in Visual Studio 2008, but missed the follo...
pubDate: '2007-12-11T03:30:49'
tags:
  - agile
  - Visual Studio 2008
redirect_from:
  - /dennis/2007/12/11/unit-testing-in-visual-studio-2008-tips
  - /blogs/dennis/archive/2007/12/11/unit-testing-in-visual-studio-2008-tips.aspx
---
I blogged about new [Unit Testing features in Visual Studio 2008](/2007/09/11/visual-studio-2008-unit-testing/), but missed the following features back then. I thought it’s still cool to share these with you.
**<u>Short cut keys to run tests</u>** I used to use TestDriven.NET in the past for executing my NUnit tests really fast. It always started them in the context you right-clicked for the menu, be it a test method, class or project. Visual Studio 2008 has the right-click context menu as well, but not in classes or projects. Luckily you can also access them with shortcut keys, which is even better<sup>1</sup>.
* · Ctrl R, T: Execute tests in current context
* · Ctrl R, C: Execute tests in current test class
* · Ctrl R, N: Execute tests in current namespace
* · Ctrl R, A: Execute all tests in solution
* · Ctrl R, D: Execute the tests in the last test run
* · Ctrl R, F: Execute the failed tests of the last test run

I only memorized and use the first two though. Remember also that when you hold the Ctrl key when pressing the second key you’ll execute the tests with the debugger.
**<u>Clicking error result and go to your test</u>** Why this is off by default still wonders me. Besides the context menu, this was my biggest pain in Visual Studio 2005.When you double-click a failed test, you’ll get some error report. And when you had more than one Assert in your test and didn’t use comments, you didn’t even know which assert failed. Now you can turn on that whenever you double-click the failed test in the test results window, you’ll be taken to the Assert that failed. Turn it on in options under Tools -> Options -> Test Tools -> Test Execution and check the last checkbox.

![testclick](/images/unit-testing-in-visual-studio-2008-tips/testclick_thumb.png) 
**<u>Disable deployment of tests</u>** People that do Test Driven Development want to compile and execute their tests as fast as possible. By default however, Visual Studio copies all binaries, debug files, etc to a deployment folder where the tests are executed. If you want to disable this, find the folder “Solution Items” in your solution and double-click the .testrunconfig file. Select “Deployment” from the list and uncheck “Enable Deployement”.
**<u>Private accessors</u>** Visual Studio 2008 has another cool feature where you can access private types in an assembly. With the tool [publicize.exe](http://msdn2.microsoft.com/en-us/library/bb514191(VS.90).aspx) you can create a wrapper assembly that gives you access to the private types. I created a simple example class, as shown below.


```csharp
public class Class1
{
  private int _age;

  private string Name { get; set; }

  public int Age
  {
    get { return _age; }
    set { _age = value; }
  }

  private string CheckThis(int i)
  {
    return (10 * i).ToString();
  }
}
```

We’ll use Visual Studio 2008 instead of directly accessing publicize.exe. You can create unit tests for this class by bringing up the context menu in the class (right-click in the code editor) and select to generate unit tests. Now make sure also the private method and property is checked and create the unit test. Your unit test will look as follows:


```csharp
[TestMethod()]
[DeploymentItem("ClassLibrary1.dll”)]
public void NameTest()
{
  Class1_Accessor target = new Class1_Accessor(); // TODO: Initialize to an appropriate value
  string expected = string.Empty; // TODO: Initialize to an appropriate value
  string actual;
  target.Name = expected;
  actual = target.Name;
  Assert.AreEqual(expected, actual);
  Assert.Inconclusive("Verify the correctness of this test method.”);
}
```

Note that I used stupid names like “ClassLibrary1” and “Class1”, but that doesn’t matter. You see that instead of the normal Class1 being initialized, the Class1_Accessor is being initialized. Where does it come from? Use the other new cool feature by right-clicking the project and at the bottom of the context menu you’ll find “Open folder in Windows Explorer”. Select the bindebug folder and you’ll see a new assembly there. When looking at it with reflector, here’s our Name property being exposed.

![privateaccessor](/images/unit-testing-in-visual-studio-2008-tips/privateaccessor_3.png) 
**<u>Visual Studio 2005 vs. Visual Studio 2008</u>** Now you know a little more about Visual Studio 2008 unit testing. Note that you can use these features even on .NET 2.0 projects. It’s only the solution files (.sln) that aren’t compatible. The project files (.csproj) are compatible and can be freely exchanged. A good solution (no pun intended) is to create a Visual Studio 2005 solution and a Visual Studio 2008 solution. Just make sure that changes to the solution are made in both and you’ll have a great Visual Studio 2008 experience, even though other team members aren’t using it.

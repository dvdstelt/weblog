---
layout: post
id: 73748
author: Dennis van der Stelt
date: 20061213 061622
title: Async invocation pattern
description: I talked to my colleague Alex Thissen recently about the changes in asynchronous invo...
categories:
    - ASP.NET
    - Development
redirect_from:
  - "/dennis/2006/12/13/async-invocation-pattern"
  - "/blogs/dennis/archive/2006/12/13/async-invocation-pattern.aspx"
---

I talked to my colleague [Alex Thissen](http://blog.alexthissen.nl/) recently about the changes in asynchronous invocation of ASP.NET 2.0 webservices. On the web there are a multitude of examples about the old way, but not so many on the new way. But after figuring out what the new way was, I started asking myself why they changed it. Probably for the benefit of readability and ease of use. But still, it’s not the first time I questioned why and how.

After discussing this with Alex, he wrote a weblog post on the [ASP.NET 2.0 async invocation pattern](http://www.alexthissen.nl/blogs/main/archive/2006/12/12/using-new-async-invocation-pattern-in-asp-net-web-services.aspx) and showed the old and new way of doing things. In this weblog post I wanted to show the subtle difference between the VB.NET and C# versions.

In Visual Basic.NET 2.0


```csharp
Sub Main()
  Dim proxy As New HelloWorldService.Service()
  AddHandler proxy.HelloWorldCompleted, AddressOf HelloWorldCompleted
  proxy.HelloWorldAsync()

  Console.WriteLine("Press any key to exit…”)
  Console.ReadKey()
End Sub

Public Sub HelloWorldCompleted(ByVal sender As Object, ByVal args As HelloWorldService.HelloWorldCompletedEventArgs)
  Console.WriteLine(args.Result)
End Sub
```

In C# 2.0


```csharp
static void Main(string[] args)
{
  HelloWorldService.Service proxy = new HelloWorldService.Service();
  proxy.HelloWorldCompleted += new HelloWorldService.HelloWorldCompletedEventHandler(proxy_HelloWorldCompleted);
  proxy.HelloWorldAsync();

  Console.WriteLine("Press any key to continue…”);
  Console.ReadKey();
}

static void proxy_HelloWorldCompleted(object sender, HelloWorldService.HelloWorldCompletedEventArgs e)
{
  Console.WriteLine(e.Result);
}
```

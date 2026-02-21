---
id: 443645
author: Dennis van der Stelt
title: Compiling a .NET 3.5 project and running on a .NET 2.0 machine
description: For those that are still curious after my previous post about using C# 3.0 features i...
pubDate: '2007-12-06T02:40:06'
tags:
  - .NET Framework 2.0
  - .NET Framework 3.5
  - Visual Studio 2008
redirect_from:
  - /dennis/2007/12/06/compiling-a-net-3-5-project-and-running-on-a-net-2-0-machine
  - /blogs/dennis/archive/2007/12/06/compiling-a-net-3-5-project-and-running-on-a-net-2-0-machine.aspx
---
For those that are still curious after my previous post about [using C# 3.0 features in .NET 2.0](/2007/12/05/using-c-3-0-from-net-2-0/). You can compile any .NET Framework 3.5 project and run it in a .NET Framework 2.0 environment (read, no .NET Framework 3.5 installed) without any problems… as long as there are no dependencies to the .NET 3.5 assemblies!

Create a new Console Application under .NET Framework 3.5.Check your references, System.Core will be automatically added to the project. This is a .NET Framework 3.5 assembly. Remove it.

Now add a single Console.WriteLine as follows:


```csharp
using System;
using System.Collections.Generic;
using System.Text;

namespace FrameWork35ConsoleApp
{
  class Program
  {
    static void Main(string[] args)
    {
      Console.WriteLine("Hello world from a .NET 3.5 application.”);
    }
  }
}
```

Compile it and copy the executable to a .NET Framework 2.0 machine. Again, one without .NET Framework 3.5 installed.

Run the executable and watch the result.



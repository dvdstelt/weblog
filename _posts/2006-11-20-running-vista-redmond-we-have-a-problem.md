---
layout: post
id: 51931
author: Dennis van der Stelt
date: 20061120 032132
title: Running Vista; Redmond, we have a problem
description: So I’m running Windows Vista. And although it’s running very smoothly itself, there a...
categories:
    - Development
    - Miscellaneous
    - Personal
    - Vista
tags:
  - Windows Vista
  - Vista
  - Visual Studio 2005
  - IPv6
redirect_from:
  - "/dennis/2006/11/20/running-vista-redmond-we-have-a-problem"
  - "/blogs/dennis/archive/2006/11/20/running-vista-redmond-we-have-a-problem.aspx"
---

So I’m running Windows Vista. And although it’s running very smoothly itself, there are some problems.
1. SQL Server 2005 won’t install  
This is the weirdest one and I have no idea how to solve it. The server/service itself has installed, but client tools (Management Studio) doesn’t. And that’s currently the application I need most.
2. Outlook Webmail Access uses a DHTML Editor that’s not installed with Windows Vista because of security reasons. I can read, but not write and email. There is a solution (download) for it, but that only installs the editor for applications, not the browser enabled version. The only solution is to install the latest Exchange patch so the DHTML Editor isn’t neccesary anymore. Luckely we have VPN as well, so I can still write email.
3. Visual Studio 2005

I already knew it had some issues, but I just had to try and see for myself. First things I’ve noticed are that VS2005 can’t attach itself automatically to the web server anymore. I haven’t tried IIS and/or WinForms yet.

Another problem I have is that Vista has IPv6 support. This means that Dns.GetHostEntry suddenly also returns hexadecimal email addresses. But I was building up some links for an intranet website/application using ip addresses. Win2003 can’t handle the IPv6 ip addresses! 😉

Luckely I found some code on the internet that should be the solution, I guess.


```csharp
private IPAddress GetIPAddress(string dataSource, System.Net.Sockets.AddressFamily addressFamily)
    {
      try
      {
        IPAddress[] addresses = Dns.GetHostEntry(dataSource).AddressList;

        // Try to avoid problems with IPV6 addresses
        foreach (IPAddress address in addresses)
        {
          if (address.AddressFamily == addressFamily)
          {
            return address;
          }
        }

        return addresses[0];
      }
      catch (Exception ex)
      {
        // If it's not possible to get the list of IP adress associated to 
        // the Data Source we try to check if Data Source is already an IP Address
        // and return it
        try
        {
          return IPAddress.Parse(dataSource);
        }
        catch
        {
          // In this case we want to rethrow the first exception
          throw ex;
        }
      }
    }
```

You can request your own ip address should be retrieved using the following line:


```csharp
GetIPAddress(Dns.GetHostName(), System.Net.Sockets.AddressFamily.InterNetwork );
```

I’m currently connected to the internet and our company’s VPN, so I have 6 ip addresses in my AddressList. The first IPv4 address return is indeed what I need and I can only assume this also works in production. I’m still unsure how to write a test* for this though.
*= I didn’t write unit test, because else [people might start complaining](https://bloggingabout.net/2006/02/10/11017#11020). 😉



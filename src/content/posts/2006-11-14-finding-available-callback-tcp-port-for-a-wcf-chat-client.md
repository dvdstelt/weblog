---
id: 47412
author: Dennis van der Stelt
title: Finding available callback tcp port for a WCF chat client
description: While having some fun writing a WCF chat application, I was having some troubles. I w...
pubDate: '2006-11-14T02:28:00'
tags:
  - .NET Framework 3.0
  - Development
  - WCF
  - Windows Communication Foundation
redirect_from:
  - /dennis/2006/11/14/finding-available-callback-tcp-port-for-a-wcf-chat-client
  - /blogs/dennis/archive/2006/11/14/finding-available-callback-tcp-port-for-a-wcf-chat-client.aspx
---
While having some fun writing a WCF chat application, I was having some troubles.

I was using duplex communication over http, using the WsDualHttpBinding. The client needs to setup a callback channel for the service to… well, call back actually. Hence the name, I guess 😉 Anyway, by default it wants to create this channel on port 80, which wasn’t possible because IIS is already listening on that port. For that you need to specify the ClientbaseAddress on your binding.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: teal">DuplexChannelFactory</span><<span style="color: teal">IChatService</span>> dcf = <span style="color: blue">new</span> <span style="color: teal">DuplexChannelFactory</span><<span style="color: teal">IChatService</span>>(client, <span style="color: maroon">"ChatService"</span>);

<span style="color: teal">Uri</span> uri = <span style="color: blue">new</span> <span style="color: teal">Uri</span>(<span style="color: maroon">@"http://localhost:8000/callbackchannel"</span>);

((<span style="color: teal">WSDualHttpBinding</span>)dcf.Endpoint.Binding).ClientBaseAddress = uri;

</div>

Now the callback channel is on port 8000.But, you might want to start multiple clients to test your service. So you need to know what port isn’t taken yet. I wasn’t the first to ask this question, but either I’m really lousy in searching Google, or nobody has blogged a complete answer yet. Either way, here’s what I used.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 9pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<span style="color: blue">int</span> selectedPort = 8000;

<span style="color: blue">bool</span> goodPort = <span style="color: blue">false</span>;

<span style="color: teal">IPAddress</span> ipAddress = <span style="color: teal">Dns</span>.GetHostEntry(<span style="color: teal">Dns</span>.GetHostName()).AddressList[0];

<span style="color: green">//</span>

<span style="color: blue">while</span> (!goodPort)

{

  <span style="color: teal">IPEndPoint</span> ipLocalEndPoint = <span style="color: blue">new</span> <span style="color: teal">IPEndPoint</span>(ipAddress, selectedPort);

  <span style="color: teal">TcpListener</span> list = <span style="color: blue">new</span> <span style="color: teal">TcpListener</span>(ipLocalEndPoint);

  <span style="color: blue">try</span>

  {

    list.Start();

    goodPort = <span style="color: blue">true</span>;

    list.Stop();

  }

  <span style="color: blue">catch</span>

  {

    selectedPort++;

  }

}

</div>

There you go, now you know as well.
**Update :** Was having some problems with CopySourceAsHtml after changing some settings. Should work now.



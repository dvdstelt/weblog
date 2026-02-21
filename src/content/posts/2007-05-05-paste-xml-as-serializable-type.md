---
id: 189609
author: Dennis van der Stelt
title: Paste XML as serializable type
description: "I had the\_privilege to see Steve Maine do some coding in a Microsoft\_SDR session afte..."
pubDate: '2007-05-05T12:35:09'
tags:
  - MIX07
  - Personal
  - Utilities
  - BizTalk Services
redirect_from:
  - /dennis/2007/05/05/paste-xml-as-serializable-type
  - /blogs/dennis/archive/2007/05/05/paste-xml-as-serializable-type.aspx
---
I had the privilege to see [Steve Maine](http://hyperthink.net/blog/) do some coding in a Microsoft SDR session after MIX07.While coding, he showed this cool tool that’s in the BizTalk Services SDK. He was showing something he had build and copied a bit of XML into the clipboard and used this tool inside Visual Studio 2005 to paste it as a serializable type, converted from the blob of XML.

The tool just used the XML to create the new class. Easy as that, but really useful! It’s in the menu under “Edit”, and then “Paste XML as Serializable Type”. I haven’t stress tested it yet, as it’s late when I’m writing this and I’m still very tired from missing so many hours of sleep during MIX07.Don’t ask what I’ve spend them on; What happens in Vegas, stays in Vegas! 😉

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 10pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

<training>

  <name>WCF</name>

  <location>MIC</location>

</training>

</div>

 Take the XML above and have a look at the class below.

<div style="border-right: #cccccc 1pt solid;padding-right: 1pt;border-top: #cccccc 1pt solid;padding-left: 1pt;font-size: 10pt;background: #f5f5f5;padding-bottom: 1pt;overflow: auto;border-left: #cccccc 1pt solid;width: 100%;color: black;padding-top: 1pt;border-bottom: #cccccc 1pt solid;font-family: lucinda console">

[System.Xml.Serialization.<span style="color: #2b91af">XmlRootAttribute</span>(Namespace = <span style="color: #a31515">“”</span>, ElementName = <span style="color: #a31515">“training”</span>)]

<span style="color: blue">public</span> <span style="color: blue">class</span> <span style="color: #2b91af">TrainingClass</span>

{

  <span style="color: blue">private</span> <span style="color: blue">string</span> nameField;

  <span style="color: blue">private</span> <span style="color: blue">string</span> locationField;

  [System.Xml.Serialization.<span style="color: #2b91af">XmlElementAttribute</span>(Namespace = <span style="color: #a31515">“”</span>, ElementName = <span style="color: #a31515">“name”</span>)]

  <span style="color: blue">public</span> <span style="color: blue">virtual</span> <span style="color: blue">string</span> Name

  {

    <span style="color: blue">get</span> { <span style="color: blue">return</span> <span style="color: blue">this</span>.nameField; }

    <span style="color: blue">set</span>  {  <span style="color: blue">this</span>.nameField = <span style="color: blue">value</span>;  }

  }

  [System.Xml.Serialization.<span style="color: #2b91af">XmlElementAttribute</span>(Namespace = <span style="color: #a31515">“”</span>, ElementName = <span style="color: #a31515">“location”</span>)]

  <span style="color: blue">public</span> <span style="color: blue">virtual</span> <span style="color: blue">string</span> Location

  {

    <span style="color: blue">get</span> { <span style="color: blue">return</span> <span style="color: blue">this</span>.locationField;}

    <span style="color: blue">set</span> { <span style="color: blue">this</span>.locationField = <span style="color: blue">value</span>;}

  }  

}

</div>

It’s located in the BizTalk Services SDK. Once installed, it’s under C:Program FilesBizTalk Services SDKSamplesWebTooling. Usable in both Visual Studio 2005 and “Orcas”. Everyone immediately responded that they wanted the tool in a PowerTools package or something. It might be released that way, but until then [download the SDK](http://labs.biztalk.net/downloads.aspx). And don’t let the BizTalk name fool you, this tool and the services in the SDK are really useful. I hope to write about it a bit more.



---
id: 476380
author: Dennis van der Stelt
title: Oslo  Building textual DSLs
description: This is the geek pr0n session Don Box mentioned. Chris Anderson and Giovanni DellaLi...
pubDate: '2008-10-30T07:48:43'
tags:
  - M Language
  - Oslo
  - PDC08
  - Textual DSL
redirect_from:
  - /dennis/2008/10/30/oslo-building-textual-dsls
  - /blogs/dennis/archive/2008/10/30/oslo-building-textual-dsls.aspx
---
This is the geek pr0n session Don Box mentioned. Chris Anderson and Giovanni Della-Libera are presenting, the entire Oslo team that’s here is inside this room.

![IMG_3257](/images/oslo-building-textual-dsls/img_5f00_3257_5f00_thumb_5f00_09e9218e.jpg) ![IMG_3260](/images/oslo-building-textual-dsls/img_5f00_3260_5f00_thumb_5f00_3b83f349.jpg) 


```csharp
module PDC
{
  language Contacts 
  {
    syntax Main = checked:Contact => checked;

    syntax Contact = 
      "Contact" ":" a:Alias =>
      Contact { Alias { a } };
    |
      "Contact" ":" a:Alias "-" n:PhoneNumber =>
      Contact { Alias { a }, Phone {phone} };

    token Alias = ('A'..'Z' | 'a'..'z')+;

    token Digit = "0".."9";
    token PhoneNumber = Digit#3 "-" Digit#3 "-" Digit#4;

    interleave TokensIHate = " " | "r" | "n"+;
  }
}
```

Tokenize is the first thing to do. The above can transform “Contact : dvdstelt – 425-555-1212”, and it removes weird characters. Chris and Gio than show how lists work, how the recursive results are flattened out, how to add comments and

![IMG_3263](/images/oslo-building-textual-dsls/img_5f00_3263_5f00_thumb_5f00_26161814.jpg) mgx.exe is used to generated an mgx file.

mgx /r:contacts.mgx input.contacts will generate M language code. The mgx is just a plain .zip file, as said before in one of my posts.

mgx /r:contacts.mgx input.contacts /t:xaml for transformation to xaml

You can Integrate MGrammar into the CLR
* Use MSBuild tasks, include the .mg file in your solution and setup the msbuild file (csproj) 
* Use the MgrammarCompiler, which is an in memory compiler 
* DynamicParser 
* IGraphBuilder 

A cool example of some MGrammer was grammar code for MSI setup package. MSI is really complex to write, so Chris and Gio build MGrammar to build the MSI. But their MGrammer became so complex, that they wrote another MGrammer code library to generate the other MGrammer code to generate the MSI installer ‘code’. The final result is about 50 lines of MGrammer and 400 lines of C#, pretty maintainable I’d say.

To sum up, MGrammer is a language for creating textual DSLs. The specification will be released under OSP, as noted on many other weblogs.

You can build your own language right now! Download at [http://msdn.microsoft.com/oslo/](http://msdn.microsoft.com/oslo/)

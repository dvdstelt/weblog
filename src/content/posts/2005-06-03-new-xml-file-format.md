---
id: 5328
author: Dennis van der Stelt
title: New XML File Format
description: Microsoft just introduced a video on Channel9 about the new file format for Office 12...
pubDate: '2005-06-03T07:06:00'
tags:
  - Miscellaneous
redirect_from:
  - /dennis/2005/06/03/new-xml-file-format
  - /blogs/dennis/archive/2005/06/03/new-xml-file-format.aspx
---
<font face="Arial" size="2">Microsoft just introduced a video on Channel9 about the new file format for Office 12, which is to be released in the future. Word, Excel and PowerPoint will be able to use the new format. You can [view the presentation here](http://channel9.msdn.com/ShowPost.aspx?PostID=73329), but in short, this is what the file format offers:</font>
* <font face="Arial" size="2">New extensions  
The old .DOC, .XLS and .PPT will become .DOCX, .XLSX and .PPTX. Whereas the change from Office 97 to the new file format in Office 2000 didn’t change the extension, users weren’t able to tell in which format a document was. This explains the change in extension.</font>  
* <font face="Arial" size="2">XML  
The new format will of course be XML, but not like it is in Office 2003.In 2003, everything was in one document, whereas in the new format, every separate part of the document will be stored in a different xml file, that contains references to other documents. For example, a PowerPoint document will contain a base XML file that has references to all the slides, that are stored in additional XML files.</font>  
* <font face="Arial" size="2">Containers  
They are able to use multiple files because Microsoft stores it in a ZIP container. You can rename the document it’s extension from .DOCX to .ZIP and open it up with your favorite zip archiver. The reason for zip is that it’s a widely known format and everyone’s already using it. Both users and developers and other tools.  
The zip containers contain multiple directories, where the different files are stored. If you include for example a .JPG file, it’s stored outside the XML file, inside the zip container. You can open up the zip, find your image and can easily replace it by another picture, without opening the entire Word document.</font>  
* <font face="Arial" size="2">Old Office upgrades  
Both Office 2000, Office XP and Office 2003 users will be able to upgrade their version via a free download to be able to use the new XML File Format.</font>  
* <font face="Arial" size="2">Schemas  
When you’re developing and create, for example, Word documents, you can validate your documents against schemas to see if Word can open your document.</font>  
* <font face="Arial" size="2">Open  
Everything is open and easy to use. For developers, the new format should be much more easy to understand and use then the old format. Microsoft had either never thought that developers wanted to create Office documents by hand, or didn’t want them to. The current binary format is a simple memory dump of the document onto disk, and therefor very hard to open and change inside your own code. The new file format is as open as can be and everyone can use it in their application.</font>  
* <font face="Arial" size="2">Desktop search  
As many parts of the document are split up into different files inside the container, there are a lot of possibilities for users and search engines to specify exactly what their looking for.</font>

<font face="Arial" size="2">Microsoft is very excited about the new File Format and will be listening to comments from you in the future. I’m not easily excited about Word documents, but it will be nice to use the new format to create documents from inside my applications. Right now we almost always choose to create Acrobat Reader documents because of the troubles you can run into when using Word documents. </font>

<!-- Posted by Bloggie - https://bloggingabout-linux.azurewebsites.net/rj -->

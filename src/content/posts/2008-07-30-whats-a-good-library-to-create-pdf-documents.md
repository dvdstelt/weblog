---
id: 469884
author: Dennis van der Stelt
title: What’s a good library to create PDF documents?
description: For a customer I’m looking for a PDF library to create thousands of PDF document. I’v...
pubDate: '2008-07-30T06:50:17'
tags:
  - Development
  - Utilities
redirect_from:
  - /dennis/2008/07/30/whats-a-good-library-to-create-pdf-documents
  - /blogs/dennis/archive/2008/07/30/whats-a-good-library-to-create-pdf-documents.aspx
---
For a customer I’m looking for a PDF library to create thousands of PDF document. I’ve tried two open source libraries, but didn’t quite like them. I’m not sure if it’s me, the library or just PDF because they didn’t feel right.

So I tried two commercial libraries. One just didn’t allow me to do what I wanted and I don’t even remember which one. The other one is from [Syncfusion](http://www.syncfusion.com/products/pdf/backoffice/default.aspx). It does work quite well, until you hit the details on changing tables, cells and other stuff. And it’s loaded with bugs. I’m not sure how long this has been under development, but I just kept running into ‘features’ to which the common reply was “We have logged this as a issue and our development team is currently working on this.”. They’ve fixed one issue so far and it’s released in next weeks developer build. But it still doesn’t gracefully draw tables on the next page and I can’t change the style of individual cells.

Now I am creating the PDF 100% by hand (or code actually) and perhaps it’s a better idea to create some other format first (html, Word, etc) and convert it to PDF afterwards.

What are your experiences with PDF libraries and/or creating PDF documents?

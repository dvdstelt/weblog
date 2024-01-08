---
layout: post
id: 1649
author: Dennis van der Stelt
date: 20041124 091700
title: Language Oriented Programming
description: I’ve been reading this article on Language Oriented Programming the next programming...
categories:
    - Architecture and Design
redirect_from:
  - "/dennis/2004/11/24/language-oriented-programming"
  - "/blogs/dennis/archive/2004/11/24/language-oriented-programming.aspx"
---

I’ve been reading this article on [Language Oriented Programming: the next programming paradigm](http://www.onboard.jetbrains.com/articles/04/10/lop/).
**Current problems** The article first describes current problems. One of the biggest problems I think is, as said in the article, that developers can clearly explain to eachother in a matter of minutes, what needs to be build. But building the actual program requires much, much more time. This is the translation from our thoughts into the ‘words’ or commands of the computer. Once the program has been build, and you (or another developer) tries to understand what is going on after a couple of months, you have to make the translation again, and reverse engineer the program from those computer ‘words’ into your own head. For this we have comments, documentation, uml models and much more, but you’d have to study a fair amount of time to understand what is going on.

What the article doesn’t describe (because it’s out of scope) but what frustrates me most of the time, is that there still is no way that from client to developer there is a good way of communication. You’ve probably all seen the pictures of the swing, where client, developer, management, sales, everyone describes the problem differently. The two final pictures are of what the client finally gets and what the client actually wanted. Every picture is totally different.

I think <u>the</u> biggest problem is communication. Probably everyone agrees, but why don’t people do something about it? We’ve got RUP, which creates many, many documents and a lot of overhead, and it might work some better, but most of the time I still see this fail miserably. Clients can’t specifiy their problem or need, the analist can’t get that information from the client either, and most of the time they can’t describe it either. For example, write a Windows forms based functional document, when we’re building a web application.
**DSL  
**Anyway, back to the article. [Sergey Dmitriev](http://www.sergeydmitriev.com/) describes his Domain Specific Languages (DSL) which, in best, should be a graphical representation of a language, completely build for a specific domain. This can be database or gui related, but can also be a language build for finance related stuff, or a more specific part of finanance. It’s very interesting to read what they’ve done with PMS already.

Years ago, people talked about the future, where we’d have some sort of building blocks. We could tie them all together and have a complete application, completely (or at least almost) without any customization by the ‘developer’. I think this is never really possible. But with DSL, it’s a bit different, but probably doable.

But there might be other problems as well. For example, integration is a hot topic currently and lots of (old) systems must be integrated and connected with eachother. A visitor asks the question on how all these languages will integrate, as multiple languages will be needed to build one program. And as not all languages will be build by the same vendor or company, this might be a big issue which must be tackled before we can start building DSLs.

Anyway, the future will bring us a lot of new goodies. I just hope there’s enough work for developers. The final result might be that only a few real developers build languages, where those developers must have a deep knowledge of the domain they built the language for. In result, a small department can built programs on those languages and don’t need to have a deep understanding of development, like you currently need to build applications.

A topic however I’m going to be reading some more about.

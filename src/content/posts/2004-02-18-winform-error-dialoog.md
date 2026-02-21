---
id: 397
author: Dennis van der Stelt
title: Error dialoog
description: Pas geleden een leuk ASP.NET error scherm gemaakt. Zodra er een excpetion optreedt, w...
pubDate: '2004-02-18T10:56:00'
tags:
  - Development
redirect_from:
  - /dennis/2004/02/18/winform-error-dialoog
  - /blogs/dennis/archive/2004/02/18/winform-error-dialoog.aspx
---
Pas geleden een leuk ASP.NET error scherm gemaakt. Zodra er een excpetion optreedt, wordt die tot in de presentatielaag omhoog gegooid en als je in je web.config de juiste instellingen maakt, kun je een mooi errorscherm tonen. Tijdens debugfase wil je dan de errormelding terugzien en het liefst de gehele stacktrace e.d. en daar had ik een leuk scherm voor gemaakt, waar je de stacktrace open kon klappen enzo.

Maar nu voor Windows Forms applicaties. Ik kwam zojuist op [Duncan Mackenzie](http://weblogs.asp.net/duncanma/archive/2004/02/13/72597.aspx) z’n blog een link tegen naar Jason Bock z’n website. Die heeft een component gemaakt waar je de error in kunt laten zien. Tijdens debugfase, of evt. oproepbaar in productie, dat zoek je zelf maar uit.

Maar dit component geeft een dialogbox met vier tabbladen waar een general message, de stacktrace, de inner exception trace en overige informatie wordt getoond. Hieronder zie je twee voorbeelden.

![](/images/winform-error-dialoog/ed%20-%20figure%201%20-%20general%20info.png)  

![](/images/winform-error-dialoog/ed%20-%20figure%203%20-%20inner%20exceptions.png)

Je kunt het hele [verhaal hier vinden](http://www.jasonbock.net/errordialog.html) en de code kun je [hier downloaden](http://www.jasonbock.net/errordialog.zip).  
Grappig overigens dat de laatste update 03 juni 2002 was, zoals ik zojuist zie! 🙂

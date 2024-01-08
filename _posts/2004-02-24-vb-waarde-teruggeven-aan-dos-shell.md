---
layout: post
id: 437
author: Dennis van der Stelt
date: 20040224 012300
title: Waarde teruggeven aan DOS Shell
description: Ik was pas geleden weer bij een ‘oude’ klant van ons, waar een door mij ontwikkelde V...
categories:
    - Miscellaneous
redirect_from:
  - "/dennis/2004/02/24/vb-waarde-teruggeven-aan-dos-shell"
  - "/blogs/dennis/archive/2004/02/24/vb-waarde-teruggeven-aan-dos-shell.aspx"
---

Ik was pas geleden weer bij een ‘oude’ klant van ons, waar een door mij ontwikkelde VB6 applicatie een waarde terug moest geven aan de schedular. Er wordt daar een VBScript gestart, die dan weer binnen een Shell mijn applicatie opstart, die dan een waarde terug verwacht, zodra er iets fout gaat.

Nu had ik dat nog nooit gedaan, een waarde teruggeven aan een Shell. Ik e-mail, ik eventlog, ik log.txt, ik insert into log, ik print, whatever. Maar nog nooit moest ik een waarde teruggeven. Ik heb even geGoogled (daar moeten ze in de Van Dale een werkwoord van maken!) en de volgende code gevonden:

<div class="code">Private Declare Sub ExitProcess Lib “kernel32” Alias _ “ExitProcess” (ByVal uExitCode As Long)  

Sub Main()  
  Dim RetVal As Long  
  RetVal = DoStuff()  
  Call ExitProcess(RetVal)  
End Sub</div>  

Uiteraard totaal overbodig voor al onze .NET ontwikkelaars, maar wilde het toch even kwijt. 😉

Voor al onze oude VB’rs die nu VB en VB.NET verafschuwen, check [deze post van Frans Bouma](http://weblogs.asp.net/fbouma/archive/2004/02/22/77877.aspx) maar eens voor wat VB.NET compiler ranting! 😉

---
id: 375
author: Dennis van der Stelt
title: WinForms vs. WebForms
description: "Iedereen weet wel behoorlijk wat verschillen op te noemen als het gaat over\_Windows F..."
pubDate: '2004-02-17T12:52:00'
tags:
  - Development
redirect_from:
  - /dennis/2004/02/17/winforms-vs-webforms
  - /blogs/dennis/archive/2004/02/17/winforms-vs-webforms.aspx
---
Iedereen weet wel behoorlijk wat verschillen op te noemen als het gaat over Windows Forms vs. Web Forms. Zo moet je Windows Forms deployen op vele machines, en Web Forms (ofwel een web applicatie) in principe maar op één server, waarbij je de applicatie benadert met een browser. WebForms maak je op met HTML waarbij je hele mooie grafische dingen kan maken, terwijl WinForms veelal de standaard Windows uitstraling hebben, wat overigens mijn voorkeur heeft tegenover het ‘opleuken’ van WinForms.

Nu zijn er met een kleine bandbreedte nog wat zaken, zoals dat je met WinForms alleen je data over hoeft te trekken, terwijl je met WebForms je HTML en je ViewState er bij krijgt. Daarnaast ben je binnen je WinForms statefull en kun je dus lokaal data bewaren, terwijl je met WebForms tijdens elke roundtrip heel je scherm opnieuw moet opbouwen, etc, etc.

Maar nu harde cijfers, wat kost het extra een regels code en vooral aan tijd om webforms te bouwen, tegenover winforms.  
Daarnaast, wat kost het aan bandbreedte om html en viewstate e.d. over te sturen?

Als iemand hier leuke cijfers over kan roepen of laten zien, wil ik dat graag horen. In de reacties uiteraard! 🙂

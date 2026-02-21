---
id: 327
author: Dennis van der Stelt
title: Coding standards  member variables
description: Coding standards zijn, naar het lijkt, redelijk hot momenteel. Komt waarschijnlijk vo...
pubDate: '2004-02-06T07:11:00'
tags:
  - Development
redirect_from:
  - /dennis/2004/02/06/coding-standards-member-variables
  - /blogs/dennis/archive/2004/02/06/coding-standards-member-variables.aspx
---
Coding standards zijn, naar het lijkt, redelijk hot momenteel. Komt waarschijnlijk vooral omdat we naast C++ en VB nu ook C# hebben. Over Java hebben we het hier niet. In ieder geval niet in positieve zin! 😉

Anyway, ik las zojuist een stukje op [Omar Shahine’s weblog](http://weblogs.asp.net/omars/archive/2004/02/05/67687.aspx), waar hij het heeft over member variables. Vroeger noemden we dat globale variabelen, tegenwoordig moet je ze via properties bekend maken! 😉 Hij noemt de volgende mogelijkheden.

<div class="code">  

<li>_memberVariable  

<li>m_MemberVariable  

<li>m_memberVariable  

<li>this.memberVariable</li></div>  

Da’s wel grappig, want uiteraard hebben we hier bij <strike>Cap Gemini</strike> Capgemini* nóg een andere methode, namelijk mMemberVariable.  
Persoonlijk geef ik de voorkeur aan _memberVariable. Dan blijf je vasthouden aan je camelCasing en is het overal meteen duidelijk dat het om een private member gaat.

p.s. Cap Gemini Ernst & Young krijgt een nieuwe naam. Ernst & Young wordt om (voor mij) onbekende redenen weggelaten en Capgemini aan elkaar, met kleine g. Hebben wij nog niets te klagen. CMG in LogicaCMG is met drie hoofdletters geschreven! 😉

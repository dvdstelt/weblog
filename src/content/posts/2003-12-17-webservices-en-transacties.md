---
id: 283
author: Dennis van der Stelt
title: Webservices en transacties
description: Ik zit hier nog steeds bij de ~~censored~~, waar ik persoonlijk wat twijfels heb bij ...
pubDate: '2003-12-17T04:11:00'
redirect_from:
  - /dennis/2003/12/17/webservices-en-transacties
  - /blogs/dennis/archive/2003/12/17/webservices-en-transacties.aspx
---
<div class="Section1">

Ik zit hier nog steeds bij de ~~censored~~, waar ik persoonlijk wat twijfels heb bij de architectuur, die door de 15 architecten is neergezet. Tenminste, ik ben de (zo lijkt het) enige die zijn twijfels uitspreekt. Maar daar sta ik ook bekend om hè, dat ik geen blad voor de mond neem.

Anyway, er zit hier een (jonge)man van Microsoft. Z’n naam boeit niet, maar hij moet advies en ondersteuning geven als het om architectethische vragen gaat. Daarnaast heeft hij de .NET kennis die iedereen hier verder mist! 😉

Er zijn twee punten waar ik zo snel even wat zorgen over heb.
* <span lang="EN-GB">Webservices voor communicatie tussen presentatie process business layer</span>
* Transactionaliteit, of het gemis hieraan, tussen de lagen.

Ik moet vooraf wel aangeven, dat de klant heeft aangegeven dat de proceslaag en de businesslaag (services) open moeten zijn. Op die manier kunnen we het proces laten overnemen door bijv. een workflow pakket. Of bijvoorbeeld met J2EE op de business laag inprikken. Terug naar het verhaal.

Microsoft is eigenlijk nooit negatief over webservices. Sterker nog, ze hebben heel lang een enorme hype hieromtrent gecreëerd waardoor veel mensen (ik denk dat de meeste collega’s wel weten wie ik bedoel 😉 dachten dat die het antwoord was op alle problemen. Toen men er achter kwam dat ze ook nog communiceerden in XML, waren ze helemaal lyrisch over webservices. Totdat Microsoft de genuanceerde uitspraak was dat webservices niet het antwoord was op álle problemen. Wij ontwikkelaars konden weer rustig adem halen! 😉

Anyway, terug op het feit dat Microsoft nooit negatief over webservices is. De Microsofter hier aanwezig is dat daarom dus ook niet. Toch geeft hij wel aan dat het niet gebruikelijk is om tussen je proces en business laag webservices te gebruiken. Het is wel mogelijk om dat tussen je presentatie- (in ons geval web/asp.net) en je proceslaag te gebruiken. Maar dan wel met een interface op je proceslaag, waardoor je gemakkelijker een ander protocol kunt implementeren.  
 Ik heb verder aangegeven, en dat gaf hij toe, dat webservices met de XMLSerializer class en het feit dat het XML is (met mega overhead in ascii) wel eens een behoorlijk performance probleem kan leveren.

Het transactionele probleem onderkende hij ook. Het feit is, dat wij over onze services (binnen [SOA](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dnbda/html/distapp.asp)) geen automaire transacties aankunnen, omdat webservices die niet ondersteunen. Er wordt hier door diezelfde architecten verklaard dat we dat óf in de userinterface oplossen, óf we maken een nieuwe service. Die nieuwe services neemt dan als het ware het transactionele gedeelte van de originele services op, zodat we tóch een transactie over twee services kunnen implementeren. Maar dan gooi je dus wel een gedeelte van je architectuur op de schop. Terwijl het zó simpel is om gewoon die proces- en business laag direct, op de standaard .NET manier, aan elkaar te koppelen.

Ik ben benieuwd wat er nog meer gaat voorvallen. Hoe we het gebrek aan (ASP).NET kennis gaan opvangen, hoe de webservices gaan performen, hoe het met de transacties afloopt. Maar ook bijvoorbeeld, hoe de klant het gaat opvangen dat ze een web applicatie krijgen! Dat schijnt tegenwoordig ook maar normaal te zijn, in plaats van windows forms. (Rich clients eigenlijk, maar ik vind Internet Explorer met haar vele DHTML mogelijkheden ook behoorlijk rich! 😉

We zullen zien. Ik ben in ieder geval lekker bezig en een heleboel aan het leren. Hopelijk leer ik niet alleen maar hoe het niet moet! 😉

</div>

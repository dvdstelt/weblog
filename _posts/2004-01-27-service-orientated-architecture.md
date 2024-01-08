---
layout: post
id: 286
author: Dennis van der Stelt
date: 20040127 040600
title: Service Orientated Architecture
description: Wat wordt er toch ongelofelijk veel gezegd en gedacht over SOA. Maar in de praktijk b...
redirect_from:
  - "/dennis/2004/01/27/service-orientated-architecture"
  - "/blogs/dennis/archive/2004/01/27/service-orientated-architecture.aspx"
---

<div class="Section1">

Wat wordt er toch ongelofelijk veel gezegd en gedacht over SOA. Maar in de praktijk brengen hebben, naar het lijkt, nog maar heel weinig mensen gedaan. Ik heb ook zo mijn gedachten over SOA. We gaan het tijdens de SIG.NET van 27 januari behandelen. Ik ben wel benieuwd naar wat meningen. Helaas kan dat alleen van mensen die er nog niet mee gewerkt hebben! 😉

Een definitie van SOA bestaat mijn inziens niet. Er zijn er namelijk heel veel en al verschillen ze weinig van elkaar, toch zijn veel mensen het over de meeste zaken eens. Ik wil een aantal punten alvast behandelen:

<span style="font-family:Symbol"><span>·<span> </span></span></span> Discoverable  
 Waarom moeten ze discoverable zijn? Oftewel, je moet ze kunnen vinden aan de hand van een registry o.i.d. waar ze allemaal vermeld zijn. Volgens mij voldoet momenteel alleen webservices daaraan, met UDDI. En hoewel de XML Schema’s veel duidelijk maken, moeten er mijn inziens altijd afspraken gemaakt worden m.b.t. authenticatie e.d. Wat is hier het nut dan van? Eén van de zaken dat bijna iedereen er vanuit gaat dat SOA altijd webservices based is, heeft hiermee te maken. Maar waarom kan ik geen direct-calls doen (simpelweg een reference leggen naar de assembly (.dll)) of gebruik maken van binary .NET Remoting?

<span style="font-family:Symbol"><span>·<span> </span></span></span> Single Instance  
 Dat schijnt ook normaal te zijn, dat het één enkel object is t.o.v. component-based, waar je elke keer een eigen en nieuw object creëert. Uiteraard logisch bij webservices. Dat ding staat geregistreerd en draait ergens, en dat is ‘t. Maar niet als ik direct-calss wil doen.

<span style="font-family:Symbol"><span>·<span> </span></span></span> Iedereen praat over lagen, communicatie middelen en/of protocollen, abstract, definities, maar… wat is een service? Hoe definieer ik die? Waaruit kan ik die opmaken? Ik zit nu op een klus, waar ze in één service zaken stoppen zoals *<span style="font-style: italic">personen</span>* en *<span style="font-style:italic">talen</span>* en *<span style="font-style:italic">tarieven</span>* en nog véél meer. Terwijl ik juist het idee heb dat die gescheiden moeten worden. Als ik bijvoorbeeld producten verkoop aan klanten, heb ik een service *<span style="font-style:italic">product</span>* en een service *<span style="font-style:italic">customers</span>*. Dan heb je een koppeling hiertussen d.m.v. orders en orderregels. Omdat die erg samenhangend zijn, stoppen we die in één service, te weten een *<span style="font-style:italic">orders</span>* service. Dit verzin ik overigens niet zelf, maar heeft Gerke ooit zo uitgelegd aan Pascal Naber en mij. Dan kom ik op het volgende…

<span style="font-family:Symbol"><span>·<span> </span></span></span> Waar beleg ik de functionaliteit om alle klanten op te vragen welke ooit product B hebben besteld?  
 Hier zijn volgens mij drie varianten op.

<span><span>o<span> </span></span></span> Je haalt eerste alle orders op waarin product B is besteld. Dan krijg je de relatie naar de klant. Even buiten beschouwing gelaten of we hier identificatie uit de database gebruiken, te weten primary en foreign keys. Dan heb je in je process-layer de gegevens van welke klanten precies product B hebben besteld. Daarna vraag je aan je *<span style="font-style:italic">customers</span>* service de gegevens van de klant op. Dit is theoretisch gezien volgens mij de beste oplossing.

<span><span>o<span> </span></span></span> Omdat de bovenstaande oplossing voor nogal wat gegevens kan zorgen (bijv. heel veel klanten id’s), moeten we in één van de drie services de gevraagde functionaliteit leggen. Omdat we alle verbindingen naar producten uit de *<span style="font-style:italic">customers</span>* service willen houden, beleggen we dit dan in de *<span style="font-style:italic">orders</span>* service. Deze heeft tenslotte al ‘kennis’ van de relatie tussen klant en product. Probleem is dan wel, dat je *<span style="font-style:italic">orders</span>* service, klantgegevens terug gaat geven.

<span><span>o<span> </span></span></span> Om het probleem uit bovenstaande te omzeilen, gaan we een vierde service aanmaken, *<span style="font-style:italic">customers-orders</span>*. Die heeft kennis van zowel de klant als zijn orders. Probleem is dan wel, dat je bijv. business logica dubbel belegt en in principe je klanten en orders in dezelfde database moeten staan. Een echte scheiding tussen deze twee services maak je bijna onmogelijk. Daarnaast krijg je problemen als je ooit wilt weten welke producten klant XYZ ooit heeft besteld. Dan krijg je een vijfde service. Als je standaard al heel veel ‘primaire’ services hebt, wil ik niet eens na gaan denken over de mogelijke combinaties.

Al met al dus nogal wat vragen en problemen. Ik hoop ooit bevredigende antwoorden te krijgen! 😉

</div>

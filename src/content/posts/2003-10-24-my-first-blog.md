---
id: 223
author: Dennis van der Stelt
title: My First Blog
description: Sinds 22 oktober 2003 bestaat de mogelijkheid om op het intranet van LogicaCMG een we...
pubDate: '2003-10-24T01:05:00'
tags:
  - Blogging
redirect_from:
  - /dennis/2003/10/24/my-first-blog
  - /blogs/dennis/archive/2003/10/24/my-first-blog.aspx
---
Sinds 22 oktober 2003 bestaat de mogelijkheid om op het intranet van LogicaCMG een weblog (blog) te beginnen. De eerste dag zijn we begonnen met enkele bloggers, maar er komen nog steeds bloggers bij. Als je ook een weblog wilt beginnen, moet je [deze post](http://wasabi/Weblogs/dennis/posts/145.aspx) lezen.

Wat we hier gaan beschrijven is een korte tutorial voor diegene die een eigen blog hebben aangevraagd en deze nu willen inrichten. Er wordt uitgelegd hoe je je blog configureert, hoe je nieuws kunt plaatsen en daarna nog wat korte tips & tricks over hoe je bijvoorbeeld de layout van je blog kunt wijzigen.
**Password wijzigen  
**Als eerste is het verstandig om je password te wijzigen. Als je het url van je blog hebt ontvangen en daar heen browsed, zie je (aan de linkerkant) onder het menu de mogelijkheid om in te loggen. Als je daar de ontvangen username en password invoert en inlogt, komt er in het menu een nieuwe optie bij: *Admin* Als je het admin gedeelte in gaat, zie je bovenin allemaal tabbladen. Als eerste gaan we het laatste tablad, *Options*, bekijken. Daaronder bevinden zich vier opties, waaronder *Password*. Als je die kiest, spreekt de rest voor zich.
**Configureren van je blog** Als je, na je password te hebben gewijzigd, voor *Configure* gaat, krijg je een waslijst met invoervelden. Ik zal ze een voor een behandelen.
* *Title* Hier voer je de titel in voor je blog. Deze komt terug bovenaan je blog, maar ook in de titlebar van Internet Explorer. Het is dus verstandig deze <u>altijd</u> in te voeren. Als je, net als mijn blog, een plaatje gebruikt en je wilt die grote letters kwijt, is dat mogelijk. Dat wordt hieronder in de tips & tricks beschreven.  
* *Subtitle* Dit is de subtitle van je blog. Hier kun je je persoonlijke quote kwijt, een slimme opmerking, wat je maar wilt. Als je voorbeelden wilt hebben, kun je er op de [asp.net weblogs](http://weblogs.asp.net/) genoeg vinden.  
* *Username* Hier kun je je username wijzigen waarmee je inlogt. Weinig boeiends.  
* *Owner’s Display Name* Dit is de naam die wordt gebruikt om de posts in je blog te ‘ondertekenen’. Deze naam komt dus onder elke post op je eigen blog terug, maar ook op de centrale pagina, waar elke post van elke blogger komt te staan.  
Let erop, dat als je deze naam wijzigt, de naam niet onder al je reeds geplaatste posts wijzigt. M.a.w. de items die je reeds hebt geplaatst, blijven je vorige naam houden. Vraag me niet waarom dat zo is gebouwd, ik ken de reden namelijk niet. Misschien voor performance, om geen foreign-key relatie te leggen, ik weet het niet.  
* *Owner’s Email* Hier het email adres wat wordt gebruikt binnen je blog om… email te versturen! 🙂  
Er wordt email verstuurt wanneer iemand contact met je opneemt via de speciale contact pagina, maar ook als iemand een reactie geplaatst heeft, zodat je weet wie waar wat plaatst, zodat je daar evt. ook weer op kunt reageren.  
* *Timezone* Om de juiste tijd te registreren, kun je hier je timezone aanpassen. De server staat op *Central European Time,* wat voor iedereen dus gewoon hetzelfde is.  
* *Language/Locale* Dit is de taal waarin je blogt. Heeft (volgens mij) alleen te maken met dat de datum boven je posts in het juiste formaat wordt neergezet.  
* *Default Number of Feed/Homepage Items* Dit is het aantal items/posts wat gelijktijdig getoond wordt. Dat geldt dus voor de meest recente posts, of dat nu voor alle categorieën of voor een enkele categorie is. Ook de RSS feed geeft dit aantal weer. Wat een RSS feed is, kun je onderin lezen.  
* *Display Skin* Hiermee stel je in hoe je blog er standaard uit ziet. Je kunt gaan voor een aantal skins die al helemaal zijn ontworpen, maar je kunt ook gaan voor een skin die je zelf verder aan moet passen d.m.v. *cascading style sheets (css)*, maar daar straks meer over.  
* *Custom CSS Selectors* Hier voer je de custom css in waardoor je de layout van je blog kunt aanpassen, na een skin gekozen te hebben.  
* *Static News/Announcement* Hier voer je statisch nieuws of aankondigingen o.i.d. in, welke in je menu terug komen, maar voorlopig niet zullen wijzigen. Het gaat hier om korte stukjes waarmee je je bezoekers wilt informeren over iets.  
Veel bloggers op [asp.net](http://weblogs.asp.net/) hebben daar bijvoorbeeld een “We’re going to the PDC“ logo staan. Zoals je ziet, staat die niet op dit blog! ;-(  
* *Allow Web Service Access* Hiermee geef je aan of je een connectie kunt maken met de webservice van je blog. Via deze webservice kun je nieuwe posts maken vanaf je desktop, en heb je dus niet meer het admin gedeelte nodig om een nieuwe post te maken. Meer informatie hierover kun je op de [officiële .Text website](http://scottwater.com/dottext/posts/9417.aspx) vinden.
**Mijn eerste post** Je hebt nu je blog geconfigureerd en wil je eerste post maken. Ga in het *Admin* gedeelte naar de eerste tab. Daar zie je twee opties onder *Actions* waarmee je o.a. je eerste post kan maken. Maar verstandiger is om eerst over je categorieën na te denken.  
Je kunt verschillende categorieën aanmaken om al je posts te groeperen. Zo maakt in ieder geval iedereen een .NET categorie aan (toch?) om daarover te kunnen bloggen. Daarnaast kun je bijvoorbeeld een categorie aanmaken als je over games gaat bloggen, over over BizTalk, of wat dan ook. Het netste echter, is om pas een categorie aan te maken zodra je er een item in gaat zetten. Bezoekers kunnen namelijk een categorie aanklikken om daarna (de laatste) items te zien uit die categorie. Het is dan een beetje verwarrend om totaal geen items terug te zien komen.

We gaan nu onze eerste post, ons eerste item plaatsen.Als je op *New Post* klikt, krijg je een zogeheten **wysiwyg** edittor te zien. Daarin kun je je tekst opmaken, welke exact hetzelfde op je blog terugkomt. Hier zitten wat haken en ogen aan, omdat je bijvoorbeeld voor je gehele blog een font type en grootte in het configuratiescherm kunt instellen met de *Custom CSS Selectors*, zoals hierboven beschreven. Meer info daarover komt in een nieuw tips & tricks artikel over hoe je het beste je posts/items qua tekst kunt opmaken. Een korte tip hierover: Als je je font via de wysiwyg edittor aanpast, komt die ook op de centrale pagina met dat font terug. Laat daar a.u.b. een beetje op! Gebruik Arial of nog liever géén apart font type om je posts op te maken.

Je kunt verder de tekstuitlijning aanpassen, bullits gebruiken, links aanmaken, etc, etc. Als je echt je posts wilt tweaken, vind je onder aan het tekstblok twee knoppen *Design* en *HTML*. Daarmee kun je de HTML zien die je wysiwyg edittor voor je maakt en uiteraard ook aanpassen. Dat is (momenteel) de enige manier om bijvoorbeeld plaatjes in je posts te plaatsen, door de ![](/images/my-first-blog/) tag te gebruiken in de HTML. Plaatjes kun je uiteraard in je gallery plaatsen en van daaruit gebruiken. Maar meer daarover in het toekomstige opmaak tricks & tips artikel.
**Tips & Tricks voor je blog** *Wat is een RSS Feed?  
*Een RSS feed is een uniforme manier om bepaalde informatie weer te geven in XML. In 9 van de 10 gevallen is dit het nieuws, wat aangeboden wordt via zo’n RSS Feed. Je hebt speciale RSS readers, waarmee je je dan kunt ‘abonneren’. De RSS reader haalt dan met een bepaald tijdsinterval de RSS Feed op, welke je daarna kunt lezen. Afhankelijk van de reader, zal deze in geval van een nieuw item een melding tonen, zodat je weet dat er iets nieuws is om te lezen.  
De Wasabi weblogs bieden allemaal hun eigen RSS Feed aan, maar je kunt ook de RSS Feed lezen waarop de laatste posts van álle blogs komen. Deze kun je [hier](http://wasabi/Weblogs/MainFeed.aspx) vinden. Als je er binnen Internet Explorer op klikt, zie je een hele lap XML. Als je dit beter leesbaar wilt maken, kun je een RSS Reader gebruiken zoals [SharpReader](http://www.sharpreader.com/), maar zelf gebruik ik [<strike>NewsGator</strike>](http://www.newsgator.com/)<strike>, omdat deze héérlijk integreert in Outlook!</strike> ook SharpReader, omdat ik Outlook bij de klant nooit open heb! 🙂

<u>Binnenkort komen hier meer tips & tricks</u>  
Heb je alvast vragen over je blog, dan kun je altijd [contact opnemen](http://wasabi/weblogs/dennis/contact.aspx) of een email sturen.

Dennis v/d Stelt

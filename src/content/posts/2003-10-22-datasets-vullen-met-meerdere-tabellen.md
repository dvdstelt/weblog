---
id: 219
author: Dennis van der Stelt
title: DataSets vullen met meerdere tabellen
description: Ik las zojuist op Christian Nagel z’n weblog hoe je (ook) meerdere datatables in één ...
pubDate: '2003-10-22T12:52:00'
tags:
  - Development
redirect_from:
  - /dennis/2003/10/22/datasets-vullen-met-meerdere-tabellen
  - /blogs/dennis/archive/2003/10/22/datasets-vullen-met-meerdere-tabellen.aspx
---
<font face="Arial">Ik las zojuist op [Christian Nagel](http://weblogs.asp.net/cnagel/posts/32904.aspx) z’n weblog hoe je (ook) meerdere datatables in één dataset kunt krijgen. Hoewel ik het al wist, wil ik dit toch even delen. Het is namelijk erg simpel in gebruik, en daarbij erg makkelijk. En aangezien we zoveel mogelijk het [kiss](http://whatis.techtarget.com/definition/0,,sid9_gci521694,00.html) principe vasthouden…</font>

<div class="code">

<font face="Courier New" size="2">SqlDataAdapter adapter = </font><font face="Courier New" color="#0000ff" size="2">new <font color="#000000">SqlDataAdapter(  
</font></font><font face="Courier New" size="2"> “SELECT * FROM Customers; SELECT * FROM Orders”, connection);  
</font><font face="Courier New" size="2">adapter.TableMappings.Add(“Table”, “Customer”);  
</font><font face="Courier New" size="2">adapter.TableMappings.Add(“Table1”, “Order”);  
</font><font face="Courier New">  
<font size="2">adapter.Fill(ds);</font></font> 

</div>

<font face="Arial">Uiteraard zien we hier een voorbeeld met inline sql-queries, maar het kan uiteraard ook in je Stored Procedures. Wat de voorkeur heeft.</font>

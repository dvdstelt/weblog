---
layout: post
id: 242
author: Dennis van der Stelt
date: 20031104 092800
title: Download alles van de PDC
description: Misschien heb je al het een en ander gedownload van de officiële PDC site.Er staan da...
categories:
    - Development
redirect_from:
  - "/dennis/2003/11/04/download-alles-van-de-pdc"
  - "/blogs/dennis/archive/2003/11/04/download-alles-van-de-pdc.aspx"
---

Misschien heb je al het een en ander gedownload van de [officiële PDC site](http://msdn.microsoft.com/events/pdc/agendaandsessions/sessions/default.aspx).  
Er staan daar echter zoveel Powerpoint presentaties, voorbeeld code zips en documenten, dat je een rsi arm krijgt van het klikken en opslaan.

[Sean ‘Early’ Campbell & Scott ‘Adopter’ Swigart](http://radio.weblogs.com/0117167/) hebben daar wat op gevonden. Ze hebben een stukje code gemaakt waarmee je alles even snel kan downloaden! 🙂

Helaas is het VB.NET! 😉  
Kan iemand het misschien even converteren? Ofwel alle Dim’s weghalen en overal ; achter zetten!? :-p

<div class="code"><font face="Courier New">

<font color="#0000ff">Option</font><font color="#000000"> Compare Text</font>
<font color="#0000ff">Imports</font><font color="#000000"> System.Net</font>
<font color="#0000ff">Imports</font><font color="#000000"> System.IO</font>
<font color="#0000ff">Imports</font><font color="#000000"> System.Text.RegularExpressions</font>
<font color="#0000ff">Module</font><font color="#000000"> Module1</font>
<font color="#000000">    </font><font color="#0000ff">Sub</font><font color="#000000"> Main()</font>
<font color="#000000">        SiteSweep(</font><font color="#000000">"http://www.asp.net/whidbey/pdc.aspx?tabindex=0&tabid=1"</font><font color="#000000">, </font><font color="#000000">"c:PDC"</font><font color="#000000">)</font>
<font color="#000000">        SiteSweep(</font><font color="#000000">"http://msdn.microsoft.com/events/pdc/agendaandsessions/sessions/default.aspx"</font><font color="#000000">, </font><font color="#000000">"c:PDC"</font><font color="#000000">)</font>
<font color="#000000">        Console.WriteLine(</font><font color="#000000">"Done"</font><font color="#000000">)</font>
<font color="#000000">        Console.ReadLine()</font>
<font color="#000000">    </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">Sub</font>
<font color="#000000">    </font><font color="#0000ff">Public</font><font color="#000000"> </font><font color="#0000ff">Sub</font><font color="#000000"> SiteSweep(</font><font color="#0000ff">ByVal</font><font color="#000000"> source </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">String</font><font color="#000000">, </font><font color="#0000ff">ByVal</font><font color="#000000"> dest </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">String</font><font color="#000000">)</font>
<font color="#000000">        </font><font color="#008000">' needed to deal with relative paths</font>
<font color="#000000">        </font><font color="#0000ff">Dim</font><font color="#000000"> root </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">String</font><font color="#000000"> </font><font color="#000000">=</font><font color="#000000"> Left(source, source.IndexOf(</font><font color="#000000">"/"</font><font color="#000000">, 7))</font>
<font color="#000000">        </font><font color="#0000ff">Dim</font><font color="#000000"> current </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">String</font><font color="#000000"> </font><font color="#000000">=</font><font color="#000000"> Left(source, source.LastIndexOf(</font><font color="#000000">"/"</font><font color="#000000">) </font><font color="#000000">+</font><font color="#000000"> 1)</font>
<font color="#000000">        </font><font color="#008000">' pull page</font>
<font color="#000000">        </font><font color="#0000ff">Dim</font><font color="#000000"> w </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">New</font><font color="#000000"> WebClient</font>
<font color="#000000">        </font><font color="#0000ff">Dim</font><font color="#000000"> sr </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">New</font><font color="#000000"> StreamReader(w.OpenRead(source))</font>
<font color="#000000">        </font><font color="#0000ff">Dim</font><font color="#000000"> s </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">String</font><font color="#000000"> </font><font color="#000000">=</font><font color="#000000"> sr.ReadToEnd()</font>
<font color="#000000">        </font><font color="#008000">' find hrefs</font>
<font color="#000000">        </font><font color="#0000ff">Dim</font><font color="#000000"> r </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">New</font><font color="#000000"> Regex(</font><font color="#000000">"hrefs*=s*(?:"</font><font color="#000000">"(?<1>[^"</font><font color="#000000">"]*)"</font><font color="#000000">"|(?<1>S+))"</font><font color="#000000">, _</font>
<font color="#000000">            RegexOptions.IgnoreCase </font><font color="#0000ff">Or</font><font color="#000000"> RegexOptions.Compiled)</font>
<font color="#000000">        </font><font color="#008000">' get rid of dups</font>
<font color="#000000">        </font><font color="#0000ff">Dim</font><font color="#000000"> d </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">New</font><font color="#000000"> Hashtable</font>
<font color="#000000">        </font><font color="#0000ff">For</font><font color="#000000"> </font><font color="#0000ff">Each</font><font color="#000000"> m </font><font color="#0000ff">As</font><font color="#000000"> Match </font><font color="#0000ff">In</font><font color="#000000"> r.Matches(s)</font>
<font color="#000000">            </font><font color="#0000ff">Dim</font><font color="#000000"> url </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">String</font><font color="#000000"> </font><font color="#000000">=</font><font color="#000000"> m.Groups(1).Value</font>
<font color="#000000">            </font><font color="#008000">' find only certain file types.  This could have been done with the </font>
<font color="#000000">            </font><font color="#008000">' previous regex, except (1) I ripped that regex off of MSDN, and (2)</font>
<font color="#000000">            </font><font color="#008000">' I plan on running the app all of one time, so who cares.</font>
<font color="#000000">            </font><font color="#0000ff">If</font><font color="#000000"> Right(url, 4) </font><font color="#000000">=</font><font color="#000000"> </font><font color="#000000">".ppt"</font><font color="#000000"> </font><font color="#0000ff">Or</font><font color="#000000"> Right(url, 4) </font><font color="#000000">=</font><font color="#000000"> </font><font color="#000000">".zip"</font><font color="#000000"> </font><font color="#0000ff">Or</font><font color="#000000"> Right(url, 4) </font><font color="#000000">=</font><font color="#000000"> </font><font color="#000000">".doc"</font><font color="#000000"> </font><font color="#0000ff">Then</font>
<font color="#000000">                </font><font color="#0000ff">If</font><font color="#000000"> Left(url, 7) </font><font color="#000000"><</font><font color="#000000">></font><font color="#000000"> </font><font color="#000000">"http://"</font><font color="#000000"> </font><font color="#0000ff">Then</font>
<font color="#000000">                    </font><font color="#0000ff">If</font><font color="#000000"> url.StartsWith(</font><font color="#000000">"/"</font><font color="#000000">) </font><font color="#0000ff">Then</font>
<font color="#000000">                        url </font><font color="#000000">=</font><font color="#000000"> root </font><font color="#000000">&</font><font color="#000000"> url</font>
<font color="#000000">                    </font><font color="#0000ff">Else</font>
<font color="#000000">                        url </font><font color="#000000">=</font><font color="#000000"> current </font><font color="#000000">&</font><font color="#000000"> url</font>
<font color="#000000">                    </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">If</font>
<font color="#000000">                </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">If</font>
<font color="#000000">                d(url) </font><font color="#000000">=</font><font color="#000000"> Right(url, </font><font color="#0000ff">Len</font><font color="#000000">(url) </font><font color="#000000">-</font><font color="#000000"> url.LastIndexOf(</font><font color="#000000">"/"</font><font color="#000000">) </font><font color="#000000">-</font><font color="#000000"> 1)</font>
<font color="#000000">            </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">If</font>
<font color="#000000">        </font><font color="#0000ff">Next</font>
<font color="#000000">        </font><font color="#0000ff">If</font><font color="#000000"> </font><font color="#0000ff">Not</font><font color="#000000"> Directory.Exists(dest) </font><font color="#0000ff">Then</font>
<font color="#000000">            Directory.CreateDirectory(dest)</font>
<font color="#000000">        </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">If</font>
<font color="#000000">        </font><font color="#008000">' download each file.  If the download bombs, try again, unless you get</font>
<font color="#000000">        </font><font color="#008000">' a 415 or 404 because there appears to be a problem with one some of the </font>
<font color="#000000">        </font><font color="#008000">' files, or they are hrefs that are commented out, and my regex ain't smart</font>
<font color="#000000">        </font><font color="#008000">' enough to figure that out.</font>
<font color="#000000">        </font><font color="#0000ff">For</font><font color="#000000"> </font><font color="#0000ff">Each</font><font color="#000000"> s </font><font color="#0000ff">In</font><font color="#000000"> d.Keys</font>
<font color="#000000">            </font><font color="#0000ff">Dim</font><font color="#000000"> isDownloaded </font><font color="#0000ff">As</font><font color="#000000"> </font><font color="#0000ff">Boolean</font><font color="#000000"> </font><font color="#000000">=</font><font color="#000000"> </font><font color="#0000ff">False</font>
<font color="#000000">            </font><font color="#0000ff">While</font><font color="#000000"> </font><font color="#0000ff">Not</font><font color="#000000"> isDownloaded</font>
<font color="#000000">                </font><font color="#0000ff">Try</font>
<font color="#000000">                    Console.WriteLine(</font><font color="#000000">"Downloading:"</font><font color="#000000"> </font><font color="#000000">&</font><font color="#000000"> s)</font>
<font color="#000000">                    </font><font color="#0000ff">If</font><font color="#000000"> </font><font color="#0000ff">Not</font><font color="#000000"> File.Exists(dest </font><font color="#000000">&</font><font color="#000000"> </font><font color="#000000">""</font><font color="#000000"> </font><font color="#000000">&</font><font color="#000000"> d(s)) </font><font color="#0000ff">Then</font>
<font color="#000000">                        w.DownloadFile(s, dest </font><font color="#000000">&</font><font color="#000000"> </font><font color="#000000">""</font><font color="#000000"> </font><font color="#000000">&</font><font color="#000000"> d(s))</font>
<font color="#000000">                    </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">If</font>
<font color="#000000">                    isDownloaded </font><font color="#000000">=</font><font color="#000000"> </font><font color="#0000ff">True</font>
<font color="#000000">                </font><font color="#0000ff">Catch</font><font color="#000000"> exc </font><font color="#0000ff">As</font><font color="#000000"> Exception</font>
<font color="#000000">                    Console.WriteLine(exc.Message)</font>
<font color="#000000">                    </font><font color="#0000ff">If</font><font color="#000000"> exc.Message.IndexOf(</font><font color="#000000">"(415)"</font><font color="#000000">) </font><font color="#000000">></font><font color="#000000">=</font><font color="#000000"> 0 </font><font color="#0000ff">Or</font><font color="#000000"> exc.Message.IndexOf(</font><font color="#000000">"(404)"</font><font color="#000000">) </font><font color="#0000ff">Then</font>
<font color="#000000">                        isDownloaded </font><font color="#000000">=</font><font color="#000000"> </font><font color="#0000ff">True</font>
<font color="#000000">                    </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">If</font>
<font color="#000000">                </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">Try</font>
<font color="#000000">            </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">While</font>
<font color="#000000">        </font><font color="#0000ff">Next</font>
<font color="#000000">    </font><font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">Sub</font>
<font color="#0000ff">End</font><font color="#000000"> </font><font color="#0000ff">Module</font>
<font color="#000000"></font>

</font></div>

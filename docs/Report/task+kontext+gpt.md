**CMSB-1810** — úprava AI reportingu (interný podklad + kontext)

**Framing pre DataHub** (usage vs performance signály, shape > completeness, bez „impact“ tlaku): pozri [`DataHub_AI_Usage_Performance_Bridge_Framing.md`](./DataHub_AI_Usage_Performance_Bridge_Framing.md).

# **Uprava AI Reportingu**

Popis

• Unsaved changes

**POZNAMKA: Produktove benchmarky ci uz tvrde cisla alebo time save musia byt menitelne v ramci casu. Cize spravit variables ktore vieme menit v pripade potreby businessu.**

HISTORICKA MAXIMALNA HODNOTA \=\> chceli by sme vidiet aky bol max v ramci historie. Nice to have

---

# ROI

Vytvoriť ROI report pohľad, ktorý zobrazuje hodnotu AI nástrojov podľa vzorca Benefit − Cost \= VALUE.  
Mockup je priložený ako roi\_report.html report má byť implementovaný podľa neho.

![image-20260224-111818.png][image1]

## Filtre:

* Časové obdobie: Týždeň / Mesiac / Kvartál / Rok (týždeň nie je must-have, môžete vypustiť)  
* Tool filter: multi-select — používateľ môže vybrať jeden alebo viac toolov; KPI karty aj graf sa aktualizujú v reálnom čase

## KPI karty (dynamické podľa filtra):

* Celkový Benefit (€ \+ ušetrené hodiny prepočítané na peniaze)  
  * Otázka: máte vy za DHUB nejaký avg cost redaktora na hodinu? Ak nie, my tiež nie, len dajte vedieť a zistíme.  
* Náklady (€)  
* Čistý zisk \= Benefit − Náklady  
* ROI % \= (Čistý zisk / Náklady) × 100

## Graf:

* Stĺpcový graf: Benefit vs. Náklady per tool  
* Hodnoty zobrazené nad stĺpcami

## ROI:

* Benefit per Tool (values \= variables, hodnoty musia byť editovateľné bez deploy):  
  * Headline ABC \=\> Porovnanie B/C s Ackovou verziou co ma byt by USER. Kolko revenue nam priniesli B/C varianty oproti A variante (sledovanie len ploch kde je ABC pouzity) | Porovnanie metrik ktore vyberie DHUB (nas navrh CTR, TTS alebo ine in=article metriky, Time saving \= 1 min (musime identifikovat presnu hodnotu \= *hodnotu pre ušetrený čas per use budeme potrebovať v času upresňovať, takže toto pre všetky features mať configurovateľné*))  
  * Perex generator \=\> Time saving \= 3 min (Produktorvy benchmark)  
  * Keyword Generator (do 15.2.2026 nasledny prechod na Tag generator) \=\> Time saving \= 1 min  
  * Tag Generator (od 16.2.2026) \=\> Time saving \= 1 min \+ 35 000 EUR rocne (Sales tim revenue, Produktovy benchmark)   
  * Poll Generator \=\> Time saving \= 5 min (Produktorvy benchmark) \+ Time spent oproti priemeru ostatnych clankov? \+ Ads (kvoli zvacseniu priestoru a moznosti novej reklamy \+ Dodanie revenue z webu kolko nam donasa takato reklama?)  
  * Quiz Generator \=\> revenue na quizovom clanku \+ Time saving \= 20 min per quiz clanok (odkaz na prieskum Jul2024)  
    * Update tychto dat zmerat angazovanost citatela s kvizmi tvorenymi s AI aby sme zistili benefit/dopad (nie je to must have teraz)  
      * ![image-20260218-130606.png][image2]  
  * Related articles auto-suggestion \=\> Time saving \= 30 sec na clanok \+ získaný perf. navyše vďaka väčšiemu prelinkovaniu článkov s related articles (Príklad: Brand Život má related articles under article na 70% publ. článkoch  a teda čo navyše získame, ak vďaka automatizácii dosiahneme 100% . toto aplikovať na celé ptf)  
  * Social Post Generator \=\> Time saving \= 1 min (vieme zmerat engagement z tychto AI postov? prepojenie na clanky?)  
  * TASR News Restyling \=\> Time saving \= 5 min \+ Ads revenue  
  * Audio Transcript \=\> DHUB?  
    * @Viktor Koslab tu len nejaký výpočet cca ušetrený čas redaktora na hodinu prepisu, aby sa dal odvodiť saving tak ako inde \- len orientačne  
  * Video subtitles Generatior \=\> DHUB?  
    * @Viktor Koslab detto ako vyššie \+ tu malo byť aj zvýšenie dopozeranosti videa, čiže ak aj nemáme toto číslo ešte, pridal by som graf na to prázdny a musíme doriešiť metriku \- len aby bolo vidno, že toto má byť prínos, len nemáme zmerané  
* COST ako tokens per tool? (costy per month teraz nebudú must-have .. len pre total vieme dať sumár z faktúr / fin. plánu)

---

# Adoption

Vytvoriť Adoption report pohľad, ktorý zobrazuje pre každý tool:

* Počet unikátnych používateľov (aspoň 1× použitie v danom období)  
* Adoption rate \= počet článkov kde bol tool použitý tool (Max CAP popísaný nižšie)

Mockup je priložený ako adoption\_report.html.

![image-20260224-143802.png][image3]

 

## Filtre (rovnaké ako ROI report):

* Časové obdobie: Týždeň / Mesiac / Kvartál / Rok (tiež týždeň nie je must-have)  
* Tool filter: multi-select výber ovplyvňuje tabuľku aj KPI karty v reálnom čase

## KPI karty:

* Unikátni používatelia (súčet za vybrané tools) (tak ako v sucasnych reportoch definovany Uzivatel a rovnako maximum Unikatnych uzivatelov ma byt podla aktualneho nastavenia)  
* Celková adopcia % (použité / CAP)  
* Celkové použitia (počet článkov)  
* Počet tools (10 \=\> možnosť zmeny priamo v reporte aby sa to nemuselo menit niekde na BE) \- resp.  vždy po pridaní toolu do reportu sa pridá počet, alebo odoberie.

## Tabuľka per tool stĺpce:

| Stĺpec | Popis |
| :---- | :---- |
| Nástroj | Názov toolu |
| Unikátni používatelia | Počet ľudí (nie použití, nie dní) |
| Použité články | Počet článkov kde bol tool použitý |
| CAP | Celkový počet článkov kde mohol byť použitý |
| Adoption Rate | Progress bar \+ % (použité / CAP) |
| Max Adoption Rate | Nastavit variables ktoru vieme vyplnit aktualne mozeme nastavit na 80%. Idealne tato variable by bola menena uzivatelom pre report aby manazment to vedel jednoducho upravit |

 Tabuľka zoradená podľa adoption rate zostupne.

## Globálny CAP kľúčová požiadavka:

CAP je globálna premenná zdieľaná naprieč všetkými reportmi. Zmena CAP hodnoty sa musí automaticky prepočítať všade v Adoption reporte aj v každom inom reporte kde sa počíta adoption.

Adoption per clanok ***(kolko clankov malo moznost pouzitia toolo vs clanky kde bol pouzity tool)***:

**TO DO:** Odfiltrovať z aktuálneho [AI dashboardu](https://datastudio.google.com/reporting/b64a2cfd-4080-4a27-b37b-3596dce81089/page/p_a33i4nkqpd) zo všetkých záložiek, kde sa meria adopcia, články, ktoré nespĺňajú kritériá uvedené nižšie.

* Príklad: *Pri Headline ABC nemôžeme započítavať do 100% článkov napr. články typu Kvíz, alebo články s povahou článku PR a pod.*  
* **Headline ABC** \=\> Nastavit cap podla: Vzorka: Počíta sa zo všetkých publikovaných článkov (Typ \= Interný, Fotostory, Encyklopédia, Longform, Ochorenie, Test; Povaha článku \= Redakčný; Zdroj článku: Vylúčiť "Externý autor pre web")  
* **Perex generator** \=\> Nastavit cap podla: Vzorka: Počíta sa zo všetkých publikovaných článkov (Typ \= Interný, Fotostory, Encyklopédia, Longform, Ochorenie, Test; Povaha článku \= Redakčný; Zdroj článku: Vylúčiť "Externý autor pre web")  
* **Keyword generator** \=\> Nastavit cap podla: Vzorka: Počíta sa zo všetkých publikovaných článkov (Typ \= Interný, Fotostory, Encyklopédia, Longform, Ochorenie, Test; Povaha článku \= Redakčný; Zdroj článku: Vylúčiť "Externý autor pre web")  
* **Tag generator** \=\> Nastavit cap podla: Vzorka: Počíta sa zo všetkých publikovaných článkov (Typ \= Interný, Fotostory, Encyklopédia, Longform, Ochorenie, Test; Povaha článku \= Redakčný; Zdroj článku: Vylúčiť "Externý autor pre web")  
* **Poll Generator** \=\> Nastavit cap podla: Vzorka: Počíta sa zo všetkých publikovaných článkov (Typ \= Interný, Fotostory, Encyklopédia, Longform, Ochorenie, Test; Povaha článku \= Redakčný; Zdroj článku: Vylúčiť "Externý autor pre web")  
* **Quiz Generator** \=\> Cap je vsetky quiz clanky a pozerat sa na to kolko clankov bolo pomocou AI a kolko bez  
* **Related articles auto-suggestion** \=\> Nastavit cap podla: Vzorka: Počíta sa zo všetkých publikovaných článkov (Typ \= Interný, Fotostory, Encyklopédia, Longform, Ochorenie, Test; Povaha článku \= Redakčný; Zdroj článku: Vylúčiť "Externý autor pre web")  
* **Social Post Generator** \=\> Pomer k poctu link postov na FB za vsetky brands  
* **TASR News Restyling** \=\> CAP TASR publikovanych clankov Ekonomický servis (TREND) vs AI spravene  
* **Audio Transcript** \=\> DHUB? Pocet hodin prepisov bez audio transcriptu v minulosti  
* **Video subtitles Generator** \=\> DHUB?  
  * definovať cca koľko je videí nahratých s potenciálnym využitím video subtitles v stave akom je teraz (časom sa môže meniť \- preklady a pod.)

—------------------------------

Kontext s kolegom na meete: 

Budziňák Daniel spustil/-a prepis

Šaghy Lukáš  
0 minúty 3 sekundy0:03  
Šaghy Lukáš 0 minúty 3 sekundy  
Jaj či to tvorí len väčšina juniorov, ktorí tam proste 1 faktúru puknú a idú ďalej. Alebo či sú to ľudia, ktorí fakt, že hry to používajú. No a vlastne samozrejme, že toto sme tiež dlhodobo reportovali. Toto je tiež 1 z dobrých pohľadov, že sme pekne videli v priebehu času, že od týchto monike, že to používa 1 1, že tí autori používajú povedzme 1 2 nástroje, takto pekne sa prelieva prelievalo do tejto strednej až vyššej skupiny. Hej, že tí ľudia používajú, že sa to nabaľuje.

Budziňák Daniel  
0 minúty 12 sekundy0:12  
Budziňák Daniel 0 minúty 12 sekundy  
Hm.

Šaghy Lukáš  
0 minúty 33 sekundy0:33  
Šaghy Lukáš 0 minúty 33 sekundy  
Aj tieto znie to povedať.

Budziňák Daniel  
0 minúty 35 sekundy0:35  
Budziňák Daniel 0 minúty 35 sekundy  
Hm.

Šaghy Lukáš  
0 minúty 36 sekundy0:36  
Šaghy Lukáš 0 minúty 36 sekundy  
A potom tam bol ešte neviem.

Budziňák Daniel  
0 minúty 38 sekundy0:38  
Budziňák Daniel 0 minúty 38 sekundy  
Ks.

Šaghy Lukáš  
0 minúty 39 sekundy0:39  
Šaghy Lukáš 0 minúty 39 sekundy  
Hm tento dobrý pohľad počkať neviem aké tam je obdobie.  
Šaghy Lukáš 0 minúty 55 sekundy  
Tento pohľad, že dobre máme tu 230 ľudí, ktorí publikovali a teda že že toto znamená, že pri koľkých percentách svojich článkov používajú ja hej a toto sú vlastne ženám sa tu tiež postupne postupom času prelievalo. To, že tu máme teraz neviem koľko to je vyše 65, alebo koľko percent ľudí, ktorí pri každom 1 článku článku svojom používajú ja, čiže toto je to, čo my máme k adopcii a to čo nám to nevyhovovalo. Hejže?  
Šaghy Lukáš 1 minúta 26 sekundy  
Pointa toho čo mi tu pýtame túto v tej v tej adoption je, že my vlastne sme potrebovali. Jednak áno, že dať nastaviť si nejaké kapely nejakú cieľovú adopciu, ale zároveň aj to, že dať si nejaký kde to bolo vlastne nejaký kep kuch na tú adopciu a to som ti už raz hovoril, že napríklad že nikdy nebude mať fissura.

Budziňák Daniel  
1 minúta 29 sekundy1:29  
Budziňák Daniel 1 minúta 29 sekundy  
Hm hm.  
Budziňák Daniel 43 minúty 24 sekundy  
Hm.

Šaghy Lukáš  
43 minúty 25 sekundy43:25  
Šaghy Lukáš 43 minúty 25 sekundy  
Ja povedať si a smerujeme to vlastne na ten grooming utorkový, aby to potom išlo zase na ten ideálne nejaká analýza, možno už do ďalšieho šprintu.  
Šaghy Lukáš 43 minúty 35 sekundy  
Čiže tam zase máme trošku nejaký čas, lebo tam tam našťastie máme pevné tieto míľniky a tým pádom teraz by som fakt, že maximum času dal do tohto, aby sme fakt, že doručili tú požiadavku a potvrdili si s nimi, že je. Áno, že je proste chceme na to pečiatku, že je nejaká kvalitná dobrá, zrozumiteľná a že nám to dajú.

Budziňák Daniel  
43 minúty 36 sekundy43:36  
Budziňák Daniel 43 minúty 36 sekundy  
Presne.  
Budziňák Daniel 43 minúty 41 sekundy  
Hm.  
Budziňák Daniel 43 minúty 46 sekundy  
Určite.

Šaghy Lukáš  
43 minúty 55 sekundy43:55  
Šaghy Lukáš 43 minúty 55 sekundy  
A keď povedia nie, tak budeme to musieť riešiť, to už zas oviec hej, teraz je znovu a tak ďalej.

Budziňák Daniel  
43 minúty 59 sekundy43:59  
Budziňák Daniel 43 minúty 59 sekundy  
To uvidíme ako sa to.  
Budziňák Daniel 44 minúty 1 sekunda  
Uvidíme, ako sa to vyvinie dobre dobre, za mňa to sedí a teda prioritu si dávam tento reporting v podstate včera som sa síce venoval niečomu inému, ale kvázi. Nemal som ešte podklady od teba, takže som využil ten čas, lebo nejako som sa zažral do toho úprimne aj ja som taký, že keď sa niečo zažijem tak potom neviem prestať ale ale nevadí, dám si, dávam si to ako prio a ideme riešiť toto a keď bude čas pomedzi to tak pozrieme potom aj ten ten kopilot a nejako to budeme posúvať, nie je to nič pálivé, akosi veľa.

Šaghy Lukáš  
44 minúty 7 sekundy44:07  
Šaghy Lukáš 44 minúty 7 sekundy  
Hm.  
Šaghy Lukáš 44 minúty 11 sekundy  
Jasné.  
Šaghy Lukáš 44 minúty 17 sekundy  
Jasné.  
Šaghy Lukáš 44 minúty 19 sekundy  
No super.  
Šaghy Lukáš 44 minúty 28 sekundy  
Určite.

Budziňák Daniel  
44 minúty 31 sekundy44:31  
Budziňák Daniel 44 minúty 31 sekundy  
Kto pôjde na ten grooming? Takže úplne v pohode tam máme nejaký čas, hlavne čo je tak je to v nejakej použiteľnej forme a na čo som hrdý je teda ten blueprint, ktorý by teoreticky mohol pomôcť 2 a ono je to namyslené takým spôsobom, že už je to v podstate ako nejaký kontrakt, ktorý by sa dal akože replikovať ďalej a používať aj čiže nie je to jednorazová záležitosť ale ale je to normálne nejaký workshop, ktorý by sa dal používať do doby kým sa aj nezapojiť do samotného kódu alebo nejako tak to hej že vieme s tým pomáhať aj my, lebo respektíve aj ten.

Šaghy Lukáš  
44 minúty 32 sekundy44:32  
Šaghy Lukáš 44 minúty 32 sekundy  
Hm.  
Šaghy Lukáš 44 minúty 33 sekundy  
Určite áno, my tak máme.  
Šaghy Lukáš 44 minúty 59 sekundy  
Hej hej.

Budziňák Daniel  
45 minúty 1 sekunda45:01  
Budziňák Daniel 45 minúty 1 sekunda  
V peknom čas čiže čiže ak hm ja budem môcť pracovať tak to, že im dokážem pripravovať podklady aby som šetril čas tak za mňa sú problém a to baví. Ide mi to a vedel by som sa v tom nájsť úplne hej čiže tak uvidíme ako sa to vyvinie celá.

Šaghy Lukáš  
45 minúty 19 sekundy45:19  
Šaghy Lukáš 45 minúty 19 sekundy  
Dobre, ja tu aj mám všetko pootvárané, že ako si mi to poslal to čo si hovoril že si robil včera, čiže ja zase keď niekde budeme chvíľku asi to, že pozriem, že niekto trošku to vnímam a určite potom zase ten cieľ je, že možno kľudne ak sa ti podarí tým, že naplánovať niečo buď do pondelka alebo pokojne ešte do piatka k tomuto hej, lebo vlastne teraz náš cieľ je, že produktov si to prejsť do do toho groomingu do utorka. Hej tam si dajme zase tam si to oťukáme s ďalšími ľuďmi a potom ideálne, lebo však kto si?

Budziňák Daniel  
45 minúty 44 sekundy45:44  
Budziňák Daniel 45 minúty 44 sekundy  
Tak.

Šaghy Lukáš  
45 minúty 50 sekundy45:50  
Šaghy Lukáš 45 minúty 50 sekundy  
Často pýta, že by to už rád videl tieto veci. Všetky pku tiež produktovo, tak zase keď to bude očkované už po všetkých možných stranách, tak zase tam by sme to dali niekde budúci týždeň možno v 2 polke alebo tak zase syrom, že už by sme si to prešli a tam sa to zase nakúpi. Hej tam bude aj si prejsť report aj si prejsť tie linkbuilding a tieto veci a plus ešte tento kopilot hejže že si presli že kľudne do toho pondelka, že ideálne toto nech si prejdeme a to do konca tohto týždňa ešte alebo štvrtok vlastne.

Budziňák Daniel  
46 minúty 12 sekundy46:12  
Budziňák Daniel 46 minúty 12 sekundy  
Hm.

Šaghy Lukáš  
46 minúty 20 sekundy46:20  
Šaghy Lukáš 46 minúty 20 sekundy  
Ten report. V.

Budziňák Daniel  
46 minúty 23 sekundy46:23  
Budziňák Daniel 46 minúty 23 sekundy  
Dobre dobre dobre okej ja ti ja ti g reportu ti dám feedback čím skôr podstate teda pustím sa do toho dneska nemám tam nič také pálivé tie zadania, ktoré sa malo pripraviť do diery a tak ďalej kto tam všetko je, takže tam sa už len čaká a môžem sa na to vrhnúť, teda bez problémov.

Šaghy Lukáš  
46 minúty 24 sekundy46:24  
Šaghy Lukáš 46 minúty 24 sekundy  
Dobre super, tak dohodnuté.  
Šaghy Lukáš 46 minúty 30 sekundy  
Dobre.  
Šaghy Lukáš 46 minúty 38 sekundy  
Super super dobre, ďakujem dohodnuté.

Budziňák Daniel  
46 minúty 42 sekundy46:42  
Budziňák Daniel 46 minúty 42 sekundy  
Dobre, dobre super, nech sa darí ahoj.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

GPT

Vidím tam už veľmi jasne:

* aktuálny STATE NMH AI ekosystému,  
* existujúce reporting capability,  
* problém „usage ≠ impact“,  
* article-centric architektúru,  
* väzbu na DataHub,  
* smer Editorial Copilot / orchestration layer,  
* KPI tlak pre Pentu,  
* aj medzeru medzi:  
  * množstvom AI adopcie,  
  * a schopnosťou preukázať business value.

Kľúčové veci, ktoré z podkladov už teraz vystupujú:

1. NMH už dnes nie je v stave „experimentujeme s AI“  
* adopcia je veľmi vysoká,  
* infra existuje,  
* logging existuje,  
* reporting existuje,  
* article\_id spine existuje,  
* AI usage history existuje.  
2. Najväčší strategický problém nie je AI generation  
    ale:  
* decision orchestration,  
* jednotná interpretácia,  
* impact attribution,  
* executive narrative.  
3. Máte už skoro všetky stavebné bloky na:  
    „Editorial Performance Intelligence Copilot“  
    nie iba AI feature collection.  
4. Report pre Pentu nesmie byť:  
    „koľko AI toolov máme“  
    ale:  
    „ako AI mení výkon redakcie a business systém.“  
5. Veľmi silná je línia:  
* AI adoption → editorial behavior → article identity → DataHub → business impact.

To je podľa mňa hlavný strategický framing celého reportu.

6. Extrémne dôležitý insight:  
    už dnes existuje základ pre Decision Validation Layer.  
    Nie teoreticky.  
    Prakticky.

Pretože:

* article\_id spine,  
* AiFeaturesUsageLog,  
* DataHub metrics,  
* publish lifecycle,  
* related articles,  
* CTR,  
* AI vs non-AI reporting,  
* adoption breakdown,  
* tool-specific analytics  
   už reálne existujú.  
7. Reporting dnes ešte stále trpí:  
* usage-first optikou,  
* nejednotným CAP,  
* slabou interpretáciou ROI,  
* chýbajúcim confidence framingom,  
* a slabým executive storytellingom.

Ale zároveň:  
 to nie je greenfield.  
 To je „high-potential fragmented intelligence layer“.

A to je obrovský rozdiel.

Som pripravený na zadanie/report direction.

prvy krok je prebrat task \- datahub tvrdi ze tomu "nerozumie" a ako lukas spominal mam to upravit tak, aby to bolo jasnejsie. Toto je alga a omega \= dat poziadavku na data. Potom ich mozeme interpretovat

Áno. Toto je presne kritický bod.

Ak DataHub tím „tomu nerozumie“, problém pravdepodobne nie je v dátach samotných, ale v tom, že task momentálne mieša:

* business interpretáciu,  
* produktový zámer,  
* reporting UX,  
* ROI hypotézy,  
* adoption logiku,  
* a technické data requirements

do jedného dokumentu.

Výsledok:  
 DataHub nevie:

* čo je MUST HAVE,  
* čo je KPI,  
* čo je len business hypotéza,  
* čo už existuje,  
* čo treba dopočítať,  
* čo je source of truth,  
* a čo je iba budúci smer.

A Lukáš má podľa mňa pravdu:  
 najprv treba vyrobiť čistý DATA REQUEST CONTRACT.

Nie „víziu reportu“.

Ale:

* aké entity,  
* aké metriky,  
* aké join keys,  
* aké filtre,  
* aké denominátory,  
* aké časové logiky,  
* aké outputy.

Toto je alfa a omega.

Momentálne dokument pôsobí skôr ako:  
 „produktový brainstorming \+ reporting vízia \+ business poznámky“.

DataHub potrebuje:  
 „presný analytický kontrakt“.

A úprimne:  
 to je presne tvoja silná stránka.

Lebo ty už rozmýšľaš:

* article-centric,  
* state-centric,  
* adoption denominator,  
* CAP logic,  
* impact attribution,  
* runtime vs published impact.

To je level vyššie než bežný reporting task.

Najväčšie problémy aktuálneho tasku, ktoré vidím:

1. Mieša sa usage vs impact  
    Toto musí byť striktne oddelené.

Príklad:

* adoption\_rate,  
* unique\_users,  
* tool\_usage

≠

* CTR uplift,  
* revenue impact,  
* engagement delta,  
* ROI.

To sú 2 úplne odlišné vrstvy.

2. Nie je explicitný source of truth  
    Napr:  
* ArticleMessage?  
* AiFeaturesUsageLog?  
* DataHub article performance?  
* GA?  
* revenue table?  
* publishing table?

Ty to chápeš.  
 DataHub možno nie.

3. CAP logika je opísaná produktovo, nie analyticky  
    Ty vieš čo myslíš.  
    Ale analytik potrebuje:  
* exact inclusion rules,  
* exclusion rules,  
* canonical denominator definition.  
4. Chýba separácia:  
    EXISTUJE vs TREBA DODAŤ vs HYPOTÉZA  
    To je veľmi dôležité.

Inak DHUB nevie:

* čo už majú,  
* čo majú postaviť,  
* čo je future direction.  
5. Nie je jasný grain dát  
    Toto je kritické.

Treba povedať:

* article-level?  
* author-level?  
* monthly aggregate?  
* tool-event-level?  
* publish-day-level?

Bez toho vznikne chaos.

6. Chýba canonical metric dictionary  
    Napr:  
* adoption\_rate,  
* AI\_article,  
* AI\_usage,  
* accepted,  
* ignored,  
* AI-assisted article,  
* CAP article.

To všetko musí mať presnú definíciu.

Podľa mňa správny ďalší krok je:

Rozdeliť to na 4 vrstvy:

1. Executive intent  
    Prečo sa to robí.  
2. Data contract  
    Presne čo potrebujeme.  
3. Metric definitions  
    Ako sa to počíta.  
4. Future / optional directions  
    ROI hypotézy, impact layer, validation layer.

A až potom:

* dashboardy,  
* vizualizácie,  
* storytelling,  
* Penta reporting.

Inak bude DataHub stále hovoriť:  
 „nerozumieme tomu“.

A úprimne:  
 majú na to dôvod.

Dobre, teraz je len velmi dolezite nevymyslat nic nove, potrebujeme data ktore su dostupne (na druhej strane musi DH tieto data mat, viem ze na vyziadanie to vedia prepojit aj s "performance analytikami webu" a potrebujeme navrhnut kontrakt ktory bude jasny (nie zbytocne obrovsky, treba sa zamerat na to co bude mat prinos do prezentacie a hodnotu)

Presne. Toto je teraz najdôležitejší mantinel:

Nepostaviť „future AI intelligence architecture task“.  
 Postaviť:

* realistický,  
* zrozumiteľný,  
* implementovateľný  
   DATA REQUEST pre DataHub.

A hlavne:  
 iba nad dátami, ktoré:

* existujú,  
* alebo sú reálne dostupné cez existujúce väzby.

Toto je podľa mňa správny framing:

Nie:  
 „čo všetko by sme raz mohli merať“

Ale:  
 „aké dôveryhodné AI reporting pohľady vieme postaviť dnes pre Pentu.“

A to je obrovský rozdiel.

Momentálne by som striktne držal scope iba na:

1. USAGE LAYER  
    Čo redaktori používali.  
2. ADOPTION LAYER  
    Ako sa AI správanie mení v čase.  
3. ARTICLE PERFORMANCE COMPARISON LAYER  
    Ako sa správajú AI-assisted články vs non-AI články.

Nie:

* causal AI attribution,  
* advanced ROI,  
* recommendation intelligence,  
* predictive scoring,  
* AI learning loops.

To je mimo scope.

A veľmi dôležité:  
 DataHub tím musí dostať kontrakt v jazyku analytiky.  
 Nie v jazyku produktu alebo AI stratégie.

To znamená:

* grain,  
* joins,  
* filtre,  
* metric definitions,  
* dimensions,  
* outputs.

Nič viac.

Podľa mňa by finálny DATA REQUEST mal mať max 4 sekcie:

1. CIEĽ REPORTINGU  
2. SOURCE OF TRUTH  
3. REQUIRED DATASETS & METRICS  
4. OPEN DATA GAPS

Hotovo.

A teraz najdôležitejšia vec:

Vy už dnes máte pravdepodobne dosť dát na veľmi silnú prezentáciu pre Pentu.

Prečo?

Lebo už existuje:

* AI usage adoption,  
* article AI identity,  
* per-tool usage,  
* author adoption evolution,  
* AI vs non-AI article performance,  
* revenue comparison,  
* article-level joins,  
* publish history,  
* article metadata,  
* tool-level usage trends.

To je na enterprise reporting veľmi veľa.

Len to dnes nie je:

* správne zarámované,  
* metricky očistené,  
* a dôveryhodne interpretované.

A toto je podľa mňa úplne kritické:

Penta nebude najviac zaujímať:  
 „koľko AI toolov máme“.

Pentu bude zaujímať:

* adopcia redakciou,  
* zmena workflow,  
* rozsah používania,  
* konzistentnosť používania,  
* business scale,  
* a či to má reálny operational impact.

To znamená:  
 oveľa väčšiu hodnotu môže mať:

* AI adoption maturity,  
* penetration across newsroom,  
* behavior change,  
* AI-assisted publishing scale,  
* consistency of usage

ako nejaké pochybné:  
 „AI zvýšila revenue o 17 %.“

A úprimne:  
 to je správne.  
 Lebo to je dôveryhodné.

Takže scope by som držal veľmi pragmatický:

SAFE:

* adoption,  
* usage,  
* scale,  
* penetration,  
* AI vs non-AI descriptive comparison.

UNSAFE:

* causal claims,  
* ROI certainty,  
* uplift claims,  
* productivity certainty bez benchmark metodiky.

A toto bude podľa mňa veľmi silný reporting framework pre vedenie.


----------------------------------------–

SUMAR

Toto sú podľa mňa najdôležitejšie insighty z celého chatu, ktoré by mali ísť do Cursor zadania:

Existing AI usage/adoption reporting už existuje a nie je predmetom redesignu.
Current dashboards sú postavené hlavne nad ArticleMessage / AI usage layer.
Scope NIE JE vytvoriť nový AI analytics system.
Scope NIE JE unifikovať performance metrics naprieč všetkými AI features.
Scope NIE JE riešiť recommendation lifecycle (accept/ignore/reject).
Scope NIE JE causal AI attribution alebo garantované ROI tvrdenia.
Potrebujeme recurring enrichment layer nad existujúcim usage reportingom.
Cieľ je prepájať dostupné performance signals s AI usage vrstvou tam, kde existujú.
Performance signals môžu byť feature-specific.
Nie všetky AI features budú mať rovnaké performance metriky.
Nie všetky AI features musia mať performance enrichment.
Missing metrics sú akceptované a nie sú blocker.
Article-centric grain je preferovaný základ datasetu.
article_id/document_id je hlavný join key.
Potrebujeme stabilný recurring export/dataset, nie nutne nový dashboard.
Dataset môže byť monthly recurring snapshot.
CSV/Looker dataset/export je dostatočný MVP output.
Dôležitá je konzistentnosť shape-u, nie perfektnosť dát.
Interpretation layer môže byť mimo DHUB (custom app/reporting).
DHUB dodáva truth layer, nie management storytelling.
Reporting musí byť descriptive/comparative, nie causal.
Available performance signals > unified AI ROI framework.
Current goal = Penta reporting + základ budúceho recurring AI reporting layeru.
Rozšírenia typu accept/ignore/recommendation lifecycle sú future direction mimo aktuálny scope.
Scope musí byť malý, realistický a implementovateľný bez veľkého redesignu infra.
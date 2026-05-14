# DHUB-3138 — Pent dodanie (Jira štruktúra)

**Účel:** Text do Jiry **bez Confluence**.

**Štruktúra:**

| Úroveň | Čo to je |
|--------|-----------|
| **DHUB-3138** | **Hlavný task** (parent) — drží zodpovednosť za celé Pent zadanie voči DataHubu. |
| **Sub-task pod DHUB-3138** | **Náš návrh** — detailný scope, metodika, moduly, acceptance (copy-paste nižšie). |

**Komunikácia s DH:** Parent ostáva kontajner; konkrétna práca a kritériá sú v subtasku. **Neprepájať** s neskoršou samostatnou DH témou (recurring prepojenie CMS usage ↔ web performance dataset) — tá príde až po Pent vo vlastnom tickete.

---

## Moduly — rozšírené **performance** signály v tomto kole

*(pre ostatné AI nástroje stačí v tomto kole adopcia / usage podľa Časti A; rozšírené web metriky štandardne nežiadať)*

| AI modul / feature | Poznámka |
|-------------------|----------|
| **Tag Generator** | Doplnenie dostupných performance polí tam, kde viete priradiť k článku / použitiu nástroja. |
| **Poll Generator** | Obdobne. |
| **Related articles auto-suggestion** | Obdobne. |
| **Video subtitles Generator** | Obdobne (kde existujú merateľné signály). |
| **Audio Transcript** | Obdobne (kde existujú merateľné signály). |

---

## Copy-paste — Parent: **DHUB-3138** (hlavný task)

### Summary (pole Summary na DHUB-3138)

```
Penta — DataHub: podklady AI reporting (adopcia + performance pre vybrané moduly)
```

### Description (pole Description na DHUB-3138)

```
Kontajner: jednorazové dodanie reportingových podkladov pre Pentu (DataHub).

Detailný scope, technická metodika a acceptance sú v priradenom subtasku (návrh produkt / NMH).
```

---

## Copy-paste — **Sub-task** (dieťa pod DHUB-3138)

*V Jire pri vytváraní subtasku nastaviť **Parent link** na **DHUB-3138**.*

### Summary (pole Summary na subtasku)

```
[Penta] AI reporting — adopcia (CAP/eligible) + performance enrichment (5 modulov)
```

### Description (pole Description na subtasku)

```
Parent: DHUB-3138.

=== Kontext a rozsah ===
Jednorazové dodanie podkladov pre management reporting (Penta). Nižšie je implementačný návrh pre parent DHUB-3138: existujúce zdroje a súčasný AI reporting, rozšírený o uvedenú metodiku tam, kde je technicky realizovateľné v krátkom čase.

=== Časť A — Usage / adopcia (všetky AI nástroje v súčasnom reportingu) ===
Grain a zdroje:
• Preferovaný výstup: konzistentný s aktuálnym AI dashboardom / reportingom (mesačná alebo dohodnutá periodicita ako doteraz).
• Kanonický článkový kľúč pre väzbu usage ↔ článok: ArticleDocumentId / article_id (alebo ekvivalent, ktorý používate ako SoT).

Eligible vzorka / CAP (per AI feature):
• Pre každý nástroj definovať použiteľnú bázu článkov (eligible / CAP): kde bol nástroj produktovo zmysluplne použiteľný (typ obsahu, formát, výnimky napr. kvíz, PR — podľa doterajších pravidiel v AI reportingu).
• Adoption metriky: použité vs eligible v rámci rovnakej definície CAP pre daný nástroj (bez zmeny základnej metriky, ktorú používate dlhodobo stabilne).

Výstup:
• Prehľadnejšie tabuľky a grafy adopcie naprieč nástrojmi; štruktúra predvídateľná medzi behmi rovnakého výstupu.

=== Časť B — Performance signály + deskriptívne porovnanie (iba nasledujúcich 5 modulov) ===
Moduly: Tag Generator; Poll Generator; Related articles auto-suggestion; Video subtitles Generator; Audio Transcript.

Dátové vrstvy (terminológia):
• Usage / CMS vrstva: či a ako bola feature použitá na článku (existujúce logy / značenia).
• Performance vrstva: metriky po publikácii priraditeľné k článku z web analytiky / DH (views, engagement, CTR, revenue alebo iné — podľa dostupnosti vášho stacku).

Join:
• Spoločný grain na úrovni článku (alebo explicitne dohodnutý agregát); join usage a performance cez rovnaký článkový ID ako v Časti A.

Enrichment:
• K riadku článku (pre uvedených päť modulov) doplniť dostupné performance polia tam, kde ich viete v danom časovom okne spočítať; nie všetky moduly nemusia mať rovnakú sadu metrik — chýbajúce pole nie je blokér, označiť medzeru v dokumentácii výstupu.

Deskriptívna komparačná logika (nie causal, nie „AI zdvihla X %“):
• Základná báza pre akékoľvek „used vs not-used“ pohľady na performance je tá istá eligible/CAP definícia ako pre adopciu daného modulu v Časti A.
• Preferovaný rez pre Pent podklady: within eligible + rovnaké reportovacie obdobie — články s použitím feature vs články bez použitia, oboje len vnútri eligible.
• Alternatívne rezy (voliteľné, ak stihnuteľné): before/after obdobia okolo rolloutu; čistý adoption trend bez performance baseline. Každý použitý rez musí byť v krátkej poznámke k výstupu explicitne popísaný (kto je v kohorte, aké časové okno, used/not-used definícia).

Baseline / čas:
• Nevyžadujeme jednu „večnú“ baseline ani jednotný model pre všetky nástroje naraz.
• Porovnania sú časovo viazané (jasné obdobie alebo okno po publishi, ak sa používa) a špecifické pre daný modul; rovnakú comparison logiku držať konzistentne v rámci jedného dodaného výstupu.
• Ak mesiac-o-mesiac vývoj nemá jednoduchú interpretáciu, stačí transparentne dokumentovať použitú logiku namiesto hľadania univerzálnej baseline.

Neúplnosť dát:
• Nie všetky performance metriky musia byť pre všetkých päť modulov dostupné; priorita: stabilná štruktúra výstupu a čitateľné označenie medzier.

=== Mimo rozsahu tohto subtasku ===
• Causal závery, garantované ROI, jednotný impact framework pre všetky AI features.
• Samostatný projekt na recurring „dataset prepojenia oboch vrstiev“ nad rámec Pent podkladov — predmet ďalšej dohody (budúci DH ticket).

=== Deliverable ===
• Dohodnutý formát (tabuľka / export / úprava dashboardu) + grafy pre Pentu podľa potreby produktu.
• Krátka metodická poznámka pri výstupe: grain, kľúče, CAP stručne per modul kde relevantné, použitá comparison logika pre Časť B, známe medzery.

=== Acceptance ===
• Produkt (NMH) potvrdí: Časť A zodpovedá doterajšiemu AI reportingu s CAP/eligible pravidlami; Časť B obsahuje dostupné performance enrichment + dokumentovanú deskriptívnu comparison logiku pre uvedených päť modulov v dohodnutom rozsahu.
```

---

*Interný súbor v repo: **DHUB-3138** = parent; dlhý text = **subtask**. Produktové CMS backlog referencie zostávajú mimo Jiry.*

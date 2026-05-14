# AI reporting — Phase 2 (po Pent): rozšírený operačný návrh

**Status:** **Interné** — nepísať do **DHUB-3138** ani Pent **subtasku**. Ide o podklad na „upratovanie“ po dodaní Pent podkladov (recurring dataset, metodika rezov, dokumentácia medzier).

**Konceptuálny rámec:** [`DataHub_AI_Usage_Performance_Bridge_Framing.md`](./DataHub_AI_Usage_Performance_Bridge_Framing.md).

---

Nižšie text **presunutý** z pôvodného dlhého Pent subtasku — zostáva ako hodnotný checklist pre ďalší krok s DH, keď už budú dáta vonku a bude zmysel riešiť grain, join, komparačné rezy a baseline dokumentáciu explicitne.

---

## Časť A — Usage / adopcia (rozšírený operačný popis)

**Výstup a zdroje**

- Konzistentné s aktuálnym AI dashboardom / reportingom (mesačná alebo dohodnutá periodicita).
- Článkový kľúč pre väzbu usage ↔ článok: ArticleDocumentId / article_id (alebo ekvivalent SoT).

**Eligible vzorka / CAP (per AI feature)**

- Pre každý nástroj: použiteľná báza článkov (eligible / CAP) — kde bol nástroj produktovo zmysluplne použiteľný (typ obsahu, formát, výnimky napr. kvíz, PR — podľa pravidiel AI reportingu).
- Adoption metriky: použité vs eligible v rámci rovnakej CAP definície pre daný nástroj (stabilita základnej metriky).

**Výstup**

- Prehľadné tabuľky a grafy adopcie; predvídateľná štruktúra medzi behmi.

---

## Časť B — Performance polia + rezy na výkon (rozšírený operačný popis)

**Moduly** (priorita enrichment): Tag Generator; Poll Generator; Related articles auto-suggestion; Video subtitles Generator; Audio Transcript.

**Čo ku článku skladať**

- Či / ako bola feature použitá v CMS (existujúce logy).
- Web metriky po publikácii, ktoré viete priradiť k článku (views, engagement, CTR, revenue — podľa stacku).

**Spájanie**

- Oblasť článku (alebo dohodnutý agregát); rovnaký článkový identifikátor ako pri adopcii.

**Doplnenie polí**

- Pre uvedených päť modulov doplniť dostupné performance polia; neúplná sada nie je blokér — medzery označiť.

**Rezy („used vs not-used“ na výkon)**

- Vychádzať z rovnakej eligible/CAP bázy ako adopcia daného modulu.
- Typicky: v jednom období, v rámci eligible — články s použitím feature vs bez použitia (definície stručne uviesť pri výstupe).
- Voliteľné: pred/po rolloute; alebo len časový rad adopcie bez výkonnostného rezu. Každý použitý rez: krátky popis kohorty a časového okna.

**Čas a baseline**

- Nie jedna fixná baseline pre všetky nástroje navždy.
- Porovnania viazané na obdobie a modul; rovnaká logika v rámci jedného výstupu; radšej popísať ako obhájiť univerzálnu baseline.

**Neúplnosť**

- Stabilná štruktúra výstupu + viditeľné medzery.

---

## Mimo Phase 2 „strict“ scope (zámerne neskôr)

- Causal závery, garantované ROI, jednotný impact framework pre všetky AI features.
- Samostatný projekt recurring „datasetu prepojenia oboch vrstiev“ ako vlastný DH ticket po dohode.

---

## Deliverable (Phase 2)

- Opakovateľný výstup (CSV / tabuľka / Looker podľa dohody).
- Krátka dokumentácia: úroveň výstupu (článok vs agregát), kľúče, CAP tam kde treba, aké rezy boli použité, známe medzery.

## Acceptance (Phase 2)

- Produkt potvrdí čitateľnosť pre reporting a zrozumiteľný popis metodiky (eligible + použité rezy + medzery).

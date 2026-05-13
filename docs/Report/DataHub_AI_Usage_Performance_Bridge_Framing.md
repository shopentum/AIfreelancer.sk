# AI reporting — framing pre DataHub (usage ↔ performance)

**Účel dokumentu:** Dať DataHub tímu **pokoj, jasnosť a implementovateľnosť**. Nie strategickú víziu ani architektúru celého AI reportingu NMH.

**Súvislosť:** Produktové zadanie [**CMSB-1810**](./task+kontext+gpt.md) (ROI / Adoption reporting). Tento súbor **zužuje jazyk a očakávania** tak, aby z neho šiel spraviť krátky **data request** bez miešania s „impact“ narratívou.

---

## 1. Čo presne teraz robíme

Budujeme **stabilný opakujúci sa analytický most** medzi:

- **usage / adoption vrstvou** (čo redaktori v CMS použili, na ktorých článkoch, v akom kontexte podľa existujúceho merania), a  
- **dostupnými performance signálmi** z web analytiky / DataHubu tam, kde už existujú alebo ich viete **realisticky** dopojiť.

To **nie je** definícia „finálneho AI reporting frameworku“ pre NMH. To je **jeden konkrétny, úzky produktový krok**: dataset (napr. mesačný export / Looker dataset) s predvídateľným tvarom.

---

## 2. Slovník — zámerne nie „impact“

| Namiesto (vyhýbať sa ako hlavnému rámcu) | Používať |
|----------------------------------------|----------|
| impact (v zmysle „AI dopad“, biznis attribution) | **performance signals**, **deskriptívne porovnanie**, **enrichment** |

**Prečo:** slovo *impact* u analytikov často spúšľa očakávanie **causal inference**, **attribution** a **ROI istoty**. To **nie je** cieľ tohto kroku.

**Čo chceme:**

- **Deskriptívne porovnanie** v rámci **rovnakej eligible bázy** pre daný nástroj (pozri §4–5), nie globálny zmiešaný web — tam, kde sú k dispozícii **performance signály** (views, CTR, engagement, revenue kde je definované — podľa toho, čo DH skutočne vie dodať).  
- **Enrichment:** pridanie dostupných performance polí k riadku článku (alebo agregátu podľa dohodnutého **grain**), nie výklad príčinnosti.

---

## 3. Dve vrstvy, jeden článkový kľúč

**Kľúčové pomenovanie pre enterprise alignment:**

- **Usage analytics** (správanie v CMS, nástroje, adopcia) **≠** **performance analytics** (správanie obsahu po publikácii podľa web metrík).  
- **Obidve vrstvy** sa dajú **prepájať article-centric joinom** (napr. kanonický document / article identifikátor podľa dohody Core + DH).

Performance vrstva je **samostatná, jasne definovaná** časť požiadavky — nie zmiešanie do jedného zmätočného „AI impact“ pojmu.

---

## 4. Eligible sample a CAP per AI feature

Pre **adopciu** aj pre **deskriptívne porovnanie performance signálov** je potrebné **per AI feature** definovať **eligible sample** (niekedy označovaný ako **CAP / použiteľná báza**): množina článkov (alebo publikačných jednotiek), kde bola daná feature **reálne použiteľná** podľa produktovo‑analytických pravidiel (typ článku, povaha, zdroj, výnimky ako kvíz / PR — podľa [**CMSB-1810**](./task+kontext+gpt.md)).

**Bez toho nie je možné korektne:**

- počítať adoption ako použité / eligible, ani  
- robiť **deskriptívne** porovnanie performance iba na zmysluplnej kohortnej báze.

Porovnávajú sa teda články **vnútri rovnakej eligible definície** pre daný nástroj, nie „všetky články na webe“ zmiešané s článkami, kde nástroj vôbec nemohol platiť.

---

## 5. Čo momentálne riešime ako dáta a čo s čím porovnávame

**Čo máme / čo buduje DH v prvom kroku:**

- **Súčasná usage vrstva:** dostupné logy / article‑centric značky použitia AI nástrojov v CMS (podľa vášho kanonického zdroja pravdy).  
- **Performance signály:** to, čo DH alebo prepojená web analytika **už vie** priradiť k článku (grain ostáva článok alebo dohodnutý agregát).

**Komparačná logika (deskriptívna, nie causal):**

- Základ je **eligible výber pre daný feature** (pozri §4).  
- Typické porovnanie v rámci tej istej eligible bázy: články **s použitím** danej feature vs články **bez použitia**, ale **oboje iba tam, kde bola feature použiteľná** — alebo iný rozumný rez definovaný v **metric dictionary** (napr. rovnaký typ obsahu, rovnaké časové okno po publishi).  
- Presný operačný tvar (jedna tabuľka vs dva výrezy vs flagové stĺpce) je súčasťou krátkeho **data requestu**; tento dokument len stanovuje **pravidlo**: *eligible definuje bázu pre adopciu aj pre deskriptívne performance zarovnanie.*

Ak niektorý porovnávací rez nie je v prvom kole dostupný, **neznamená to stopnutie datasetu** — zmysel má stále článkový riadok s usage + dostupnými performance poľami a transparentnou medzerou v komparačnej dimenzii.

---

## 6. Performance vrstva môže byť nekompletná

**Explicitne:**

- **Nie všetky AI features musia mať dostupné performance metriky.**  
- **Chýbajúce metriky nie sú blokér pre vznik ani dodanie datasetu.**

Metriky môžu byť **feature-specific**; nie je povinné mať jednotný rámec pre všetky nástroje naraz.

---

## 7. Shape > completeness

**Priorita:**

1. **Opakujúci sa**, **stabilný**, **rozšíriteľný shape** výstupu (stĺpce, grain, kľúče, verzia schémy).  
2. Až potom „úplnosť“ každého poľa.

**Nie je cieľ:** dokonalý, úplne vyplnený dataset v prvej vlne.  
**Je cieľ:** dataset, ktorý sa dá **mesačne / pravidelne** generovať rovnakým spôsobom a na ktorý sa dá bez rozbitia dopĺňať ďalšie performance signály.

---

## 8. Disciplína scope (čo do tohto kroku nepatrí)

Do tohto **bridge** kroku **nepatri**:

- záväzný **causal** záver „AI zvýšila X o Y %“,  
- garantované **ROI** ani jednotný „impact framework“ pre všetky features,  
- návrh **finálneho** dlhodobého AI BI pre celú redakciu.

Patrí sem:

- truth layer + **deskriptívny / komparatívny** obsah podľa dostupných dát,  
- transparentné označenie **dátových medzier**.

---

## 9. Ďalší krok (pre DHUB)

Skrátený **data request** v jazyku analytiky: grain, join kľúče, **eligible sample / CAP definícia per feature** (inclusion / exclusion v analytickom zápise), zdroje pre usage vrstvu, zdroje pre performance signály, definícia **deskriptívnej komparačnej bázy** (used vs not-used within eligible, prípadné časové okná), povinné vs voliteľné polia, periodicita exportu. Detailné KPI reporting UX zostáva v zadaní [**CMSB-1810**](./task+kontext+gpt.md); **tento framing** fixuje očakávania a tlak na implementáciu.

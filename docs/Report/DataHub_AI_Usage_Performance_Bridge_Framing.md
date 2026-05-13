# AI reporting — framing pre DataHub (usage ↔ performance)

**Účel dokumentu:** Dať DataHub tímu **pokoj, jasnosť a implementovateľnosť**. Nie strategickú víziu ani architektúru celého AI reportingu NMH.

**Súvislosť:** Produktové zadanie a kontext v [`task+kontext+gpt.md`](./task+kontext+gpt.md) (JIRA — ROI / Adoption). Tento súbor **zužuje jazyk a očakávania** tak, aby z neho šiel spraviť krátky **data request** bez miešania s „impact“ narratívou.

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

- **Deskriptívne porovnanie** napr. článkov / kohort s dostupnými AI usage značkami vs bez nich — tam, kde sú k dispozícii rovnaké **performance signály** (views, CTR, engagement, revenue kde je definované — podľa toho, čo DH skutočne vie dodať).  
- **Enrichment:** pridanie dostupných performance polí k riadku článku (alebo agregátu podľa dohodnutého **grain**), nie výklad príčinnosti.

---

## 3. Dve vrstvy, jeden článkový kľúč

**Kľúčové pomenovanie pre enterprise alignment:**

- **Usage analytics** (správanie v CMS, nástroje, adopcia) **≠** **performance analytics** (správanie obsahu po publikácii podľa web metrík).  
- **Obidve vrstvy** sa dajú **prepájať article-centric joinom** (napr. kanonický document / article identifikátor podľa dohody Core + DH).

Performance vrstva je **samostatná, jasne definovaná** časť požiadavky — nie zmiešanie do jedného zmätočného „AI impact“ pojmu.

---

## 4. Performance vrstva môže byť nekompletná

**Explicitne:**

- **Nie všetky AI features musia mať dostupné performance metriky.**  
- **Chýbajúce metriky nie sú blokér pre vznik ani dodanie datasetu.**

Metriky môžu byť **feature-specific**; nie je povinné mať jednotný rámec pre všetky nástroje naraz.

---

## 5. Shape > completeness

**Priorita:**

1. **Opakujúci sa**, **stabilný**, **rozšíriteľný shape** výstupu (stĺpce, grain, kľúče, verzia schémy).  
2. Až potom „úplnosť“ každého poľa.

**Nie je cieľ:** dokonalý, úplne vyplnený dataset v prvej vlne.  
**Je cieľ:** dataset, ktorý sa dá **mesačne / pravidelne** generovať rovnakým spôsobom a na ktorý sa dá bez rozbitia dopĺňať ďalšie performance signály.

---

## 6. Disciplína scope (čo do tohto kroku nepatrí)

Do tohto **bridge** kroku **nepatri**:

- záväzný **causal** záver „AI zvýšila X o Y %“,  
- garantované **ROI** ani jednotný „impact framework“ pre všetky features,  
- návrh **finálneho** dlhodobého AI BI pre celú redakciu.

Patrí sem:

- truth layer + **deskriptívny / komparatívny** obsah podľa dostupných dát,  
- transparentné označenie **dátových medzier**.

---

## 7. Ďalší krok (pre DHUB)

Skrátený **data request** v jazyku analytiky: grain, join kľúče, zdroje pre usage vrstvu, zdroje pre performance signály, povinné vs voliteľné polia, periodicita exportu. Detailné KPI reporting UX zostáva v produktovom tasku; **tento framing** fixuje očakávania a tlak na implementáciu.

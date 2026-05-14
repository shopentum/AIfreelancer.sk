# AI reporting — framing pre DataHub (usage ↔ performance)

**Status dokumentu:** **Interný** (produkt / analytika). **S DHUB sa táto téma vôbec neprepája** — ani slovkom, ani odkazom v rámci **DHUB-3138** (Penta). Komunikácia s DataHubom pri Pent dodaní je výhradne podľa [`DHUB-3138_Penta_Data_Delivery.md`](./DHUB-3138_Penta_Data_Delivery.md). Samostatný **nasledujúci** DH ticket / diskusia (recurring dataset usage ↔ performance nad rámec Pent podkladov) je iná práca a **nie je** závislá od tohto dokumentu z pohľadu DH.

**Účel dokumentu:** Zjednotiť jazyk, scope a analytické očakávania **vnútorne** pri príprave ďalšieho kroku po Pent: stabilné prepojenie AI usage s performance signálmi.

**Súvislosť:** Produktové zadanie **CMSB-1810** (ROI / Adoption — širší kontext v repo). Pent operatíva: **DHUB-3138** — samostatný súbor vyššie; **netýka sa** obsahu tohto framing dokumentu z pohľadu DH komunikácie.

---

## 1. Čo presne teraz robíme

Budujeme **stabilné opakované analytické prepájanie** medzi:

- **usage / adoption vrstvou** (čo redaktori v CMS použili, na ktorých článkoch, v akom kontexte podľa existujúceho merania), a  
- **dostupnými performance signálmi** z web analytiky / DataHubu tam, kde už existujú alebo ich viete **realisticky** dopojiť.

To **nie je** definícia „finálneho AI reporting frameworku“ pre NMH. To je **jeden konkrétny, úzky produktový krok**: **stabilný recurring dataset** (napr. mesačný export / Looker dataset) s **konzistentnou štruktúrou**.

---

## 2. Slovník — zámerne nie „impact“

Nevnímať primárne ako:
jednotný AI impact / ROI reporting  
Preferovaný rámec: **performance signals**, **popisné (deskriptívne) porovnanie**, **performance enrichment**

Cieľom aktuálneho kroku nie je definovať jednotný AI impact alebo attribution framework naprieč všetkými AI features.

Fokus je na:

prepájaní existujúcej AI usage vrstvy s dostupnými performance signálmi,  
popisnom porovnávaní v rámci rovnakej eligible bázy,  
a vytvorení **opakovateľného** reporting datasetu nad dostupnými dátami.

**Čo potrebujeme:**  
Popisné porovnanie v rámci **rovnakej eligible bázy** pre daný nástroj (pozri §4–6), nie globálny zmiešaný web - tam, kde sú k dispozícii **performance signály** (views, CTR, engagement, revenue kde je definované — podľa toho, čo DH skutočne vie dodať). **Enrichment:** pridanie dostupných performance polí k riadku článku (alebo agregátu podľa dohodnutého **grain**), nie výklad príčinnosti.

---

## 3. Dve vrstvy, jeden článkový kľúč

**Kľúčové pomenovanie pre enterprise alignment:**

- **Usage analytics** (správanie v CMS, nástroje, adopcia) ≠ **performance analytics** (správanie obsahu po publikácii podľa web metrík).  
- Usage a performance vrstva sa prepájajú cez existujúci spoločný **ArticleDocumentId / article_id.**

Performance vrstva je **samostatná, jasne definovaná**, nie zlučovanie usage a performance vrstvy do jedného všeobecného „AI impact“ rámca.

---

## 4. Eligible sample a CAP per AI feature

Pre **adopciu** aj pre **popisné porovnanie performance signálov** je potrebné **per AI feature** definovať **eligible sample** (označovaný ako **CAP / použiteľná báza**): množina článkov (alebo publikačných jednotiek), kde bola daná feature **reálne použiteľná** podľa produktovo‑analytických pravidiel (typ článku, povaha, zdroj, výnimky ako kvíz / PR — podľa **CMSB-1810**).

**Bez toho nie je možné korektne:**

- počítať adoption ako použité / eligible, ani  
- robiť zmysluplné porovnanie performance iba na adekvátnej kohortnej báze.

Porovnávajú sa teda články **vnútri rovnakej eligible definície** pre daný nástroj, nie „všetky články na webe“ zmiešané s článkami, kde nástroj vôbec nemohol platiť.

---

## 5. Čo momentálne riešime ako dáta a čo s čím porovnávame

**Čo máme / čo buduje DH v prvom kroku:**

- **Súčasná usage vrstva:** dostupné logy / article‑centric značky použitia AI nástrojov v CMS (podľa vášho kanonického zdroja pravdy).  
- **Performance signály:** to, čo DH alebo prepojená web analytika **už vie** priradiť k článku (grain ostáva článok alebo dohodnutý agregát).

**Komparačná logika (popisná, nie causal):**

- Základ je **eligible výber pre daný feature** (pozri §4).  
- Typické porovnanie v rámci tej istej eligible bázy: články **s použitím** danej feature vs články **bez použitia**, ale **oboje iba tam, kde bola feature použiteľná** — alebo iný rozumný rez definovaný v **metric dictionary** (napr. rovnaký typ obsahu, rovnaké časové okno po publishi).  
- Presný operačný tvar (jedna tabuľka vs dva výrezy vs flagové stĺpce) je súčasťou krátkeho **data requestu**; tento dokument len stanovuje **pravidlo**: *eligible definuje bázu pre adopciu aj pre popisné zarovnanie performance.*

Ak niektorý porovnávací rez nie je v prvom kole dostupný, **neznamená to stopnutie datasetu** — zmysel má stále **riadok datasetu na úrovni článku** s usage + dostupnými performance poľami a **explicitne označená medzera** v komparačnej dimenzii.

---

## 6. Baseline, čas a komparačná logika

**Legitímna otázka DataHubu:** ako sa má správať „baseline“ mesiac oproti mesiacu oproti aktuálnym dátam - či existuje jedna statická baseline.

**Zámer tohto dokumentu:** problém **nemusíte** vyriešiť jednou večnou metodikou; stačí ho **správne zarámovať**.

Pri adopcii AI sa systém **prirodzene mení v čase** (rollouty feature, používatelia, workflow, obsah, sezónnosť, traffic). Preto „baseline z januára“ nemusí byť analyticky relevantná v júli — a to je **normálne**. Pokus o **jednu univerzálnu baseline pre všetky AI features** často vedie k **metodickým problémom** alebo **nepresným porovnaniam**.

**Porovnania v tomto kroku sú:**

- **časovo viazané** (jasné reportovacie obdobie alebo okno),
- **špecifické pre daný nástroj** (feature-specific),
- **viazané na aktuálne definovanú eligible bázu** (§4).

**Cieľom aktuálneho kroku nie je vedecká causal analýza, ale metodicky jasný a čitateľný reporting pre vedenie** — s porovnaniami, ktoré sú v rámci každého výstupu **stabilné a opakovateľné**. Baseline nemusí byť „dokonalá“; musí byť **interpretovateľná** a **rovnako použitá** v rámci daného reporting rez.

**Praktické typy rezov** (nie všetky naraz; výber podľa nástroja a otázky):

| Typ | Popis | Poznámka |
|-----|--------|-----------|
| **Within eligible, same period** | V jednom období (napr. mesiac): eligible články **s** použitím feature vs eligible **bez** použitia. | Najbezpečnejší **MVP** prístup k popisnému porovnaniu performance. |
| **Before / after rollout** | Obdobie pred vs po zavedení / rozšírení feature. | Užitočné selektívne; vyššie riziko zmien trafficu, sezónnosti, redakcie — treba zrozumiteľný popis v dokumentácii datasetu. |
| **Adoption trend** | Rast adopcie, penetrácie, „zrelosti“ autorov **bez** performance baseline. | Baseline výkonu často netreba; stačí **časový rad** usage/adoption. |

**Čo nepotrebujeme fixovať navždy:** jednu baseline metodiku pre všetky AI features.

**Čo potrebujeme:** pre každý reporting rez **explicitne uviesť comparison logic** (kto je v eligible, aké obdobie, used vs not-used alebo iný dohodnutý rez) a **držať ju rovnako** pri opakovaných exportoch, kým sa metodika zámerne nezmení.

**Komparačné bázy môžu byť špecifické pre nástroj a časovo viazané; cieľom aktuálneho kroku nie je definovať univerzálny causal baseline model pre všetky AI features.**

---

## 7. Performance vrstva môže byť nekompletná

**Explicitne:**

- **Nie všetky AI features musia mať dostupné performance metriky.**  
- **Chýbajúce metriky nie sú blokér pre vznik ani dodanie datasetu.**

Metriky môžu byť **špecifické pre nástroj**; nie je povinné mať jednotný rámec pre všetky nástroje naraz.

---

## 8. Shape > completeness

**Priorita:**

1. **Opakujúci sa**, **stabilný** výstup: predvídateľná **štruktúra datasetu** (stĺpce, grain, kľúče, verzia schémy) — **konzistentný formát** medzi behmi.  
2. Až potom „úplnosť“ vyplnenia jednotlivých polí.

**Nie je cieľ:** dokonalý, úplne vyplnený dataset v prvej vlne.  
**Je cieľ:** výstup, ktorý sa dá **mesačne / pravidelne** generovať rovnakým spôsobom a na ktorý sa dá bez rozbitia dopĺňať ďalšie performance signály.

---

## 9. Disciplína scope (čo do aktuálneho kroku nepatrí)

**Tento krok nezahŕňa:**

- záväzný **causal** záver „AI zvýšila X o Y %“,  
- garantované **ROI** ani jednotný „impact framework“ pre všetky features,
- **jednu univerzálnu baseline / komparačnú metodiku** naviazanú na všetky AI features navždy (pozri §6 — stačí jasne definovaný rez per výstup),
- návrh **finálneho** dlhodobého AI BI pre celú redakciu.

**Zahŕňa:**

- **stabilnú dátovú vrstvu** + **popisné / komparatívne** pohľady podľa dostupných dát,  
- **čitateľné** označenie **dátových medzier**.

---

## 10. Ďalší krok (interné — po Pent / mimo DHUB-3138)

Až po dodaní Pent podkladov cez **DHUB-3138** môže nasledovať samostatný technický request v jazyku analytiky podľa princípov tohto dokumentu (grain, join kľúče, CAP per feature, recurring výstup, dokumentácia medzier). **Do ticketu DHUB-3138 sa tento krok neprepája.**

Detailný KPI reporting UX ostáva súčasťou **CMSB-1810**.

---

## Príloha (interné)

**Copy-paste pre Jira (Penta):** výhradne **[`DHUB-3138_Penta_Data_Delivery.md`](./DHUB-3138_Penta_Data_Delivery.md)**. Tento framing súbor do DH komunikácie **nevkladať**.

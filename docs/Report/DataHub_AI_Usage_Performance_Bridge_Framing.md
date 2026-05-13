# AI reporting — framing pre DataHub (usage ↔ performance)

**Účel dokumentu:** Zjednotiť jazyk, scope a analytické očakávania medzi produktom a DataHub tímom. Definovať zrozumiteľný analytický framing a minimálny data request pre prepájanie existujúcej AI usage vrstvy s dostupnými performance signálmi.

**Súvislosť:** Produktové zadanie [CMSB-1810] (ROI / Adoption reporting). Tento dokument spresňuje jazyk, scope a dátové očakávania tak, aby z neho bolo možné pripraviť krátky a implementovateľný data request pre DataHub.

---

## 1. Čo presne teraz robíme

Budujeme **stabilný opakujúci sa analytický most** medzi:

- **usage / adoption vrstvou** (čo redaktori v CMS použili, na ktorých článkoch, v akom kontexte podľa existujúceho merania), a  
- **dostupnými performance signálmi** z web analytiky / DataHubu tam, kde už existujú alebo ich viete **realisticky** dopojiť.

To **nie je** definícia „finálneho AI reporting frameworku“ pre NMH. To je **jeden konkrétny, úzky produktový krok**: dataset (napr. mesačný export / Looker dataset) s predvídateľným tvarom.

---

## 2. Slovník — zámerne nie „impact“

Nevnímať primárne ako:
jednotný AI impact / ROI reporting
Preferovaný rámec: **performance signals, deskriptívne porovnanie, performance enrichment**

Cieľom aktuálneho kroku nie je definovať jednotný AI impact alebo attribution framework naprieč všetkými AI features.

Fokus je na:

prepájaní existujúcej AI usage vrstvy s dostupnými performance signálmi,
deskriptívnom porovnávaní v rámci rovnakej eligible bázy,
a vytvorení stabilného reporting datasetu nad dostupnými dátami.

**Čo potrebujeme:**
**Deskriptívne porovnanie** v rámci **rovnakej eligible bázy** pre daný nástroj (pozri §4–6), nie globálny zmiešaný web - tam, kde sú k dispozícii **performance signály** (views, CTR, engagement, revenue kde je definované - podľa toho, čo DH skutočne vie dodať). **Enrichment:** pridanie dostupných performance polí k riadku článku (alebo agregátu podľa dohodnutého **grain**), nie výklad príčinnosti.

---

## 3. Dve vrstvy, jeden článkový kľúč

**Kľúčové pomenovanie pre enterprise alignment:**

- **Usage analytics** (správanie v CMS, nástroje, adopcia) ≠ **performance analytics** (správanie obsahu po publikácii podľa web metrík).  
- Usage a performance vrstva sa prepájajú cez existujúci spoločný **ArticleDocumentId / article_id.**
Performance vrstva je **samostatná, jasne definovaná** časť požiadavky - nie zmiešanie do jedného zmätočného „AI impact“ pojmu.

---

## 4. Eligible sample a CAP per AI feature

Pre **adopciu** aj pre **deskriptívne porovnanie performance signálov** je potrebné **per AI feature** definovať **eligible sample** (označovaný ako **CAP / použiteľná báza**): množina článkov (alebo publikačných jednotiek), kde bola daná feature **reálne použiteľná** podľa produktovo‑analytických pravidiel (typ článku, povaha, zdroj, výnimky ako kvíz / PR - podľa **CMSB-1810**).

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

## 6. Baseline, čas a komparačná logika

**Legitímna otázka DataHubu:** ako sa má správať „baseline“ mesiac oproti mesiacu oproti aktuálnym dátam — či existuje jedna statická baseline.

**Zámer tohto dokumentu:** problém **úplne nemusiť** vyriešiť jednou večnou metodikou; stačí ho **správne zarámovať**.

Pri adopcii AI sa systém **prirodzene mení v čase** (rollouty feature, používatelia, workflow, obsah, sezónnosť, traffic). Preto „baseline z januára“ nemusí byť analyticky relevantná v júli — a to je **normálne**. Pokus o **jednu univerzálnu baseline pre všetko** je často analytický pas.

**Deskriptívne porovnania sú:**

- **časovo viazané** (explicitné reportovacie obdobie alebo okno),
- **feature-specific**,
- **závislé od aktuálne definovanej eligible bázy** (§4).

**Management reporting ≠ vedecký experiment.** Baseline nemusí byť „dokonalá“; musí byť **transparentná**, **konzistentná v rámci daného reporting rez** a **interpretovateľná** pre čitateľa výstupu.

**Praktické typy rezov** (nie všetky naraz; výber podľa nástroja a otázky):

| Typ | Popis | Poznámka |
|-----|--------|-----------|
| **Within eligible, same period** | V jednom období (napr. mesiac): eligible články **s** použitím feature vs eligible **bez** použitia. | Najbezpečnejší **MVP** prístup k deskriptívnemu porovnaniu performance. |
| **Before / after rollout** | Obdobie pred vs po zavedení / rozšírení feature. | Užitočné selektívne; vyššie riziko zmien trafficu, sezónnosti, redakcie — treba explicitný popis v dokumentácii datasetu. |
| **Adoption trend** | Rast adopcie, penetrácie, „zrelosti“ autorov **bez** performance baseline. | Baseline výkonu často netreba; stačí časová série usage/adoption. |

**Čo nepotrebujeme fixovať navždy:** jednu baseline metodiku pre všetky AI features.

**Čo potrebujeme:** pre každý reporting rez **transparentne označiť comparison logic** (kto je v eligible, aké obdobie, used vs not-used alebo iný dohodnutý rez) a **držať ju konzistentne** pri opakovaných exportoch, kým sa metodika zámerne nezmení.

**Komparačné bázy môžu byť feature-specific a časovo viazané; cieľom aktuálneho kroku nie je definovať univerzálny causal baseline model pre všetky AI features.**

---

## 7. Performance vrstva môže byť nekompletná

**Explicitne:**

- **Nie všetky AI features musia mať dostupné performance metriky.**  
- **Chýbajúce metriky nie sú blokér pre vznik ani dodanie datasetu.**

Metriky môžu byť **feature-specific**; nie je povinné mať jednotný rámec pre všetky nástroje naraz.

---

## 8. Shape > completeness

**Priorita:**

1. **Opakujúci sa**, **stabilný**, **rozšíriteľný shape** výstupu (stĺpce, grain, kľúče, verzia schémy).  
2. Až potom „úplnosť“ každého poľa.

**Nie je cieľ:** dokonalý, úplne vyplnený dataset v prvej vlne.  
**Je cieľ:** dataset, ktorý sa dá **mesačne / pravidelne** generovať rovnakým spôsobom a na ktorý sa dá bez rozbitia dopĺňať ďalšie performance signály.

---

## 9. Disciplína scope (čo do tohto kroku nepatrí)

Do tohto **bridge** kroku **nepatri**:

- záväzný **causal** záver „AI zvýšila X o Y %“,  
- garantované **ROI** ani jednotný „impact framework“ pre všetky features,
- **jedna univerzálna baseline / komparačná metodika** viazaná na všetky AI features navždy (pozri §6 — stačí transparentný rez per výstup),
- návrh **finálneho** dlhodobého AI BI pre celú redakciu.

Patrí sem:

- truth layer + **deskriptívny / komparatívny** obsah podľa dostupných dát,  
- transparentné označenie **dátových medzier**.

---

## 10. Ďalší krok (pre DHUB)

Skrátený **data request** v jazyku analytiky: grain, join kľúče, **eligible sample / CAP definícia per feature** (inclusion / exclusion v analytickom zápise), zdroje pre usage vrstvu, zdroje pre performance signály, definícia **deskriptívnej komparačnej bázy** (used vs not-used within eligible, prípadné časové okná), **explicitný popis comparison logic / baseline rez** pre daný výstup (pozri §6), povinné vs voliteľné polia, periodicita exportu. Detailné KPI reporting UX zostáva v zadaní [**CMSB-1810**](./task+kontext+gpt.md); **tento framing** fixuje očakávania a tlak na implementáciu.

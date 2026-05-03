# CMS Copilot - Q&A Layer

**Analýza a smerovanie (nie roadmapa)**  
**Status:** materiál na diskusiu s tímom  
**Súvisí s:** EAGLE CMS 2026-2027 - Inteligentný Copilot redakcie, Article Performance Layer

---

## Účel dokumentu

Tento text je **rozbor a rámec rozhodnutí**, nie záväzný plán dodávky. Slúži na:

- zosúladiť vnímanie Q&A (z „AI generátora“ na **Copilot s rozhodnutiami a dátami**)
- oddeliť **čo má zmysel urobiť hneď** a **čo je ďalší obmedzený krok (MVP2)** od **dlhodobého smeru bez termínov**
- ukázať minimálne **dátové základy** a riziká, aby sa modul neuzavrel ako „feature bez dopadu“

---

## 1. Reálny charakter modulu

### Aktuálny stav

- AI generuje Q&A
- redaktor upravuje / akceptuje / zahodí
- chýba **systematická spätná väzba** (logging, metriky)

### Kam smerujeme (kontextovo)

- Q&A ako súčasť **Article Performance Layer**: návrh → interakcia redaktora → **záznam správania** → neskôr vyhodnotenie a odporúčania

**Idea posunu:** nie len generovať text, ale **rozhodovať nad obsahom** a vedieť to **merať**.

---

## 2. Dátový základ - JSON #1 (Editorial Behavior)

**Účel:** Zachytiť správanie redaktora a kvalitu AI výstupu. Bez toho sú závery o adopcii a kvalite pocitové.

```json
{
  "feature": "qa_generation_v1_logging",
  "events": [
    "qa_generated",
    "qa_edited",
    "qa_accepted",
    "qa_rejected"
  ],
  "core_metrics": [
    "acceptance_rate",
    "edit_distance",
    "generation_rate",
    "time_to_accept"
  ]
}
```

**Implementovateľnosť:** JSON #1 je zámerne navrhnutý tak, aby ho bolo možné **dodať len z editora a logu udalostí** - **bez závislosti na DataHub** a bez performance dát (CTR, scroll a pod.). Všetko v `core_metrics` musí ísť odvodiť z časových razítok eventov a z diffu textu v rámci CMS.

**Význam:** prvý **Data Acquisition** krok pre Q&A (a rovnaký prístup sa hodí aj ostatným Copilot modulom v editore).

---

## 3. Koncept JSON #2 (Decision / Performance - referenčný)

**Účel:** Neskôr prepojiť editorial udalosti s výkonom článku a s odporúčaniami. Tu ide o **architektonickú predstavu**, nie o záväzok implementácie v jednej vlne.

```json
{
  "feature": "qa_copilot_decision_layer",
  "layers": [
    "event_decision_layer",
    "trigger_engine_v2",
    "quality_feedback_loop",
    "cross_module_integration",
    "performance_layer",
    "content_expansion_mode",
    "copilot_recommendation_engine"
  ]
}
```

**Poznámka:** Zoznam vrstiev ilustruje **smer** (Decision Intelligence), nie povinný rozsah jedného projektu. Rozdeľovanie na menšie releasy je na refinemente.

---

## 4. Analýza hodnoty (časová logika)

### Krátkodobo (bez JSON #1)

- nedá sa rozumne optimalizovať trigger ani kvalita modelu
- acceptance rate sám o sebe môže klamať (viď riziká)

### Strednodobo (s dátami + jedným jasným produktovým rezaním)

- úprava triggerov a textov na základe správania redakcie
- **jeden** dobre ohraničený cross-modulový flow v editore namiesto desiatich paralelných iniciatív

### Dlhodobo (autonomný smer)

- Copilot aktívnejšie **navrhuje** ďalší krok (nie len čaká na klik)
- vyžaduje DataHub, performance signály a produktové pravidlá - mimo rámca „malého“ Q&A modulu samého o sebe

---

## 5. Kľúčový posun (myšlienka)

| Dnes typicky | Cieľová logika |
| AI generuje obsah | AI + editor generujú **rozhodnutia, ktoré vieme zmerať** |

---

## 6. Architektonický pattern (zdieľaný s inými modulmi)

| Vrstva | Význam |
| Generation | AI výstup |
| Interaction | redaktor |
| Feedback | logging |
| Evaluation | analýza (najprv nad JSON #1) |
| Decision | odporúčanie (neskôr; závisí od dát) |

Zhoda s DataHub eventmi, SEO Copilot / tag logikou: **jeden typ „navrhni → vyber → zaloguj“** namiesto izolovaných widgetov.

---

## 7. Riziká

| ID | Rizikum | Poznámka |
| R1 | Feature bez dopadu | bez neskoršieho performance kontextu ťažko ukázať biznis efekt; prvý krok sú aspoň editorial metriky |
| R2 | Noise generator | príliš jednoduchý trigger (napr. len dĺžka textu) môže generovať zbytočné návrhy |
| R3 | Zlé čítanie kvality | samotný acceptance rate ≠ kvalita; **edit distance** a podobné signály pomáhajú |
| R4 | Žiadny uzavretý okruh | bez metrík a občasnej revízie triggerov / promptov sa zlepšovanie zastaví |

---

## 8. DATA GAP

| ID | Gap |
| DG1 - Baseline | porovnanie scenára bez Q&A |
| DG2 - Performance | ATS, CTR, scroll (alebo ekvivalent podľa zdroja dát) |
| DG3 - Typológia článkov | klasifikácia pre segmentáciu výkonu |

Tieto body **neblokujú** začatie JSON #1; obmedzujú až **interpretáciu „čo to urobilo s článkom navonok“**.

---

## 9. Cross-module prepojenia (kontext)

- **Tags:** entity a článok ako vstup do označovania a ďalšej práce v editore
- **SEO Copilot / linkbuilding:** kontext článku a tagov pre interné linky
- **Performance layer:** neskôr - väzba na správanie čitateľa

**Konštatovanie:** zmysluplnejší **jeden vertikál** (tagy → linky) pre QA a redakciu než paralelné rozširovanie Q&A o celú „decision“ architektúru v jednom kroku.

---

## 10. Jasné kroky (čo z tohto dokumentu brať ako návrh akcií)

### Krok A - Teraz: JSON #1

- zaviesť **append-only** logovanie udalostí Q&A (`qa_*`) a minimálne metriky (**acceptance**, **edit distance** kde technicky možné, **time_to_accept**, **usage**), všetko odvoditeľné v CMS bez DataHub / performance
- bez tohto kroku nie je analýza v dokumente konzistentná s realitou produktu

### Krok B - MVP2 (navrhovaný obrys, na refine)

- **produktovo zamerať MVP2** na **prepojenie Tags + Linkbuilding** v editore (jeden priebeh, zdieľané vzory UI a logovania s existujúcimi špecifikáciami)
- Q&A v tej vlne **nepretŕhať** na plnú „Decision Layer“ - nech zostane s JSON #1 a prípadnými drobnými úpravami copy / triggeru podľa vzniknutých dát

### Autonomný smer (bez záväzku backlogu)

- JSON #2 a prvky typu **recommendation engine**, **trigger_engine_v2**, plné **performance** prepojenie: držať ako **smer uchovania architektúry**, rozhodovať po MVP2 a po dátach z JSON #1 (a z tag/link flow)

---

## 11. Zhrnutie pre rozhodnutie

- **JSON #1** je predpoklad, aby Q&A (a podobné moduly) neboli „hluché“ k redaktorovi a kvalite výstupu
- **MVP2** má väčší zmysel ako **Tags + Linkbuilding** než nafúknutie Q&A o celú decision architektúru
- **Zvyšok** textu (JSON #2, proactive Copilot, plná performance vrstva) je **autonomný smer** - na ďalšie epicy a refine, nie ako jeden monoblok pre QA

---

## Voliteľne

- po zosúladení s tímom: samostatný **Jira Epic** len pre JSON #1; MVP2 už podľa link/tags špecifikácie, nie podľa tohto dokumentu ako „mega roadmapy“

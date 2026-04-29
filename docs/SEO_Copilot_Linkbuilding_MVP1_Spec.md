# SEO Copilot: Linkbuilding MVP1
## Jira Feature Spec - Interné prelinkovanie v editore
> **Dokument:** Jira Epic + Story + Design Zámer
> **Projekt:** SEO Copilot - Linkbuilding (súčasť Article Performance Layer)
> **Autor:** Daniel Budziňák, Senior Product Manager
> **Verzia:** 1.3 | Dátum: 2026-04-29
> **Status:** Ready for refinement
> **Súvisí s:** `MDIE_C_Jira_Spec.pdf` (Article Performance Layer), `SEO_Copilot_Tags_MVP1`

---

## 0. KONTEXT A DATA GAP

MVP1 vychádza z existujúceho architektonického návrhu linkbuildingu (Confluence: `Linkbuilding Automat v CMS`) a redukuje ho na základný overiteľný flow. Cieľom nie je kompletný linkbuilding systém, ale **decision vrstva nad existujúcim infra**, ktorá rozhoduje, kde a aké interné linky majú zmysel.

**Čo vieme:**
- Tag API existuje; hard aj soft filter je navrhnutý a implementovateľný nad existujúcimi dátami
- Anchor detekcia nevyžaduje LLM - riešiteľné knižnicou (SpaCy sk)
- Linkbuilding nadväzuje na Tags: linky vedú na tag stránky - Tags musia byť prijaté pred aktiváciou Linkbuildingu (Krok A - Krok B)
- DataHub existuje; baseline metriky (CTR interných linkov) treba zachytiť pred spustením

**DATA GAP `[DATA_GAP]`:**

| # | Gap | Zodpovednosť |
| DG-L1 | Je SpaCy (`sk_core_news_lg`) alebo iná NLP knižnica v AI service stacku? (súvisí s CMSD1778) | Backend / AI service tím |
| DG-L2 | Lifecycle stavu `ignored`: kedy presne - pri zatvorení / publishi / konci session? | PM + Backend |
| DG-L3 | Incremental use case: nová validácia prepíše predchádzajúce návrhy alebo diff-uje? | Backend / AI service tím |
| DG-L4 | ~~Scope pilota~~ - **VYRIEŠENÉ:** plus1deň, 4 týždne | ✅ |
| DG-L5 | Baseline metriky (CTR interných linkov, priemerný počet linkov/článok) - kto a kedy zachytí? | Analytics / DataHub tím |
| DG-L6 | Pravidlá indexácie tagov dostupné cez API? (potrebné pre hard filter) | Backend / SEO tím |

---

## 1. PRODUKT ZÁMER

**Problém:** Redaktori prelinkujú interný obsah nesystematicky - bez kontextu o tom, ktoré tagy sú relevantné a kde v texte anchor prirodzene existuje. Výsledok: nižší interný traffic, nekonzistentné prelinkovanie naprieč brandmi.

**Riešenie:** SEO Copilot Linkbuilding navrhne redaktorovi interné linky priamo v editore - s kontextom vety, kde anchor sedí - a redaktor jedným klikom rozhodne, či link pridá alebo odmietne. Systém nemodifikuje text automaticky. Každá interakcia je zalogovaná pre vyhodnotenie dopadu.

**Čo overuje MVP1:**
1. Vieme generovať relevantné interné linky nad existujúcim tag infra
2. Redaktori sú ochotní návrhy používať
3. Návrhy majú merateľný dopad na interný traffic

**Kľúčový princíp:** AI navrhuje - redaktor rozhoduje - systém loguje - DataHub vyhodnocuje.

---

## 2. ROZSAH MVP1

### Zahrnuté
- plus1deň (pilotná redakcia, testovacie obdobie 4 týždne)
- Tagy ako cieľ prelinkovania
- Anchor detekcia pomocou NLP knižnice (SpaCy sk) - nie LLM
- Návrhový režim (HITL - human in the loop)
- Hard cap: max. 5 linkov/článok + žiadny link do perexu
- Hard filter (publikovaný, nie blacklist, nie duplikát)
- Soft filter: 2 signály - relevancia (match) + existencia obsahu
- Krok A - Krok B workflow: Tags musia byť prijaté pred aktiváciou Linkbuildingu
- Deduplication: 1 entita = 1 návrh (prvý výskyt po perexe)
- Commit akcia: „Použiť prelinkovania a zatvoriť" akceptuje všetky zostávajúce návrhy naraz
- Event logging: minimálny MVP1 schema (`suggestion_id`, `action`, `article_id`, `site_id`)

### Vylúčené z MVP1 - MVP2+
- Cosine similarity / pokročilá anchor selection logika (ranking layer)
- Morphodita fallback (edge-case optimalizácia - riešiť po overení adopcie)
- Detailné link density pravidlá na úrovni vety/odstavca (HITL ich nahrádza)
- Soft filter: freshness + typ tagu (nemáme kalibračné dáta)
- Incremental / diff logic (vždy fresh run)
- Rozšírený event schema (DataHub doplní polia neskôr)
- Články ako cieľ prelinkovania
- Performance-based ranking (GSC a pod.)
- LLM generovanie anchorov

---

## 3. FLOW MVP1

```
Article (DRAFT)
  └─► Redaktor klikne „Generovať tagy a prelinkovania" (pravý panel)
        │
        ▼
      Modálne okno — sekcia Tagy
      Tagy sa načítavajú progressívne; redaktor upraví/odznačí
      [Použiť v článku] → tagy sú prijaté
        │
        ▼
      Modálne okno — sekcia Interné prelinkovania
      (sprístupní sa po prijatí tagov; pred tým disabled)
        │
        Input: zoznam prijatých tagov pre článok
        │
        ▼
      Anchor detekcia (SpaCy sk)
      Lemmatizácia tagu aj textu - nájdenie výskytu v skloňovanom tvare
        │
        ▼
      Hard filter (publikovaný, nie blacklist, indexovateľný, nie duplikát)
        │
        ▼
      Soft filter / Validation vrstva (relevancia: match + existencia obsahu)
        │
        ▼
      Selection
      1 najlepší kandidát per anchor
      Deduplication: 1 entita = 1 návrh (prvý výskyt po perexe)
      Hard cap: max. 1 link/odstavec / max. 5/článok / žiadny do perexu / nie H1-H3
        │
        ▼
      Suggestion Output — modálny zoznam
      anchor | cieľový tag | kontext vety
      Per návrh: [×] Zmazať (MVP1 perzistentné) | [Nepoužiť] on hover (MVP1 perzistentné)
      [Generovať znova] — reset zoznamu
      [Použiť prelinkovania a zatvoriť] → akceptuje zostávajúce návrhy
        │
        ▼
      Event logging - JSON - DataHub
        │
        ▼
      Publish (nikdy neblokovaný)
```

---

## 4. EPIC

**Názov epicu:** `[SEO-EPIC-02] SEO Copilot: Linkbuilding MVP1`
**Priorita:** P0 (pilot blocker)
**Labels:** `seo-copilot`, `linkbuilding`, `tags`, `anchor-detection`, `hitl`, `event-logging`
**Cieľ:** Redaktor má v editore prehľadné návrhy interných linkov s kontextom vety, môže ich jedným klikom prijať alebo odmietnuť, pričom systém loguje každú interakciu a nikdy neblokuje publish.

---

## 5. USER STORIES

### Story 1: Zobrazenie návrhov interných linkov

SEO-201
Ako redaktor
Chcem po prijatí tagov vidieť návrhy interných linkov s kontextom vety
Aby som vedel rýchlo posúdiť, kde link v texte sedí, a rozhodnúť o jeho použití.

**Acceptance Criteria:**
- V pravom paneli sú po prijatí tagov dostupné dve tlačidlá: „Zobraziť návrhy pre tagy" a „Zobraziť návrhy prelinkovania"
- Kliknutie otvára **modálne okno** s dvomi sekciami: Tagy (hore) a Interné prelinkovania (dole)
- Sekcia Interné prelinkovania je pred prijatím tagov disabled s tooltipom „Dostupné po prijatí tagov"
- Po prijatí tagov sa sekcia linkov automaticky aktivuje a načíta progressívne (bez reloadu)
- Každý návrh zobrazuje: anchor (monospace badge), šípku, cieľový tag, kontext vety
- Počet viditeľných návrhov je zobrazený v hlavičke sekcie: „Vybraných X návrhov"
- Rovnaká entita navrhnutá max. **1×** (prvý výskyt po perexe)
- Ak sú všetky návrhy odstránené: zobrazí sa empty state „Všetky návrhy boli odstránené. Kliknite na Generovať znova."

**Edge cases:**
| Scenár | Správanie |
| Žiadny tag neprejde filtrom | 0 návrhov, sekcia linkov prázdna |
| Všetky tagy blacklistované | 0 návrhov, fail-safe |
| Anchor len v perexe | Návrh sa nevytvorí |
| Článok kratší ako 3 odstavce | Systém nenavrhuje linky |
| BE API nedostupné | `suggestions_skipped`, 0 návrhov, článok nezmenený |
| Linky aktivované pred tagmi | Sekcia disabled s tooltipom |

---

### Story 2: Správa návrhov linkov — akceptácia, mazanie, odmietnutie

SEO-202
Ako redaktor
Chcem každý návrh linku individuálne spracovať alebo celý set potvrdiť jedným klikom
Aby som mal plnú kontrolu nad prelinkovaním článku.

**Acceptance Criteria:**
- Na každom riadku: vždy viditeľný `×` (Zmazať); „Nepoužiť" sa zobrazí pri hover na riadok
- `×` (Zmazať): okamžite odstráni návrh zo zoznamu (MVP1 perzistentné); event `link_suggestion_removed`
- „Nepoužiť": okamžite odstráni návrh zo zoznamu (MVP1 perzistentné); event `link_suggestion_rejected`
- „Generovať znova" resetuje všetky link akcie a znovu animuje zoznam (escape hatch)
- „Použiť prelinkovania a zatvoriť" akceptuje všetky zostávajúce viditeľné návrhy; každý = samostatný `link_suggestion_accepted` event
- Anchor sa nevkladá automaticky — každá akcia je explicitná (HITL)
- Publish prebehne normálne bez ohľadu na stav návrhov
- Neinteragované návrhy pri publishi dostanú stav `ignored` (`[DATA_GAP DG-L2]`)

---

### Story 3: Event logging

SEO-203
Ako pilot owner alebo analytik
Chcem mať zalogované všetky interakcie redaktora s návrhmi
Aby sme mohli vyhodnotiť adopciu a dopad na traffic.

**Acceptance Criteria:**
- Každý event obsahuje: `suggestion_id`, `action`, `timestamp`, `article_id`, `site_id`
- Každý návrh má unikátne `suggestion_id` (UUID)
- Eventy sú ukladané ako append-only log
- JSON export logu je dostupný pre QA a DataHub (viď Sekcia 9)
- `suggestions_generated` event sa zapíše pri každej validácii (aj keď je 0 návrhov)

---

## 6. LOGIKA MVP1 - DETAILNÝ POPIS

### 6.1 Input
Zoznam prijatých tagov pre článok (výstup Kroku A - Tags).

### 6.2 Anchor detekcia (bez LLM)

**Knižnica:** SpaCy `sk_core_news_lg`

Lemmatizácia tagu aj textu článku - nájdenie výskytu v skloňovanom tvare. Ak SpaCy anchor nenájde - návrh sa nevytvorí, žiadna chyba.

**Dôvod voľby (nie LLM):** Anchor matching je deterministický problém. SpaCy sk je navrhovaný interne v kontexte CMSD1778 - zdieľame model. `[DATA_GAP DG-L1]` - potvrdiť, či je v AI service stacku.

### 6.3 Hard filter (povinné podmienky)

| Podmienka | Zdroj dát |
| Tag je publikovaný | Tag API |
| Tag nie je blacklistovaný | Tag API / konfig |
| Tag je indexovateľný | Tag API (ak dostupné) - `[DATA_GAP DG-L6]` |
| Tag nie je už manuálne zalinkovaný v článku | Parser existujúcich linkov v texte |

Ak niektorá podmienka nie je splnená - tag sa preskočí. Žiadna chyba, žiadna zmena článku.

### 6.4 Soft filter / Validation vrstva

Cieľ: eliminovať zjavne nevhodné targety. MVP1 používa iba **2 signály**:

| Signál | Typ | Dôvod |
| Relevancia voči článku (match) | must-have | Základná zmysluplnosť návrhu |
| Existencia obsahu | proxy kvalita | Tag nie je prázdny |

Freshness, typ tagu a ďalšie signály - MVP2 (nemáme kalibračné dáta, riskujeme overfiltering).

### 6.5 Selection a deduplication

- Pre každý anchor sa vyberá **jeden najlepší kandidát** (tag s najvyššou relevančnou skórou po filtroch)
- Ak sa rovnaká entita vyskytuje v texte viackrát - systém navrhne link **iba raz**

**Výber výskytu — distribuovaný greedy:**
1. Nájdi všetky výskyty anchoru po perexe (nie H1-H3, nie popisky obrázkov)
2. Vyber prvý výskyt v odstavci, ktorý ešte **nemá priradený žiadny iný link**
3. Ak taký odstavec neexistuje - návrh sa nevytvorí (hard cap na odstavec zabraňuje nahromadeniu)

Toto zabraňuje hromadeniu linkov na začiatku článku: každý ďalší tag automaticky putuje do ďalšieho voľného odstavca.

**Vylúčené pozície:**
- Perex
- Nadpisy H1-H3 (rozbilo by frontend rendering)
- Popisky obrázkov / alt texty (mimo toku textu)

Pokročilý výber (cosine similarity, sémantická podobnosť) - MVP2.

### 6.6 Akcie redaktora - granularita feedbacku

Pri návrhoch interných linkov rozlišujeme štyri typy interakcie:

| Stav | Trigger | Význam | Perzistencia (MVP1) |
| `accepted` | „Použiť prelinkovania a zatvoriť" | Návrh bol použitý v článku | zostáva prijatý |
| `rejected` | „Nepoužiť" | Vedomé odmietnutie — návrh je nevhodný | odstránenie návrhu zo zoznamu (MVP1 perzistentné) |
| `removed` | „×" (Zmazať) | Upratanie zoznamu — nie hodnotenie kvality | odstránenie návrhu zo zoznamu (MVP1 perzistentné) |
| `ignored` | žiadna interakcia do publishu | Redaktor návrh videl, ale nereagoval | - |

**Perzistencia v MVP1:** Obe akcie (`rejected` aj `removed`) odstránia návrh zo zoznamu — pri opätovnom otvorení modálu zostávajú preč. Rozdiel je iba v event logu (DataHub kalibrácia v MVP2). Obnovenie = „Generovať znova".

**UI hierarchia akcií:**
- `×` (Zmazať) — vždy viditeľný, malý, červená ikona, sivý rám; tooltip: „Odstrániť zo zoznamu návrhov. Neovplyvní budúce návrhy."
- `Nepoužiť` — zobrazí sa pri hover na riadok, sivý, diskrétny; tooltip: „Nepoužiť, ak návrh nesedí pre tento článok"
- `Generovať znova` — v hlavičke sekcie; resetuje všetky link akcie a znovu animuje zoznam

**Dôvod rozlíšenia `rejected` vs `removed`:**
DataHub potrebuje odlíšiť vedome odmietnutý návrh od upratania zoznamu pre kalibráciu scoring modelu v MVP2. Nesmú byť zlučované.

**Event schema:**
```typescript
type LinkActionStatus = 'accepted' | 'rejected' | 'removed' | 'ignored';

{ type: "link_suggestion_accepted",  suggestion_id, article_id, site_id }
{ type: "link_suggestion_rejected",  suggestion_id, article_id, site_id }
{ type: "link_suggestion_removed",   suggestion_id, article_id, site_id }
```

---

### 6.7 Link density pravidlá

| Pravidlo | Hodnota |
| Perex | žiadny link |
| Max. linky na odstavec | 1 (guard proti nahromadeniu) |
| Max. linky na článok | 5 (konfigurovateľné: `seo_copilot.max_links_per_article`) |

Pravidlo 1 link/odstavec je jednoduchý distribuovaný guard - nie scoring. Granulárne pravidlá na úrovni vety - MVP2.

---

## 7. UI / UX

### Vstupný bod (pravý panel editora)

```
[Generovať tagy a prelinkovania]   ← pred prijatím tagov
  ↓ po prijatí tagov:
[Zobraziť návrhy pre tagy]   [Zobraziť návrhy prelinkovania]
```

### Modálne okno — sekcia Interné prelinkovania

**Hlavička sekcie:**
```
🔗 Interné prelinkovania    Vybraných 10 návrhov
[↺ Generovať znova]   [✓ Použiť prelinkovania a zatvoriť]
```

**Riadok návrhu:**
```
✓  kreatín monohydrát  →  Kreatín
   „...štúdie naznačujú, že kreatín monohydrát..."
                                          [×]  [Nepoužiť ←hover]
```

### Stavové labely

| Stav | Správanie |
| Aktívny návrh | modrý rámik + CheckCircle2 vľavo |
| Zmazaný (`×`) | okamžite zmizne zo zoznamu; event `removed` |
| Odmietnutý („Nepoužiť") | okamžite zmizne zo zoznamu; event `rejected` |
| Linky disabled | šedý Lock ikona + „Dostupné po prijatí tagov" |

### UI Copy

| Element | Text |
| Sekcia v modáli | „Interné prelinkovania" |
| Linky disabled tooltip | „Dostupné po prijatí tagov" |
| Počítadlo | „Vybraných X návrhov" |
| Commit button | „Použiť prelinkovania a zatvoriť" |
| Reset button | „Generovať znova" |
| Empty state | „Všetky návrhy boli odstránené. Kliknite na Generovať znova." |
| API nedostupné | „Návrhy linkov sú dočasne nedostupné." |
| Zmazať tooltip | „Odstrániť zo zoznamu návrhov. Neovplyvní budúce návrhy." |
| Nepoužiť tooltip | „Nepoužiť, ak návrh nesedí pre tento článok" |

---

## 8. EDGE CASES

| # | Scenár | Systémové správanie | UI reakcia |
| EL1 | Žiadny tag neprejde filtrom | 0 návrhov; fail-safe | Sekcia sa nezobrazí |
| EL2 | Všetky tagy blacklistované | 0 návrhov | Sekcia sa nezobrazí |
| EL3 | Anchor text len v perexe | Návrh sa nevytvorí | - |
| EL4 | Tá istá entita 5× v texte | 1 návrh (prvý výskyt po perexe) | Karta pre 1 link |
| EL5 | Tag manuálne zalinkovaný | Systém tag preskočí | - |
| EL6 | Článok kratší ako 3 odstavce | 0 návrhov; guard na krátky obsah | - |
| EL7 | BE API nedostupné | `suggestions_skipped`; článok nezmenený | Banner: „Návrhy linkov sú dočasne nedostupné." |
| EL8 | Linky aktivované pred prijatím tagov | Sekcia disabled | Tooltip: „Dostupné po prijatí tagov" |
| EL9 | Redaktor publikuje bez interakcie | Neinteragované návrhy - `ignored` pri publishi | Publish prebehne normálne; `[DATA_GAP DG-L2]` |
| EL10 | Incremental: editor má existujúce linky z predchádzajúcej session | MVP1: nová validácia prepíše predchádzajúce návrhy; `[DATA_GAP DG-L3]` pre diff-approach | - |
| EL11 | SpaCy nevedelo lemmatizovať anchor | Návrh sa nevytvorí; žiadna chyba; Morphodita fallback - MVP2 | - |

---

## 9. EVENT LOGGING / JSON SCHEMA

### Suggestion Object

```typescript
type LinkSuggestion = {
  suggestion_id: string;   // UUID, povinný
  anchor_text: string;
  target_id: string;       // tag ID
  target_label: string;
  target_url: string;
  context_snippet: string; // výrez vety s anchorom
  article_id: string;
};
```

### User Action Event

```typescript
type LinkAction = {
  suggestion_id: string;
  action: "accepted" | "rejected" | "removed" | "ignored";
  timestamp: number;       // Unix ms
  article_id: string;
  site_id: string;
};
```

Rozšírené polia (`article_type`, `position_in_text`, `editor_id`, `suggestion_source`) - MVP2 / DataHub tím doplní podľa potreby.

### Event typy

| Event | Kedy |
| `suggestions_generated` | Po každej validácii (aj 0 návrhov) |
| `link_suggestion_accepted` | „Použiť prelinkovania a zatvoriť" — pre každý zostávajúci návrh |
| `link_suggestion_rejected` | Redaktor klikol „Nepoužiť" — okamžitý event |
| `link_suggestion_removed` | Redaktor klikol `×` (Zmazať) — okamžitý event |
| `suggestion_ignored` | Neinteragované pri publishi / konci session |
| `suggestions_skipped` | API nedostupné; 0 návrhov z technického dôvodu |

### Technické pravidlá

- Každý návrh má unikátne `suggestion_id` (UUID)
- Každá interakcia je samostatný event (append-only log)
- Eventy obsahujú dostatočný kontext na spätnú analýzu
- MVP1: JSON export pre QA; DataHub napojenie = ďalší krok (`[DATA_GAP DG-L5]`)

---

## 10. ACCEPTANCE CRITERIA - SÚHRNNÝ CHECKLIST

**Flow a podmienky:**
- Krok B je disabled pred dokončením Kroku A (Tags)
- Po Kroku A sa Krok B automaticky aktivuje (bez reloadu)
- Systém navrhne min. 1 link na článok (ak prejde filtrami)

**Filtre:**
- Hard filter: publikovaný tag, nie blacklist, nie duplikát existujúceho linku
- Soft filter: relevancia (match) + existencia obsahu
- Žiadny link do perexu
- Hard cap: max. 1 link/odstavec, max. 5 linkov/článok

**Deduplication:**
- Rovnaká entita navrhnutá max. 1× (prvý výskyt po perexe)
- Pre každý anchor = 1 najlepší kandidát

**UI:**
- Vstup cez modálne okno; pravý panel obsahuje „Zobraziť návrhy prelinkovania"
- Každý návrh zobrazuje: anchor (monospace), cieľ, kontext vety
- Akcie: `×` (Zmazať, vždy viditeľný) + „Nepoužiť" (hover)
- Commit: „Použiť prelinkovania a zatvoriť" akceptuje zostatok
- „Generovať znova" resetuje zoznam

**Logging:**
- Každý event obsahuje: `suggestion_id`, `action`, `timestamp`, `article_id`, `site_id`
- `suggestions_generated` zalogovaný pri každej validácii
- `suggestion_ignored` pri neinteragovaných návrhoch

**Fail-safe:**
- Žiadna akcia nesmie blokovať publish flow
- Ak API zlyhá: 0 návrhov, článok ostáva nezmenený, event `suggestions_skipped`

---

## 11. FEATURE FLAGS

```
seo_copilot.linkbuilding.enabled          // false - zapína celý flow per redakcia
seo_copilot.max_links_per_article         // 5 - max. návrhov na článok
seo_copilot.linkbuilding.require_step_a   // true - Krok B podmienený Krokom A
```

Vypínateľné bez nového deployu, per brand.

---

## 12. MERANIE A VYHODNOTENIE

### Predpoklad: Baseline pred spustením `[DATA_GAP DG-L5]`

Pred spustením MVP1 zachytiť (Analytics / DataHub tím):
- Priemerný CTR interných linkov v texte (posledných 30 dní)
- Priemerný počet interných linkov na článok

Bez baseline nie je možné porovnanie „pred vs. po".

### Testovací setup

- Pilotná redakcia: **plus1deň**
- Testovacie obdobie: **4 týždne**

### Primárne metriky

| Metrika | Cieľ |
| CTR interných linkov v texte | Nárast vs. baseline |
| Počet klikov na interné linky / článok | Nárast vs. baseline |

### Sekundárne metriky

| Metrika | Cieľ |
| Adoption rate | Koľko % článkov využilo návrhy |
| Acceptance rate | Koľko % návrhov redaktori prijali |
| Pages per session | Orientačný dopad na engagement |
| Time on article | Orientačný dopad |

### Výstup

- Vyhodnotenie dopadu na engagement a traffic
- Rozhodnutie o rozšírení (MVP2: články ako cieľ, pokročilý scoring, GSC dáta)

---

## 13. SMEROVANIE - MVP2 A ĎALEJ

| Funkcia | Verzia |
| Rozšírenie targetov: články (nielen tagy) | MVP2 |
| Pokročilý scoring model (relevancia, veľkosť, aktivita, SEO kvalita) | MVP2 |
| Performance-based ranking (GSC, traffic dáta) | MVP2 |
| Variabilita a optimalizácia anchor textov | MVP2 |
| Morphodita fallback po overení SpaCy presnosti na NMH obsahu | MVP2 |
| Systematická práca s kvalitou tagov (TAGY 3.0) | Post-MVP |
| Historická optimalizácia anchor textov | Post-MVP |

---

## 14. JIRA SUB-TASKY (ROZPAD EPICU)

Tento dokument slúži ako **Master Epic**. Pre vývojový tím sa rozpadá na nasledujúce sub-tasky podľa NMH tímovej štruktúry:

| Sub-task | Tím | Popis |
| **ST-1: NLP Pipeline** | DataHub (DH) | Implementácia SpaCy `sk_core_news_lg`; lemmatizácia tagu + textu článku; anchor detekcia; sentence boundary extraction pre context snippet |
| **ST-2: Core API rozšírenie** | Core | Endpoint: `POST /linkbuilding/suggest` - prijme článok, vráti `LinkSuggestion[]`; integrácia s DH NLP pipeline; hard filter + soft filter nad existujúcim tag API |
| **ST-3: Admin UI** | Admin (CMS) | Modálne okno s dvomi sekciami (Tagy + Interné prelinkovania); sekcia linkov disabled pred prijatím tagov; riadky s anchor/cieľ/kontext; akcie `×` (Zmazať) + „Nepoužiť" (hover); „Generovať znova"; commit „Použiť prelinkovania a zatvoriť"; pravý panel: tlačidlá „Zobraziť návrhy pre tagy" / „Zobraziť návrhy prelinkovania" |
| **ST-4: Event Logging** | DataHub / Admin | JSON event schema (`LinkSuggestion`, `LinkAction`); append-only log; JSON export pre QA |
| **ST-5: Feature Flags** | Core / Infra | `seo_copilot.linkbuilding.enabled`, `seo_copilot.max_links_per_article`, `seo_copilot.linkbuilding.require_step_a` - vypínateľné per brand bez deployu |

**Poradie implementácie:** ST-1 (DH NLP) - ST-2 (Core API) - ST-3 (Admin UI) - ST-4 (Logging) - ST-5 (Flags)

---

## HISTÓRIA DOKUMENTU

| Verzia | Dátum | Autor | Zmena |
| 0.1 | 2026-04-12 | Daniel Budziňák | Pôvodný návrh `SEO_Copilot_Linkbuilding_MVP1.pdf` |
| 1.0 | 2026-04-28 | Daniel Budziňák | Formalizácia do Jira spec; SpaCy bez LLM; Krok A - Krok B; deduplication; bulk UI; DATA GAP DG-L1-DG-L6; edge cases EL1-EL11; JSON schema |
| 1.1 | 2026-04-29 | Daniel Budziňák | MVP scope rez: cosine similarity - MVP2; Morphodita fallback - MVP2; link density zjednodušené na hard cap; soft filter redukovaný na 2 signály; event schema orezaný na minimálne polia |
| 1.2 | 2026-04-29 | Daniel Budziňák | Formátovanie: dlhé pomlčky - krátke; odstránené checkboxy; odstránené ``` z user stories; odstránené oddeľovacie riadky tabuliek |
| 1.3 | 2026-04-29 | Daniel Budziňák | UI refaktor: modálny workflow (namiesto inline panelu); akcie zmenené na `×` Zmazať + „Nepoužiť"; obe sú trvalé v MVP1; pridaný „Generovať znova"; bulk button pattern nahradený commit „Použiť prelinkovania a zatvoriť"; sekcie 3, 5, 6.6, 7, 9, 10, 14 aktualizované |

---

*Súvisí s `MDIE_C_Jira_Spec.pdf` (Article Performance Layer - Phase 1 scope) a `SEO_Copilot_Tags_MVP1` (Krok A - podmienka pre aktiváciu tohto flow).*

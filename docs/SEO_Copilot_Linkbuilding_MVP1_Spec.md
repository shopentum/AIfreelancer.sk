# SEO Copilot: Linkbuilding MVP1
## Jira Feature Spec — Interné prelinkovanie v editore
> **Dokument:** Jira Epic + Story + Design Zámer
> **Projekt:** SEO Copilot — Linkbuilding (súčasť Article Performance Layer)
> **Autor:** Daniel Budziňák, Senior Product Manager
> **Verzia:** 1.0 | Dátum: 2026-04-28
> **Status:** Ready for refinement
> **Súvisí s:** `MDIE_C_Jira_Spec.pdf` (Article Performance Layer), `SEO_Copilot_Tags_MVP1`

---

## 0. KONTEXT A DATA GAP

MVP1 vychádza z existujúceho architektonického návrhu linkbuildingu (Confluence: `Linkbuilding Automat v CMS`) a redukuje ho na základný overiteľný flow. Cieľom nie je kompletný linkbuilding systém, ale **decision vrstva nad existujúcim infra**, ktorá rozhoduje, kde a aké interné linky majú zmysel.

**Čo vieme:**
- Tag API existuje; hard aj soft filter je navrhnutý a implementovateľný nad existujúcimi dátami
- Anchor detekcia nevyžaduje LLM — riešiteľné knižnicou (SpaCy sk + prípadne Morphodita fallback)
- Linkbuilding nadväzuje na Tags: linky vedú na tag stránky → Tags musia byť prijaté pred aktiváciou Linkbuildingu (Krok A → Krok B)
- DataHub existuje; baseline metriky (CTR interných linkov) treba zachytiť pred spustením

**DATA GAP `[DATA_GAP]`:**

| # | Gap | Zodpovednosť |
|---|-----|--------------|
| DG-L1 | Je SpaCy (`sk_core_news_lg`) alebo iná NLP knižnica v AI service stacku? (súvisí s CMSD1778) | Backend / AI service tím |
| DG-L2 | Lifecycle stavu `ignored`: kedy presne — pri zatvorení / publishi / konci session? | PM + Backend |
| DG-L3 | Incremental use case: nová validácia prepíše predchádzajúce návrhy alebo diff-uje? | Backend / AI service tím |
| DG-L4 | ~~Scope pilota~~ — **VYRIEŠENÉ:** plus1deň, 4 týždne | ✅ |
| DG-L5 | Baseline metriky (CTR interných linkov, priemerný počet linkov/článok) — kto a kedy zachytí? | Analytics / DataHub tím |
| DG-L6 | Pravidlá indexácie tagov dostupné cez API? (potrebné pre hard filter) | Backend / SEO tím |

---

## 1. PRODUKT ZÁMER

**Problém:** Redaktori prelinkujú interné obsah nesystematicky — bez kontextu o tom, ktoré tagy sú relevantné a kde v texte anchor prirodzene existuje. Výsledok: nižší interný traffic, nekonzistentné prelinkovanie naprieč brandmi.

**Riešenie:** SEO Copilot Linkbuilding navrhne redaktorovi interné linky priamo v editore — s kontextom vety, kde anchor sedí — a redaktor jedným klikom rozhodne, či link pridá alebo odmietne. Systém nemodifikuje text automaticky. Každá interakcia je zalogovaná pre vyhodnotenie dopadu.

**Čo overuje MVP1:**
1. Vieme generovať relevantné interné linky nad existujúcim tag infra
2. Redaktori sú ochotní návrhy používať
3. Návrhy majú merateľný dopad na interný traffic

**Kľúčový princíp:** AI navrhuje → redaktor rozhoduje → systém loguje → DataHub vyhodnocuje.

---

## 2. ROZSAH MVP1

### Zahrnuté
- plus1deň (pilotná redakcia, testovacie obdobie 4 týždne)
- Tagy ako cieľ prelinkovania
- Anchor detekcia pomocou NLP knižnice (SpaCy sk) — nie LLM
- Návrhový režim (HITL — human in the loop)
- Základné pravidlá link density
- Hard filter + soft filter (validation vrstva nad existujúcimi dátami)
- Krok A → Krok B workflow: Tags musia byť prijaté pred aktiváciou Linkbuildingu
- Deduplication: 1 entita = 1 návrh (najlepší výskyt)
- Bulk akcia: „Pridať všetky (N)" pre rýchle schválenie setu
- Event logging: JSON eventy kompatibilné s DataHub

### Vylúčené z MVP1 (MVP2+)
- Články ako cieľ prelinkovania
- Komplexný scoring model (anchor aj candidate)
- LLM generovanie anchorov
- Historická optimalizácia anchor textov
- Performance-based ranking (GSC a pod.)
- Morphodita fallback — zvážiť po reálnom testovaní SpaCy na NMH obsahu

---

## 3. FLOW MVP1

```
Article (DRAFT)
  └─► [Krok A: Tags dokončený?]
        │
        ├── NIE ──► Krok B disabled (tooltip: „Najprv prijmite navrhované tagy")
        │
        └── ÁNO ──► Input: zoznam prijatých tagov pre článok
                      │
                      ▼
                    Anchor detekcia (SpaCy sk)
                    Lemmatizácia tagu aj textu → nájdenie výskytu v skloňovanom tvare
                      │
                      ▼
                    Hard filter
                    (publikovaný, nie blacklist, indexovateľný, nie duplikát)
                      │
                      ▼
                    Soft filter / Validation vrstva
                    (relevancia, freshness, existencia obsahu, typ tagu)
                      │
                      ▼
                    Selection
                    1 najlepší kandidát per anchor
                    Deduplication: 1 entita = 1 návrh
                    Link density rules
                      │
                      ▼
                    Suggestion Output
                    anchor | cieľový tag | kontext vety | paragraph index
                      │
                      ▼
                    Editor confirm (HITL)
                    [Pridať link] / [Odmietnuť] / [Pridať všetky (N)]
                      │
                      ▼
                    Event logging → JSON → DataHub
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
```
SEO-201
Ako redaktor
Chcem po prijatí tagov (Krok A) vidieť návrhy interných linkov s kontextom vety
Aby som vedel rýchlo posúdiť, kde link v texte sedí, a rozhodnúť o jeho použití.
```

**Acceptance Criteria:**
- [ ] Sekcia „Tagy & Interné linky" je viditeľná v SEO záložke panelu
- [ ] Pred dokončením Kroku A (Tags): tlačidlá „Pridať link" a „Pridať všetky (N)" sú **disabled** s tooltipom „Najprv prijmite navrhované tagy (Krok A)"
- [ ] Po dokončení Kroku A: sekcia sa automaticky aktivuje (bez reloadu)
- [ ] Každý návrh zobrazuje: anchor text (zvýraznený), šípku → cieľový tag, výrez kontextovej vety, badge odstavca (`Odst. N`)
- [ ] Ak zostávajú **2 a viac** nespracovaných návrhov: zobrazí sa tlačidlo „Pridať všetky (N)" — hromadné prijatie; N sa dynamicky aktualizuje
- [ ] Ak zostáva **1 nespracovaný** návrh: zobrazí sa tlačidlo „Pridať link" (singulár)
- [ ] Rovnaká entita navrhnutá max. **1×** (najlepší výskyt; nie perex, správna density)
- [ ] Po spracovaní všetkých návrhov: sekcia zobrazí „Všetky návrhy spracované"

**Edge cases:**
| Scenár | Správanie |
|--------|-----------|
| Žiadny tag neprejde filtrom | 0 návrhov, sekcia sa nezobrazí |
| Všetky tagy blacklistované | 0 návrhov, fail-safe |
| Anchor len v perexe | Návrh sa nevytvorí |
| Článok kratší ako 3 odstavce | Systém nenavrhuje linky |
| BE API nedostupné | `suggestions_skipped`, 0 návrhov, článok nezmenený |
| Krok B aktivovaný pred Krokom A | Disabled s tooltipom |

---

### Story 2: Prijatie / odmietnutie návrhu
```
SEO-202
Ako redaktor
Chcem každý návrh linku individuálne prijať alebo odmietnuť
Aby som mal plnú kontrolu nad prelinkovaním článku.
```

**Acceptance Criteria:**
- [ ] Na každej karte dve akcie: „Pridať link" (zelené) / „Odmietnuť" (sivé)
- [ ] Po „Pridať link": karta zobrazí „Pridané", event zalogovaný ako `suggestion_accepted`
- [ ] Po „Odmietnuť": karta zobrazí „Odmietnuté", event zalogovaný ako `suggestion_rejected`
- [ ] Po „Pridať všetky (N)": každý link zalogovaný ako samostatný `suggestion_accepted` event
- [ ] Anchor sa nevkladá automaticky — každá akcia je explicitná (HITL)
- [ ] Publish prebehne normálne bez ohľadu na stav návrhov
- [ ] Neinteragované návrhy pri publishi dostanú stav `ignored` (`[DATA_GAP DG-L2]`)

---

### Story 3: Event logging
```
SEO-203
Ako pilot owner alebo analytik
Chcem mať zalogované všetky interakcie redaktora s návrhmi
Aby sme mohli vyhodnotiť adopciu a dopad na traffic.
```

**Acceptance Criteria:**
- [ ] Každý event obsahuje: `suggestion_id`, `action`, `timestamp`, `editor_id`, `article_id`, `site_id`, `article_type`
- [ ] Každý návrh má unikátne `suggestion_id` (UUID)
- [ ] Eventy sú ukladané ako append-only log
- [ ] JSON export logu je dostupný pre QA a DataHub (viď Sekcia 9)
- [ ] `suggestions_generated` event sa zapíše pri každej validácii (aj keď je 0 návrhov)

---

## 6. LOGIKA MVP1 — DETAILNÝ POPIS

### 6.1 Input
Zoznam prijatých tagov pre článok (výstup Kroku A — Tags).

### 6.2 Anchor detekcia (bez LLM)

**Knižnica:** SpaCy `sk_core_news_lg`

```python
def get_anchor_lemmas(text: str) -> list[str]:
    doc = nlp_spacy(text)
    if _needs_morphodita_fallback(doc):
        return morphodita.get_lemmas(text)   # MVP2: po overení SpaCy presnosti
    return [t.lemma_ for t in doc]

def _needs_morphodita_fallback(doc) -> bool:
    if len(doc) > 1:  # viacslovný tag
        return True
    for token in doc:
        if token.lemma_ == token.text and token.is_alpha and len(token.text) > 4:
            return True  # SpaCy nevedelo lemmatizovať
    return False
```

**Dôvod voľby knižnice (nie LLM):**
- Anchor matching je deterministický problém — LLM je overkill
- API náklady a latencia pri NMH scale (tisíce článkov denne)
- SpaCy sk model bol navrhnutý interne v kontexte CMSD1778 (lemmatizácia pre SEO Checker) — zdieľame model, nulové extra náklady na infraštruktúru
- Morphodita (`ufal.morphodita`) ako fallback pre viacslovné tagy: zvážiť po reálnom testovaní SpaCy presnosti na NMH obsahu — `[DATA_GAP DG-L1]`

### 6.3 Hard filter (povinné podmienky)

| Podmienka | Zdroj dát |
|-----------|-----------|
| Tag je publikovaný | Tag API |
| Tag nie je blacklistovaný | Tag API / konfig |
| Tag je indexovateľný | Tag API (ak dostupné) — `[DATA_GAP DG-L6]` |
| Tag nie je už manuálne zalinkovaný v článku | Parser existujúcich linkov v texte |

Ak niektorá podmienka nie je splnená → tag sa preskočí. Žiadna chyba, žiadna zmena článku.

### 6.4 Soft filter / Validation vrstva

Cieľ: eliminovať zjavne nevhodné targety bez komplexného scoring modelu.

| Signál | Typ | Dôvod |
|--------|-----|-------|
| Relevancia voči článku | must-have | Základná zmysluplnosť návrhu |
| Freshness (recent activity) | doplnkový | Preferencia aktívnych tagov |
| Existencia obsahu | proxy kvalita | Tag nie je prázdny |
| Typ tagu | preferencia | Entity typy relevantné pre spravodajstvo |

Táto vrstva **nepredstavuje komplexný scoring model** — je to jednoduchý decision filter nad existujúcimi dátami z BE.

### 6.5 Selection a deduplication

- Pre každý anchor sa vyberá **jeden najlepší kandidát** (tag s najvyššou relevančnou skórou po filtroch)
- Ak sa rovnaká entita vyskytuje v texte viackrát → systém navrhne link **iba raz**: výber podľa priority:
  1. Nie perex
  2. Najlepší kontext (nie headline, nie posledná veta)
  3. Správna link density (max. 1 link/veta, max. 1–2/odstavec)

### 6.6 Link density pravidlá

| Pravidlo | Hodnota |
|----------|---------|
| Max. linky na vetu | 1 |
| Max. linky na odstavec | 1–2 (podľa dĺžky) |
| Perex | žiadny link |
| Max. linky na článok | 5 (konfigurovateľné: `seo_copilot.max_links_per_article`) |

---

## 7. UI / UX

### Návrh karty

```
┌─────────────────────────────────────────────────────┐
│ Interný link                          Odst. 3  ●    │
│ kreatín monohydrát  →  Kreatín                      │
│ „...štúdie naznačujú, že kreatín monohydrát mohol   │
│  predstavovať prelom v suplementácii..."             │
│                                                     │
│  [✓ Pridať link]          [Odmietnuť]               │
└─────────────────────────────────────────────────────┘
```

### Header sekcie

```
Tagy & Interné linky   [3 nových]          [Pridať všetky (3)]
```

### Stavové labely

| Stav | Label | Farba |
|------|-------|-------|
| Nespracovaný | modrá bodka | modrá |
| Prijatý | „Pridané" + ✓ | zelená |
| Odmietnutý | „Odmietnuté" | sivá |
| Krok B disabled | tlačidlá sivé + tooltip | sivá |

### UI Copy

| Element | Text |
|---------|------|
| Sekcia | „Tagy & Interné linky" |
| Krok B disabled tooltip | „Najprv prijmite navrhované tagy (Krok A)" |
| Bulk button (N≥2) | „Pridať všetky (N)" |
| Bulk button (N=1) | „Pridať link" |
| Prijatý stav | „Pridané" |
| Odmietnutý stav | „Odmietnuté" |
| Všetky spracované | „Všetky návrhy linkov spracované" |
| API nedostupné | „Návrhy linkov sú dočasne nedostupné." |
| Krok A chýba | „Najprv prijmite navrhované tagy (Krok A)" |

---

## 8. EDGE CASES

| # | Scenár | Systémové správanie | UI reakcia |
|---|--------|---------------------|------------|
| EL1 | Žiadny tag neprejde filtrom | 0 návrhov; fail-safe | Sekcia sa nezobrazí |
| EL2 | Všetky tagy blacklistované | 0 návrhov | Sekcia sa nezobrazí |
| EL3 | Anchor text len v perexe | Návrh sa nevytvorí | – |
| EL4 | Tá istá entita 5× v texte | 1 návrh (najlepší výskyt po perexe) | Karta pre 1 link |
| EL5 | Tag manuálne zalinkovaný | Systém tag preskočí | – |
| EL6 | Článok kratší ako 3 odstavce | 0 návrhov; guard na krátky obsah | – |
| EL7 | BE API nedostupné | `suggestions_skipped`; článok nezmenený | Banner: „Návrhy linkov sú dočasne nedostupné." |
| EL8 | Krok B aktivovaný pred Krokom A | Tlačidlá disabled | Tooltip: „Najprv prijmite navrhované tagy (Krok A)" |
| EL9 | Redaktor publikuje bez interakcie | Neinteragované návrhy → `ignored` pri publishi | Publish prebehne normálne; `[DATA_GAP DG-L2]` |
| EL10 | Incremental: editor má existujúce linky z predchádzajúcej session | MVP1: nová validácia prepíše predchádzajúce návrhy; `[DATA_GAP DG-L3]` pre diff-approach | – |
| EL11 | SpaCy nevedelo lemmatizovať anchor | Fallback: Morphodita (ak dostupná); ak nie → návrh sa nevytvorí | – |

---

## 9. EVENT LOGGING / JSON SCHEMA

### Suggestion Object

```typescript
type LinkSuggestion = {
  suggestion_id: string;           // UUID, povinný
  suggestion_type: "internal_link";
  anchor_text: string;
  target_id: string;               // tag ID
  target_label: string;            // zobrazovaný názov tagu
  target_url: string;              // URL tag stránky
  context_snippet: string;         // výrez vety s anchorom
  suggestion_source: "rule_based" | "hybrid"; // nie "ai" — bez LLM
  article_id: string;              // [DATA_GAP DG-L2]
  site_id: string;
  article_type: string;
  position_in_text: {
    paragraph_index: number;
    sentence_index: number;
  };
};
```

### User Action Event

```typescript
type LinkAction = {
  suggestion_id: string;
  action: "accepted" | "rejected" | "ignored";
  timestamp: number;               // Unix ms
  editor_id: string | null;
  article_id: string;
  site_id: string;
  article_type: string;
};
```

### Event typy

| Event | Kedy |
|-------|------|
| `suggestions_generated` | Po každej validácii (aj 0 návrhov) |
| `suggestion_accepted` | Redaktor klikol „Pridať link" (aj pri bulk) |
| `suggestion_rejected` | Redaktor klikol „Odmietnuť" |
| `suggestion_ignored` | Neinteragované pri publishi / konci session |
| `suggestions_skipped` | API nedostupné; 0 návrhov z technického dôvodu |

### Technické pravidlá

- Každý návrh má unikátne `suggestion_id` (UUID)
- Každá interakcia je samostatný event (append-only log)
- Eventy obsahujú dostatočný kontext na spätnú analýzu
- MVP1: JSON export pre QA; DataHub napojenie = ďalší krok (`[DATA_GAP DG-L5]`)

---

## 10. ACCEPTANCE CRITERIA — SÚHRNNÝ CHECKLIST

**Flow a podmienky:**
- [ ] Krok B je disabled pred dokončením Kroku A (Tags)
- [ ] Po Kroku A sa Krok B automaticky aktivuje (bez reloadu)
- [ ] Systém navrhne min. 1 link na článok (ak prejde filtrami)

**Filtre:**
- [ ] Hard filter: publikovaný tag, nie blacklist, nie duplikát existujúceho linku
- [ ] Soft filter: relevancia, freshness, existencia obsahu, typ tagu
- [ ] Žiadny link do perexu
- [ ] Link density pravidlá rešpektované

**Deduplication:**
- [ ] Rovnaká entita navrhnutá max. 1× (najlepší výskyt)
- [ ] Pre každý anchor = 1 najlepší kandidát

**UI:**
- [ ] Každý návrh zobrazuje: anchor, cieľ, kontext vety, badge odstavca
- [ ] „Pridať všetky (N)" aktívne pri N≥2; „Pridať link" pri N=1
- [ ] Každá karta: „Pridať link" + „Odmietnuť"

**Logging:**
- [ ] Každý event obsahuje: `suggestion_id`, `action`, `timestamp`, `article_id`, `site_id`
- [ ] `suggestions_generated` zalogovaný pri každej validácii
- [ ] `suggestion_ignored` pri neinteragovaných návrhoch

**Fail-safe:**
- [ ] Žiadna akcia nesmie blokovať publish flow
- [ ] Ak API zlyhá: 0 návrhov, článok ostáva nezmenený, event `suggestions_skipped`

---

## 11. FEATURE FLAGS

```
seo_copilot.linkbuilding.enabled          // false — zapína celý flow per redakcia
seo_copilot.max_links_per_article         // 5 — max. návrhov na článok
seo_copilot.linkbuilding.require_step_a   // true — Krok B podmienený Krokom A
```

Vypínateľné bez nového deployu, per brand/tenant.

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
|---------|------|
| CTR interných linkov v texte | Nárast vs. baseline |
| Počet klikov na interné linky / článok | Nárast vs. baseline |

### Sekundárne metriky

| Metrika | Cieľ |
|---------|------|
| Adoption rate | Koľko % článkov využilo návrhy |
| Acceptance rate | Koľko % návrhov redaktori prijali |
| Pages per session | Orientačný dopad na engagement |
| Time on article | Orientačný dopad |

### Výstup

- Vyhodnotenie dopadu na engagement a traffic
- Rozhodnutie o rozšírení (MVP2: články ako cieľ, pokročilý scoring, GSC dáta)

---

## 13. SMEROVANIE — MVP2 A ĎALEJ

| Funkcia | Verzia |
|---------|--------|
| Rozšírenie targetov: články (nielen tagy) | MVP2 |
| Pokročilý scoring model (relevancia, veľkosť, aktivita, SEO kvalita) | MVP2 |
| Performance-based ranking (GSC, traffic dáta) | MVP2 |
| Variabilita a optimalizácia anchor textov | MVP2 |
| Morphodita fallback po overení SpaCy presnosti na NMH obsahu | MVP2 |
| Systematická práca s kvalitou tagov (TAGY 3.0) | Post-MVP |
| Historická optimalizácia anchor textov | Post-MVP |

---

## HISTÓRIA DOKUMENTU

| Verzia | Dátum | Autor | Zmena |
|--------|-------|-------|-------|
| 0.1 | 2026-04-12 | Daniel Budziňák | Pôvodný návrh `SEO_Copilot_Linkbuilding_MVP1.pdf` |
| 1.0 | 2026-04-28 | Daniel Budziňák | Formalizácia do Jira spec; aktualizácia o NLP knižnicu (SpaCy, bez LLM); Krok A → Krok B workflow; deduplication (1 entita = 1 návrh); best candidate výber; bulk UI (Pridať všetky N); nové DATA GAP DG-L1 až DG-L6; edge cases EL1–EL11; rozšírené JSON schema |

---

*Súvisí s `MDIE_C_Jira_Spec.pdf` (Article Performance Layer — Phase 1 scope) a `SEO_Copilot_Tags_MVP1` (Krok A — podmienka pre aktiváciu tohto flow).*

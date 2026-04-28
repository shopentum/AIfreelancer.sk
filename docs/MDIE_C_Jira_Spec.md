# MDIE C: Produktové zadanie pre vývojový tím
## Article Performance Layer — Validation, SEO & Linkbuilding Feature
> **Dokument:** Confluence / Jira Epic + Story + Design Zámer
> **Projekt:** Media Decision Intelligence Engine (MDIE) — Article Performance Layer
> **Autor:** Daniel Budziňák, Senior Product Manager
> **Verzia:** 3.1 | Dátum: 2026-04-28
> **Status:** In Progress — Phase 1 aktívna implementácia

---

## 0. KONTEXT A AKTUÁLNY DATA GAP

Dokument vychádza z funkčného prototypu (aifreelancer.sk/nmh) a z kontextu získaného počas prvého týždňa v NMH.

**Čo vieme:**
- CMS architektúra: `Admin → Core → Data Composer → Content Provider → Frontend`
- Validation layer sa napája na Admin — pracuje výhradne s **draftom** článku, nie s live verziou
- AI service pre tagy a alternatívne titulky existuje; adopcia AI funkcií je ~75 %, ale hodnota (KPI) nie je jasne meraná
- Tag API existuje; každá site má vlastnú množinu tagov; AI generovanie tagov funguje na ~95 % kvalite
- Linkbuilding má komplexný architektonický návrh, ale bez produkčne overeného MVP
- DataHub existuje ako cieľová analytická vrstva; baseline metriky nie sú vždy dostupné

**Aktuálne DATA GAP `[DATA_GAP]`:**

| # | Gap | Zodpovednosť |
|---|-----|--------------|
| DG-1 | Finálne váhy Readiness Score pilierov | `[PM DECISION]` PM + šéfredaktor pilota |
| DG-2 | API kontrakt validation requestu: `article_id`, `site_id`, `article_type` — kto ich poskytuje? | Backend / Admin tím |
| DG-3 | DataHub endpoint pre príjem suggestion eventov — existuje alebo treba nový? | DataHub tím |
| DG-4 | Lifecycle stavu `ignored`: kedy sa návrh označí ako ignorovaný — pri zatvorení / publishi / konci session? | PM + Backend |
| DG-5 | Pravidlá indexácie tagov dostupné cez API? | Backend / SEO tím |
| DG-6 | Je SpaCy (`sk_core_news_lg`) alebo iná NLP knižnica už v AI service stacku? (súvisí s CMSD1778) | Backend / AI service tím |
| DG-7 | Skip / návrat: ak redaktor publikuje bez interakcie s návrhmi → `ignored`; môže spustiť Krok A alebo Krok B znova po publishi? | PM + Backend |
| DG-8 | Incremental use case: editor má existujúce linky z predchádzajúcej session — systém vie diff-ovať a navrhnúť iba nové? | Backend / AI service tím |
| DG-9 | Scope nasadenia: ktoré site / rubriky vstupujú do Phase 1 pilota? | Matej / PM |

---

## 1. KONTEXT A PRODUKT ZÁMER

EAGLE CMS má vysokú adopciu AI funkcií (~75 % článkov). Problém nie je adopcia — je to chýbajúca **merateľná hodnota**. AI copilot pomáha tvoriť obsah, ale neexistuje vrstva, ktorá by redaktorovi aktívne pomáhala pripraviť článok na výkon: správne tagy, interné prelinkovanie, vyriešené rizikové tvrdenia, SEO polia.

Táto feature rieši práve to: **Article Performance Layer** — rozšírenie existujúceho editora o validačný a optimalizačný panel, ktorý funguje na drafte článku, nezasahuje do publish flow a zbiera dáta pre meranie skutočného dopadu.

> **Scope tohto zadania:** Validácia draftu článku → identifikácia rizikových tvrdení + SEO príležitostí + chýbajúcich tagov + príležitostí na interné prelinkovanie → redaktor rozhoduje o každom návrhu → systém loguje interakcie pre DataHub.

**Čo tu nie je:** tvorba draftu (Creation layer), distribúcia, integrácia na externé fact-check API, automatické publikovanie, globálna optimalizácia tag databázy.

**Pozícia v CMS architektúre:**
```
Admin (editor pracuje s draftom)
  └─► Validation / Performance Layer (tento dokument)
        ├─► AI service (tagy, linky, claim opravy)
        └─► Event logging → DataHub
Core (zdroj pravdy, draft → publish → Data Composer → Content Provider → Frontend)
```

**Kľúčový princíp:** AI navrhuje → redaktor rozhoduje → systém loguje → DataHub vyhodnocuje.

---

## 2. FEATURE SUMMARY

**Čo riešenie robí:** Article Performance Layer je panel v pravej časti editora, ktorý počas práce s draftom identifikuje príležitosti na zlepšenie článku v štyroch oblastiach: dôveryhodnosť tvrdení, štýl, SEO a výkon (tagy + interné linky). Každý návrh je odôvodnený a redaktor ho môže jedným klikom prijať, upraviť alebo vedome ignorovať.

**Aký problém rieši:**
- Adopcia AI ≠ hodnota. ~75 % článkov používa AI, ale KPI sú nejasné.
- Redaktor nemá jednotné miesto, kde by videl, čo ešte chýba pre výkon článku.
- Chýba closed-loop: feature → použitie → dopad na traffic/engagement.

**Ako funguje:** Redaktor otvorí draft → spustí validáciu → panel zobrazí návrhy v záložkách (Dôvera / Štýl / SEO) a sekciách (Navrhované tagy / Interné linky) → redaktor rozhoduje o každom návrhu → Readiness Score rastie → článok je pripravený na publikáciu.

**Prečo je dôležité:** Systém nepredpisuje obsah. Poskytuje redaktorovi kontext na rýchle rozhodnutie a zaznamenáva každú interakciu pre spätnú analýzu dopadu.

**User Flow (príklad):**
Redaktor otvorí draft → „Validovať" → systém navrhne 3 opravy tvrdení + 2 SEO úpravy + 5 tagov + 3 interné linky → redaktor vyrieši 8/10 návrhov za 2 minúty → Readiness Score: 91 % → publikuje.

---

## 3. ROZSAH RIEŠENIA A FÁZOVANIE

### 3.1 Phase 1 (Aktuálna implementácia): Tags & Linkbuilding MVP

Implementuje sa podľa samostatnej spec: `SEO_Copilot_Linkbuilding_MVP1.pdf`

Zahrnuté:
- Navrhované tagy pre článok (chip set, Pridať set / odstrániť individuálne)
- Návrhy interných linkov (anchor → cieľový tag, Pridať link / Odmietnuť)
- Základné pravidlá link density (max. 1 link/veta, max. 1–2/odstavec, žiadny link do perexu)
- Hard filter: publikovaný tag, nie blacklistovaný, nie prázdny, nie duplikát existujúceho linku
- Soft filter: relevancia, freshness, existencia obsahu, typ tagu
- HITL: redaktor potvrdí každý návrh pred aplikovaním
- Event logging: `suggestions_generated`, `suggestion_accepted`, `suggestion_rejected`, `suggestion_ignored` (kompatibilné s DataHub)
- Fail-safe: ak API zlyhá, článok ostáva nezmenený

### 3.2 Phase 2: Full Article Performance Layer

Integrácia validačného panela (Dôvera / Štýl / SEO) s Performance vrstvou (Tagy / Linky) v jednom paneli:
- Claim validation a AI-Assisted Fix (Trust / Style)
- SEO návrhy (titulok, SEO titulok, URL, perex)
- Tagy + interné linky (z Phase 1)
- Unified Readiness Score naprieč všetkými piliermi
- Collab Lock (optimistic locking cez ETag)
- Undo stack (max. 5 krokov)
- Export audit logu (JSON → DataHub)

### 3.3 Out of Scope (Phase 3+)

- Overovanie zdrojov cez externé fact-check API
- Plnohodnotné Editorial Identity Layer (tón a pravidlá per značka)
- Automatické smerovanie úloh na rôzne AI modely (viď MDIE B Príloha)
- Analytické dashboardy a prehľady Time-to-Fix
- Undo snapshots uložené na serveri prepojené s Audit Trail
- Živá prítomnosť editorov cez WebSocket (Collab Lock 2. fáza)
- Feedback Loop & Model Calibration: aktívne učenie modelu z dát (MVP: iba logging)
- Výkon článku rozšírený o multimédiá, ankety, galérie, video (post-MVP)

### 3.4 Ako budeme postupovať

Phase 1 (Tags + Linkbuilding) → zbierame dáta (adoption rate, acceptance rate, CTR) → Phase 2 (Full Panel) stavia na overenom základe. Každá fáza je samostatne dodateľná a merateľná.

---

## 4. EPIC

**Názov epicu:** `[MDIE-EPIC-01] Article Performance Layer`
**Priorita:** P0 (pilot blocker)
**Labels:** `mdie`, `validation`, `performance-layer`, `linkbuilding`, `tags`, `audit`, `cms-adapter`, `resilience`
**Cieľ:** Redaktor má v editore jeden panel, ktorý mu aktívne pomáha pripraviť článok na výkon — správne tvrdenia, SEO, tagy a interné linky — s plným auditným záznamom a bez blokovania publish flow.

---

## 5. USER STORIES (MVP Scope)

### Story 1: Spustenie validácie
```
MDIE-101
Ako redaktor
Chcem spustiť validáciu môjho draftu priamo z editora
Aby som dostal štruktúrovaný prehľad príležitostí bez toho, aby som musel otvárať iný nástroj.
```

**Acceptance Criteria:**
- [ ] Tlačidlo „Validovať článok" je viditeľné v Intelligence bare nad editorom
- [ ] Po kliknutí sa spustí loading stav (spinner + text „Analyzujem…")
- [ ] Po dokončení sa v pravom paneli zobrazia záložky: Dôvera | Štýl | SEO s počtom nálezov
- [ ] Pod záložkami sú sekcie: Navrhované tagy | Interné linky
- [ ] Readiness Score (0–100 %) sa zobrazí v progress bare s animovaným counterom od 0
- [ ] Ak je validácia aktívna a redaktor klikne znova, tlačidlo je disabled (prevent duplicate)
- [ ] Ak je článok uzamknutý iným editorom (Collab Lock), tlačidlo je disabled s tooltipom

**Edge cases:**
| Scenár | Správanie | UI copy |
|--------|-----------|---------|
| API nedostupné / timeout | Validácia skončí bez výsledku, redaktor môže pokračovať | „AI Validácia je dočasne nedostupná. Môžete pokračovať v manuálnej editácii." |
| Prázdny článok | Validácia sa nespustí | Tooltip: „Pridajte text článku pred spustením validácie." |
| Collab Lock zapnutý | Tlačidlo disabled | Tooltip: „Článok upravuje iný editor — validáciu spustíte po uvoľnení zámku." |

---

### Story 2: Zobrazenie nálezu s education layer
```
MDIE-102
Ako redaktor
Chcem pri každom náleze vidieť nielen kategóriu, ale aj jednu zrozumiteľnú vetu prečo systém nález identifikoval
Aby som rozumel logike AI a nemusel hádať, čo mám opraviť.
```

**Acceptance Criteria:**
- [ ] Každý nález v zozname zobrazuje **iba**: `shortLabel` + citovaný text z článku, bez dlhých popisov
- [ ] Nálezy sú zoradené: vysoké riziko → stredné → nízke
- [ ] Kliknutie na kartu nálezu otvorí detail v tom istom paneli
- [ ] V detaile je **na vrchu TL;DR box** (modrý, 1 veta z `whyFlagged`)
- [ ] Text z článku zodpovedajúci nálezu je vizuálne zvýraznený priamo v editore (highlight)
- [ ] Kliknutie na zvýraznený úsek textu v editore otvorí zodpovedajúci detail nálezu v pravom paneli a automaticky prepne na správnu záložku (Dôvera / Štýl / SEO)
- [ ] Ak sa na danom mieste prekrýva viac nálezov, aktivuje sa nález s najvyšším rizikom (high → medium → low)
- [ ] Vyriešené nálezy sa zobrazia v sekcii „Vyriešené" dole v zozname s typom riešenia

**Edge cases:**
| Scenár | Správanie |
|--------|-----------|
| Nález sa nenachádza v texte (text zmenený pred validáciou) | Highlight sa nezobrazí, nález ostáva v zozname bez zvýraznenia |
| Viac nálezov na rovnakom texte | Zobrazí sa každý zvlášť; highlight sa kombinuje |

---

### Story 3: AI-Assisted Fix s auditným záznamom
```
MDIE-103
Ako redaktor
Chcem jedným kliknutím nechať AI navrhnúť a aplikovať opravu konkrétneho nálezu
Aby som ušetril čas na rutinných opravách a mal garantovaný auditný záznam o každej zmene.
```

**Acceptance Criteria:**
- [ ] V detaile nálezu sú **tri akcie**: „Opraviť pomocou AI" (primárna), „Upraviť ručne", „Ignorovať"
- [ ] **AI fix:** Po kliknutí AI opraví text v editore, zelený fade (~2,5 s), nález → „Vyriešené" s labelom „Opravené AI", Readiness Score sa zvýši
- [ ] **Upraviť ručne:** Editor sa presunie na dané miesto v texte, tlačidlo → „Potvrdiť opravu" → po potvrdení nález → „Vyriešené", Readiness Score sa zvýši
- [ ] **Ignorovať:** Nález → „Vyriešené" s labelom „Ignorované (vedomé rozhodnutie)", Readiness Score sa zvýši
- [ ] **SEO: Použiť návrh:** AI hodnota sa skopíruje do poľa, položka zobrazí „Použité", Readiness Score sa zvýši
- [ ] **SEO: Ignorovať:** Položka zobrazí „Ignorované", Readiness Score sa zvýši; pole ostáva nezmenené
- [ ] Do audit logu sa zapíše: `suggestion_id`, `actorId`, `source`, `resolutionType`, `claimId`, `timestamp`, `article_id`, `site_id`
- [ ] Redaktor má možnosť vrátiť AI fix cez „Späť" (Undo stack, max. 5 krokov)
- [ ] Po Undo: fialový flash (~1 s) na obnovených poliach

**Edge cases:**
| Scenár | Správanie | UI copy |
|--------|-----------|---------|
| AI vráti prázdny reťazec | Oprava sa neaplikuje | „Oprava sa nepodarila. Upravte text ručne alebo skúste znova." |
| Collab Lock zapnutý | Tlačidlo disabled | Tooltip: „Článok upravuje iný editor — AI úpravy sú pozastavené." |
| API nedostupné | Oprava sa nespustí | „AI funkcie sú dočasne nedostupné. Môžete pokračovať v manuálnej editácii." |
| Text nálezu nenájdený v dokumente | Oprava sa nespustí | „Text nálezu sa v článku nenašiel. Nález skontrolujte ručne." |

**Definícia Done:**
- Unit testy pre `handleFixWithAI` (success, empty result, not found)
- Integration test: klik → audit záznam → undo → audit záznam
- Feature flag: `mdie.fix.ai_enabled` (vypnuteľné per tenant)

---

### Story 4: Kolaboračný zámok (Collab Lock)
```
MDIE-104
Ako redaktor
Chcem vidieť, ak niekto iný práve upravuje ten istý článok
Aby som omylom neprepísal jeho prácu.
```

**Acceptance Criteria:**
- [ ] Ak je článok uzamknutý, zobrazí sa žltý banner: „Aktuálne upravuje: {meno}. Vy ste v režime čítania."
- [ ] Editor (textarea) je `readOnly`
- [ ] Validácia, AI fix, SEO návrhy a Tagy/Linky akcie sú disabled s príslušnými tooltipmi
- [ ] Undo (Späť) je disabled počas zámku
- [ ] Po uvoľnení zámku sa všetky prvky obnovia automaticky (bez reloadu stránky)

**Technická poznámka:**
Pilot: zamykanie pomocou `If-Match` / `ETag` (optimistic locking).
Plná prevádzka: živá prítomnosť editorov cez WebSocket (napr. Ably / Supabase Realtime).

---

### Story 5: Export audit logu
```
MDIE-105
Ako pilot owner alebo QA
Chcem stiahnuť JSON log všetkých udalostí z aktuálnej session
Aby som mohol vyhodnotiť adopciu a identifikovať UX problémy bez prístupu do produkčnej DB.
```

**Acceptance Criteria:**
- [ ] Tlačidlo „Export logu" je v Intelligence bare
- [ ] Stiahne sa súbor `eagle-test-log-{timestamp}.json`
- [ ] Súbor obsahuje: `events[]`, `metrics` (aiFixCount, timeToFixMsAvg, linkSuggestions, tagSuggestions), `resolvedClaims[]`, `seoChangeLog[]`
- [ ] `timeToFixMs` = čas od prvého otvorenia karty nálezu po vykonanie opravy
- [ ] Každý event má `suggestion_id`, `article_id`, `site_id`, `editor_id`, `timestamp`

---

### Story 6: Navrhované tagy — Krok A (Phase 1)
```
MDIE-106
Ako redaktor
Chcem pri každom článku vidieť navrhované tagy s možnosťou prijať celý set alebo odstrániť nevhodné
Aby som nemusel tagy hľadať manuálne a mal ich kontextuálne odporúčanie priamo v editore.
```

> **Krok A** — Tagy musia byť prijaté (ručne alebo cez „Pridať všetky") pred tým, než systém aktivuje návrhy interných linkov (Krok B). Dôvod: interné linky vedú na tag stránky — bez prijatých tagov nemajú platné cieľové URL.

**Acceptance Criteria:**
- [ ] Po validácii sa v SEO záložke zobrazí sekcia „Navrhované tagy" označená ako **Krok A**
- [ ] Sekcia Interných linkov (Krok B) je viditeľná, ale tlačidlá „Pridať link" a „Pridať všetky" sú **disabled** pokiaľ nie je dokončený Krok A
- [ ] Tooltip na disabled Krok B: „Najprv prijmite navrhované tagy (Krok A)"
- [ ] Tagy sú zobrazené ako klikateľné chipy s náhľadom URL tagu (hover tooltip)
- [ ] Každý chip má tlačidlo `×` pre individuálne odstránenie zo setu
- [ ] Ak zostávajú **2 a viac** tagov: zobrazí sa tlačidlo „Pridať všetky (N)" — hromadné pridanie celého zostávajúceho setu jedným kliknutím; N sa dynamicky aktualizuje pri každom `×`
- [ ] Ak zostáva **1 tag**: zobrazí sa tlačidlo „Pridať tag" (singulár) namiesto hromadnej akcie
- [ ] Po hromadnom pridaní sa všetky chipy zafarbia zeleno, Readiness Score sa zvýši
- [ ] Badge počítadlo „X tagov" sa aktualizuje s každým `×`
- [ ] Ak redaktor odstráni všetky: „Všetky tagy boli odstránené."
- [ ] Každá akcia (pridanie setu, odstránenie tagu) je zalogovaná ako event s `suggestion_id`
- [ ] Ak API pre tagy zlyhá: 0 návrhov, článok ostáva nezmenený, event: `suggestions_skipped`
- [ ] Collab Lock: sekcia disabled s tooltipom

**Edge cases:**
| Scenár | Správanie |
|--------|-----------|
| Žiadny tag neprejde filtrom | 0 návrhov, sekcia sa nezobrazí |
| Tag už existuje v článku | Systém ho nenavrhne (deduplikácia) |
| API nedostupné | `suggestions_skipped`, článok nezmenený |

**Feature flags:** `article_validation.performance_layer.enabled`, `article_validation.event_logging.enabled`

---

### Story 7: Návrhy interných linkov — Krok B (Phase 1)
```
MDIE-107
Ako redaktor
Chcem vidieť návrhy interných linkov s kontextom vety, kde link patrí
Aby som nemusel manuálne hľadať vhodné miesta na prelinkovanie.
```

> **Krok B** — Podmienený Krokom A. Tlačidlá pre akceptovanie linkov sú aktívne až po prijatí tagov. Systém navrhuje linky priebežne (sú viditeľné), ale interakcia je zablokovaná.

**Acceptance Criteria:**
- [ ] Po validácii sa v SEO záložke zobrazí sekcia „Tagy & Interné linky" označená ako **Krok B**
- [ ] Ak Krok A nie je dokončený: tlačidlá „Pridať link" a „Pridať všetky (N)" sú **disabled** s tooltipom „Najprv prijmite navrhované tagy (Krok A)"
- [ ] Po dokončení Kroku A sa Krok B automaticky aktivuje (bez reloadu)
- [ ] Každý návrh obsahuje: anchor text (zvýraznený), šípku → cieľový tag, výrez kontextovej vety
- [ ] Ak zostávajú **2 a viac** nespracovaných návrhov: zobrazí sa tlačidlo „Pridať všetky (N)" — hromadné prijatie jedným kliknutím; N sa aktualizuje s každou vyriešenou kartou
- [ ] Ak zostáva **1 nespracovaný** návrh: zobrazí sa tlačidlo „Pridať link" (singulár)
- [ ] Na každej karte dve akcie: „Pridať link" (zelené) / „Odmietnuť" (sivé)
- [ ] Po „Pridať link" (jednotlivo aj hromadne): karta zobrazí „Pridané", Readiness Score sa zvýši, event zalogovaný pre každý link
- [ ] Po „Odmietnuť": karta zobrazí „Odmietnuté", event zalogovaný
- [ ] **Deduplication — entita:** Ak sa rovnaký tag/entita vyskytuje v texte viackrát, systém navrhne link **iba raz** (pre najvhodnejší výskyt — nie perex, najlepší kontext, správna density)
- [ ] Anchor text sa vyberá výhradne z existujúcich výskytov v texte (nie generovanie nových fráz)
- [ ] Pre každý anchor sa vyberá **jeden najlepší kandidát** (tag s najvyššou relevančnou skórou)
- [ ] Systém rešpektuje link density: max. 1 link/veta, max. 1–2 linky/odstavec
- [ ] Žiadny link do perexu
- [ ] Ak sa anchor nenašiel v texte: návrh sa nevytvorí
- [ ] Ak tag je už manuálne zalinkovaný: systém ho preskočí (deduplikácia existujúcich linkov)

**Edge cases:**
| Scenár | Správanie |
|--------|-----------|
| Anchor len v perexe | Návrh sa nevytvorí |
| Všetky tagy sú blacklistované | 0 návrhov |
| Článok kratší ako 3 odstavce | Systém nenavrhuje linky |
| Redaktor nič neurobí do publishu | Neinteragované návrhy sa označia ako `ignored` (viď DG-7) |
| Tá istá entita 5× v texte | Systém navrhne 1 kartu (najlepší výskyt), nie 5 |
| Krok B aktivovaný pred Krokom A | Tlačidlá disabled, tooltip aktívny |

**Feature flags:** `seo_copilot.linkbuilding.enabled`, `seo_copilot.max_links_per_article` (default: 5)

---

## 6. WORKFLOW / LOGIKA PROCESU

```
[Redaktor otvorí DRAFT článku v Admin editore]
        │
        ▼
[Klikne "Validovať článok"]
        │
        ├─── [Collab Lock aktívny?] ──YES──► [Disabled, tooltip]
        │
        ├─── [API dostupné?] ──NO──► [Banner: "Nedostupné, editujte ručne"]
        │                                    │
        ▼                                    ▼
[Loading "Analyzujem…"]               [Audit log: audit_failed_unavailable]
        │
        ▼
[Zobrazia sa výsledky v paneli]
[Záložky: Dôvera | Štýl | SEO + sekcie: Navrhované tagy | Interné linky]
[Readiness Score animuje od 0 po vypočítanú hodnotu]
[Zvýraznené úseky textu v editore sú klikateľné]
        │
        ├──► [Redaktor klikne na zvýraznený text v editore]
        │    [Panel otvorí zodpovedajúci detail nálezu]
        │    [Správna záložka sa aktivuje automaticky]
        │    [Pri prekrytí: aktivuje sa nález s najvyšším rizikom]
        │
        ▼
[Redaktor klikne na kartu nálezu / tagu / linku]
[Audit: claimFirstSeenAt = now()]
        │
        ├──► [Opraviť pomocou AI]
        │    [AI opraví text → zelený fade → "Opravené AI" → Score↑ → Undo snapshot]
        │
        ├──► [Upraviť ručne]
        │    [Editor sa presunie → "Potvrdiť opravu" → "Upravené ručne" → Score↑]
        │
        ├──► [Ignorovať (nález / SEO)]
        │    ["Ignorované (vedomé rozhodnutie)" → Score↑ → event logged]
        │
        ├──► [Krok A: Pridať všetky / Pridať tag (tagy)]
        │    [Zostatok tagov pridaný → chipy zelené → Score↑ → event: tags_committed]
        │    [Krok A dokončený → Krok B sa automaticky aktivuje]
        │
        ├──► [Odstrániť tag ×]
        │    [Tag zo setu odstránený → event: tag_removed]
        │
        ├──► [Krok B: Pridať link / Pridať všetky (linky)]
        │    [Podmienka: Krok A musí byť dokončený]
        │    [Ak Krok A nie je dokončený → tlačidlá disabled, tooltip aktívny]
        │    [Po splnení podmienky: Link prijatý → "Pridané" → Score↑ → event: link_suggestion_accepted]
        │
        ├──► [Odmietnuť link]
        │    ["Odmietnuté" → event: link_suggestion_rejected]
        │
        └──► [Späť (Undo)]
             [Obnoví posledný snapshot → fialový flash]
                    │
                    ▼
        [Publish Gate — SOFT (nikdy neblokuje publish flow)]
        [Score ≥ 80 %: zelený badge "Pripravené"]
        [Score 50–79 %: žltý badge "Odporúčame dokončiť"]
        [Score < 50 %: červený badge "Nevyriešené nálezy"]
        [Publish tlačidlo je aktívne vo všetkých prípadoch]
```

---

## 7. UI COPY: KOMPLETNÉ TEXTÁCIE

### Tlačidlá a akcie

| Element | Default | Loading/Active | Disabled |
|---------|---------|----------------|----------|
| Validovať | „Validovať článok" | „Audit v procese…" | Sivé (disabled) |
| Opraviť pomocou AI | „Opraviť pomocou AI" | „Opravujem…" + spinner | Sivé (lock / API) |
| Upraviť ručne | „Upraviť ručne" | – | – |
| Potvrdiť opravu | „Potvrdiť opravu" | – | – |
| Ignorovať (nález/SEO) | „Ignorovať" | – | Sivé (Collab Lock) |
| Použiť návrh (SEO) | „Použiť návrh" | – | Sivé (lock / API) |
| Pridať všetky (tagy, N≥2) | „Pridať všetky (N)" | – | Sivé (Collab Lock) |
| Pridať tag (tagy, N=1) | „Pridať tag" | – | Sivé (Collab Lock) |
| Pridať všetky (linky, N≥2) | „Pridať všetky (N)" | – | Sivé (Collab Lock) |
| Pridať link (linky, N=1 / jednotlivo) | „Pridať link" | – | Sivé (Collab Lock) |
| Odmietnuť (link) | „Odmietnuť" | – | – |
| Späť (Undo) | „Späť (N)" | – | Sivé (disabled) |
| Export logu | „Export logu" | – | – |

### Tooltipy (hover)

| Element | Tooltip |
|---------|---------|
| Validovať (Collab Lock) | „Článok upravuje iný editor — validáciu spustíte po uvoľnení zámku." |
| Opraviť pomocou AI (Collab Lock) | „Článok upravuje iný editor — AI úpravy sú pozastavené." |
| Opraviť pomocou AI (API down) | „AI funkcie sú dočasne nedostupné." |
| Ignorovať (Collab Lock) | „Nemožno ignorovať počas zámku — článok upravuje iný editor." |
| Späť: prázdna história | „Nie je čo vrátiť. Zatiaľ ste nepoužili AI opravu nálezu ani SEO návrh." |
| Späť: dostupný (N krokov) | „Späť (N): obnoví posledný stav pred AI úpravou (max. 5 krokov)." |
| Export logu | „Stiahnuť JSON s udalosťami a metrikami pre testy a DataHub." |

### Bannery a systémové hlášky

| Situácia | Text bannera |
|----------|-------------|
| API validácie nedostupné | „AI Validácia je dočasne nedostupná. Môžete pokračovať v manuálnej editácii." |
| AI fix nedostupný | „AI funkcie sú dočasne nedostupné. Môžete pokračovať v manuálnej editácii." |
| SEO návrh nedostupný | „AI návrhy sú dočasne nedostupné. Polia môžete vyplniť ručne." |
| Collab Lock | „Aktuálne upravuje: {meno}. Vy ste v režime čítania." |
| Text nálezu nenájdený | „Text nálezu sa v článku nenašiel. Nález skontrolujte ručne." |
| AI fix: prázdny výsledok | „Oprava sa nepodarila. Upravte text ručne alebo skúste znova." |
| Tags API nedostupné | „Návrhy tagov sú dočasne nedostupné. Tagy pridajte ručne." |

### Záložky, sekcie a stavové labely

| Element | Text |
|---------|------|
| Záložka 1 | „Dôvera" |
| Záložka 2 | „Štýl" |
| Záložka 3 | „SEO" |
| Sekcia tagov | „Navrhované tagy" |
| Sekcia linkov | „Tagy & Interné linky" |
| Readiness label | „Readiness Score" |
| Sekcia vyriešených | „Vyriešené" |
| Publish Gate: zelený | „Pripravené na publikáciu" |
| Publish Gate: žltý | „Odporúčame dokončiť validáciu" |
| Publish Gate: červený | „Článok obsahuje nevyriešené nálezy" |
| Tag: pridaný | „Pridané" |
| Link: prijatý | „Pridané" |
| Link: odmietnutý | „Odmietnuté" |
| Typ riešenia: AI fix | „Opravené AI" |
| Typ riešenia: ručne | „Upravené ručne" |
| Typ riešenia: ignorované | „Ignorované (vedomé rozhodnutie)" |

---

## 8. EDGE CASES: KOMPLETNÁ TABUĽKA

| # | Scenár | Systémové správanie | UI reakcia |
|---|--------|---------------------|------------|
| E1 | API validácie timeout | Job `failed`, `reason: provider_unavailable` | Banner: „AI Validácia je dočasne nedostupná…" |
| E2 | API vráti prázdny zoznam nálezov | Validácia úspešná, 0 nálezov | „Skvelé! Žiadne nálezy nenájdené. Readiness Score: 100 %" |
| E3 | Text nálezu nie je v dokumente | `indexOf` vráti -1, fix sa nespustí | „Text nálezu sa v článku nenašiel." |
| E4 | AI vráti prázdny string | Fix sa neaplikuje | „Oprava sa nepodarila. Upravte text ručne." |
| E5 | Collab Lock sa zapne počas AI volania | Po `await` sa skontroluje zámok; ak active → fix sa neaplikuje | Žltý banner |
| E6 | Undo stack plný (5/5) | Najstarší snapshot sa vymaže, nový sa pridá | Počítadlo ostáva na „(5)" |
| E7 | Nová validácia → história sa vymaže | `articleHistory = []` | Tlačidlo „Späť" sa deaktivuje |
| E8 | Duplicitné kliknutie na „Validovať" | Tlačidlo disabled, druhý request sa nespustí | Spinner + „Audit v procese…" |
| E9 | SEO návrh aplikovaný, potom Undo | Snapshot obnoví pôvodné SEO pole | Fialový flash na SEO poli |
| E10 | Článok bez textu, klik na Validovať | Guard na prázdny string | Tooltip: „Pridajte text článku." |
| E11 | Ignorovanie pri aktívnom Collab Lock | Tlačidlo „Ignorovať" disabled | Tooltip: „Nemožno ignorovať počas zámku." |
| E12 | Žiadny tag neprejde filtrom | 0 návrhov, sekcia sa nezobrazí | – |
| E13 | Anchor text len v perexe | Návrh sa nevytvorí | – |
| E14 | Tag už je manuálne zalinkovaný | Systém tag preskočí | – |
| E15 | Článok kratší ako 3 odstavce | Systém nenavrhuje linky | – |
| E16 | Tags API nedostupné | `suggestions_skipped`, 0 návrhov | Banner: „Návrhy tagov sú dočasne nedostupné." |
| E17 | Redaktor publikuje bez interakcie s návrhmi | Neinteragované návrhy označené ako `ignored` | Publish prebehne normálne |
| E18 | Viac nálezov na rovnakom texte editora | Klik aktivuje nález s najvyšším rizikom | Panel prepne na zodpovedajúci nález |
| E19 | Redaktor chce prijať link (Krok B) bez dokončeného Kroku A | Tlačidlá Krok B zostávajú disabled | Tooltip: „Najprv prijmite navrhované tagy (Krok A)" |
| E20 | Tá istá entita (napr. „kreatín") sa vyskytuje v texte 5× | Systém vytvorí 1 návrh linku pre najvhodnejší výskyt (nie perex, správna density, najlepší kontext) | – |
| E21 | Redaktor publikuje bez akejkoľvek interakcie s Krokom A alebo B | Všetky neinteragované návrhy dostanú stav `ignored` pri publishi | Publish prebehne normálne; `[DATA_GAP DG-7]` — presný lifecycle definuje PM + Backend |
| E22 | Incremental: editor má z predchádzajúcej session akceptované linky a chce dosuggestovať ďalšie | `[DATA_GAP DG-8]` — systém potrebuje vedieť diff-ovať existujúce vs. nové návrhy; MVP: nová validácia prepíše predchádzajúce návrhy | – |

---

## 9. ACCEPTANCE CRITERIA: SÚHRNNÁ CHECKLIST

**Funkčnosť — Validácia (Dôvera / Štýl / SEO):**
- [ ] Validácia sa spustí a zobrazí nálezy (UI loading)
- [ ] Každý nález zobrazuje: `shortLabel` + citácia
- [ ] Detail nálezu obsahuje TL;DR box (modrý, 1 veta) na vrchu
- [ ] Tri akcie: „Opraviť pomocou AI", „Upraviť ručne", „Ignorovať"
- [ ] Každá akcia presunie nález do „Vyriešené" s príslušným labelom
- [ ] SEO návrhy: „Použiť návrh" a „Ignorovať" fungujú s Readiness Score

**Funkčnosť — Tagy (Krok A):**
- [ ] Navrhované tagy sa zobrazia ako chip set označený „Krok A"
- [ ] `×` odstráni individuálny tag; počítadlo v badge sa aktualizuje
- [ ] „Pridať všetky (N)" / „Pridať tag" pridá zostatok a zvýši Readiness Score
- [ ] Po dokončení Kroku A sa Krok B automaticky aktivuje (bez reloadu)
- [ ] Všetky akcie sú zalogované s `suggestion_id`

**Funkčnosť — Interné linky (Krok B):**
- [ ] Sekcia „Tagy & Interné linky" označená „Krok B" — viditeľná, ale disabled pred dokončením Kroku A
- [ ] Po Kroku A: tlačidlá „Pridať link" / „Pridať všetky (N)" sa aktivujú automaticky
- [ ] Každý návrh obsahuje: anchor, cieľ, kontext vety, paragraph badge
- [ ] Rovnaká entita navrhnutá max. 1× (deduplication)
- [ ] „Pridať link" a „Odmietnuť" fungujú s Readiness Score a event logom
- [ ] Anchor sa nevkladá automaticky — vždy HITL

**Readiness Score:**
- [ ] Score animuje od 0 po vypočítanú hodnotu po validácii
- [ ] Score rastie po každej vyriešenej položke (claim, SEO, tag set, link)
- [ ] Publish Gate je výhradne soft (vizuálny indikátor, nikdy neblokuje publish)

**Audit a bezpečnosť:**
- [ ] Každá akcia má: `suggestion_id`, `actorId`, `resolutionType`, `timestamp`, `article_id`, `site_id`
- [ ] Audit log je len na pridávanie
- [ ] `whyFlagged` generuje systém, nie redaktor

**UX:**
- [ ] Zelený fade po AI fixe (2,5 s)
- [ ] Fialový flash po Undo (1 s)
- [ ] Kliknutie na zvýraznený text → detail nálezu, správna záložka
- [ ] Pri prekrytí nálezov → aktivuje sa nález s najvyšším rizikom

**Non-functional:**
- [ ] Feature flags (pozri Sekcia 12) sú vypínateľné per tenant bez deployu
- [ ] Fail-safe: žiadna funkcia validation layera nesmie blokovať publish
- [ ] Všetky texty v centrálnom prekladovom súbore

---

## 10. READINESS SCORE — VÝPOČTOVÝ MODEL

> Tento model je **návrh** — finálne váhy vyžadujú `[PM DECISION]` a potvrdenie šéfredaktora pilotnej značky.

### Základný vzorec

```
ReadinessScore = Σ (PillarScore_i × PillarWeight_i)
```

### Váhy pilierov `[PM DECISION]`

| Pilier | Navrhovaná váha | Zdôvodnenie |
|--------|----------------|-------------|
| Dôvera (Trust) | 35 % | Najvyššie právne a reputačné riziko |
| SEO | 25 % | Priamy dopad na traffic |
| Štýl (Style) | 20 % | Brand konzistencia, nižšie riziko |
| Výkon (Tags + Links) | 20 % | Engagement a distribúcia |

### Výpočet PillarScore

```
PillarScore = Σ(item_weight × resolution_factor) / Σ(item_weight) × 100
```

**Váha položky (Trust / Štýl):**
- `high` risk = 3, `medium` = 2, `low` = 1

**SEO a Výkon:** každá položka = 1 (flat weight)

**Resolution factor `[PM DECISION]`:**

| Stav | Factor | Poznámka |
|------|--------|----------|
| AI fix / Potvrdiť ručne / Použiť návrh / Pridať link / Pridať set | 1.0 | Plná akcia |
| Ignorovať (vedomé rozhodnutie) | 0.5 | Rozhodnutie prebehlo, bez opravy |
| Neadresované | 0.0 | Otvorená položka |

### Publish Gate — soft indikátor

| Score | Indikátor | Správanie publish tlačidla |
|-------|-----------|---------------------------|
| ≥ 80 % | Zelený — „Pripravené" | Aktívne, zelená farba |
| 50–79 % | Žltý — „Odporúčame dokončiť" | Aktívne, neutrálna farba |
| < 50 % | Červený — „Nevyriešené nálezy" | Aktívne, s vizuálnym upozornením |

**Publish flow sa nikdy neblokuje.**

### `[DATA_GAP]` pre scoring
- DG-1: Finálne váhy pilierov (PM + šéfredaktor)
- Ignored factor 0.5 je návrh — overí sa na základe pilotných dát
- Score sa počíta client-side v prototype; v produkcii: definovať, či server-side alebo client-side `[PM DECISION]`

---

## 11. PREČO SME TO NAVRHLI TAKTO

### Education Layer (`whyFlagged`)
**Problém:** Redaktori majú nízku dôveru k AI výstupom bez vysvetlenia.
**Riešenie:** Pole `whyFlagged` — jedna veta v odlíšenom vizuálnom bloku, ktorá vysvetľuje prečo systém nález identifikoval.
**Výsledok:** Redaktor nevníma výstup ako hodnotenie, ale ako kontext pre rozhodnutie.

### História zmien (Undo) ako záchranná sieť
**Problém:** Redaktori váhajú použiť AI opravu bez istoty, že ju môžu vrátiť.
**Riešenie:** Undo stack (max. 5 krokov), počet viditeľný na tlačidle.
**Výsledok:** Pocit kontroly zvyšuje ochotu používať AI.

### Collab Lock
**Problém:** Dvaja redaktori môžu prepisovať ten istý odstavec.
**Riešenie:** Žltý banner s menom editora + editor iba na čítanie + všetky AI akcie vypnuté.
**Technická poznámka:** Pilot: `ETag` / `If-Match`. Produkcia: WebSocket presence.

### Záchranný režim pri výpadku AI
**Princíp:** Performance Layer nikdy neblokuje prácu redakcie. Je to asistent, nie bloker.

### Attribution (Kto + Kedy)
**Riešenie:** Pätičky kariet, plný audit log s `actorId`, `source`, `timestamp`, `documentVersion`.

### Navigačný mostík: klik na zvýraznený text → detail nálezu
**Problém:** Redaktor vidí farebné zvýraznenia, ale nevie, ktoré zodpovedá ktorému nálezu v paneli.
**Riešenie:** Kliknutie na zvýraznený text priamo otvorí detail nálezu a prepne záložku.
**Technická poznámka:** Textarea + overlay architektúra — click handler na textarea cez `selectionStart` pozíciu. Hover kurzor (`cursor-pointer`) je zámer pre v2.

### Soft Publish Gate
**Problém:** Blokujúci gate by porušil CMS princíp a znížil dôveru redaktorov.
**Riešenie:** Vizuálny indikátor (zelená/žltá/červená) bez blokovania. Rozhodnutie ostáva na redaktorovi.

### Ignored ako feedback signal
**Tlačidlo „Ignorovať" nie je len UX rozhodnutie** — je to dátový signal pre budúcu kalibráciu modelu. `Ignorovať` = systém navrhol niečo, čo redaktor vedome odmietol. Toto je najcennejší typ spätnej väzby.

---

## 12. WIREFRAME / UI NÁČRT

> *Odkaz na živý prototyp: [https://www.aifreelancer.sk/nmh](https://www.aifreelancer.sk/nmh)*

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER (logo, brand, používateľ)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ INTELLIGENCE BAR                                                         │
│ [🛡 Trust & Governance]  Readiness: ████░ 84%  [Validovať] [↩ Späť(3)] │
│                                                [Export logu]            │
├────────────────────────────────┬────────────────────────────────────────┤
│ EDITOR — DRAFT                 │ PERFORMANCE PANEL (sticky)             │
│                                │                                        │
│ Titulok ░░░░░░░░░░░░░░░░░░░░░  │ [Dôvera 3] [Štýl 2] [SEO 3]          │
│ SEO titulok ░░░░░░░░░░░░░░░░░  │ ─────────────────────────────────────  │
│ URL ░░░░░░░░░░░░░░░░░░░░░░░░░  │ Navrhované tagy                       │
│                                │ [Kreatín ×] [Alzheimer ×] [Zdravie ×] │
│ Perex ░░░░░░░░░░░░░░░░░░░░░░░  │ [Pridať set]                          │
│                                │ ─────────────────────────────────────  │
│ ┌──────────────────────────┐   │ Tagy & Interné linky                  │
│ │ Text článku              │   │ kreatín monohydrát → Kreatín          │
│ │ [highlight — klikateľné] │◄──┤ „...mohol predstavovať prelom..."     │
│ │ kreatín monohydrát       │   │ [Pridať link] [Odmietnuť]             │
│ │ [highlight fialový]      │   │ ─────────────────────────────────────  │
│ └──────────────────────────┘   │ 🔴 Príliš silné medicínske tvrdenie   │
│                                │ 🟡 Chýba konkrétna cena               │
│                                │ ─────────────────────────────────────  │
│                                │ Publish Gate: 🟢 Pripravené           │
└────────────────────────────────┴────────────────────────────────────────┘
```

**Farebný kód nálezov:**
- 🔴 Červená = vysoké riziko
- 🟡 Žltá = stredné riziko
- 🟢 Zelená = nízke riziko / vyriešené
- 🔵 Modrá = tag / link návrh

---

## 13. TECHNICKÉ POZNÁMKY PRE DEV TÍM

### Dátový model: Unified Suggestion Object

```typescript
type Suggestion = {
  suggestion_id: string;          // UUID, povinný pre event tracking
  suggestion_type: "trust" | "style" | "seo" | "tag" | "internal_link";
  anchor_text: string | null;     // pre internal_link
  target_id: string | null;       // tag ID alebo field key
  target_type: "tag" | "article" | "field" | null;
  target_label: string | null;
  context_snippet: string | null; // výrez vety pre kontext
  suggestion_source: "ai" | "rule_based" | "hybrid";
  article_id: string;             // [DATA_GAP DG-2]
  site_id: string;                // [DATA_GAP DG-2]
  article_type: string;
  position_in_text: {
    paragraph_index: number;
    sentence_index: number;
  } | null;
};
```

### Dátový model: Claim objekt (pre Trust / Štýl)

```typescript
type Claim = {
  id: string;
  text: string;
  risk: "high" | "medium" | "low";
  shortLabel: string;
  explanation: string;
  whyFlagged?: string;
  recommendedAction: string;
  startIndex: number;
  endIndex: number;
};
```

### Dátový model: Audit Event

```typescript
type AuditEvent =
  | { type: "audit_completed"; at: number; readinessScore: number }
  | { type: "audit_failed_unavailable"; at: number; reason: string }
  | { type: "ai_fix_applied"; suggestion_id: string; claimId: string;
      tab: "trust" | "style"; timeToFixMs: number; timeToFixUnder5s: boolean;
      appliedAt: number; actorId: string; source: "ai";
      article_id: string; site_id: string; beforeText: string; afterText: string }
  | { type: "seo_suggestion_applied"; suggestion_id: string; key: string;
      appliedAt: number; actorId: string; article_id: string; site_id: string }
  | { type: "tags_committed"; at: number; suggestion_id: string;
      tags: { id: string; label: string }[]; removedCount: number;
      article_id: string; site_id: string }
  | { type: "tag_removed"; at: number; suggestion_id: string;
      tagId: string; label: string; article_id: string; site_id: string }
  | { type: "link_suggestion_accepted"; at: number; suggestion_id: string;
      anchor_text: string; target_id: string; context_snippet: string;
      article_id: string; site_id: string }
  | { type: "link_suggestion_rejected"; at: number; suggestion_id: string;
      anchor_text: string; target_id: string;
      article_id: string; site_id: string }
  | { type: "suggestions_skipped"; at: number; reason: string;
      article_id: string; site_id: string };
```

### Feature flags (per tenant)

```
mdie.validation.enabled                      // celý validation flow
mdie.fix.ai_enabled                          // AI fix tlačidlo
mdie.fix.undo_stack_size                     // int, default: 5
mdie.collab_lock.enabled                     // optimistic locking
mdie.collab_lock.strategy                    // "etag" | "websocket"
mdie.export.audit_log_enabled                // JSON export tlačidlo
seo_copilot.linkbuilding.enabled             // interné linky
seo_copilot.max_links_per_article            // int, default: 5
article_validation.performance_layer.enabled // tagy + linky sekcia
article_validation.event_logging.enabled     // event logging
```

### API kontrakt: POST validation `[DATA_GAP DG-2]`

```
POST /api/mdie/v1/documents/{documentId}/validate
Headers:
  Authorization: Bearer {token}
  X-Tenant-Id: {brandId}
  If-Match: {currentVersion}

Body:
  {
    "content": "...",
    "title": "...",
    "seoTitle": "...",
    "perex": "...",
    "article_id": "...",     // [DATA_GAP DG-2]
    "site_id": "...",        // [DATA_GAP DG-2]
    "article_type": "..."    // [DATA_GAP DG-2]
  }

Response 200:
  { "jobId": "uuid", "status": "queued" }

Response 409 Conflict:
  { "error": "version_conflict", "currentVersion": "abc123" }
```

### NLP Stack pre anchor detekciu `[DATA_GAP DG-6]`

**Kontex:** Anchor detekcia (nájsť miesto v texte, kde sa tag vyskytuje aj v skloňovanom tvare) vyžaduje NLP pre slovenčinu. Slovenčina má 7 pádov — regex nestačí.

**Odporúčaná architektúra:**

```python
def get_anchor_lemmas(text: str) -> list[str]:
    doc = nlp_spacy(text)

    # Fallback: viacslovný tag alebo SpaCy tvar nezmenilo (neznáme slovo)
    if _needs_morphodita(doc, text):
        return morphodita.get_lemmas(text)

    return [t.lemma_ for t in doc]

def _needs_morphodita(doc, original: str) -> bool:
    if len(doc) > 1:  # viacslovný tag — SpaCy sk má slabšiu podporu MWE
        return True
    for token in doc:
        if token.lemma_ == token.text and token.is_alpha and len(token.text) > 4:
            return True  # SpaCy nevedelo lemmatizovať — vráti originálny tvar
    return False
```

| Vrstva | Knižnica | Dôvod |
|--------|----------|-------|
| Primárna (anchor detekcia, sentence extraction, NER) | **SpaCy `sk_core_news_lg`** | Slovenský model, ekosystém, CMSD1778 precedens |
| Fallback (morfologická presnosť) | **Morphodita** (`ufal.morphodita`) | Pre viacslovné tagy a zložité skloňovanie |
| Best occurrence selection | **Rule-based nad SpaCy výstupom** | Deterministické pravidlá (nie perex, density, nie duplikát) |
| Tag relevancia voči obsahu | **Existujúci tag AI systém** | Soft filter je riešený, nevymýšľame znova |

**Rozhodnutie:** SpaCy primary. Morphodita zvážiť po reálnom testovaní SpaCy na NMH obsahu — prípadne MVP2. `[DATA_GAP DG-6]` — potvrdiť, či SpaCy alebo iná NLP knižnica je už v AI service stacku (súvisí s CMSD1778).

---

### DataHub integrácia `[DATA_GAP DG-3]`

Events z audit logu musia byť kompatibilné s DataHub event schémou.
Spôsob odosielania (on publish / periodicky / na vyžiadanie) sa definuje s DataHub tímom.
V MVP fáze: eventy sa ukladajú lokálne (JSON export) a odosielanie do DataHubu je out of scope.

---

## HISTÓRIA DOKUMENTU

| Verzia | Dátum | Autor | Zmena |
|--------|-------|-------|-------|
| 1.0 | 2026-04-12 | Daniel Budziňák | Prvá verzia pre 2. kolo výberového konania NMH |
| 1.2 | 2026-04-12 | Daniel Budziňák | Token Management presunutý do MDIE B |
| 2.0 | 2026-04-12 | Daniel Budziňák | DATA GAP, Feature Summary, MVP Scope, Out of Scope |
| 2.1 | 2026-04-12 | Daniel Budziňák | Sync s prototypom: skrátené labels, TL;DR, Ignorovať, score logika |
| 2.2 | 2026-04-12 | Daniel Budziňák | Navigačný mostík: klik na zvýraznený text → detail nálezu |
| 3.0 | 2026-04-27 | Daniel Budziňák | Repozícia na Article Performance Layer; CMS kontext; fázovanie Phase 1 (Tags+Links) → Phase 2 (Full Layer); Story 6+7; Soft Publish Gate; Readiness Score model; Unified Suggestion Object; nové feature flags; aktualizovaný DATA GAP |
| 3.1 | 2026-04-28 | Daniel Budziňák | Krok A → Krok B podmienená logika; deduplication (1 entita = 1 návrh); best candidate výber; skip/návrat (DG-7); incremental use case (DG-8); scope pilota (DG-9); NLP stack SpaCy + Morphodita (DG-6); E19–E22 edge cases; AC checklist aktualizovaný |

---

*Dokument pripravený v rámci výberového konania na pozíciu Senior Product Manager. Súvisí s MDIE A (`MDIE_A_Strategicka_Vizia.pdf`) a MDIE B (`MDIE_B_Projektovy_Ramec.pdf`).*

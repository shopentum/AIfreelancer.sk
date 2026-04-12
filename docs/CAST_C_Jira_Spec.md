# ČASŤ C — Produktové zadanie pre vývojový tím
## MDIE: Claim Validation & AI-Assisted Fix Feature
> **Dokument:** Confluence / Jira Epic + Story + Design Rationale  
> **Projekt:** Media Decision Intelligence Engine (MDIE)  
> **Autor:** Daniel Budziňák — Solution Architect  
> **Verzia:** 1.0 | Dátum: 2026-04-12  
> **Status:** Ready for Development

---

## 1. KONTEXT A PRODUKT RATIONALE

Tento dokument je **produktová špecifikácia** pre jednu konkrétnu feature z MDIE Validation Layer: **Claim Validation & AI-Assisted Fix**.

Redaktor pracuje pod časovým tlakom. Keď vidí len správu „Príliš silné medicínske tvrdenie", nevie prečo ani čo presne má urobiť. Výsledkom je odpor, ignorovanie upozornení a právne riziko. Táto feature rieši práve toto: **systém argumentuje, nie len posudzuje**.

> **Scope tohto zadania:** Validácia existujúceho draftu článku → zobrazenie nálezov (claimov) → redaktor vyberie nález → AI navrhne opravu → redaktor schváli → zmena sa zapíše do audit logu.

**Čo tu nie je:** tvorba draftu (Creation), distribúcia (Distribution), integrácia na externé fact-check API (produkcia – mimo scope pilotu).

---

## 2. EPIC

**Názov epicu:** `[MDIE-EPIC-01] Claim Validation & AI-Assisted Fix`  
**Priorita:** P0 (pilot blocker)  
**Labels:** `mdie`, `validation`, `audit`, `cms-adapter`, `resilience`  
**Cieľ:** Redaktor dostane štruktúrovaný zoznam rizikových nálezov v texte článku, pochopí prečo systém nález zdvihol, a môže ho jedným klikom opraviť s plným auditným záznamom.

---

## 3. USER STORIES

### Story 1 — Spustenie validácie
```
MDIE-101
Ako redaktor
Chcem spustiť validáciu môjho článku priamo z editora
Aby som dostal štruktúrovaný prehľad rizík bez toho, aby som musel otvárať iný nástroj.
```

**Acceptance Criteria:**
- [ ] Tlačidlo „Validovať článok" je viditeľné v Intelligence bare nad editorom
- [ ] Po kliknutí sa spustí loading stav (spinner + text „Analyzujem…") — max. zobrazovací čas pre UI: 3 s
- [ ] Po dokončení sa v pravom paneli zobrazia záložky: Dôvera | Štýl | SEO s počtom nálezov
- [ ] Readiness Score (0–100 %) sa zobrazí v progress bare
- [ ] Ak je validácia aktívna a redaktor klikne znova, tlačidlo je disabled (prevent duplicate)
- [ ] Ak je článok uzamknutý iným editorom (Collab Lock), tlačidlo je disabled s tooltipom: „Článok upravuje iný editor — validáciu spustíte po uvoľnení zámku."

**Edge cases:**
| Scenár | Správanie | UI copy |
|--------|-----------|---------|
| API nedostupné / timeout | Validácia skončí bez výsledku, redaktor môže pokračovať | „AI Validácia je dočasne nedostupná. Môžete pokračovať v manuálnej editácii." |
| Prázdny článok | Validácia sa nespustí | Tooltip: „Pridajte text článku pred spustením validácie." |
| Collab Lock zapnutý | Tlačidlo disabled | Tooltip: viď vyššie |

---

### Story 2 — Zobrazenie nálezu s education layer
```
MDIE-102
Ako redaktor
Chcem pri každom náleze vidieť nielen kategóriu, ale aj jednu zrozumiteľnú vetu prečo systém nález zdvihol
Aby som rozumel logike AI a nemusel hádať, čo mám opraviť.
```

**Acceptance Criteria:**
- [ ] Každý nález v zozname zobrazuje: `risk badge` (vysoké / stredné / nízke), `reason` (názov kategórie), `whyFlagged` (jedna veta vysvetlenia)
- [ ] Nálezy sú zoradené: vysoké riziko → stredné → nízke
- [ ] Kliknutie na kartu nálezu otvorí detail v tom istom paneli
- [ ] V detaile je: citovaný text z článku, dôvod, vysvetlenie, `whyFlagged` v odlíšenom fialovom boxe, odporúčaná akcia
- [ ] Text z článku zodpovedajúci nálezu je vizuálne zvýraznený priamo v editore (highlight)
- [ ] Vyriešené nálezy sa zobrazia v sekcii „Vyriešené" dole v zozname (s pätičkou: meno editora + relatívny čas)

**Edge cases:**
| Scenár | Správanie |
|--------|-----------|
| Nález sa nenachádza v texte (text zmenený pred validáciou) | Highlight sa nezobrazí, nález ostáva v zozname bez zvýraznenia |
| Viac nálezov na rovnakom texte | Zobrazí sa každý zvlášť; highlight sa kombinuje |

**UI copy — kľúčové polia:**

| Element | Text |
|---------|------|
| Záložka dôvery | Dôvera |
| Záložka štýlu | Štýl |
| Záložka SEO | SEO |
| Sekcia vyriešených | Vyriešené |
| Pätička karty | „Opravil(a) {meno} · pred {X} min." |
| Prázdny stav po vyriešení všetkých | „Všetky nálezy boli vyriešené. Skontrolujte Readiness Score." |

---

### Story 3 — AI-Assisted Fix s auditným záznamom
```
MDIE-103
Ako redaktor
Chcem jedným kliknutím nechať AI navrhnúť a aplikovať opravu konkrétneho nálezu
Aby som ušetril čas na rutinných opravách a mal garantovaný auditný záznam o každej zmene.
```

**Acceptance Criteria:**
- [ ] Tlačidlo „Opraviť pomocou AI" je v detaile nálezu
- [ ] Po kliknutí: AI opraví text priamo v editore, zelený fade-in efekt zvýrazní zmenenú pasáž (~2,5 s)
- [ ] Nález sa presunie do sekcie „Vyriešené" s pätičkou: meno editora + čas
- [ ] Readiness Score sa inkrementálne zvýši (+2 alebo +3 body)
- [ ] Do audit logu sa zapíše: `actorId`, `actorType: human`, `source: ai`, `documentVersion`, `claimId`, `beforeText`, `afterText`, `timestamp`
- [ ] Redaktor má možnosť vrátiť zmenu cez tlačidlo „Späť" (Undo stack, max. 5 krokov)
- [ ] Tlačidlo „Späť" zobrazuje počet dostupných krokov: „Späť (3)"
- [ ] Po Undo: fialový flash (~1 s) zvýrazní obnovené polia, aby redaktor videl, čo sa zmenilo

**Edge cases:**
| Scenár | Správanie | UI copy |
|--------|-----------|---------|
| AI vráti prázdny reťazec | Oprava sa neaplikuje, nález ostáva otvorený | „Oprava sa nepodarila. Upravte text ručne alebo skúste znova." |
| Collab Lock zapnutý | Tlačidlo disabled | Tooltip: „Článok upravuje iný editor — AI úpravy sú pozastavené." |
| API nedostupné | Oprava sa nespustí, zobrazí sa banner | „AI funkcie sú dočasne nedostupné. Môžete pokračovať v manuálnej editácii." |
| Text nálezu bol medzičasom zmenený (nenájdený v dokumente) | Oprava sa nespustí | „Text nálezu sa v článku nenašiel. Nález skontrolujte ručne." |
| Používateľ klikne viackrát rýchlo | Tlačidlo je disabled počas spracovania | Spinner + „Opravujem…" |

**Definícia Done:**
- Unit testy pre `handleFixWithAI` (success, empty result, not found)
- Integration test: klik → audit záznam → undo → audit záznam
- Feature flag: `mdie.fix.ai_enabled` (vypnuteľné per tenant)

---

### Story 4 — Kolaboračný zámok (Collab Lock)
```
MDIE-104
Ako redaktor
Chcem vidieť, ak niekto iný práve upravuje ten istý článok
Aby som omylom neprepísal jeho prácu.
```

**Acceptance Criteria:**
- [ ] Ak je článok uzamknutý, zobrazí sa žltý banner pod Intelligence barom: „Aktuálne upravuje: {meno}. Vy ste v režime čítania."
- [ ] Editor (textarea) je `readOnly`
- [ ] Validácia, AI fix a SEO návrhy sú disabled s príslušnými tooltipmi
- [ ] Undo (Späť) je disabled počas zámku
- [ ] Po uvoľnení zámku sa všetky prvky obnovia automaticky (bez reloadu stránky)

**Technická poznámka (pre produkciu):**  
Pilot: optimistic locking cez `If-Match` / `ETag` header.  
Full scale: real-time presence cez WebSocket (napr. Ably / Supabase Realtime).

---

### Story 5 — Export audit logu (pre testovanie a compliance)
```
MDIE-105
Ako pilot owner alebo QA
Chcem stiahnuť JSON log všetkých udalostí z aktuálnej session
Aby som mohol vyhodnotiť adopciu a identifikovať UX problémy bez prístupu do produkčnej DB.
```

**Acceptance Criteria:**
- [ ] Tlačidlo „Export logu" je v Intelligence bare
- [ ] Stiahne sa súbor `eagle-test-log-{timestamp}.json`
- [ ] Súbor obsahuje: `events[]`, `metrics.aiFixCount`, `metrics.timeToFixMsAvg`, `metrics.timeToFixUnder5SecondsRate`, `resolvedClaims[]`, `seoChangeLog[]`
- [ ] `timeToFixMs` = čas od prvého otvorenia karty nálezu po klik na AI fix
- [ ] Ak nález nebol otvorený, `timeToFixMs` = čas od dokončenia validácie

---

## 4. WORKFLOW / LOGIKA PROCESU

```
[Redaktor otvorí článok]
        │
        ▼
[Klikne "Validovať článok"]
        │
        ├─── [Collab Lock aktívny?] ──YES──► [Disabled, tooltip]
        │
        ├─── [API dostupné?] ──NO──► [Banner: "Nedostupné, editujte ručne"]
        │                                    │
        ▼                                    ▼
[Loading ~1,5s "Analyzujem…"]         [Audit log: audit_failed_unavailable]
        │
        ▼
[Zobrazia sa nálezy v paneli]
[Readiness Score %, záložky: Dôvera / Štýl / SEO]
        │
        ▼
[Redaktor klikne na kartu nálezu]
[Highlight v editore, detail v paneli]
[Audit: claimFirstSeenAt = now()]
        │
        ├──► [Opraviť pomocou AI]
        │           │
        │           ├─── [API nedostupné] ──► [Banner, nález ostáva otvorený]
        │           │
        │           ├─── [Text nenájdený] ──► [Chybová hláška pod tlačidlom]
        │           │
        │           ▼
        │    [AI opraví text v editore]
        │    [Zelený fade na zmenenom texte]
        │    [Nález → "Vyriešené" + pätička]
        │    [Readiness Score +2/+3]
        │    [Audit log: ai_fix_applied, timeToFixMs]
        │    [Snapshot do Undo stack (max. 5)]
        │
        ├──► [Upraviť ručne]
        │    [Focus na text v editore, selection]
        │
        └──► [Späť (Undo)]
             [Obnoví posledný snapshot]
             [Fialový flash na zmenených poliach]
             [Audit: undo_applied — produkcia; v prototype frontend-only]
                    │
                    ▼
        [Redaktor spokojný → Publish Gate]
        [Readiness Score ≥ threshold → povolené publikovanie]
```

---

## 5. UI COPY — KOMPLETNÉ TEXTÁCIE

### Tlačidlá a akcie

| Element | Default | Loading/Active | Disabled |
|---------|---------|----------------|----------|
| Validovať | „Validovať článok" | „Audit v procese…" | Sivé, cursor-not-allowed |
| Opraviť pomocou AI | „Opraviť pomocou AI" | „Opravujem…" + spinner | Sivé (lock / API) |
| Upraviť ručne | „Upraviť ručne" | – | – |
| Použiť návrh (SEO) | „Použiť návrh" | – | Sivé (lock / API) |
| Späť (Undo) | „Späť (N)" | – | Sivé + bez počtu |
| Export logu | „Export logu" | – | – |

### Tooltipy (hover)

| Element | Tooltip |
|---------|---------|
| Validovať (Collab Lock) | „Článok upravuje iný editor — validáciu spustíte po uvoľnení zámku." |
| Opraviť pomocou AI (Collab Lock) | „Článok upravuje iný editor — AI úpravy sú pozastavené." |
| Opraviť pomocou AI (API down) | „AI funkcie sú dočasne nedostupné." |
| Späť — prázdna história | „Nie je čo vrátiť — zatiaľ ste nepoužili AI opravu nálezu ani SEO návrh." |
| Späť — dostupný (N krokov) | „Späť (N) — obnoví posledný stav pred AI úpravou (max. 5 krokov)." |
| Späť — Collab Lock | „Vrátenie stavu nie je dostupné, kým článok upravuje iný editor." |
| Export logu | „Stiahnuť JSON s udalosťami a Time-to-Fix metrikami pre testy a grafy." |

### Bannery a systémové hlášky

| Situácia | Text bannera |
|----------|-------------|
| API validácie nedostupné | „AI Validácia je dočasne nedostupná. Môžete pokračovať v manuálnej editácii." |
| AI fix nedostupný | „AI funkcie sú dočasne nedostupné. Môžete pokračovať v manuálnej editácii článku v editore." |
| SEO návrh nedostupný | „AI návrhy sú dočasne nedostupné. Polia môžete vyplniť ručne." |
| Collab Lock | „Aktuálne upravuje: {meno}. Vy ste v režime čítania — AI validáciu a úpravy textu môžete spustiť až po uvoľnení zámku." |
| Text nálezu nenájdený | „Text nálezu sa v článku nenašiel. Nález skontrolujte ručne." |
| AI fix — prázdny výsledok | „Oprava sa nepodarila. Upravte text ručne alebo skúste znova." |

### Záložky a polia

| Element | Text |
|---------|------|
| Záložka 1 | „Dôvera" |
| Záložka 2 | „Štýl" |
| Záložka 3 | „SEO" |
| Readiness label | „Readiness Score" |
| Sekcia vyriešených | „Vyriešené" |
| Prázdny stav (bez auditu) | „Spustite audit pre analýzu" |
| Education layer box | *(fialový box, kurzíva, príklad:)* „Systém nenašiel v texte konkrétny zdroj pre toto medicínske tvrdenie." |
| Pätička vyriešenej karty | „Opravil(a) {meno} · pred {X} min." |
| Pätička SEO zmeny v detaile | „Upravil(a) {meno} · pred {X} min." |
| Späť tlačidlo — label | „(N)" vedľa ikony histórie |

---

## 6. EDGE CASES — KOMPLETNÁ TABUĽKA

| # | Scenár | Systémové správanie | UI reakcia |
|---|--------|---------------------|------------|
| E1 | API validácie timeout (>5 s) | Job označený ako `failed`, `reason: provider_unavailable` | Banner: „AI Validácia je dočasne nedostupná…" |
| E2 | API vráti prázdny zoznam nálezov | Validácia úspešná, 0 nálezov | „Skvelé! Žiadne nálezy nenájdené. Readiness Score: 100 %" |
| E3 | Text nálezu nie je v dokumente | `indexOf` vráti -1, fix sa nespustí | „Text nálezu sa v článku nenašiel. Nález skontrolujte ručne." |
| E4 | AI vráti prázdny string | Fix sa neaplikuje | „Oprava sa nepodarila. Upravte text ručne alebo skúste znova." |
| E5 | AI vráti text dlhší ako pôvodný o >300 % | Upozornenie v konzole (prod: log), fix sa aplikuje | Štandardné zelené zvýraznenie; bez blokovania |
| E6 | Collab Lock sa zapne počas aktívneho AI volania | Po `await` sa skontroluje stav zámku; ak je active → fix sa neaplikuje, snapshot sa nezapíše | Žiadna zmena, redaktor vidí žltý banner |
| E7 | Undo stack plný (5/5), redaktor klikne ďalší AI fix | Najstarší snapshot sa vymaže, nový sa pridá | Počítadlo ostáva na „(5)" |
| E8 | Nová validácia spustená → história sa vymaže | `articleHistory = []`, undo flash sa zruší | Tlačidlo „Späť" sa deaktivuje |
| E9 | Redaktor klikne „Späť" viacnásobne rýchlo | `flushSync` + sekvenčné spracovanie; každý klik odpáli jeden krok | Počítadlo klesá 5→4→3… |
| E10 | Duplicitné kliknutie na „Validovať" počas loading | Tlačidlo disabled, druhý request sa nespustí | Spinner + „Audit v procese…" |
| E11 | SEO návrh aplikovaný, potom Undo | Snapshot obnoví pôvodné SEO pole; seoChangeLog ostáva (iba append) | Fialový flash na SEO poli |
| E12 | Článok bez textu, klik na Validovať | Guard na prázdny string, validácia sa nespustí | Tooltip: „Pridajte text článku pred spustením validácie." |

---

## 7. ACCEPTANCE CRITERIA — SÚHRNNÁ CHECKLIST

**Funkčnosť:**
- [ ] Validácia sa spustí a zobrazí nálezy v < 3 s (UI loading)
- [ ] Každý nález má `reason` + `whyFlagged` (education layer)
- [ ] AI fix upraví text, zapíše audit záznam, presunie nález do „Vyriešené"
- [ ] Undo (max. 5 krokov) funguje pre AI fix aj SEO návrh
- [ ] Collab Lock blokuje všetky mutácie; text ostáva readOnly
- [ ] API degradation: editor ostáva plne editovateľný bez AI funkcií
- [ ] Export JSON obsahuje `timeToFixMs` pre každý AI fix

**Audit a bezpečnosť:**
- [ ] Každá zmena má: `actorId`, `source` (ai/human), `timestamp`, `documentVersion`, `claimId`
- [ ] Audit log je append-only (žiadne mazanie)
- [ ] `whyFlagged` je vždy generovaný systémom, nie editovateľný redaktorom

**UX:**
- [ ] Zelený fade po AI fixe (2,5 s)
- [ ] Fialový flash po Undo na zmenených poliach (1 s)
- [ ] Všetky disabled stavy majú tooltips
- [ ] Readiness Score sa animovane inkrementuje po každej oprave

**Non-functional:**
- [ ] Feature flag `mdie.fix.ai_enabled` vypne AI fix bez redeploymentu
- [ ] Feature flag `mdie.validation.collab_lock` vypne collab lock pre konkrétneho tenanta
- [ ] Všetky texty (copy) sú v centrálnom i18n súbore (nie hardcoded)

---

## 8. DESIGN RATIONALE (Prototype Learnings)

> *Táto sekcia zdôvodňuje prečo sú niektoré funkcie v zadaní navrhnuté práve takto. Nie sú to náhodné detaily — každý vzišiel z konkrétneho UX problému identifikovaného počas prototypovania.*

### 8.1 Education Layer (`whyFlagged`)
**Problém:** Redaktori majú odpor voči AI, ktorá im "hovorí, že robia chyby" bez vysvetlenia.  
**Riešenie:** Pole `whyFlagged` — jedna veta v italics v odlíšenom boxe, ktorá argumentuje, nie súdi.  
**Príklad:** Namiesto „Príliš silné medicínske tvrdenie" → „Systém nenašiel v texte konkrétny zdroj, ktorý by podložil toto medicínske tvrdenie ako hotovú istotu."  
**Výsledok:** Redaktor nevidí „chybu", ale „chýbajúci podklad". Znižuje to kognitívnu záťaž a odpor k zmene.

### 8.2 Undo Stack ako „záchranná sieť"
**Problém:** Redaktori sa boja kliknúť na „Opraviť pomocou AI", pretože sa obávajú nevratnej zmeny.  
**Riešenie:** Snapshot logika pred každým AI fixom aj SEO návrhom (max. 5 krokov). Počítadlo krokov na tlačidle.  
**Výsledok:** Redaktor si zachováva pocit kontroly. Experiment ukazuje, že samotná existencia Undo zvyšuje ochotu delegovať na AI — aj keď ho redaktor nakoniec nepoužije.  
**Technická poznámka:** V prototype je Undo frontend-only (React state + `flushSync`). V produkcii: server-side snapshot verzie dokumentu prepojený s Audit Trail.

### 8.3 Collab Lock / Read-Only Banner
**Problém:** Race condition — dvaja redaktori prepisujú ten istý odsek súčasne.  
**Riešenie:** Žltý banner s menom editora + read-only stav textarea + disabled všetky AI akcie.  
**Dôvod viditeľnosti mena:** Redaktor nevolá na IT, že „tlačidlo nefunguje" — vie presne prečo a koho kontaktovať.  
**Technická poznámka:** Pilot: optimistic locking (`ETag` / `If-Match`). Full scale: WebSocket presence (napr. Ably alebo Supabase Realtime) pre real-time stav.

### 8.4 Graceful Degradation (API Resilience)
**Problém:** „Čo ak vypadne AI?" — najčastejšia enterprise námietka.  
**Riešenie:** Prepínač výpadku (v prototype ako checkbox, v produkcii: circuit breaker). Keď AI nedostupné → bannery + editor zostáva 100 % editovateľný.  
**Kľúčový princíp:** MDIE nikdy **neblokuje** redakčný proces. Je to asistent, nie brána.

### 8.5 Attribution (Kto + Kedy)
**Problém:** Korporátne právne oddelenia požadujú dohľadateľnosť každej zmeny v obsahu.  
**Riešenie:** Pätičky kariet (`Opravil(a) {meno} · pred {X} min.`), plný audit log s `actorId`, `source`, `timestamp`, `documentVersion`.  
**Výsledok:** Každá zmena má „podpis". Systém je audit-ready od prvého dňa pilotu.

### 8.6 Time-to-Fix Metrika
**Definícia:** Čas od prvého otvorenia karty nálezu po klik na AI fix.  
**Prečo to meriame:** Ak je priemerný čas pod 10 sekúnd, systém funguje intuitívne. Ak je nad 2 minúty, education layer alebo UX potrebuje iteráciu.  
**Dôležité:** Táto metrika je **indikátor použiteľnosti**, nie záväzný SLA. Produkčné čísla sa stanovia po pilote.

---

## 9. WIREFRAME / UI NÁČRT

> *Odkaz na živý prototyp (deploy): [EAGLE Admin — /eagle-admin](https://aifreelancer.sk/eagle-admin)*  
> *(Prihlasovacie údaje k prototypu dostupné u autora)*

**Popis obrazovky (referencia k priloženým screenshotom z prototypu):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER (logo, brand, používateľ)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ INTELLIGENCE BAR                                                         │
│ [🛡 Trust & Governance]  Readiness: ████░ 84%  [Validovať] [↩ Späť(3)] │
│                                                [Export logu]            │
│ [☐ Prototyp: druhý editor]  [☐ Simulácia: výpadok API]                  │
├────────────────────────────────┬────────────────────────────────────────┤
│ EDITOR (ľavý stĺpec)           │ AI PANEL (pravý stĺpec, sticky)        │
│                                │                                        │
│ Titulok ░░░░░░░░░░░░░░░░░░░░░  │ [Dôvera 3] [Štýl 2] [SEO 3]          │
│ SEO titulok ░░░░░░░░░░░░░░░░░  │ ─────────────────────────────────────  │
│ URL ░░░░░░░░░░░░░░░░░░░░░░░░░  │ 🔴 Príliš silné medicínske tvrdenie   │
│                                │ Systém nenašiel zdroj...               │
│ Perex ░░░░░░░░░░░░░░░░░░░░░░░  │ „kreatín mohol predstavovať prelom…"  │
│                                │ ─────────────────────────────────────  │
│ ┌──────────────────────────┐   │ 🟡 Vágne cenové tvrdenie              │
│ │ Text článku              │   │ Chýba konkrétna suma...               │
│ │                          │   │ „stojí pár eur"                       │
│ │ [highlight fialový]      │◄──┤ ─────────────────────────────────────  │
│ │ kreatín monohydrát       │   │ [Vyriešené]                           │
│ │ [highlight zelený]       │   │ ✓ Opravil Daniel · pred 2 min.        │
│ │                          │   │                                        │
│ └──────────────────────────┘   │                                        │
│                                │ DETAIL (po kliknutí na nález):         │
│                                │ ◄ Späť na zoznam                       │
│                                │ „kreatín mohol predstavovať prelom…"   │
│                                │ Dôvod: Príliš silné medicínske tvrdenie│
│                                │ ╔══════════════════════════════╗       │
│                                │ ║ Systém nenašiel v texte...  ║       │
│                                │ ╚══════════════════════════════╝       │
│                                │ Odporúčaná akcia: Zmierniť tón...      │
│                                │ [🤖 Opraviť pomocou AI] [✏ Ručne]     │
└────────────────────────────────┴────────────────────────────────────────┘
```

**Farebný kód nálezov:**
- 🔴 Červená ľavá linka = vysoké riziko
- 🟡 Žltá ľavá linka = stredné riziko
- 🟢 Zelená ľavá linka = nízke riziko / vyriešené

---

## 10. TECHNICKÉ POZNÁMKY PRE DEV TÍM

### Dátový model — Claim objekt
```typescript
type Claim = {
  id: string;
  text: string;                  // citovaný text z článku
  risk: "high" | "medium" | "low";
  reason: string;                // kategória (zobrazená tučne)
  explanation: string;           // podrobný popis
  whyFlagged?: string;           // education layer — jedna veta prečo
  recommendedAction: string;     // čo má redaktor urobiť
  startIndex: number;            // pozícia v dokumente (pre highlight)
  endIndex: number;
};
```

### Dátový model — Audit udalosť
```typescript
type AuditEvent =
  | { type: "audit_completed"; at: number; readinessScore: number }
  | { type: "audit_failed_unavailable"; at: number; reason: string }
  | {
      type: "ai_fix_applied";
      claimId: string;
      tab: "trust" | "linguistic";
      timeToFixMs: number;
      timeToFixUnder5s: boolean;
      appliedAt: number;
      actorId: string;
      actorType: "human";
      source: "ai";
      documentVersion: string;
      beforeText: string;
      afterText: string;
    }
  | {
      type: "seo_suggestion_applied";
      key: "title" | "seoTitle" | "url" | "perex";
      appliedAt: number;
      timeSinceAuditMs: number | null;
      actorId: string;
    };
```

### Feature flags (per tenant)
```
mdie.validation.enabled          // celý validation flow
mdie.fix.ai_enabled              // AI fix tlačidlo
mdie.fix.undo_stack_size         // int, default: 5
mdie.collab_lock.enabled         // optimistic locking
mdie.collab_lock.strategy        // "etag" | "websocket"
mdie.export.audit_log_enabled    // JSON export tlačidlo
```

### API kontrakt — POST validation
```
POST /api/mdie/v1/documents/{documentId}/validate
Headers:
  Authorization: Bearer {token}
  X-Tenant-Id: {brandId}
  If-Match: {currentVersion}     // pre optimistic locking

Body:
  { "content": "...", "title": "...", "seoTitle": "...", "perex": "..." }

Response 200:
  { "jobId": "uuid", "status": "queued" }

Response 409 Conflict:
  { "error": "version_conflict", "currentVersion": "abc123" }

GET /api/mdie/v1/validation-jobs/{jobId}
Response 200:
  { "status": "succeeded", "result": { ...ArticleAudit } }
  { "status": "failed", "errorCode": "provider_unavailable" }
```

---

## 11. OPTIMALIZÁCIA PREVÁDZKOVÝCH NÁKLADOV (Token Management)

> *Pre zabezpečenie ekonomickej udržateľnosti pri spracovaní stoviek článkov denne MDIE implementuje štyri vrstvy optimalizácie nákladov na LLM volania.*

### 11.1 Native Prompt Caching

Redakčné kódexy, SEO manuály a statické inštrukcie Editorial Identity Layer sú uložené v **efemérnej cache na úrovni API providera**. Načítavajú sa raz za reláciu — opakované volania pre ďalšie články v tej istej session neopakujú prenos týchto inštrukcií.

**Efekt:** Redukcia nákladov na vstupné (input) tokeny až o **90 %** pri opakovateľných systémových promptoch.  
**Technická poznámka:** Implementácia závisí od support providera (Anthropic: prompt caching cez `cache_control`; OpenAI: analogicky cez system message caching). Cache TTL typicky 5 min — vhodné pre redakčné relácie.

---

### 11.2 Stateless Context Management (Context Sharding)

MDIE **neposiela do LLM celý archív dokumentov ani históriu** redakcie. Shared Intelligence Core filtruje a zostavuje len **relevantné fragmenty kontextu** pre konkrétny článok v reálnom čase (napr. policy danej značky, kategória obsahu, historické korekcie podobného typu).

**Efekt:** Minimalizuje zbytočný tok dát cez API — platíme len za tokeny, ktoré priamo ovplyvňujú kvalitu výstupu.  
**Implementácia (návrh):** Retrieval vrstva (napr. pgvector / Pinecone) zostaví kontext na základe sémantickej podobnosti so spracovávaným článkom pred každým LLM volaním.

---

### 11.3 Tiered Model Routing (Smerovanie podľa náročnosti úlohy)

MDIE implementuje **dvojúrovňové smerovanie**:

| Tier | Typ úlohy | Model | Náklady |
|------|-----------|-------|---------|
| **Tier 1 — Lightweight** | Gramatika, základné SEO, formátovanie, rutinné štýlové kontroly | Rýchly a lacný model (napr. Haiku / GPT-4o-mini) | Nízke |
| **Tier 2 — High-Intelligence** | Faktická verifikácia, medicínske/právne riziko, komplexné claim overenie | Silný model (napr. Sonnet / Opus) | Aktivuje sa len pri identifikácii rizika |

**Logika smerovania:** Tier 1 prebehne vždy. Ak výsledok identifikuje `risk: high` nález, **až potom** sa aktivuje Tier 2 pre hĺbkovú analýzu daného úseku.  
**Efekt:** Najdrahšie modely sa volajú **len keď je to odôvodnené rizikom** — nie pre každú kontrolu každého článku.

**Feature flag:** `mdie.routing.tier2_threshold` — konfigurovateľný prah risk skóre pre aktiváciu Tier 2 (per tenant).

---

### 11.4 Batch Processing (Dávkové spracovanie)

Pre obsah **bez požiadavky na okamžitú publikáciu** (magazínové témy, nadčasové články, scheduled content) MDIE využíva **Batch API režim** providera:

- Validácia sa zaradí do fronty a spracuje v čase **nižšej vyťaženosti infraštruktúry**
- Cena: typicky **50 % bežnej ceny** API volaní (Anthropic Batch API, OpenAI Batch)
- SLA: výsledok do 24 hodín (konfigurovateľné per článok)

**Implementácia:** Pri ukladaní draftu redaktor volí `priority: immediate | scheduled`. Scheduled články idú do Batch queue; výsledok validácie sa zobrazí pri ďalšom otvorení článku.

**Feature flag:** `mdie.batch.enabled`, `mdie.batch.max_latency_hours` (default: 12)

---

### 11.5 Prehľad — ekonomický dopad kombinovaných techník

| Technika | Typ úspory | Odhadovaný dopad |
|----------|-----------|-----------------|
| Prompt Caching | Input tokeny | −60 % až −90 % na systémové inštrukcie |
| Context Sharding | Input tokeny | −30 % až −50 % na kontext |
| Tiered Routing | Compute / output | −40 % až −70 % na drahých modeloch |
| Batch Processing | Celková cena API | −50 % na non-urgent obsah |

> **Poznámka:** Hodnoty sú odhadované na základe dostupných ceníkov AI providerov a typického redakčného workflow. Presné čísla sa stanovia po pilotnom meraní skutočného token usage v prostredí NMH.

---

## HISTORIA DOKUMENTU

| Verzia | Dátum | Autor | Zmena |
|--------|-------|-------|-------|
| 1.0 | 2026-04-12 | Daniel Budziňák | Prvá verzia pre 2. kolo výberového konania NMH |
| 1.1 | 2026-04-12 | Daniel Budziňák | Doplnená sekcia 11: Token Management & Cost Optimization |

---

*Dokument pripravený v rámci výberového konania na pozíciu PM/Produktový architekt. Funkčný prototyp je dostupný na vyžiadanie.*

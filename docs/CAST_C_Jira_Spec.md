# ČASŤ C — Produktové zadanie pre vývojový tím
## MDIE: Claim Validation & AI-Assisted Fix Feature
> **Dokument:** Confluence / Jira Epic + Story + Design Rationale  
> **Projekt:** Media Decision Intelligence Engine (MDIE)  
> **Autor:** Daniel Budziňák — Solution Architect  
> **Verzia:** 2.1 | Dátum: 2026-04-12  
> **Status:** Ready for Development

---

## 0. TECHNICKÝ KONTEXT A DATA GAP

Tento dokument vychádza z funkčného prototypu a predpokladaného redakčného workflow.

Zároveň pracuje s vedomým **DATA GAP** — bez detailného prístupu k internej architektúre existujúcich systémov (najmä Discovery a Creation vrstiev). Návrh preto predstavuje **cieľový smer a praktický základ pre pilotnú fázu**, v ktorej bude riešenie kalibrované podľa reálnych procesov, dát a technických limitov.

Cieľom nebolo nahradiť existujúce vrstvy, ale nadviazať na ne a rozšíriť ich o **validačnú a rozhodovaciu logiku** (Validation & Governance Layer).

---

## 1. KONTEXT A PRODUKT RATIONALE

Tento dokument je **produktová špecifikácia** pre jednu konkrétnu feature z MDIE Validation Layer: **Claim Validation & AI-Assisted Fix**.

Redaktor pracuje pod časovým tlakom. Keď vidí len správu „Príliš silné medicínske tvrdenie", nevie prečo ani čo presne má urobiť. Výsledkom je odpor, ignorovanie upozornení a právne riziko. Táto feature rieši práve toto: **systém argumentuje, nie len posudzuje**.

> **Scope tohto zadania:** Validácia existujúceho draftu článku → zobrazenie nálezov (claimov) → redaktor vyberie nález → AI navrhne opravu → redaktor schváli → zmena sa zapíše do audit logu.

**Čo tu nie je:** tvorba draftu (Creation), distribúcia (Distribution), integrácia na externé fact-check API (produkcia – mimo scope pilotu).

---

## 2. FEATURE SUMMARY

**Čo riešenie robí:** Claim Validation & AI-Assisted Fix je funkčná vrstva MDIE, ktorá počas editácie článku identifikuje rizikové tvrdenia, vizuálne ich zvýrazní a umožňuje redaktorovi jedným klikom aplikovať AI opravu — s plným auditným záznamom a možnosťou vrátenia zmeny.

**Aký problém rieši:** Redaktor pracuje pod časovým tlakom a nemá kapacitu manuálne overovať každé faktické, právne alebo štylistické tvrdenie. Bežné AI systémy mu povedia „chyba", bez kontextu. Výsledkom je ignorovanie upozornení a rastúce právne riziko pre vydavateľa.

**Ako funguje:** Editor odošle draft na validáciu → systém vráti štruktúrovaný zoznam nálezov (claims) s vysvetlením logiky → redaktor vyberie nález, opraví ho (AI alebo ručne) → zmena je zaznamenaná v audit logu → article postúpi cez Publish Gate.

**Prečo je dôležité:** Systém neurčuje, čo bude publikované. Garantuje, že redaktor má pred publikáciou k dispozícii overený podklad pre vlastné rozhodnutie. MDIE je asistent, nie cenzor.

**User Flow (príklad):**  
Redaktor otvorí článok → klikne „Validovať" → systém zvýrazní 3 problémové pasáže → redaktor opraví 2–3 problémy v priebehu sekúnd → Readiness Score stúpne → článok je pripravený na publikáciu.

---

## 3. ROZSAH RIEŠENIA

### 3.1 MVP Scope (Phase 1 — Pilot)

Toto zadanie pokrýva výhradne Phase 1. Cieľom je dodať **funkčný, testovateľný MVP** v jednej redakcii:

- Základná claim extraction z textu článku
- Jednoduché risk scoring: `low` / `medium` / `high`
- Heatmap / highlight vizualizácia nálezov v editore
- Základné akcie pre nálezy (Dôvera/Štýl): „Opraviť pomocou AI", „Upraviť ručne" (s potvrdením), „Ignorovať"
- Základné akcie pre SEO návrhy: „Použiť návrh" (AI), „Ignorovať"
- História zmien — Undo (max. 5 krokov, uložené v prehliadači v pilote)
- Zamykanie článku pri súbežnej editácii — Collab Lock (cez ETag)
- Záchranný režim pri výpadku AI — editor zostáva plne funkčný
- Export záznamu o udalostiach (JSON) pre vyhodnotenie pilotu

### 3.2 Out of Scope (Phase 2+)

Tieto funkcie sú architektonicky navrhnuté, ale **nie sú súčasťou pilotnej implementácie**:

- Overovanie zdrojov cez externé fact-check API
- Plnohodnotné pravidlá per redakcia / značka (Editorial Identity Layer)
- Automatické smerovanie úloh na rôzne AI modely podľa náročnosti (viď Časť B Príloha)
- Analytické dashboardy a agregované metriky (Time-to-Fix prehľady)
- Zálohy stavu (Undo snapshots) uložené na serveri prepojené s Audit Trail
- Živá prítomnosť editorov cez WebSocket (Collab Lock — 2. fáza)

### 3.3 Ako budeme postupovať

Tento návrh je postavený tak, aby sa **dal spustiť rýchlo a rozširovať postupne** — začíname jednoduchým, ale hodnotným MVP a každá ďalšia fáza na ňom prirodzene stavia. Každá fáza je samostatne dodateľná a merateľná.

---

## 4. EPIC

**Názov epicu:** `[MDIE-EPIC-01] Claim Validation & AI-Assisted Fix`  
**Priorita:** P0 (pilot blocker)  
**Labels:** `mdie`, `validation`, `audit`, `cms-adapter`, `resilience`  
**Cieľ:** Redaktor dostane štruktúrovaný zoznam rizikových nálezov v texte článku, pochopí prečo systém nález zdvihol, a môže ho jedným klikom opraviť s plným auditným záznamom.

---

## 5. USER STORIES (MVP Scope)

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
- [ ] Každý nález v zozname zobrazuje **iba**: `shortLabel` (krátky názov problému, pochopiteľný do 1 sekundy) + citovaný text z článku — bez dlhých popisov
- [ ] Hodnoty `shortLabel` sú krátke a jednoznačné (príklady: „Tvrdenie je príliš silné", „Chýba konkrétna cena", „Text je príliš odborný")
- [ ] Nálezy sú zoradené: vysoké riziko → stredné → nízke
- [ ] Kliknutie na kartu nálezu otvorí detail v tom istom paneli
- [ ] V detaile je **na vrchu TL;DR box** (modrý, 1 veta z `whyFlagged` — prečo systém nález zdvihol), potom citácia, dôvod, vysvetlenie, odporúčaná akcia
- [ ] Text z článku zodpovedajúci nálezu je vizuálne zvýraznený priamo v editore (highlight)
- [ ] Vyriešené nálezy (Dôvera/Štýl) sa zobrazia v sekcii „Vyriešené" dole v zozname s typom riešenia (viď Story 3)
- [ ] SEO návrhy po akcii (Použiť / Ignorovať) sa zobrazia priamo v SEO zozname so stavom „Použité" alebo „Ignorované" — bez presunu do samostatnej sekcie

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
| Typ riešenia — AI fix | „Opravené AI" |
| Typ riešenia — ručne | „Upravené ručne" |
| Typ riešenia — ignorované | „Ignorované (vedomé rozhodnutie)" |
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
- [ ] V detaile nálezu sú **tri akcie**: „Opraviť pomocou AI" (primárna), „Upraviť ručne", „Ignorovať"
- [ ] **AI fix:** Po kliknutí AI opraví text v editore, zelený fade (~2,5 s), nález → „Vyriešené" s labelom „Opravené AI", Readiness Score +2/+3
- [ ] **Upraviť ručne:** Po kliknutí sa editor fokusne, tlačidlo sa zmení na „Potvrdiť opravu" (zelené) → po potvrdení nález → „Vyriešené" s labelom „Upravené ručne", Readiness Score +2/+3
- [ ] **Ignorovať (nález):** Nález sa presunie do „Vyriešené" s labelom „Ignorované (vedomé rozhodnutie)", Readiness Score +2/+3
- [ ] Všetky tri akcie pre nálezy **pridajú body** do Readiness Score — Score reprezentuje „všetky nálezy boli vyriešené (úpravou alebo rozhodnutím)"
- [ ] **SEO — Použiť návrh:** AI hodnota sa skopíruje do poľa, položka v SEO zozname zobrazí „Použité", Readiness Score +2/+3
- [ ] **SEO — Ignorovať:** Položka v SEO zozname zobrazí „Ignorované", Readiness Score +2/+3; redaktor si zachová vlastný titulok
- [ ] Do audit logu sa zapíše pre každú akciu: `actorId`, `source` (ai/human), `resolutionType` (ai_fix/manual/ignored), `claimId`, `timestamp`
- [ ] Redaktor má možnosť vrátiť AI fix cez „Späť" (Undo stack, max. 5 krokov)
- [ ] Tlačidlo „Späť" zobrazuje počet krokov: „Späť (3)"
- [ ] Po Undo: fialový flash (~1 s) na obnovených poliach

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
Pilot: zamykanie pomocou `If-Match` / `ETag` hlavičky (optimistic locking).  
Plná prevádzka: živá prítomnosť editorov cez WebSocket (napr. Ably / Supabase Realtime).

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

## 6. WORKFLOW / LOGIKA PROCESU

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
        │    [Nález → "Vyriešené" · label: "Opravené AI"]
        │    [Readiness Score +2/+3]
        │    [Audit log: ai_fix_applied, resolutionType: ai_fix]
        │    [Snapshot do Undo stack (max. 5)]
        │
        ├──► [Upraviť ručne]
        │    [Focus na text v editore]
        │    [Tlačidlo → "Potvrdiť opravu" (zelené)]
        │           │
        │           ▼
        │    [Redaktor potvrdí kliknutím]
        │    [Nález → "Vyriešené" · label: "Upravené ručne"]
        │    [Readiness Score +2/+3]
        │    [Audit log: resolutionType: manual]
        │
        ├──► [Ignorovať]
        │    [Nález → "Vyriešené" · label: "Ignorované (vedomé rozhodnutie)"]
        │    [Readiness Score +2/+3]
        │    [Audit log: resolutionType: ignored]
        │
        └──► [Späť (Undo)]
             [Obnoví posledný snapshot (len AI fix)]
             [Fialový flash na zmenených poliach]
             [Audit: undo_applied — produkcia; v prototype frontend-only]
                    │
                    ▼
        [Všetky nálezy vyriešené → Publish Gate]
        [Readiness Score ≥ threshold → povolené publikovanie]
```

---

## 7. UI COPY — KOMPLETNÉ TEXTÁCIE

### Tlačidlá a akcie

| Element | Default | Loading/Active | Disabled |
|---------|---------|----------------|----------|
| Validovať | „Validovať článok" | „Audit v procese…" | Sivé, cursor-not-allowed |
| Opraviť pomocou AI | „Opraviť pomocou AI" | „Opravujem…" + spinner | Sivé (lock / API) |
| Upraviť ručne | „Upraviť ručne" | – | – |
|| Potvrdiť opravu | „Potvrdiť opravu“ | – | – |
|| Ignorovať | „Ignorovať“ | – | Sivé (Collab Lock) |
| Použiť návrh (SEO) | „Použiť návrh" | – | Sivé (lock / API) |
| Ignorovať (SEO) | „Ignorovať" | – | Sivé (Collab Lock) |
| Späť (Undo) | „Späť (N)" | – | Sivé + bez počtu |
| Export logu | „Export logu" | – | – |

### Tooltipy (hover)

| Element | Tooltip |
|---------|---------|
| Validovať (Collab Lock) | „Článok upravuje iný editor — validáciu spustíte po uvoľnení zámku." |
| Opraviť pomocou AI (Collab Lock) | „Článok upravuje iný editor — AI úpravy sú pozastavené." |
| Opraviť pomocou AI (API down) | „AI funkcie sú dočasne nedostupné." |
|| Ignorovať (Collab Lock) | „Nemožno ignorovať počas zámku — článok upravuje iný editor.“ |
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
| Education layer box (TL;DR) | *(modrý box, na vrchu detailu, príklad:)* „Systém nenaršiel v texte konkrétny zdroj pre toto medicínske tvrdenie.“ |
| Pätička vyriešenej karty | „Opravil(a) {meno} · pred {X} min." |
| Pätička SEO zmeny v detaile | „Upravil(a) {meno} · pred {X} min." |
| Späť tlačidlo — label | „(N)" vedľa ikony histórie |

---

## 8. EDGE CASES — KOMPLETNÁ TABUĽKA

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
| E13 | Ignorovanie pri aktívnom Collab Lock | Tlačidlo „Ignorovať" je disabled | Tooltip: „Nemožno ignorovať počas zámku." |
| E14 | Redaktor klikne „Upraviť ručne" ale nepotvrdí (prepne view) | Pending stav sa zruší, nález ostáva v zozname otvorený | – |
| E15 | Redaktor ignoruje SEO titulok — má vlastný | SEO položka označená „Ignorované", Readiness Score +2/+3; pole ostáva nezmenené | – |
| E16 | SEO návrh ignorovaný — detail sa zatvorí | „Ignorovať" tlačidlo sa skryje po akcii; bez novej validácie nie je možné zmeniť rozhodnutie | – |

---

## 9. ACCEPTANCE CRITERIA — SÚHRNNÁ CHECKLIST

**Funkčnosť:**
- [ ] Validácia sa spustí a zobrazí nálezy v < 3 s (UI loading)
- [ ] Každý nález v zozname zobrazuje iba: krátky názov problému (`shortLabel`) + citácia — bez dlhých popisov
- [ ] Detail nálezu obsahuje TL;DR box (modrý, 1 veta) na vrchu, pred citáciou
- [ ] V detaile nálezu sú tri akcie: „Opraviť pomocou AI", „Upraviť ručne" (s potvrdením), „Ignorovať"
- [ ] AI fix upraví text, zapíše audit záznam, presunie nález do „Vyriešené" s labelom „Opravené AI"
- [ ] Ignorácia presunie nález do „Vyriešené" s labelom „Ignorované (vedomé rozhodnutie)"; Readiness Score +2/+3
- [ ] Potvrdená ručná úprava presunie nález do „Vyriešené" s labelom „Upravené ručne"; Readiness Score +2/+3
- [ ] Všetky tri akcie pridávajú body — Score = všetky nálezy vyriešené (úpravou alebo rozhodnutím)
- [ ] Score nediferencuje kvalitu riešenia, ale mieru uzavretia nálezov; kvalita je zachytená v audit logu
- [ ] SEO návrh: „Použiť návrh" skopíruje AI hodnotu do poľa, položka v SEO zozname zobrazí „Použité"
- [ ] SEO návrh: „Ignorovať" označí položku v SEO zozname ako „Ignorované (vedomé rozhodnutie)", Readiness Score +2/+3; pole ostáva nezmenené
- [ ] Undo (max. 5 krokov) funguje pre AI fix aj SEO návrh
- [ ] Collab Lock blokuje všetky zmeny vrátane Ignorovania; text ostáva len na čítanie
- [ ] API degradation: editor ostáva plne editovateľný bez AI funkcií
- [ ] Export JSON obsahuje `timeToFixMs` pre každý AI fix

**Audit a bezpečnosť:**
- [ ] Každá zmena má: `actorId`, `source` (ai/human), `resolutionType` (ai_fix/manual/ignored), `timestamp`, `documentVersion`, `claimId`
- [ ] Audit log je len na pridávanie — záznamy nie je možné mazať ani upravovať
- [ ] `whyFlagged` je vždy generovaný systémom, nie editovateľný redaktorom

**UX:**
- [ ] Zelený fade po AI fixe (2,5 s)
- [ ] Fialový flash po Undo na zmenených poliach (1 s)
- [ ] Všetky disabled stavy majú tooltips
- [ ] Readiness Score sa animovane inkrementuje po každej oprave

**Non-functional:**
- [ ] Prepínač `mdie.fix.ai_enabled` vypne AI fix bez nového nasadenia
- [ ] Prepínač `mdie.validation.collab_lock` vypne zamykanie článkov pre konkrétnu redakciu
- [ ] Všetky texty (copy) sú v centrálnom prekladovom súbore (nie pevne zadrôtované v kóde)

---

## 10. PREČO SME TO NAVRHLI TAKTO (Zistenia z prototypu)

> *Táto sekcia vysvetľuje, prečo sú niektoré funkcie navrhnuté práve takto. Nie sú to náhodné detaily — každý vzišiel z konkrétneho problému, ktorý sme objavili počas testovania prototypu.*

### 8.1 Education Layer (`whyFlagged`)
**Problém:** Redaktori majú odpor voči AI, ktorá im "hovorí, že robia chyby" bez vysvetlenia.  
**Riešenie:** Pole `whyFlagged` — jedna veta v italics v odlíšenom boxe, ktorá argumentuje, nie súdi.  
**Príklad:** Namiesto „Príliš silné medicínske tvrdenie" → „Systém nenašiel v texte konkrétny zdroj, ktorý by podložil toto medicínske tvrdenie ako hotovú istotu."  
**Výsledok:** Redaktor nevidí „chybu", ale „chýbajúci podklad". Znižuje to kognitívnu záťaž a odpor k zmene.

### 8.2 História zmien (Undo) ako „záchranná sieť"
**Problém:** Redaktori sa boja kliknúť na „Opraviť pomocou AI", pretože sa obávajú nevratnej zmeny.  
**Riešenie:** Pred každou AI opravou aj SEO návrhom sa uloží záloha stavu (max. 5 krokov). Počet krokov je viditeľný priamo na tlačidle.  
**Výsledok:** Redaktor má pocit kontroly. Samotná existencia možnosti vrátiť zmenu zvyšuje ochotu používať AI — aj keď ju nakoniec nevyužije.  
**Technická poznámka:** V prototype je história zmien uložená v prehliadači (React state + `flushSync`). V produkcii: záloha verzie dokumentu na serveri prepojená s Audit Trail.

### 8.3 Collab Lock / Zamknutý článok
**Problém:** Dvaja redaktori môžu súčasne prepisovať ten istý odsek a navzájom si mazať prácu.  
**Riešenie:** Žltý banner s menom editora + editor iba na čítanie + všetky AI akcie vypnuté.  
**Prečo vidieť meno:** Redaktor nevolá IT, že „tlačidlo nefunguje" — hneď vie prečo a koho kontaktovať.  
**Technická poznámka:** Pilot: zamykanie cez `ETag` / `If-Match`. Plná prevádzka: živá prítomnosť editorov cez WebSocket (napr. Ably alebo Supabase Realtime).

### 8.4 Záchranný režim pri výpadku AI
**Problém:** „Čo ak vypadne AI?" — najčastejšia námietka pri nasadzovaní AI v korporáte.  
**Riešenie:** Prepínač výpadku (v prototype ako checkbox, v produkcii: automatická poistka). Keď AI nedostupná → bannery + editor zostáva 100 % funkčný.  
**Kľúčový princíp:** MDIE nikdy **neblokuje** prácu redakcie. Je to asistent, nie strážca.

### 8.5 Attribution (Kto + Kedy)
**Problém:** Korporátne právne oddelenia požadujú dohľadateľnosť každej zmeny v obsahu.  
**Riešenie:** Pätičky kariet (`Opravil(a) {meno} · pred {X} min.`), plný audit log s `actorId`, `source`, `timestamp`, `documentVersion`.  
**Výsledok:** Každá zmena má „podpis". Systém je audit-ready od prvého dňa pilotu.

### 8.6 Time-to-Fix Metrika
**Definícia:** Čas od prvého otvorenia karty nálezu po klik na AI fix.  
**Prečo to meriame:** Ak je priemerný čas pod 10 sekúnd, systém funguje intuitívne. Ak je nad 2 minúty, education layer alebo UX potrebuje iteráciu.  
**Dôležité:** Táto metrika je **indikátor použiteľnosti**, nie záväzný SLA. Produkčné čísla sa stanovia po pilote.

---

## 11. WIREFRAME / UI NÁČRT

> *Odkaz na živý prototyp: [https://www.aifreelancer.sk/nmh](https://www.aifreelancer.sk/nmh)*  
> *Heslo: `nmh2026`*

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

## 12. TECHNICKÉ POZNÁMKY PRE DEV TÍM

### Dátový model — Claim objekt
```typescript
type Claim = {
  id: string;
  text: string;                  // citovaný text z článku
  risk: "high" | "medium" | "low";
  shortLabel: string;            // krátky názov problému — zobrazený v list view aj detaile
  explanation: string;           // podrobný popis (detail view)
  whyFlagged?: string;           // TL;DR — jedna veta prečo systém nález zdvihol (detail view)
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

> **Poznámka k nákladovej optimalizácii:** Systém využíva Shared Intelligence Core s natívnou podporou Prompt Cachingu a Tiered Routingu pre optimalizáciu API volaní — viď Architektonickú prílohu (Časť B).

---

## HISTORIA DOKUMENTU

| Verzia | Dátum | Autor | Zmena |
|--------|-------|-------|-------|
| 1.0 | 2026-04-12 | Daniel Budziňák | Prvá verzia pre 2. kolo výberového konania NMH |
| 1.2 | 2026-04-12 | Daniel Budziňák | Token Management presunutý do Časti B (Príloha); C zameraná výhradne na feature spec |
|| 2.0 | 2026-04-12 | Daniel Budzinák | Doplnené: DATA GAP, Feature Summary, MVP Scope, Out of Scope, Execution Framing |
|| 2.1 | 2026-04-12 | Daniel Budziňák | Sync s prototypom: list view (iba reason+citácia), TL;DR detail, Ignorovať akcia, resolutionType, score logika |

---

*Dokument pripravený v rámci výberového konania na pozíciu PM/Produktový architekt. Funkčný prototyp je dostupný na vyžiadanie.*

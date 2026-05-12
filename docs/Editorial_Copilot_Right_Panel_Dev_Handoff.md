# Editorial Copilot — pravý panel: podklad pre vývoj (handoff)

**Verzia dokumentu:** 0.1 (návrh)  
**Stav:** *Prvá sekcia je pripravená na validáciu s vývojom; ďalšie sekcie sú rámcové — doplníme po feedbacku.*  
**Súvislosť:** produktový smer je v [`Editorial_Copilot_Strategic_Direction_NHM.md`](./Editorial_Copilot_Strategic_Direction_NHM.md). Technický zdroj prototypu: Next route **`/nmh`** (locale napr. `/sk/nmh`), komponent `EagleCMS.tsx`.

---

## Ako s týmto dokumentom pracovať

1. **Teraz:** Prosím potvrďte alebo doplníte **Sekciu 1** (rozsah a integračná hranica). Bez nej nemá zmysel rozpisovať presný props/API kontrakt.
2. **Potom:** Doplníme Sekcie 2–4 konkrétne (Typescriptové tvary, stavová matica, odporúčaný postup mock vs napojenie).
3. **Mimo scope:** Celý zvyšok EAGLE editora (ľavý stĺpec, formulár článku, modal tagov ako celok) zostáva mimo tohto handoffu, ak nie je explicitne spomenuté.

---

## Sekcia 1 — Rozsah a integračná hranica *(na validáciu)*

### 1.1 Cieľ

Pripraviť **jednu jasnú UI vrstvu** pre **pravý panel „Editorial Copilot“**, kde je už teraz:

- prepínač Nastavenia / Editorial Copilot,
- blok pripravenosti (readiness score, priebeh nálezov),
- sekcia **Odporúčané** (prioritný zoznam),
- záložky **Dôvera / Štýl / SEO**,
- zoznam nálezov alebo **detail nálezu** (vrátane SEO položiek ako klíkových „nálezov“),
- akcie typu validácia, návrhy AI, ignorovať / aplikovať atď.

**Záměr pre vývoj:** oddeliť „**vizuál, layout, animácie a prázdne/stavy**“ od „**načítanie článku, API Intelligence, persistencia**“. Nemusí to znamenať okamžitý Storybook — stačí dohodnutá **hranica súborov a kontrakt udalostí** (`props` + `callbacks`), aby ste mohli **prepojiť káble** bez redesignu layoutu.

### 1.2 Čo je IN scope (tento handoff)

| Položka | Poznámka |
|--------|-----------|
| Pravý stĺpec od toggle „Editorial Copilot“ nadol | V aktuálnom prototyp je vnorený v `EagleCMS.tsx`; cieľom je ho vedieť **extrahovať** bez menenia ľavého editora. |
| Jednotný vertikálny scroll stránky | Prototyp: užívateľský scroll je na `<main>`; pravý panel **nemá** vlastný `overflow-y` scroll — aby nekolidoval s návykom „jedna stránka“. Pri extrakcii prosím zachovať, alebo výslovne odľaviť zmenu UX. |
| Stavy UI definované prototypom | Loading auditu, prázdny stav, detail nálezu, vyriešený nález, SEO reťazec nález → návrh → rekapitulácia, bannery pri výpadku (ak sú zapnuté simulácie v dev buildoch). |

### 1.3 Čo je explicitne OUT of scope (tento handoff)

| Položka | Dôvod |
|--------|--------|
| Ľavý stĺpec editora (titulky, text článku, toolbar…) | Ostáva v existujúcom rodečení; panel dostane už „derivované“ signály alebo callbacky. |
| Modal sprievodcu tagov a odkazov ako celá aplikačná logika | Môže ostať volaný z panela cez callback (`onOpenTagsWizard` atď.); špecifikácia modálu nie je súčasťou prvého rezu panelu. |
| Backendové API a autorizácia | Kontrakt má byť **frontové rozhranie** (props/events); napojenie na reálne služby je na vývoj. |

### 1.4 Integračný model (odporúčaný smer)

**Odporúčaný tvar:**

- **`EditorialCopilotPanel`** (alebo ekvivalent) — čo najviac **presentational**: vstupy sú serializovateľné dáta + málo UI-only stavu (napr. otvorený detail ID je alebo vo view-modeli zvonku).
- **Rodič** (dočasne `EagleCMS`, neskôr tenší kontejner) — drží **zdroje pravdy** pre audit, výber nálezu, históriu undo článku, volania API.

**Minimum na začatie práce bez megarefaktoru:**

1. Vizuál pravého panelu ostane funkčne ako teraz.
2. Dohodneme **zoznam udalostí navonok** (nižšie v dokumente doplníme tabuľku po Sekcii 1).
3. Dátové štruktúry čerpajú z existujúcich typov (`ArticleAudit`, `Claim`, SEO kľúče…) alebo z ich **úzkeho subsetu pre panel**.

### 1.5 Otázky na vývoj (na prvý sync)

Prosím odpovedzte / zakázníčte na grooming:

1. **Kde má žiť modul?** (`src/features/editorial-copilot/`, `packages/ui-editorial-copilot`, …)
2. **Storybook / Ladle:** má zmysel hneď, alebo až po prvej extrakcii súboru?
3. **Server vs client:** panel ostáva `use client`; ktoré dáta idú SSR už pri načítaní editora?
4. **Single scroll:** potvrdiť zachovanie správania bez vnútorného scrollu v pravom paneli na desktop/tablet.

### 1.6 Definition of Done — „fáza 0“ (po vašej validácii Sekcie 1)

- [ ] Písomne potvrdený **IN/OUT scope** (odsek 1.2–1.3).
- [ ] Jedna stránková **škica callbacks** (kto čo volá pri Validate / Apply / Ignore / výbere záložky) — doplníme ako Sekciu 3.
- [ ] Rozhodnutie **kam extrahovať** JSX pravého panelu prvým PR bez zmeny správania.

---

## Sekcia 2 — View-model a props *(rámcovo — po validácii §1)*

**Účel:** Jedna tabuľka „čo panel číta“ vs „čo panel dostane už dopočítané“.  

**Obsah neskôr:**

- Odporúčaný **„CopilotPanelProps“**: napr. `audit`, `isValidating`, `selectedFindingId`, `activeTab`, `assistantPriorities` (už dnes odvodené v prototyp),
- Čo ostane interné vs čo musí dodť host.

*(Nezadávame presné TS typy, kým nie je schválená Sekcia 1.)*

---

## Sekcia 3 — Callback kontrakt *(rámcovo — po validácii §1)*

**Účel:** Zoznam `onXyz` udalostí s významom pre telemetriu a API.

**Predbežný smer (ne záväzný checklist na rozšírenie):**

- Validácia / audit (`onValidate` alebo ekvivalent)
- Výber nálezu / SEO kľúča (`onSelectFinding`)
- Zatvorenie detailu (`onClearSelection`)
- Aplikácia AI návrhu na nález (`onApplyClaimSuggestion`)
- Ignorovanie nálezu (`onIgnoreClaim` / SEO variant)
- Aplikácia SEO návrhu (`onApplySeoSuggestion`)
- Otvorenie sprievodcu tagov / odkazov (`onOpenTagsLinksWizard`)
- Undo článku (ak má zostať dostupný z panelu) (`onUndoArticleSnapshot`)

Presná podpisovka a payload — podľa vašej konvencie (REST, tRPC, server actions).

---

## Sekcia 4 — Stavová matica *(rámcovo)*

**Účel:** Matica „stav systému × čo panel ukáže“ (loading, error, prázdny audit, lock kolaborácie, …).

Parametre stavov doplníme po zhode na Sekciách 1–3.

---

## Sekcia 5 — Mock, fixtures, dokumentácia v Storybooku *(rámcovo)*

**Účel:** Ako dizajn/produkt drží **referenčné scenáre** bez napojenia na backend.

- Fixtures ako malé JSON/TS objekty (scenár „3 nálezy“, „SEO warning“, „všetko vyriešené“).
- Storybook story na riadok: jedna story = jeden fixture.

Implementácia až po odsúhlasení boundary.

---

## Sekcia 6 — Kontakt a ďalší krok

**Ďalší krok:** Meeting alebo komentár k **Sekcii 1** (checklist + otázky 1.5). Po tom doplníme Sekcie 2–4 konkrétnymi tabuľkami pripravenými na implementáciu.

---

*Tento dokument je interný podklad pre tímový alignment; nie je záväzný backlog bez vývojového odhadnutia.*

---

## Príloha: Nahodenie do Confluence (space News & Media / NMH)

**Cieľové miesto:** [NMH space — Overview](https://aifreelancer.atlassian.net/wiki/spaces/NMH/overview) (vyžaduje prihlásenie Atlassian účtom do `aifreelancer.atlassian.net`).

**Poznámka:** Automatické vytvorenie stránky cez API/MCP z tohto prostredia nie je dostupné bez nakonfigurovaného Atlassian MCP a oprávnení; zdroj pravdy ostáva tento súbor v git.

### Postup (prvá stránka v spáci)

1. Otvor space **NMH** → **Create** (Blank page).
2. **Title (navrhovaný):** `Editorial Copilot — pravý panel: handoff pre vývoj (v0.1)`
3. **Obsah:** skopíruj celý dokument od nadpisu `# Editorial Copilot` vyššie až po vetu *„nie je záväzný backlog…“* (bez tejto prílohy — alebo ju pridaj ako sekciu „Interné: ako publikovať“, podľa uváženia).
4. **Markdown v Confluence Cloud:** podľa verzie editora buď priame vloženie, alebo **/** → *Markdown* → vloženie; ak tabuľky nesedia, skopíruj ich ručne z náhľadu v IDE alebo ako HTML export z nástroja, ktorý tí používajú.
5. **Odkaz na strategiu:** relatívny odkaz `Editorial_Copilot_Strategic_Direction_NHM.md` v Confluence nereflektuje repo — doplň buď odkaz na GitHub/raw súbor, alebo duplicitný Confluence dokument so strategickým smerom.

### Metadata na stránke (odporúčané)

| Pole | Hodnota |
|------|--------|
| Labels | `editorial-copilot`, `frontend`, `nmh`, `handoff` |
| Parent | Overview alebo prázdny root space (podľa vašej štruktúry) |

Po zverejnení sem doplň URL stránky do README alebo do komentára v PR (voliteľné).

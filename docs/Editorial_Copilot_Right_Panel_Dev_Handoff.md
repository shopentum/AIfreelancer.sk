# Editorial Copilot — pravý panel: podklad pre vývoj (handoff)

**Verzia dokumentu:** 0.5  
**Status:** Sekcia 1 — čaká na validáciu scope. Sekcie 2–5 — obsah v súlade s repozitárom (`src/features/editorial-copilot/`). Core/API payloady pri callbackoch — doplnenie podľa Jira/Confluence (mimo rozsahu prvého FE extraktu).

**Súvislosť:** Produkt — [`Editorial_Copilot_Strategic_Direction_NHM.md`](./Editorial_Copilot_Strategic_Direction_NHM.md). Prototyp editora: **`/[locale]/nmh`** → `EagleCMS.tsx`. Kontrakt + fixture scenáre: **`/[locale]/nmh/copilot-blueprint`**.

---

## Changelog

### v0.5

- Redakcia tónu dokumentu (changelog, status); presná definícia prototyp vs modul bez meta-komentára.

### v0.4

- Blok **Prototyp vs modul**: kanon vizuálu a správania (`EagleCMS` / `/nmh`) vs pripravený modul (`src/features/editorial-copilot/`).
- Upresnenie úlohy blueprint/playground (kontrakt, review; nie náhrada plného panelu).

### v0.3

- Doplnená stavová matica panelu (loading / zoznam / detail / resolved / banner / undo).
- Doplnený integračný playbook pre FE extrakciu a phased rollout.
- Zosúladenie fixtures ↔ state matrix.
- Zjednotenie DoD a názvoslovia dokumentu.
- Doplnené väzby medzi fixtures, stavmi a callback kontraktom.

**Cieľ zmien v0.3:** minimalizovať priestor na rozdielnu interpretáciu FE správania počas implementácie.

---

## Prototyp vs modul (zdroj pravdy)

- **`EagleCMS.tsx`**, route **`/[locale]/nmh`**: zdroj pravdy pre kompletný vizuál a správanie pravého Copilot panelu (vrátane hrán, ktoré blueprint ešte nekópiuje 1:1).
- **`src/features/editorial-copilot/`**: izolovaný balík pre budúci modul — typy, callbacks, fixtures, blueprint, playground.
- **Blueprint / playground**: nenahrádzajú panel z Eagle; slúžia ako referenčný kontrakt a náhľad scenárov bez spustenia celého editora.
- **Nasledujúca implementačná fáza:** extrakcia JSX a logiky pravého panelu z `EagleCMS.tsx` do modulu; `EagleCMS` ostáva hostiteľ; správanie zostáva zhodné s `/nmh`; kontrakt a fixtures sú už pripravené.

**Implementačný zámer:** aktuálny kanon = Eagle; cieľ = samostatný modul so zhodným správaním + existujúca vrstva kontraktu a fixtures.

---

## Práca s dokumentom

| Položka | Popis |
|--------|--------|
| **Scope (Sekcia 1)** | Validácia rozsahu a integračnej hranice pred uzamykaním backend payloadov pri callbackoch. |
| **Obsah v repozitári** | View-model a callbacks (Sekcie 2–3); stavová matica a integračný postup (Sekcia 4); fixtures a playground (Sekcia 5). |
| **Doplnenie neskôr** | Presné payloady a chybové stavy Core/API pri `onValidate` / apply / ignore (Jira/Confluence). Nie je podmienkou prvého FE extraktu. |
| **Mimo scope** | Ľavý stĺpec editora, celý modal tagov/odkazov, backendová autorizácia — ak nie je výslovne v Sekcii 1. |

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
2. Zoznam udalostí navonok — **Sekcia 3** + typ `EditorialCopilotPanelCallbacks` v repozitári.
3. Dátové štruktúry čerpajú z existujúcich typov (`ArticleAudit`, `Claim`, SEO kľúče…) alebo z ich úzkeho subsetu pre panel.

### 1.5 Otázky na vývoj (na prvý sync)

Otázky na grooming / prvý technický sync:

1. **Kde má žiť modul?** (`src/features/editorial-copilot/`, `packages/ui-editorial-copilot`, …)
2. **Storybook / Ladle:** má zmysel hneď, alebo až po prvej extrakcii súboru?
3. **Server vs client:** panel ostáva `use client`; ktoré dáta idú SSR už pri načítaní editora?
4. **Single scroll:** potvrdiť zachovanie správania bez vnútorného scrollu v pravom paneli na desktop/tablet.

### 1.6 Definition of Done — „fáza 0“ (po vašej validácii Sekcie 1)

- [ ] Písomne potvrdený **IN/OUT scope** (odsek 1.2–1.3).
- [x] Jedna stránková **škica callbacks** — hotová ako **Sekcia 3** + typ `EditorialCopilotPanelCallbacks` v repozitári.
- [ ] Rozhodnutie **kam extrahovať** JSX pravého panelu prvým PR bez zmeny správania (predbežný návrh: `src/features/editorial-copilot/` + postup v Sekcii 4.2).

---

## Sekcia 2 — View-model a props *(kanonický tvar v `types.ts`)*

**Účel:** Jedna tabuľka „čo panel číta“ vs „čo panel dostane už dopočítané“.

**Implementovaný kanon:** rozhranie **`EditorialCopilotPanelViewModel`** v `src/features/editorial-copilot/types.ts` (pole ako `audit`, `isValidating`, `displayedScore`, `findingsProgress`, `activeAuditTab`, `selectedFindingId`, `assistantPriorities`, `claimAiProposal*`, `resolvedClaimDetail`, `seoAppliedKeys`, `ignoredSeoKeys`, `collaborationLocked`, `articleUndoDepth`, voliteľné `fixtureLabel` len pre demo).

Po schválení Sekcie 1 môžeme doplniť stĺpec „kto dopočítava“ (host vs panel) a úzky subset polí pre produkciu, ak bude iný ako celý view-model.

---

## Sekcia 3 — Callback kontrakt *(implementované v blueprinte)*

**Účel:** Zoznam `onXyz` udalostí s významom pre telemetriu a API. V TypeScripte sú to presne polia `EditorialCopilotPanelCallbacks` v `src/features/editorial-copilot/types.ts`.

| Callback | Signatúra (skrátene) | Účel |
|----------|---------------------|------|
| `onValidate` | `()` | Spustenie auditu / validácie. |
| `onSelectFinding` | `(id: string)` | Výber nálezu alebo SEO kľúča (`title`, `seoTitle`, …). |
| `onClearFindingSelection` | `()` | Návrat zo detailu na zoznam. |
| `onAuditTabChange` | `(tab: CopilotAuditTab)` | Prepínač Dôvera / Štýl / SEO. |
| `onRequestClaimAiProposal` | `(claimId: string)` | Vyžiadať AI návrh pre trust/štýl nález. |
| `onApplyClaimAiProposal` | `(claimId: string)` | Použiť návrh v článku (host). |
| `onIgnoreClaim` | `(claimId: string)` | Ignorovať nález. |
| `onApplySeoSuggestion` | `(key: SeoAuditKey)` | Použiť SEO návrh. |
| `onIgnoreSeoSuggestion` | `(key: SeoAuditKey)` | Ignorovať SEO položku. |
| `onPriorityActivate` | `(rowKey: string)` | Klik z riadku Odporúčané. |
| `onOpenTagsLinksWizard` | `()` | Otvoriť sprievodcu tagov / odkazov (iba hook). |
| `onUndoArticleSnapshot` | `()` | Undo poslednej zmeny článku z panela. |

Payload na strane Core/API ostáva na vývoj — blueprint volá len tieto funkcie bez sieťovej logiky.

---

## Sekcia 4 — Stavová matica a postup integrácie

**Účel:** Mapovanie kombinácií `EditorialCopilotPanelViewModel` na správanie UI; poradie krokov pri extrakcii JSX z `EagleCMS.tsx` (bez zmeny správania `/nmh`).

### 4.1 Matica stavov (orientačná)

Riadky = typické **systémové situácie**; stĺpce = čo má host nastaviť vo **`EditorialCopilotPanelViewModel`** a čo používateľ vidí. Niektoré polia sú ortogonálne (napr. banner + audit).

| Situácia | Typické polia VM | Viditeľné správanie panelu (high-level) |
|----------|------------------|----------------------------------------|
| Pred prvou validáciou | `audit: null`, `isValidating: false`, `findingsProgress: null` | Výzva spustiť validáciu; žiadny zoznam nálezov. |
| Validácia prebieha | `isValidating: true`, `audit` často `null` alebo starý | Indikátor loadingu; CTA validácie disabled alebo „prebieha“. |
| Audit načítaný, zoznam | `audit` vyplnený, `selectedFindingId: null` | Záložky + zoznam nálezov / SEO položiek; readiness podľa `displayedScore` / progress. |
| Detail nálezu (trust / štýl) | `selectedFindingId` = ID claimu, `resolvedClaimDetail` podľa potreby | Detail karty; ak je návrh → `claimAiProposal`; ak vyriešené → `resolvedClaimDetail`. |
| Detail SEO | `activeAuditTab: "seo"`, `selectedFindingId` ∈ SEO kľúče | SEO detail; po aplikácii môže `seoAppliedKeys` obsahovať kľúč. |
| Banner výpadku / nedostupnosti | `sidebarBanner` text | Horná hláška; zvyšok panelu môže byť partial alebo read-only podľa dohody. |
| Kolaboračný zámok | `collaborationLocked: true` | Akcie meniace článok / audit **disabled** v blueprinte; copy od hosta (prototyp má vlastný text). |
| Undo dostupné | `articleUndoDepth > 0` | Tlačidlo undo enabled; host interpretuje hĺbku zásobníka. |

**Chybový stav auditu** (`auditError` v prototyp `EagleCMS`) zatiaľ **nie je** samostatné pole vo view-modeli — host môže mapovať chybu na `sidebarBanner` alebo rozšíriť typ po dohode (malý doplnok).

### 4.2 Odporúčaný postup integrácie (fáza 1 → 2)

Postup: prvý PR = presun vizuálu a logiky panelu; správanie zhodné s `/nmh`.

1. **Potvrdiť Sekciu 1** (scope, single scroll, umiestnenie modulu) — zápis z groomingu alebo komentár v úlohe.
2. **Extrahovať JSX pravého panelu** z `EagleCMS.tsx` do napr. `EditorialCopilotPanel.tsx` v `src/features/editorial-copilot/`: vstupy = aktuálne lokálne state handlery ostávajú v rodičovi, panel dostane props zhodné s `EditorialCopilotPanelViewModel` + `EditorialCopilotPanelCallbacks` (alebo tenší alias, kým sa typy zliaju 1:1).
3. **Parita s blueprintom:** kde blueprint zámerne zjednodušuje (napr. SEO applied recap), doplniť paritu z Eagle do modulu alebo rozdiel explicitne uviesť v PR (podklad pre QA).
4. **`/nmh/copilot-blueprint`:** referencia na kontrakt a fixture scenáre; automatické testy porovnávajú s `/nmh` len tam, kde je so blueprintom zámerná zhoda.
5. **Fáza 2:** napojiť callbacks na skutočné API/Core podľa vášho kontraktu (mimo tohto dokumentu); doplniť telemetriu podľa potreby.

### 4.3 Súvislosť s fixtures

Pri rozšírení produktových stavov: nový riadok v **5.2** + nový riadok v matici **4.1** + prípadná úprava callback tabuľky (Sekcia 3).

---

## Sekcia 5 — Mock, fixtures, playground *(implementovaný prvý rez)*

**Účel:** Držať **referenčné scenáre** bez napojenia na backend a bez celého `EagleCMS`.

### 5.1 Kde je kód

| Súbor | Úloha |
|------|--------|
| `src/features/editorial-copilot/types.ts` | `EditorialCopilotPanelViewModel`, `EditorialCopilotPanelCallbacks`, `CopilotAuditTab`, pomôcky (`isCopilotSeoKey`, `findClaimById`), `noopCopilotCallbacks`. Typy auditu čerpajú z `ArticleAudit`, `Claim`, `SeoAuditKey` v `@/eagle_admin/geminiService`. |
| `src/features/editorial-copilot/fixtures.ts` | `DEMO_ARTICLE_AUDIT`, `getEditorialCopilotFixture(id)`, `EDITORIAL_COPILOT_FIXTURE_IDS`. |
| `src/features/editorial-copilot/EditorialCopilotPanelBlueprint.tsx` | Presentational blueprint pravého panelu (readiness, Odporúčané, záložky, zoznam/detail, základné CTA). Nie je pixel-parita s celým `EagleCMS` — cieľ je kontrakt + hlavné stavy. |
| `src/features/editorial-copilot/CopilotBlueprintPlayground.tsx` | Client: výber fixture, panel + `console.info` na všetky callbacks (`[CopilotBlueprint]`). |
| `src/features/editorial-copilot/index.ts` | Re-exporty pre hostiteľa. |
| `src/app/[locale]/nmh/copilot-blueprint/page.tsx` | Next stránka (`noindex`): renderuje playground. |

### 5.2 Tabuľka fixtures (`EditorialCopilotFixtureId`)

| ID | Čo ilustruje |
|----|----------------|
| `empty_before_audit` | Pred prvou validáciou, prázdny panel. |
| `validating` | Loading validácie. |
| `trust_list` | Záložka Dôvera — zoznam nálezov + Odporúčané. |
| `trust_detail_with_proposal` | Detail nálezu + AI návrh textu. |
| `trust_detail_resolved` | Detail vyriešeného nálezu (HITL rekapitulácia). |
| `seo_tab_list` | Záložka SEO — zoznam položiek. |
| `seo_detail_suggestion` | SEO detail s návrhom (štítok `title`). |
| `seo_detail_applied` | Ten istý kľúč po aplikácii (`seoAppliedKeys` obsahuje `title`; audit upravený helperom). |
| `sidebar_banner_only` | Horný banner (simulácia nedostupnosti služby). |

### 5.3 Čo blueprint zatiaľ **nezahŕňa** (oproti `EagleCMS`)

- Plný SEO „applied“ diff / recap ako v plnom prototyp.
- Všetky animácie a okrajové stavy kolaborácie mimo základného `collaborationLocked`.
- Akýkoľvek fetch, persistencia, synchronizácia s ľavým editorom — host musí mapovať skutočný stav na `EditorialCopilotPanelViewModel`.

### 5.4 Storybook / Ladle

Playground na route nahradzuje prvý beh Storybooku; po dohode s FE možno pridať stories, ktoré volajú ten istý `getEditorialCopilotFixture`.

---

## Sekcia 6 — Ďalší krok

1. Validácia **Sekcie 1** (odpovede na **1.5**, schválenie **1.6**).
2. Schválenie postupu **4.2** (prvý extrakt PR).
3. Doplnenie Core/API payloadov podľa Jira/Confluence po dodaní podkladu — mimo kritickej cesty prvého FE extraktu.

---

*Tento dokument je interný podklad pre tímový alignment; nie je záväzný backlog bez vývojového odhadnutia.*

---

## Príloha: Nahodenie do Confluence (space News & Media / NMH)

**Cieľové miesto:** [NMH space — Overview](https://aifreelancer.atlassian.net/wiki/spaces/NMH/overview) (vyžaduje prihlásenie Atlassian účtom do `aifreelancer.atlassian.net`).

**Poznámka:** Automatické vytvorenie stránky cez API/MCP z tohto prostredia nie je dostupné bez nakonfigurovaného Atlassian MCP a oprávnení; zdroj pravdy ostáva tento súbor v git.

### Postup (prvá stránka v spáci)

1. Otvor space **NMH** → **Create** (Blank page).
2. **Title (navrhovaný):** `Editorial Copilot — pravý panel: handoff pre vývoj (v0.5)`
3. **Obsah:** skopíruj celý dokument od nadpisu `# Editorial Copilot` vyššie až po vetu *„nie je záväzný backlog…“* (bez tejto prílohy — alebo ju pridaj ako sekciu „Interné: ako publikovať“, podľa uváženia).
4. **Markdown v Confluence Cloud:** podľa verzie editora buď priame vloženie, alebo **/** → *Markdown* → vloženie; ak tabuľky nesedia, skopíruj ich ručne z náhľadu v IDE alebo ako HTML export z nástroja, ktorý tí používajú.
5. **Odkaz na strategiu:** relatívny odkaz `Editorial_Copilot_Strategic_Direction_NHM.md` v Confluence nereflektuje repo — doplň buď odkaz na GitHub/raw súbor, alebo duplicitný Confluence dokument so strategickým smerom.

### Metadata na stránke (odporúčané)

| Pole | Hodnota |
|------|--------|
| Labels | `editorial-copilot`, `frontend`, `nmh`, `handoff` |
| Parent | Overview alebo prázdny root space (podľa vašej štruktúry) |

Po zverejnení sem doplň URL stránky do README alebo do komentára v PR (voliteľné).

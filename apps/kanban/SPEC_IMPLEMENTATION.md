# Kanban Dashboard — MVP špecifikácia a návod na implementáciu

Tento dokument je **zdroj pravdy** pre správanie a implementáciu MVP. Pôvodný outline je v [`kanban.txt`](./kanban.txt); kde sa líši, platí **tento dokument**.

Číslovanie funkcií v `kanban.txt` (1, 4, 6, 7) je zámerné - ostatné body sú mimo MVP.

### Rozhodnutia uzavreté pred kódením

1. **Status v modale:** modal má **status select**; **DnD ostáva primárne**. Oba vstupy musia volať **tú istú** doménovú funkciu napr. `updateTaskStatus(taskId, nextStatus)` (názov podľa codebase), aby nevznikli rozdielne vetvy logiky.
2. **Časovač - uložené vs odvodené:** persistuje sa len `isTimerRunning` a `timerStartedAt`. Stav **paused** na UI je **odvodený**: `paused = !isTimerRunning && totalTrackedSeconds > 0` (žiadny samostatný boolean v modeli).
3. **Archív UI:** MVP musí obsahovať **Archive panel/stránku** so zoznamom položiek, filtrom podľa projektu, filtrom podľa dátumu a sumárom vyfiltrovaného času.
4. **Dátum a čas v UI (absolútne časové pečate):** slovenský formát **`15.5.2026 22:20`** - deň a mesiac **bez** úvodných núl, rok štvormiestny, medzera, čas **24 h** v tvare `HH:mm` (hodiny a minúty dvojmiestne). Jednotne pre activity log, stĺpec `archivedAt` v archíve a kdekoľvek inde sa z ISO z modelu zobrazuje kalendárny čas. (V kóde ostáva ukladanie ISO; formátuje sa pri renderi, `timeZone` podľa používateľa / `Europe/Bratislava` ak treba explicitne.)
5. **Trvanie časovača** (pole `totalTrackedSeconds` na karte a v modale): **nie** rovnaký formát ako dátum vyššie; ľudský zápis, napr. `1h 23m`, `45m`, `0m` podľa kontextu - jedna funkcia formátovania v celej appke.

---

## 1. Účel a kontext

- **Nie** náhrada Jira; Jira zostáva zdroj pravdy na projektovej vrstve.
- **Áno** osobná execution vrstva: rýchly capture, kanban, čas na úlohe, poznámky, jednoduchá história udalostí.
- Bez auth, tímových funkcií a AI v MVP.

---

## 2. Hlavná obrazovka (index)

- Kanban board **na jednej stránke** — štyri stĺpce, všetky aktívne úlohy podľa vybraného filtra.
- **Predvolený filter:** „All“ — na doske sú úlohy zo **všetkých projektov naraz** (vrátane Index).
- **Zmena filtra horizontálnym výberom projektu:** UI okamžite zobrazí len úlohy patriace pod daný filter (bez nového route-u nutné; stačí jedna route `/` + client state).

---

## 3. Projekty a „Index“

### 3.1 Zoznam projektov

Pomenované projekty (príklad):

- Shopentum  
- NMH  
- AIWORKS  
- Finance  
- Personal  

### 3.2 Index (nezatriedené)

- **Index** je štandardný projekt v zmysle poľa `project` na úlohe — miesto pre úlohy bez konkrétneho klienta/streamu.
- V horizontálnom selectore je položka **Index** vedľa **All** a ostatných projektov.
- Úlohy s `project === Index` sú „nezatriedené“.

### 3.3 Filter horného panelu

Poradie odporúčané pre UX:

1. **All** — všetky aktívne úlohy  
2. **Index**  
3. Ostatné projekty (scroll horizontálne podľa potreby)

---

## 4. Brain dump (rýchly zápis)

Umiestnenie: navrch boardu, vždy viditeľný.

Komponenty:

1. **Textové pole** — názov úlohy.  
2. **Select projektu** — položky: **Index**, Shopentum, NMH, AIWORKS, Finance, Personal (alebo konfigurovateľný zoznam).

Správanie:

- **Enter** vytvorí úlohu so stavom **Ready**.
- Ak používateľ **níč nevyberie v selecte**, implicitná hodnota je **Index** (nezatriedené).
- Žiadny modal pri vytvorení.
- Úlohu je možné neskôr upraviť v detaile (názov, projekt, stav, poznámky).

---

## 5. Kanban stĺpce

| Stav            | Farebný akcent (UI) |
|-----------------|---------------------|
| Ready           | modrá               |
| In Progress     | oranžová            |
| Ready to Review | fialová             |
| Done            | zelená              |

- Drag & drop medzi stĺpcami mení **status** úlohy.
- **Pri presune do In Progress:** žiadny dialóg, žiadna automatika časovača (viď sekciu 7).

---

## 6. Task card (náhľad na doske)

Na karte viditeľné minimálne:

- titul  
- **badge projektu** (vrátane „Index“)  
- **narátaný čas** (`totalTrackedSeconds` — čitateľný formát, napr. `1h 23m`)  
- **indikátor časovača:** **running** ak `isTimerRunning`; **paused** ak odvodené `paused` (viď sekciu 7); inak **stopped** (napr. ešte nikdy spustený alebo po Stop s vynulovaným časom podľa správania tlačidiel)

Klik na kartu → detail (**modal**, viď sekciu 8).

---

## 7. Časovač (MVP - ručný)

Požiadavky:

- Start / Pause / Stop z UI (primárne v **modale detailu**; voliteľne aj kompaktné akcie na karte ak nekomplikuje layout).
- Čas je **viditeľný na karte** v kanbane (ako vyššie).

**Zjednodušenie oproti staršiemu outline v `kanban.txt`:**

- **Žiadne** automatické spustenie ani prompt pri presune do **In Progress**.
- **Žiadne** automatické pause pri **Ready to Review** ani stop pri **Done**.

Odporúčaná konzistentná logika aj tak:

- Pri **Done** alebo pri explicitnom **Stop**: zapísať do activity logu zastavenie / dokončenie podľa potreby; narátaný čas musí zostať uložený v úlohe (pre fakturáciu a archív).

### 7.1 Polia v úlohe (explicitné)

- `isTimerRunning`: `boolean` - aktuálne beží segment časovača  
- `timerStartedAt`: `string | null` - ISO začiatok aktuálneho segmentu; ak `isTimerRunning`, malo by byť non-null

**Odvodený stav na UI (nepersistuje sa):**

```text
paused = !isTimerRunning && totalTrackedSeconds > 0
```

Interpretácia:

- **`paused`:** už bol nazbieraný nejaký čas a timer práve nebeží (typicky po Pause alebo po Stop bez vynulovania podľa správania tlačidiel).
- **`stopped` bez času:** napr. `!isTimerRunning && totalTrackedSeconds === 0` a `timerStartedAt === null`.

Implementácia Start/Pause/Stop musí držať konzistenciu polí vyššie (napr. Pause: pripočítať elapsed do `totalTrackedSeconds`, nastaviť `isTimerRunning = false`, `timerStartedAt = null`).

### 7.2 Výpočet zobrazeného času

- Persistovaný základ: `totalTrackedSeconds`.
- Ak `isTimerRunning === true` a `timerStartedAt` je nastavené: **displej** = `totalTrackedSeconds + (now - timerStartedAt)` v sekundách (alebo ekvivalent bez driftu podľa volby časovej bázy).

Edge cases na zhodu v implementácii:

- Refresh počas behu: **dopočítanie na UI** - `getDisplayTrackedSeconds` pripočíta delta z `timerStartedAt` k `totalTrackedSeconds` pri renderi; persistovaný `totalTrackedSeconds` sa zvýši až pri Pause/Stop alebo pri presune do **Done** (vtedy sa behajúci segment pred zmenou statusu zlúči do `totalTrackedSeconds` a zapíše sa `timer_stopped`).

---

## 8. Detail úlohy - **modal**

Áno: **modalné okno** (nie drawer), aby bol kontext boardu stále čitateľný na pozadí.

Obsah modalu:

- titul (editovateľný)  
- výber projektu (vrátane Index)  
- **select statusu** - ten istý význam ako presun DnD medzi stĺpcami; **DnD ostáva primárny** spôsob práce na doske  
- textarea poznámok (jednoduchý markdown text - bez rich editora)  
- časovač: Start / Pause / Stop + zobrazenie celkového času  
- activity timeline (zoradená časovo, najnovšie dole alebo hore - zvoľ jedno a drž konzistentne)

**Jedna aktualizačná logika:** zmena statusu cez DnD aj cez select v modale musí ísť cez **spoločnú** funkciu (napr. `updateTaskStatus`), vrátane zápisu do activity logu a `updatedAt`.

---

## 9. Poznámky

- Nepovinné pole `notes` (plain text / „markdown štýl“ bez náhľadu je OK).
- Uloženie pri blur alebo explicitnom „Save“ — MVP môže byť auto-save na `change` s malým debounce.

---

## 10. Activity log

Účel: **orientácia v čase** („ktorý deň som to rozbehol“), nie reporting ani analytika.

Typy udalostí (minimum):

- Created  
- Status changed (starý → nový)  
- Timer started / paused / stopped  
- Notes updated (voliteľne zlučiť viac edits do jednej položky debounceom, aby log nebol spam)  
- Project changed  
- Marked done (ak sa líši od samotnej zmeny statusu — môže byť jedna udalosť)

Formát položky:

- `id`, `type`, `at` (ISO timestamp), `payload` (ľubovoľný krátky JSON alebo text — napr. `{ from: 'Ready', to: 'In Progress' }`)

**Trim:**

- drž rozumný limit napr. **200–500 posledných položiek na úlohu** alebo **90 dní** — čo nastane skôr; pri append orež zo začiatku.
- nie je potrebná ťažká analytika ani export logu v MVP.

---

## 11. Archivácia Done úloh

### 11.1 Počas behu aplikácie (jedna „session“ v zmysle otvoreného tabu)

- Úlohy vo stĺpci **Done** **zostávajú na doske** a sú súčasťou aktívnych dát — používateľ ich vidí.

### 11.2 Pri ďalšom načítaní aplikácie (reload / nový vstup na stránku)

- Úlohy vo stave **Done** sa **presunú z aktívnej dosky do archívu**.
- Archív je **per projekt**: úloha ide do archívu podľa svojho `project` (Shopentum, Index, …).
- Motivácia: uchovanie **časov a histórie** pre fakturáciu a spätné vyhodnotenie; aktívna doska ostane čitateľná.

### 11.3 Technické uloženie (localStorage)

Odporúčaný model:

- **`kanban_active_tasks_v1`** — pole aktívnych úloh (bez Done po flushi pri štarte — pozri nižšie).
- **`kanban_archives_v1`** — objekt `{ [projectId: string]: ArchivedTask[] }` alebo ekvivalent.

Algoritmus pri **bootstrap** aplikácie:

1. Načítaj aktívne úlohy a archívy z storage.  
2. Identifikuj úlohy so `status === 'Done'`.  
3. Pre každú pridaj kópiu do `archives[task.project]` (append na začiatok alebo koniec — zvoľ a drž).  
4. Odstráň ich z aktívneho poľa.  
5. Persistuj obe štruktúry.

**Poznámka:** Jednorazový omylom refresh presunie Done do archívu — ak bude vadné, neskôr sa dá doplniť „Undo posledný archive flush“ alebo oneskorený flush cez tlačidlo.

### 11.4 UI archívu v MVP (povinné)

MVP obsahuje **Archive panel alebo samostatnú stránku** (route napr. `/archive` alebo prepínač pohľadu v rámci appky) s týmito povinnými časťami:

- **Zoznam položiek** archívu: aspoň `title`, `project`, `totalTrackedSeconds`, `archivedAt`  
- **Filter podľa projektu** (vrátane Index), konzistentný s id projektov na boarde  
- **Filter podľa dátumu** (aspoň od-do podľa `archivedAt`; voliteľne rýchle predvoľby dnes/týždeň/mesiac)  
- **Sumár vyfiltrovaného času**: súčet `totalTrackedSeconds` po aplikovaní filtrov, zobrazený v ľudskom formáte podľa rozhodnutia 5

Pravidlá správania:

- Filtre sa aplikujú kombinovane (project + date range).  
- Sumár sa prepočíta pri každej zmene filtra.  
- Pri nulovom výsledku sa zobrazí `0m` a prázdny stav zoznamu.

Implementačne je akceptovateľné zdieľať komponenty s hlavnou appkou (rovnaký tmavý štýl). Cieľ je rýchlo nájsť položky a ich čas pre fakturáciu.

---

## 12. Dátový model úlohy

Pole minimálne:

- `id`: string (uuid)  
- `title`: string  
- `project`: string (id projektu alebo `'index'`)  
- `status`: enum - Ready \| InProgress \| ReadyToReview \| Done  
- `notes`: string  
- `createdAt`: ISO string  
- `updatedAt`: ISO string  
- `totalTrackedSeconds`: number  
- `timerStartedAt`: `string | null` (začiatok aktuálneho behu segmentu)  
- `isTimerRunning`: boolean (pozri sekciu 7.1)  
- `activityLog`: array (položky podľa sekcie 10)

**UI-only (nepersistované):** `paused = !isTimerRunning && totalTrackedSeconds > 0`

Archivovaná úloha môže mať navyše:

- `archivedAt` — čas presunu do archívu  

---

## 13. Persistencia — localStorage teraz, Supabase neskôr

### 13.1 Zásady

- Žiadny backend v prvom kole; všetko cez **localStorage** (alebo `indexedDB` ak veľkosť — pre MVP stačí localStorage pri rozumnom počte úloh).
- Kód rozdeľ tak, aby **UI a doménová logika** nevolali `localStorage` priamo v každom komponente — jedna vrstva napr. `TaskRepository` / `tasksStorage.ts`.

### 13.2 Rozhranie repozitára (návrh)

Metódy orientačne:

- `loadActiveTasks()`, `saveActiveTasks(tasks)`  
- `loadArchives()`, `saveArchives(archives)`  
- `flushDoneToArchives()` — voliteľne volaná len pri bootstrap (podľa sekcie 11)

Pre Supabase neskôr:

- Rovnaké rozhranie implementuje `SupabaseTaskRepository` (náhrada storage).
- Mapovanie riadok ↔ Task jednym mapperom.
- Auth a multi-device sú mimo MVP; pri migrácii bude potrebné **anon kľúč + RLS** alebo jednoduchý token — rozhodnutie pri integrácii.

Verziovanie kľúčov (`_v1`) uľahči migrácie schémy storage.

---

## 14. Dizajn

- Tmavý **enterprise** štýl v línií existujúceho webu (referencia vizuálna z hlavnej stránky / brand guidelines ak existujú).
- Formátovanie času v UI: rozhodnutia **4** a **5** v bloku „Rozhodnutia uzavreté pred kódením“ vyššie.
- Akcenty stĺpcov podľa tabuľky v sekcii 5.
- Žiadny enterprise šum (žiadne story points, sprinty, komentáre …).

---

## 15. Monorepo a nasadenie (skrátene)

- Samostatný priečinok appky s vlastným `package.json`.
- Vercel: **Root Directory** = priečinok appky (tam kde je `package.json`).
- Voliteľne root `README.md` s mapou `apps/*` → domény.

**Dvoje PC:** čisto **localStorage** synchronizáciu medzi strojmi neumožní; sync cez Supabase je budúci krok podľa sekcie 13.

---

## 16. Kontrolný zoznam implementácie

1. [ ] Shell appky + routing `/`  
2. [ ] Stav boardu + filter All / Index / projekty  
3. [ ] Brain dump + select projektu (default Index)  
4. [ ] DnD medzi stĺpcami + persistencia aktívnych úloh  
5. [ ] Modal detail + poznámky + časovač (ručný)  
6. [ ] Activity log — append pri akciách + trim  
7. [ ] Bootstrap flush Done → archív per projekt + persistencia archívu  
8. [ ] Archive panel/stránka (zoznam položiek, filter projektu, filter dátumu, sumár vyfiltrovaného času)  
9. [x] Abstrakcia repozitára pripravená na Supabase (`createTaskRepository`, skeleton, mapper)  

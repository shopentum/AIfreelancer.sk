# Kanban Dashboard - fázy implementácie

Zdroj pravdy: [`SPEC_IMPLEMENTATION.md`](./SPEC_IMPLEMENTATION.md)

## Fáza 1 - Základ a board (hotová)

**Cieľ:** Použiteľný kanban na jednej stránke s perzistenciou.

- [x] Shell appky (Vite + React + TS), route `/`
- [x] Typy, projekty, formátovanie času (SK dátum, trvanie)
- [x] `TaskRepository` + localStorage (`kanban_active_tasks_v1`)
- [x] Filter All / Index / projekty
- [x] Brain dump + select projektu (default Index)
- [x] 4 stĺpce, karty (titul, badge, čas, indikátor časovača)
- [x] DnD medzi stĺpcami cez `updateTaskStatus`
- [x] Activity log pri create / zmene statusu (základ)

**Mimo scope fázy 1:** modal detail, časovač ovládanie, archív UI, flush Done pri štarte.

**Spustenie:** `cd apps/kanban && npm run dev` (port 5174)

## Fáza 2 - Detail a časovač (hotová)

- [x] Modal (titul, projekt, status select, poznámky)
- [x] Start / Pause / Stop + live displej času
- [x] Activity log (timer, notes, project)
- [x] Refresh: dopočítanie z `timerStartedAt` (globálny tick + `getDisplayTrackedSeconds`; pri Done zlúčenie segmentu)

## Fáza 3 - Archív (hotová)

- [x] `kanban_archives_v1` + bootstrap flush Done pri štarte (`flushDoneToArchive`, finalizácia bežiaceho časovača)
- [x] Stránka `/archive`: tabuľka, filter projektu, filter dátum (od-do, kalendár Europe/Bratislava), predvoľby Dnes / 7 dní / Tento mesiac
- [x] Sumár vyfiltrovaného času + počet položiek
- [x] `react-router-dom`, navigácia Board / Archív, `vercel.json` rewrite pre SPA

## Fáza 4 - Nasadenie a rozšírenia (hotová)

- [x] Root `README.md` - mapa `apps/*` a domény
- [x] `apps/kanban/README.md`, `.env.example`, `docs/SUPABASE_MIGRATION.md`
- [x] `createTaskRepository` + `SupabaseTaskRepository` skeleton + `taskMapper`
- [x] UX: titulky stránok, badge úložiska v navigácii, hint pri stĺpci Done, URL query pre filtre archívu

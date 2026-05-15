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

## Fáza 2 - Detail a časovač

- Modal (titul, projekt, status select, poznámky)
- Start / Pause / Stop + live displej času
- Activity log (timer, notes, project)
- Refresh: dopočítanie z `timerStartedAt`

## Fáza 3 - Archív

- `kanban_archives_v1`, bootstrap flush Done
- Stránka `/archive`: zoznam, filter projektu + dátum, sumár času

## Fáza 4 - Nasadenie a rozšírenia

- README / Vercel root `apps/kanban`
- Supabase `TaskRepository` implementácia (voliteľne skeleton)
- Drobný polish UX

# Supabase - budúca integrácia

MVP používa `LocalStorageTaskRepository`. Prepínač: `VITE_TASK_STORAGE=local` (default).

## Skeleton v codebase

- `src/repositories/TaskRepository.ts` - rozhranie
- `src/repositories/createTaskRepository.ts` - factory
- `src/repositories/supabaseTaskRepository.ts` - implementácia zatiaľ hádže `SupabaseNotConfiguredError`
- `src/repositories/supabase/taskMapper.ts` - mapovanie `Task` ↔ `TaskRow`

## Kroky pri zapnutí Supabase

1. Vytvoriť tabuľku `kanban_tasks` (návrh stĺpcov v `taskMapper.ts`).
2. RLS: používateľ vidí len svoje riadky (`user_id = auth.uid()`).
3. Nainštalovať `@supabase/supabase-js`, doplniť klienta v `SupabaseTaskRepository`.
4. Vercel env: `VITE_TASK_STORAGE=supabase`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
5. Jednorazová migrácia z localStorage (export/import script).

Auth a multi-device sync sú mimo aktuálneho MVP.

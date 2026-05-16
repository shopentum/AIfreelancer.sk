# Kanban Dashboard

Osobný execution board. Špecifikácia: [`SPEC_IMPLEMENTATION.md`](./SPEC_IMPLEMENTATION.md), fázy: [`PHASES.md`](./PHASES.md).

## Produkcia

- https://kanban.aifreelancer.sk/
- Vercel preview: https://kanbanapp-sepia.vercel.app/

## Vývoj

```bash
cd apps/kanban
npm install
cp .env.example .env   # voliteľné
npm run dev
```

App beží na http://localhost:5174

## Build

```bash
npm run build
npm run preview
```

## Routy

- `/` - Kanban board  
- `/archive` - Archív (po reload sa Done úlohy presunú sem)

Filtre archívu sa synchronizujú do URL (`?project=nmh&from=2026-05-01&to=2026-05-15`) - zdieľateľný odkaz pre fakturáciu.

## Konfigurácia

| Premenná | Default | Popis |
|----------|---------|--------|
| `VITE_TASK_STORAGE` | `local` | `local` = localStorage; `supabase` = skeleton (ešte bez DB) |
| `VITE_SUPABASE_URL` | - | budúci Supabase projekt |
| `VITE_SUPABASE_ANON_KEY` | - | budúci anon kľúč |

Viac: [`docs/SUPABASE_MIGRATION.md`](./docs/SUPABASE_MIGRATION.md)

## Vercel

V projekte **kanban_app** (nie hlavný Next.js site):

| Nastavenie | Hodnota |
|------------|---------|
| Root Directory | `apps/kanban` |
| Framework Preset | Vite (alebo Other — `vercel.json` to prepíše) |
| Build Command | *(prázdne — berie z `vercel.json`)* |
| Output Directory | `dist` — **nie** `apps/kanban/dist` |

`vercel.json` — `outputDirectory: dist`, SPA rewrite pre `/archive` a `/backlog`.

Ak vidíš *No Output Directory named dist*: Root Directory musí byť `apps/kanban`, Output Directory len `dist`.

Premenné prostredia nastav v projekte Vercel (Production). Pre MVP stačí default bez env (local storage v prehliadači používateľa).

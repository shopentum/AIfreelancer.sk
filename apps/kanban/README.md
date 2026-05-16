# Kanban Dashboard

Osobný execution board. Špecifikácia: [`SPEC_IMPLEMENTATION.md`](./SPEC_IMPLEMENTATION.md), fázy: [`PHASES.md`](./PHASES.md).

## Produkcia

- https://kanban.aifreelancer.sk/
- Vercel preview: https://kanbanapp-sepia.vercel.app/

## Vývoj

```bash
cd apps/kanban
npm install
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

Lokálne: `npm run preview` a otvor `/archive` priamo v prehliadači.

## Vercel

Root Directory: `apps/kanban`

V priečinku appky je `vercel.json` s rewrite na `index.html`, aby `/archive` fungovalo po deployi (SPA).

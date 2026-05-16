# `/apps` — deployovateľné aplikácie

Jeden podpriečinok = jedna SPA s vlastným `package.json` a (typicky) vlastným Vercel projektom.

**Register:** [`../SYSTEM_REGISTRY.md`](../SYSTEM_REGISTRY.md)

| Priečinok | Stav | Kód |
|-----------|------|-----|
| [`site/`](site/) | live | README only — Next.js v koreni repa |
| [`kanban/`](kanban/) | live | plná appka |
| [`cashflow/`](cashflow/) | external | len README → repo `shopentum/cashflow` |

**Default:** menšie veci → `aifreelancer.sk/<path>` (`src/features` + `src/app`).  
Sem (`apps/`) dávaj SPA v monorepe, ak naozaj potrebuje oddelený build — **nie** nové Git repo.

Samostatný produkt → vlastný repo (pozri `cashflow/` README), nie plná kópia v `apps/`.

Vždy najprv `SYSTEM_REGISTRY.md` a checklist **nová vec**.

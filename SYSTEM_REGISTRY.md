# System Registry — aifreelancer.sk ecosystem

**Jediný zdroj pravdy** pre aplikácie, domény a deploy. Pred novou appkou, Vercel projektom alebo duplicitným priečinkom **najprv uprav tento súbor**, potom kód.

Posledná revízia: 2026-05-16

---

## Ako čítať tabuľku

| Stĺpec | Význam |
|--------|--------|
| **app** | Krátky ID (`kanban`, `cashflow`, `site`) |
| **root** | Kde je zdroják (cesta v repe alebo externý repo) |
| **domain** | Verejná produkčná URL |
| **deployment model** | Ako sa nasadzuje |
| **owner** | Kto rozhoduje / udržiava |
| **production state** | `live` \| `redirect` \| `staging` \| `deprecated` \| `external` |

---

## Centrálny register aplikácií

| app | root | domain | deployment model | owner | production state |
|-----|------|--------|------------------|-------|------------------|
| **site** | `/` (tento repo, Next.js `src/app`) | `www.aifreelancer.sk`, `aifreelancer.sk` | Vercel **`a-ifreelancer-sk`** · Root **prázdne** · `npm run build` | Daniel / shopentum | **live** |
| **kanban** | `apps/kanban` | `kanban.aifreelancer.sk` | Vercel **`kanban_app`** · Root **`apps/kanban`** · `vite build` | Daniel / shopentum | **live** |
| **cashflow** | GitHub **`shopentum/cashflow`** (nie v tomto repe) | `cashflow.aifreelancer.sk` | Vercel **`cashflow-omega`** · Root **prázdne** · samostatný repo | Daniel / shopentum | **live** |
| **shopentum** | GitHub **`shopentum/shopentum.sk`** | `shopentum.sk` (podľa DNS projektu) | Vercel **`shopentum-sk`** · samostatný repo | shopentum | **live** |

### Presmerovania na hlavnom webe (nie samostatné appky)

| path na `site` | cieľ | production state |
|----------------|------|------------------|
| `/cashflow`, `/[locale]/cashflow` | `https://cashflow.aifreelancer.sk` | **redirect** |

---

## Vercel — povolené projekty (monorepo `shopentum/AIfreelancer.sk`)

| Vercel project | Git repo | Root Directory | Doména |
|----------------|----------|----------------|--------|
| `a-ifreelancer-sk` | `AIfreelancer.sk` | `.` | `www` + apex |
| `kanban_app` | `AIfreelancer.sk` | `apps/kanban` | `kanban.aifreelancer.sk` |

**Zakázané:** druhý import toho istého repa pre `site` (`a-ifreelancer-sk-*`, `eagle-cms`, …).  
**Zakázané:** Vercel projekt s Root `omega-cashflow` alebo kopie cashflow v monorepe.

`vercel.json` v koreni: `ignoreCommand` → build `site` preskočí, ak commit mení **iba** `apps/kanban/**`.

---

## Štruktúra repozitára `AIfreelancer.sk`

```
apps/                    # Samostatné deployovateľné SPA (1 priečinok = 1 Vercel root)
  kanban/                # live — kanban.aifreelancer.sk
  cashflow/              # README only — kód v shopentum/cashflow
  README.md

src/
  app/                   # Next.js App Router (= routes, pozri src/routes/README.md)
  features/              # Produktové / marketingové featury (komponenty + logika)
  modules/               # Väčšie interné moduly (Eagle, …)
  routes/                # Dokumentácia mapovania URL → app/
  components/            # Zdieľané UI
  lib/                   # Zdieľané utility (site URL, cashflow redirect, …)

SYSTEM_REGISTRY.md       # tento súbor
```

Externé appky **nemajú** duplicitný kód v `apps/<name>/` — len `apps/<name>/README.md` s odkazom na repo.

---

## Site moduly (súčasť `site`, nie vlastný Vercel)

| module | kód | príklad URL | poznámka |
|--------|-----|-------------|----------|
| marketing | `src/app/(site)/`, `src/components/` | `/`, `/agency`, `/kontakt` | verejný web |
| izyvape | `src/app/(site)/izyvape*`, `src/components/Izyvape*` | `/izyvape`, `/izyvape-strategy` | klientska prezentácia |
| eagle-admin | `src/eagle_admin/`, `src/app/.../eagle-admin` | `/eagle-admin` | prototyp CMS, **nie** `eagle-cms` projekt |
| nmh | `src/app/.../nmh` | `/nmh`, `/nmh/copilot-blueprint` | interné / demo |
| proficrafts | `src/components/proficrafts/` | `/proficrafts` | microsite v Next |
| prusafinance | `public/prusafinance/` | `/prusafinance/*` | statický export v `public` |

---

## Checklist — nová aplikácia

1. [ ] Záznam v tabuľke **Centrálny register** v tomto súbore.
2. [ ] Rozhodnutie: **monorepo `apps/<id>`** vs **nový Git repo** (cashflow / shopentum model).
3. [ ] Presne **jeden** Vercel projekt + **jedna** produkčná doména.
4. [ ] Root Directory = priečinok s `package.json` danej appky (nie koreň monorepa pre SPA).
5. [ ] `ignoreCommand` / úprava `scripts/vercel-should-build-main.sh` ak je v monorepe.
6. [ ] Žiadna druhá kópia appky v `src/` ani `omega-*` paralelný priečinok.
7. [ ] Aktualizovať `apps/README.md` a prípadne `src/routes/ROUTES.md`.

---

## Checklist — zmena deploy / domény

1. [ ] Overiť **Settings → Domains** — doména len na jednom projekte.
2. [ ] Production deploy z `main` na správnom projekte.
3. [ ] Aktualizovať tento register (stĺpec domain / production state).

---

## Historické chyby (neopakovať)

- Viacero Vercel projektov s Root `.` na jedno repo → každý push = N buildov, doména na inom projekte ako úspešný deploy.
- `omega-cashflow/` + `src/cashflow/` + `shopentum/cashflow` — tri kópie jednej appky.
- `eagle-cms` Vercel projekt — Eagle je modul v Next.js, nie samostatná appka.
- `PersonalKanban.tsx` v `apps/kanban/docs/` — netýka sa produkcie, rozbíjal root TypeScript check.

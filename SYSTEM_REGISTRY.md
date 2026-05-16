# System Registry — aifreelancer.sk ecosystem

**Jediný zdroj pravdy** pre aplikácie, domény a deploy. Pred novou appkou, Vercel projektom alebo duplicitným priečinkom **najprv uprav tento súbor**, potom kód.

Posledná revízia: 2026-05-16

---

## Produktové pravidlo (default)

**Samostatné Git repo len pre samostatný produkt** (vlastný životný cyklus, často vlastná značka alebo dlhodobo oddelený vývoj mimo marketingového webu).

Všetko menšie patrí do ekosystému **aifreelancer.sk** — nie nový Vercel import toho istého monorepa, nie duplicitný kód.

| Veľkosť / účel | Kam | URL typicky | Nový repo? |
|----------------|-----|-------------|------------|
| Landing, klient deck, interný modul, prototyp | `src/features/` alebo `src/modules/` + `src/app/…` | `aifreelancer.sk/<path>` | **Nie** |
| Väčšia SPA, ale stále jeden ekosystém (nástroj, dashboard) | `apps/<id>/` v monorepe | subdoména `*.aifreelancer.sk` alebo path na `site` | **Nie** |
| **Samostatný produkt** | vlastný GitHub repo | vlastná doména / subdoména | **Áno** |

**Predvolené:** skús najprv path na `site` → potom `apps/` v monorepe → samostatné repo až po explicitnom rozhodnutí v registri (stĺpec *deployment model* obsahuje `standalone-product`).

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
| **site** | `/` (Next.js `src/app`) | `www.aifreelancer.sk`, `aifreelancer.sk` | **`monorepo-site`** · Vercel `a-ifreelancer-sk` · Root `.` | Daniel / shopentum | **live** |
| **kanban** | `apps/kanban` | `kanban.aifreelancer.sk` | **`monorepo-app`** · Vercel `kanban_app` · Root `apps/kanban` | Daniel / shopentum | **live** |
| **cashflow** | GitHub **`shopentum/cashflow`** | `cashflow.aifreelancer.sk` | **`standalone-product`** · Vercel `cashflow-omega` | Daniel / shopentum | **live** |
| **shopentum** | GitHub **`shopentum/shopentum.sk`** | `shopentum.sk` | **`standalone-product`** · Vercel `shopentum-sk` | shopentum | **live** |

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

## Checklist — nová vec (vždy v tomto poradí)

1. [ ] Je to **samostatný produkt**? Ak **nie** → žiadne nové repo (pokračuj krokom 2–3).
2. [ ] Stačí **stránka / modul**? → `src/features/<name>/` + route `aifreelancer.sk/...` + záznam v **Site moduly**.
3. [ ] Potrebuje **vlastnú SPA** (Vite), ale stále náš ekosystém? → `apps/<id>/` + Vercel s Root `apps/<id>` (nie nový repo).
4. [ ] Až ak **samostatný produkt** → nový repo + jeden Vercel + záznam s `standalone-product`.
5. [ ] Záznam v tabuľke **Centrálny register** (app, root, domain, deployment model, owner, state).
6. [ ] Presne **jeden** Vercel projekt + **jedna** produkčná doména.
7. [ ] Žiadna druhá kópia kódu (`src/` + `apps/` + externý repo naraz).
8. [ ] `src/routes/ROUTES.md` pri novej verejnej ceste na `site`.

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

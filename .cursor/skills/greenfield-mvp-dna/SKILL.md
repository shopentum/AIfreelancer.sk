---
name: greenfield-mvp-dna
description: Scopes and architects greenfield MVPs (own products and client work) using a consistent Decision Intelligence DNA—delivery vs Phase 2, STOP CONDITIONS, DATA GAP, narrow measurable slices, and role boundaries. Use when starting a new MVP, client proposal, spike vs build, scope creep review, or when work is outside NMH/EAGLE enterprise context.
disable-model-invocation: true
---

# Greenfield MVP — Decision DNA

Reusable **spôsob rozhodovania** pre nové MVP (vlastné aj klientské). Nie história chatu, nie enterprise NMH špecifiká — na NMH/EAGLE použi skill `nmh-decision-intelligence-architecture`.

## Kedy použiť

- Nový produkt, klient, pilot, „spravme MVP“
- Rozhodnutie spike vs implementácia
- Review scope pred deadline / demo / odovzdaním klientovi
- Oddelenie **čo ukážeme teraz** vs **čo je vízia / Phase 2**
- Prevencia driftu (framework v demo, duplicitný scope, chýbajúce AC)

## DNA — core principles

| Princíp | Význam |
|--------|--------|
| **Jedna hodnota, jeden rez** | MVP = jedna jasná user/job story + merateľný výsledok; nie mini-platforma |
| **Delivery → metodika** | Pred termínom: fungujúci slice, UI/flow, dáta „dostatočné na demo“; analytika/metodika/scale → Phase 2 |
| **Shape > completeness** | Stabilná štruktúra (API, model, obrazovka) nad 100 % edge cases; medzery pomenovať |
| **Reuse pred greenfield** | Existujúci repo, modul, auth, design system — nie nový stack „lebo sa dá“ |
| **Externý ≠ interný artefakt** | Klient/stakeholder dostane **čo a kedy**; interný doc = prečo, riziká, Phase 2 — nemiešať |
| **Product vlastní smer** | Stack, AI model, integrácie, „či vôbec“ — nie dev počas sprintu bez ticketu |
| **AI: človek rozhoduje** | Návrh áno; autonómne kritické akcie nie (publish, platba, delete, send) |
| **Signály, nie impact** | Metriky = usage/behavior signály; causal ROI až keď je meranie pripravené |
| **Eligible báza** | Ak meriaš adopciu/úspech, menovateľ = kde feature **má zmysel**, nie „všetci používatelia / všetky záznamy“ |

## Rozhodovací tok (vždy)

```
1. Typ?        [Vlastný produkt | Klientský delivery | Interný prototyp]
2. Fáza?       [Discovery spike | MVP delivery | Phase 2]
3. Audience?   [Klient | Investor | Interný tím | Dev]
4. Deadline?   [Áno → STOP sklon | Nie → viac dizajnu povolené]
5. Core key?   [User/entity ID, auth, zdroj pravdy — existuje?]
6. Mimo scope? [DATA GAP + kto rozhodne]
```

## STOP CONDITIONS

Ak platí aspoň jedna podmienka, **zastav** rozširovanie a framework language:

| Ak… | Preferuj |
|-----|----------|
| **Deadline > metodická čistota** | Demo-ready slice; metodiku do Phase 2 |
| **Stakeholder chce delivery, nie framework** | Krátky scope: čo dodáme, čo nie, AC, termín |
| **Chýba core identity / join key** | DATA GAP + spike; nedesignovať reporting ani integrácie „cez to“ |
| **Causal / ROI metodika nie je pripravená** | Popisné metriky; nie „zvýšilo to X %“ |

**V tomto režime:** explicitný **DATA GAP** · **užší scope** · **stable delivery** · **follow-up Phase 2** (samostatný ticket / interný doc).

STOP ≠ nekvalita — je to **správna vrstva práce v správnom čase**.

## STOP check (30 sekúnd)

Pred každým výstupom pre klienta / ticket / implementáciu:

1. Je to **MVP delivery** alebo už **Phase 2**?  
2. Číta to **kto potrebuje akciu** (nie len architekt)?  
3. Je **jeden** hlavný výsledok demo?  
4. Sú **AC merateľné**?  
5. Platí **STOP**? → skrátiť, nie doplniť framework.

## Fázy a artefakty

| Fáza | Účel | Typický výstup |
|------|------|----------------|
| **Discovery / spike** | Rozhodnutie áno/nie, stack, riziká | Stručný záver + DATA GAP + rozpad taskov |
| **MVP delivery** | Fungujúci slice pre deadline | Scope 1 strana + AC + mimo scope |
| **Phase 2** | Metodika, scale, analytics, hardening | Interný backlog / architektúra — nie v tom istom texte ako demo scope |

**Kontajner + detail (pattern):** epic / parent = zodpovednosť; **jeden** implementačný task alebo doc = presný delivery (žiadna duplicita parent = child).

## Scope pravidlá MVP

**Zahrň:**

- Jedna primárna user journey (happy path + 1–2 známe failure režimy)
- Auth / tenancy len ak je v MVP nevyhnutná
- Observability minimum: log + 1–2 business eventy (nie full BI)
- Explicitné **mimo scope** a **kto interpretuje** (ty / klient / ich analytik)

**Nezahrň do MVP delivery (→ Phase 2):**

- Univerzálny admin, multi-tenant enterprise, full i18n
- Kompletný reporting framework, A/B platforma, ML pipeline
- „Všetky integrácie“ a causal impact reporting

## DATA GAP

```markdown
## DATA GAP
- [Čo nevieme]
- [Blokuje MVP? áno / nie]
- [Kto rozhodne]
- [Dočasný default do rozhodnutia]
```

- **Neblokujúce** (chýba pekná metrika) → označiť, MVP pokračuje  
- **Blokujúce** (neexistuje API, identity, legal) → spike alebo zúžiť MVP

## Role (generic)

| Rola | Zodpovednosť |
|------|----------------|
| **Product / ty (architektúra)** | Scope, stack, priorita, interpretácia pre biznis |
| **Build (dev / agent)** | Implementácia podľa uzavretého AC |
| **Klient / stakeholder** | Akceptácia slice; nie mikroriadenie stacku v tickete |
| **Dáta / integrácie** | Dodajú connector alebo export; interpretácia podľa dohody |

## Anti-patterns

| Anti-pattern | Náprava |
|--------------|---------|
| MVP = celá vízia v jednom tickete | Slice + Phase 2 backlog |
| Framework language v klientskom emaile | Delivery language |
| Spike bez DATA GAP | Explicitné medzery |
| „Optimalizovať“ / „spraviť pekne“ bez AC | Merateľné kritérium |
| Nový repo/Vercel bez registry check (v monorepe) | Reuse path na `site` / `apps/*` podľa projektu |
| AI auto-publish / auto-send | HITL, confirm step |

## Expected outputs

| Situácia | Šablóna |
|----------|---------|
| **MVP scope (klient / interný)** | [mvp-scope-template.md](mvp-scope-template.md) |
| **Architektúra (interná, 1 strana)** | Problém → slice → stack → data flow → riziká → DATA GAP → Phase 2 |
| **Dev task** | Zadanie úzke → AC → test/overenie; bez reopen stacku |

## Súvisiace zdroje

- Terminológia: [terminology.md](terminology.md)  
- Prompty a flows: [examples.md](examples.md)  
- **NMH / EAGLE / DataHub / CMS:** skill `nmh-decision-intelligence-architecture` (nie tento)

## Rozšíriteľnosť

Doplň **princípy**, nie názvy klientov ani ticket ID. Vertikálu (e‑shop, fintech, CMS) pridaj do `terminology.md` + jeden flow do `examples.md`.

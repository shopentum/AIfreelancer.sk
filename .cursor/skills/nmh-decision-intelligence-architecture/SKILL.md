---
name: nmh-decision-intelligence-architecture
description: Applies NMH enterprise architecture and Decision Intelligence reasoning for CMS Copilot, AI governance, DataHub measurement, editorial workflows, and validation layers. Use when designing or scoping AI/editorial systems, usage vs performance analytics, stakeholder tickets (DH/CMS), MVP boundaries, measurement framing, or preventing architectural drift in NMH/EAGLE context.
disable-model-invocation: true
---

# NMH Decision Intelligence — Architecture Intelligence

Reusable **spôsob rozhodovania**, nie pamäť chatu. Pri každej úlohe najprv urči **fázu** (delivery / design / governance), **audience** (interné / DH / redakcia / vedenie) a **vrstvu** (interaction vs performance).

## Kedy použiť tento skill

- Návrh alebo review architektúry CMS Copilot, editorial workflow, QA/validation vrstvy
- Rozhodnutia o meraní AI (adopcia, CAP/eligible, performance signály, reporting)
- Oddelenie MVP od dlhodobej vízie; scope ticketov voči DataHub / CMS / produktu
- Framing „AI usage vs business dopad“ bez predčasného causal/ROI tlaku
- Enterprise artefakty: parent task + subtask, interný vs externý dokument
- Kontrola driftu (framework language v delivery, zmiešané vrstvy, zlý menovateľ metrík)

## Core principles (stabilná vrstva)

| Princíp | Význam |
|--------|--------|
| **Orchestrácia, nie nový ostrov** | Využiť `article_id` spine, existujúce moduly, logy, DH — Copilot agreguje a prioritizuje, nenahrádza celý stack naraz |
| **Článok ako os** | `ArticleDocumentId` / `article_id` = kanonický join pre usage, rozhodnutia redaktora, performance po publishi |
| **Dve vrstvy merania** | **Usage / interaction** (CMS, adopcia, návrhy) ≠ **Performance** (web metriky po publikácii). Neprepájať do jedného „AI impact“ rámca predčasne |
| **CAP / eligible** | Menovateľ adopcie a porovnaní = články, kde bola feature **reálne dostupná**, nie všetky články na webe |
| **Popisné signály, nie causal impact** | Preferovať *performance signals*, enrichment, porovnanie v rámci eligible — nie „AI zdvihla X %“ bez metodiky |
| **Shape > completeness** | Stabilná štruktúra datasetu / výstupu nad dokonalým vyplnením polí; medzery explicitne |
| **AI navrhuje, človek rozhoduje** | HITL, audit, explainability; žiadna autonómna publikácia |
| **Delivery → metodika** | Pred kritickým termínom (napr. Pent): dodať tabuľky/grafy/polia; „upratovanie“ metodiky až v ďalšej fáze |
| **Roly a scope** | DH **dodáva dáta**; CMS/produkt **interpretuje**; dev implementuje podľa **uzavretého** stacku |
| **Product vs Dev** | Výber nástroja/smeru = produkt/architektúra; dev task = implementácia + AC, nie reopen výberu |

## Rozhodovací tok (vždy)

```
1. Fáza?     [MVP delivery | Stabilizácia | Phase 2 metodika | Vízia]
2. Kto číta? [Interné | DH | Redakcia | Management]
3. Čo meníme? [UX/workflow | Dataset | Ticket | Governance]
4. Ktorá vrstva? [Usage | Performance | Obe — oddelene špecifikované]
5. Je CAP definovaný per feature?
6. Je join key explicitný?
7. Čo je mimo scope / DATA GAP?
```

## Architectural patterns

### A. Editorial Copilot — vrstvený model (referenčná mapa)

Nie „sidebar s 30 AI funkciami“, ale **Article Performance State** + prioritizované odporúčania:

1. Content Quality  
2. SEO Intelligence  
3. Discovery & Distribution  
4. Performance Intelligence (napojenie na realitu po publishi)  
5. Editorial Decision (TOP N, severity, confidence)  
6. Learning & Adoption  
7. Governance & Trust (HITL, audit, policy)

**ERI pri odporúčaní:** Evidence → Reasoning → Impact (impact ako rámec pre redaktora, nie ako garantovaná causal metrika v reportingu).

### B. Measurement spine

```
CMS usage / suggestion logs ──article_id──► článok ◄──article_id── web performance (DH)
                      │
                      └── CAP/eligible per AI feature (per typ obsahu, výnimky)
```

- Adopcia: `použité / eligible` v **rovnakej** CAP definícii  
- Performance enrichment: dostupné polia pri článku; nie všetky features musia mať všetky metriky  
- Porovnanie (keď už Phase 2): within eligible, same period — used vs not-used **iba v eligible**

### C. Enterprise ticketing

| Úroveň | Účel |
|--------|------|
| **Parent** (napr. DH epic) | Kontajner zodpovednosti, krátky popis |
| **Sub-task** | Konkrétny delivery scope, moduly, AC |

**Pravidlo:** Externý text = čo dodať; interný framing = prečo a ako neskôr — **nemiešať** do jedného Jira popisu predčasne.

### D. Artefakty: tri úrovne

1. **Externý / DH** — delivery language: čo, ktoré moduly, kľúč, CAP, deliverable, acceptance  
2. **Interný Phase 2** — grain, rezy, dokumentácia medzier, recurring dataset  
3. **Framing / vízia** — dlhodobý jazyk, governance, anti-patterns (nikdy nie ako závislosť DH ticketu v delivery fáze)

## Decision heuristics

**Pred Pent / kritickým stakeholderom**

- Minimalizovať riziko zdržania: žiadna nová metodická agenda v tom istom tickete čo dáta  
- Neposielať DH interné „bridge“ / framework dokumenty  
- Explicitne: vyhodnotenie dát = CMS tím; DH = výstupy  

**Pri návrhu metriky**

- Opýtať sa: *Je menovateľ eligible báza alebo celý web?*  
- Opýtať sa: *Meriame interaction alebo performance?*  
- Opýtať sa: *Chýbajúca metrika blokuje dodanie?* → default **nie**  

**Pri scope creep**

- Ak text vyžaduje baseline diskusiu, komparačnú metodiku, causal ROI → presunúť do **Phase 2** alebo spike s **DATA GAP**  
- Ak ticket nie je spike, musí byť **realizovateľný** bez „preskúmajme možnosti“  

**MVP filter**

- Čo je **orchestrácia existujúceho** vs **nová platforma**?  
- Čo musí fungovať pri výpadku jednej služby?  
- Čo sa dá logovať už teraz (životný cyklus návrhu: navrhnuté → prijaté / odmietnuté / ignorované)?  

## Anti-patterns

| Anti-pattern | Prečo je zlý | Náprava |
|--------------|--------------|---------|
| „AI impact“ / ROI framework v DH delivery tickete | Otvára metodickú diskusiu, blokuje dáta | Delivery + Phase 2 oddelene |
| Baseline = všetky články | Skresľuje adopciu | CAP/eligible menovateľ |
| Zmiešanie usage + performance do jednej metriky | Nekonzistentná interpretácia | Dve vrstvy, jeden join key |
| Framework language pred Pentom | DH nepotrebuje vyriešiť teóriu na dodanie tabuliek | Krátky subtask |
| Duplicitný parent + subtask obsah | Noise v Jire | Parent kontajner, detail v subtasku |
| Spike bez DATA GAP | Nerealizovateľný follow-up | Explicitné medzery a rozhodnutia |
| Copilot = len LLM | Ignoruje deterministické moduly | Orchestrácia signálov + cielený LLM |
| 30 návrhov v paneli | AI fatigue, pokles adopcie | TOP N, severity, ticho keď netreba |

## DATA GAP handling

Použiť vždy, keď chýba rozhodnutie alebo dáta:

```markdown
## DATA GAP
- [Čo nevieme]
- [Prečo to blokuje / neblokuje]
- [Kto rozhodne: Produkt | Architektúra | DH | CMS]
- [Default / dočasný postup do rozhodnutia]
```

- **Neblokujúce medzery** (chýbajúca performance metrika pre feature) → označiť, dodanie pokračuje  
- **Blokujúce medzery** (neexistuje join key, CAP nedefinovaný) → spike / follow-up pred implementáciou  

## Governance constraints

- Žiadna autonómna publikácia; audit trail pre AI návrhy a rozhodnutia redaktora  
- Explainability: prečo návrh, z čoho vychádza, confidence  
- Sensitive topics / brand tone / policy alignment — signál, nie autonómna zmena  
- Dev **nemení** produktové rozhodnutie nástroja ticho — explicitný follow-up  
- Interné repo dokumenty ≠ automatická závislosť externého tímu  

## Expected outputs (podľa typu úlohy)

| Typ | Štruktúra výstupu |
|-----|-------------------|
| **DH / data request** | Kontext → čo dodať → moduly → kľúč → CAP pravidlo → performance polia → mimo scope → deliverable → acceptance |
| **Architektúrny návrh** | Problém → princípy → vrstvy → data flow → MVP slice → Phase 2 → riziká → DATA GAP |
| **Produktový task** | Zadanie (úzke) → AC merateľné → bez duplicity s podkladom → realizovateľné pre dev |
| **Interný framing** | Slovník → scope / out of scope → anti-patterns → ďalší krok |

## Rýchla kontrola pred odovzdaním

- [ ] Je audience správna (nie interný framework pre DH)?  
- [ ] Je fáza správna (delivery vs metodika)?  
- [ ] Je `article_id` explicitný?  
- [ ] Je CAP per feature zmienený tam, kde sú podiely?  
- [ ] Sú vrstvy oddelené?  
- [ ] Je interpretácia dát priradená správnej role?  
- [ ] Chýbajúce metriky nie sú falošný blokér?  

## Ďalšie zdroje v tomto skilli

- Terminológia a mapovanie pojmov: [terminology.md](terminology.md)  
- Príklady promptov a reasoning flows: [examples.md](examples.md)  

## Rozšíriteľnosť

Skill dopĺňaj **princípmi a heuristikami**, nie ticket ID ani dátumami. Projektové detaily (konkrétne moduly Pent kola, cesty v repo) patria do `docs/Report/` alebo taskov — skill odkazuje na **vzory**. Pri nových doménach (napr. ďalší vertical) pridaj sekciu do `terminology.md` a jeden example flow do `examples.md`.

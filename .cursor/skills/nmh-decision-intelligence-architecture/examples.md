# Príklady — prompty a reasoning flows

## Example prompts (pre užívateľa)

```
Navrhni scope sub-tasku pre DataHub pred Pentou: adopcia všetkých AI nástrojov 
+ performance polia len pre [moduly]. Parent je DHUB-XXXX. Bez framework language.
```

```
Rozdeľ toto zadanie na MVP delivery vs Phase 2 metodiku. 
Ktorú časť môže DH dostať teraz a čo nechať interné?
```

```
Skontroluj tento Jira popis proti NMH architecture intelligence: 
CAP, article_id, vrstvy, anti-patterns.
```

```
Navrhni DATA GAP sekciu pre spike: chýba definícia eligible pre Poll Generator.
```

```
Ako má Copilot agregovať SEO checker + tagy + LLM feedback bez toho, 
aby bol len ďalší LLM sidebar?
```

---

## Flow 1: Pent / DH delivery (z chatu)

**Vstup:** Potrebujeme dáta pre vedenie, DH má málo času, nechceme metodickú diskusiu.

**Reasoning:**

1. Fáza = **delivery**; audience = **DH**  
2. Parent = kontajner; **sub-task** = čo dodať  
3. Časť A: adopcia, existujúce CAP, `article_id`, menovateľ = eligible nie celý web  
4. Časť B: explicitný zoznam modulov + performance polia podľa náleznosti  
5. Explicitne: chýbajúce metriky **nie blokér**; interpretácia = **CMS**  
6. Vylúčiť: baseline framework, causal, interné framing docs  

**Výstup:** Krátky Jira Description (~1 obrazovka), nie Phase 2 dokument.

---

## Flow 2: Phase 2 po dodaní dát

**Vstup:** Dáta z Pent sú vonku, chceme recurring dataset usage ↔ performance.

**Reasoning:**

1. Fáza = **Phase 2**; audience = **interné + neskôr DH**  
2. Oddeliť usage a performance vrstvy, jeden join key  
3. CAP per feature pre adopciu aj rezy  
4. Porovnanie: within eligible; dokumentovať rezy  
5. Shape > completeness; medzery v dokumentácii  
6. Nový DH ticket — **nie** rozšírenie Pent sub-tasku o framework  

**Výstup:** Interný operačný návrh + samostatný data request.

---

## Flow 3: Copilot feature — je to MVP?

**Vstup:** „Pridajme CTR prediction do panelu hneď.“

**Reasoning:**

1. Ktorá vrstva? Performance — vyžaduje dáta po publishi a model  
2. Existuje infra? Ak nie → **DATA GAP** alebo Phase 2  
3. MVP = orchestrácia existujúcich signálov + TOP N odporúčania  
4. ERI: aký evidence dnes máme pre redaktora?  
5. Governance: HITL, confidence, nie auto-publish  

**Výstup:** MVP slice (signál / pravidlo) vs backlog (prediction).

---

## Flow 4: Metrika adopcie vyzerá nízko

**Vstup:** „Adopcia AI je len 3 %.“

**Reasoning:**

1. Menovateľ = všetky články alebo **eligible**?  
2. Per feature CAP — je nástroj na tom článku vôbec použiteľný?  
3. Usage vs performance — metrika ktorého typu?  
4. Časové okno a rollout feature  

**Výstup:** Buď oprava definície CAP, alebo DATA GAP na produktové pravidlá.

---

## Flow 5: Task pre dev vs spike

**Vstup:** „Implementujte lepší AI reporting.“

**Reasoning:**

1. Je zvolený nástroj/smer? Ak nie → **produkt**, nie dev task  
2. Merateľné AC? Ak nie → doplniť alebo spike  
3. Je to spike? → povinný **DATA GAP** a výstup = rozhodnutie / rozpad taskov  
4. Text ticketu musí stačiť na grooming bez 20-stranového doc  

**Výstup:** Úzky dev task alebo spike s medzerami.

---

## Mini šablóna: architektúrny návrh (interný)

```markdown
## Problém
[1–2 vety]

## Princípy (max 5)
- …

## Vrstvy / data flow
[diagram alebo odrážky]

## MVP (teraz)
- …

## Phase 2 (neskôr)
- …

## DATA GAP
- …

## Riziká / anti-patterns
- …
```

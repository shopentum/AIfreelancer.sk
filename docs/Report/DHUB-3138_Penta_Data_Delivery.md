# DHUB-3138 — Pent dodanie (Jira štruktúra)

**Účel:** Text do Jiry **bez Confluence**.

**Štruktúra:**

| Úroveň | Čo to je |
|--------|-----------|
| **DHUB-3138** | **Hlavný task** (parent) — drží zodpovednosť za Pent zadanie voči DataHubu. |
| **Sub-task pod DHUB-3138** | **Krátky návrh dodania** — čo dodať, ktoré moduly, aké dáta, CAP podľa existujúcich pravidiel. |

**Teraz delivery, potom metodika:** Rozšírený operačný návrh (grain, komparačné rezy, baseline dokumentácia, rozlíšenie usage vs web metrík) je **iba interný** v [`DataHub_AI_Reporting_Phase2_PostPenta.md`](./DataHub_AI_Reporting_Phase2_PostPenta.md) — **nie** do Pent subtasku.

**Komunikácia s DH:** Neprepájať Pent úlohu s neskorším recurring „prepojením“ datasetov — samostatný ticket po Pent.

---

## Moduly — doplnenie **performance** polí v tomto kole

*(ostatné AI nástroje: v tomto kole stačí adopcia / usage ako v Časti A — bez rozšírených web metrik)*

| AI modul / feature |
|-------------------|
| **Tag Generator** |
| **Poll Generator** |
| **Related articles auto-suggestion** |
| **Video subtitles Generator** |
| **Audio Transcript** |

**Performance dáta (orientačne):** čo už viete priradiť k **článku** alebo k **použitiu feature** z web analytiky / DH — napr. views, engagement, CTR, revenue (podľa dostupnosti). Chýbajúce pole **nie je blokér**.

---

## Copy-paste — Parent: **DHUB-3138** (hlavný task)

### Summary (pole Summary na DHUB-3138)

```
Penta — DataHub: podklady AI reporting (adopcia + performance pre vybrané moduly)
```

### Description (pole Description na DHUB-3138)

```
Kontajner: jednorazové dodanie reportingových podkladov pre Pentu (DataHub).

Konkrétny rozsah dodania je v priradenom subtasku (produkt / NMH).
```

---

## Copy-paste — **Sub-task** (dieťa pod DHUB-3138)

*Parent link: **DHUB-3138**.*

### Summary (pole Summary na subtasku)

```
[Penta] AI adopcia + doplnenie performance polí (5 modulov)
```

### Description (pole Description na subtasku)

```
Parent: DHUB-3138.

Jednorazové podklady pre Pentu. Cieľ: existujúce zdroje, tabuľky/grafy — bez otvárania novej metodickej agendy v tomto ticketi.

1) Adopcia — všetky AI nástroje v súčasnom AI reportinge
• Tabuľky a grafy ako doteraz (periodicita / dashboard podľa zvyku DH).
• CAP / eligible: dodržať existujúce pravidlá AI reportingu pre jednotlivé nástroje; základnú adoption metriku nemeníme.

2) Performance polia — len týchto 5 modulov
• Tag Generator
• Poll Generator
• Related articles auto-suggestion
• Video subtitles Generator
• Audio Transcript
• K výstupu priradiť dostupné web / DH performance údaje na úrovni článku (alebo tak, ako viete spočítať pri použití feature) — čo konkrétne (views, CTR, engagement, …) podľa vašej náleznosti. Ak niečo pre modul nie je, vynechať alebo krátko označiť medzeru.

Deliverable: dohodnutý formát (tabuľka / export / úprava dashboardu) + grafy pre Pentu podľa potreby produktu.

Acceptance: NMH potvrdí dodanie bodu 1 podľa existujúcich CAP pravidiel a bodu 2 pre uvedených päť modulov v dohodnutom rozsahu.
```

---

*Interné: **DHUB-3138** = parent; vyššie = Pent **subtask**. Rozšírená metodika po Pent: [`DataHub_AI_Reporting_Phase2_PostPenta.md`](./DataHub_AI_Reporting_Phase2_PostPenta.md).*

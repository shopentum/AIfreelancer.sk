# DHUB-3138 — Pent dodanie (Jira štruktúra)

**Účel:** Text do Jiry **bez Confluence**.

**Štruktúra:**

| Úroveň | Čo to je |
|--------|-----------|
| **DHUB-3138** | **Hlavný task** (parent) — drží zodpovednosť za Pent zadanie voči DataHubu. |
| **Sub-task pod DHUB-3138** | **Krátky návrh dodania** — čo dodať, ktoré moduly, aké dáta, CAP podľa existujúcich pravidiel. |

**Teraz delivery, potom metodika:** rozšírený návrh po Pent je interné v [`DataHub_AI_Reporting_Phase2_PostPenta.md`](./DataHub_AI_Reporting_Phase2_PostPenta.md). Pent subtask doň **nenarážať** voči DH.

**Komunikácia s DH:** Pent úlohu neprepájať s neskorším recurring prepojením datasetov — vlastný ticket po Pent.

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

**Performance dáta (orientačne):** čo už viete priradiť k **článku** alebo k **použitiu feature** z web analytiky / DH — napr. views, engagement, CTR, revenue (podľa dostupnosti).

**Neúplnosť metrik (explicitne):**

- Nie všetky AI features musia mať v tomto kole dostupné performance metriky.
- Chýbajúce metriky nie sú blokér pre vznik ani dodanie výstupu (tabuľka / export / úprava dashboardu).

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

Mimo scope tohto ticketu: vyhodnotenie / interpretácia dát (čo čísla „znamenajú“ pre biznis) — to bude riešiť CMS tím; DH dodáva výstupy podľa dohody.

1) Adopcia — všetky AI nástroje v súčasnom AI reportinge
• Tabuľky a grafy ako doteraz (periodicita / dashboard podľa zvyku DH).
• Spájanie na článok cez kanonický identifikátor: ArticleDocumentId / article_id (alebo ekvivalent, ktorý používate ako zdroj pravdy).
• CAP / eligible: dodržať existujúce pravidlá AI reportingu pre jednotlivé nástroje. Pri adopčných podieloch a „baseline“ menovateľoch nejde o počet všetkých článkov na webe, ale o bázu tam, kde bola daná AI funkcia pre daný typ obsahu reálne dostupná / použiteľná (podľa tých istých eligible pravidiel). Číslo má odrážať túto realitu, nie umelo nafúknutý celkový počet článkov.

2) Performance polia — len týchto 5 modulov
• Tag Generator
• Poll Generator
• Related articles (auto-suggestion)
• Video subtitles Generator
• Audio Transcript
• K výstupu priradiť dostupné web / DH performance údaje na úrovni článku cez rovnaký článkový kľúč ako vyššie (ArticleDocumentId / article_id), alebo tak, ako viete spočítať pri použití feature — konkrétne polia (views, CTR, engagement, …) podľa dostupnosti.

• Nie všetky AI features musia mať dostupné performance metriky v tomto kole.
• Chýbajúce metriky nie sú blokér pre vznik ani dodanie výstupu.

Deliverable: dohodnutý formát (tabuľka / export / úprava dashboardu) + grafy pre Pentu podľa potreby produktu.

Acceptance: NMH potvrdí dodanie bodu 1 podľa existujúcich CAP pravidiel a bodu 2 pre uvedených päť modulov v dohodnutom rozsahu; vyhodnotenie dát ostáva na CMS tíme.
```

---

*Interné: **DHUB-3138** = parent; vyššie = Pent **subtask**. Rozšírená metodika po Pent: [`DataHub_AI_Reporting_Phase2_PostPenta.md`](./DataHub_AI_Reporting_Phase2_PostPenta.md).*

# DHUB-3138 — jednorazové dodanie dát pred Pentou

**Účel:** Text pripravený na **Jira task DHUB-3138** (bez Confluence špecifikácie).  
**Dôležité:** DataHub **nie je** strana diskusie o internom dokumente „bridge framing“. Do tohto ticketu **nevkladáme** odkazy na bridge dokument, tému komparácií kohort, baseline metodiky ani rozšírený analytický rámec — aby sa pred Pentou neotváralo zbytočné riziko zdržania.

**Produktový kontext (iba orientačne pre DH):** širšie zadanie AI reportingu je **CMSB-1810** (ROI / Adoption — podklad v repo).

---

## Moduly, pre ktoré žiadame doplniť / rozšíriť **performance-relevantné dáta** v tomto kole

*(z feedbacku produktu — mimo týchto zostáva hlavne adopcia a prípadne time saving podľa CMSB-1810, bez rozšírených web metrik v tomto tickete)*

| AI modul / features | Poznámka |
|---------------------|----------|
| **Tag Generator** | Tagy — doplnenie dostupných performance signálov tam, kde DH vie článok/feature spočítať. |
| **Poll Generator** | Polls — obdobne. |
| **Related articles auto-suggestion** | Related articles — obdobne. |
| **Video subtitles Generator** | Video subtitles — obdobne (tam kde sú merateľné signály). |
| **Audio Transcript** | Audio transcript — obdobne (tam kde sú merateľné signály). |

---

## Copy-paste: Summary (Jira pole Summary)

```
DHUB-3138 — Penta: adopcia (CMSB-1810) + doplnenie performance dát pre vybrané AI moduly
```

---

## Copy-paste: Description (Jira pole Description)

```
Kontext:
Jednorazové dodanie podkladov pre management reporting (Penta). Scope je úzky: tabuľky / grafy z existujúcich zdrojov, bez zavádzania nového analytického frameworku v tomto ticketi.

Časť A — Adopcia (komplet AI):
• Postupovať podľa produktového zadania CMSB-1810 (ROI / Adoption): eligible vzorka / CAP podľa tam uvedených pravidiel, konzistentne so súčasným AI reportingom (mesačná / denná obnova ako doteraz).
• Výstup: prehľadnejšie tabuľky a grafy pre adopciu naprieč AI nástrojmi — bez zmeny základnej metriky, ktorá je dlhodobo stabilná.

Časť B — Performance / rozšírené metriky len pre tento zoznam modulov:
• Tag Generator
• Poll Generator
• Related articles auto-suggestion
• Video subtitles Generator
• Audio Transcript

Požiadavka: doplniť k týmto modulom dostupné performance údaje z web analytiky / DataHubu tam, kde ich viete v krátkom čase priradiť k článkom alebo k použitiu feature (konkrétne polia podľa vašej náleznosti). Ak niektorý signál pre modul nie je dostupný, nie je to blokér — vynechať alebo označiť medzeru.

V tomto ticketu výslovne NEŽIADAME: návrh komparačných kohort, baseline diskusiu, prepojenie na interné „bridge“ dokumenty ani metodiku causal dopadu.

Deliverable:
• Dohodnutý formát výstupu (tabuľka / export / dashboard úprava) + grafové pohľady pre Pentu podľa potreby produktu.

Acceptance:
• Produkt (NMH) potvrdí, že dáta pre Časť A sú v súlade s CMSB-1810 a že pre Časť B sú pre uvedených päť modulov doplnené všetky dostupné performance signály v dohodnutom rozsahu.
```

---

*Tento súbor je jediný určený na kopírovanie do **DHUB-3138**. Bridge framing zostáva interný a po Pent môže slúžiť na následné „upratovanie“ — nie ako závislosť tohto ticketu.*

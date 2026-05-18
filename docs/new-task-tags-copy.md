# Article Tags Copy — Echobox metadata (utility)

---

## 1. Implementačný task (Jira paste)

Samostatný text do Jiry — stačí na grooming a implementáciu.

### Summary

```
Article Detail + Editor — Kopírovať tagy (Echobox metadata)
```

### Description

```
Use case:
Tím kopíruje existujúce tagy článku pre social do Echoboxu ako metadata pre analytiku a grouping postov — nie ako public hashtagy ani social copy.

Kde:
• Article Detail (/article/{id}) — pri tagoch (aj bez edit práv na článok).
• Article Editor — pri tagoch, rovnaké správanie (pattern ako Social Post Generator).

UX:
• Reuse existujúceho admin copy-to-clipboard + toast (žiadny nový custom UI).
• „Kopírovať tagy“ · tooltip: „Skopíruje tagy článku do schránky pre ďalšie použitie.“
• Bez tagov: disabled · „Článok nemá žiadne tagy.“
• Clipboard error: zrozumiteľná chyba používateľovi (nie silent fail).

Formát schránky:
tag1, tag2, tag3 — bez #; pri serializácii vynechať prázdne/null; žiadne trailing separators (nie „tag1, , tag3,“).

Tech:
Zdroj tagov = aktuálne renderovaný zoznam na danej obrazovke (Detail / Editor), vrátane neuložených zmien v editore — nie samostatný fetch „iného“ stavu.
Žiadny nový BE/API. Copy nič nemení ani neukladá.

Mimo scope:
AI, Echobox integrácia/sync/automation, DAM, hashtag formáty, logovanie.
```

### Akceptačné kritériá

```
1. Copy akcia pri tagoch na Article Detail aj v Article Editor (existujúci admin pattern).
2. S tagmi: schránka „tag1, tag2, …“ (", ", bez #, poradie ako v UI; bez prázdnych položiek) na oboch miestach.
3. Editor: po pridaní tagu bez uloženia článku copy obsahuje aj tento tag (renderovaný stav).
4. Toast po úspechu (existujúci admin pattern).
5. Bez tagov: disabled + „Článok nemá žiadne tagy.“ na oboch miestach.
6. Tagy v systéme sa po akcii nemenia; žiadny sync/ukladanie z tejto feature.
7. Detail funguje pre používateľa bez edit práva; pri zlyhaní clipboardu je zrozumiteľná chyba.
```

---

## 2. Extra context (voliteľné — nie pre Jiru)

**Review (Lukáš):** potvrdené metadata do Echoboxu, formát čiarkou, obe lokácie Detail + Editor.

**Prečo nie DAM:** article tagy ≠ metadata fotky; kopírovanie tagov na assety mimo tohto tasku.

**Pôvodný problém:** ručné kopírovanie, friction, social tím často bez edit práv → potreba copy na detaile.

**Typ tasku:** utility helper (nie platform feature) — preto minimálny scope v Jire vyššie.

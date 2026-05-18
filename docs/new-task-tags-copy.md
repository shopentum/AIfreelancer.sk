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
Social tím kopíruje existujúce tagy článku do Echoboxu ako metadata pre analytiku a grouping postov — nie ako public hashtagy ani social copy.

Kde:
• Article Detail (/article/{id}) — pri tagoch (aj bez edit práv na článok).
• Article Editor — pri tagoch, rovnaké správanie (pattern ako Social Post Generator).

UX:
• Reuse existujúceho admin copy-to-clipboard + toast (žiadny nový custom UI).
• „Kopírovať tagy“ · tooltip: „Skopíruje tagy článku do schránky pre ďalšie použitie.“
• Bez tagov: disabled · „Článok nemá žiadne tagy.“
• Clipboard error: user-visible.

Formát schránky:
tag1, tag2, tag3 — všetky tagy z UI, tags.join(", "), bez #.

Tech:
Rovnaký tag zdroj ako zobrazenie na obrazovke. Žiadny nový BE/API. Copy nič nemení ani neukladá.

Mimo scope:
AI, Echobox integrácia/sync/automation, DAM, hashtag formáty, logovanie.
```

### Akceptačné kritériá

```
1. Copy akcia pri tagoch na Article Detail aj v Article Editor (existujúci admin pattern).
2. S tagmi: schránka „tag1, tag2, …“ (", ", bez #, poradie ako v UI) na oboch miestach.
3. Toast po úspechu (existujúci admin pattern).
4. Bez tagov: disabled + „Článok nemá žiadne tagy.“ na oboch miestach.
5. Tagy v systéme sa po akcii nemenia; žiadny sync/ukladanie z tejto feature.
6. Detail funguje pre používateľa bez edit práva; pri zlyhaní clipboardu je zrozumiteľná chyba.
```

---

## 2. Extra context (voliteľné — nie pre Jiru)

**Review (Lukáš):** potvrdené metadata do Echoboxu, formát čiarkou, obe lokácie Detail + Editor.

**Prečo nie DAM:** article tagy ≠ metadata fotky; kopírovanie tagov na assety mimo tohto tasku.

**Pôvodný problém:** ručné kopírovanie, friction, social tím často bez edit práv → potreba copy na detaile.

**Typ tasku:** utility helper (nie platform feature) — preto minimálny scope v Jire vyššie.

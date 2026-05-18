CONTEXT PACK — Article Tags Copy / Echobox metadata helper (NMH)

## CONTEXT UPDATE (review s Lukášom)

**Potvrdený use case:** kopírovanie article tagov do **Echobox** ako **metadata / interné tagging** pre analytiku a grouping postov — **nie** public hashtagy, **nie** social copy formatting, **nie** FB/IG hashtag helper.

**Formát MVP (fixné):** `tag1, tag2, tag3` (čiarka + medzera) — raw metadata export, bez `#`.

**Umiestnenie:** **Article Detail** (primary) **+ Article Editor** (secondary) — rovnaký pattern ako pri Social Post Generatore („aj-aj“).

**UX:** reuse existujúceho admin **copy-to-clipboard** patternu; žiadny custom reinvent.

**Helptext:** tlačidlo „Kopírovať tagy“ (alebo „Skopírovať tagy do schránky“); tooltip: „Skopíruje tagy článku do schránky pre ďalšie použitie.“ Prázdny stav: „Článok nemá žiadne tagy.“

**Nie je:** Echobox integrácia, sync, automation, hashtag generator, AI tagging.

---

1. Čo je reálny problém

Redakcia + social media tím potrebujú rýchlo dostať tagy článku pre:

Echobox (metadata tagging vrstvu pre analytiku a kategorizáciu postov)
distribúciu / interné označenie postov

Aktuálne:

tagy existujú pri článku,
ale workflow nie je pohodlný,
social media manažéri často nemajú edit práva,
nechceme aby chodili do editora článku.

Výsledok:

friction,
kopírovanie ručne,
nízka adopcia,
zbytočný context switching.
2. Dôležitá PRODUCT pravda

Toto NIE JE:

AI feature,
DAM automatika,
smart tagging engine,
metadata governance systém.

Toto JE:

lightweight workflow helper,
distribučná utility feature,
copy helper nad existujúcim tag infra.
3. Veľmi dôležitý kontext — DAM

Pôvodne sa riešilo:

či tagy pôjdu aj do DAM ku fotkám.

Ale vznikol zásadný problém:

Článok obsahuje:

osoby,
miesta,
eventy,
entity,
širší kontext.

Fotografia:

reprezentuje iba časť článku.

Čiže:

slepé kopírovanie article tagov na asset/fotku je nebezpečné,
znečisťuje DAM metadata,
môže zhoršiť vyhľadávanie assetov.

Preto:

DAM tagging NIE JE primary MVP use case,
max ako manual helper,
nie automatika.
4. Reálny MVP use case

Social/media tím otvorí Article Detail alebo Editor pri tagoch → „Kopírovať tagy“ → vloží reťazec do Echoboxu ako **metadata** (interná kategorizácia, analytika) — nie ako public hashtagy.

5. Kde to musí byť (UPDATE)

**Article Detail** — PRIMARY (`/article/{id}`): používatelia bez edit práv, rýchly náhľad + copy.

**Article Editor** — SECONDARY: rovnaké správanie pri tagoch v editore (pattern ako Social Post Generator).

6. UX návrh MVP
Button
Kopírovať tagy

Umiestnenie:

pri zozname tagov článku,
ideálne inline vedľa sekcie tagov.
7. Správanie
Klik
copy do clipboardu
success toast:
Tagy skopírované
Bez tagov
disabled state
tooltip:
Článok nemá žiadne tagy.

Reuse: existujúci admin copy-to-clipboard + toast pattern.

8. Formát výstupu (MVP — uzavreté)

tag1, tag2, tag3

Dôvod: Echobox metadata workflow, interné tagging — nie hashtag rendering.

9. DATA GAP

Uzavreté (review Lukáš): formát čiarkou, všetky tagy článku, obe lokácie Detail + Editor.
10. Architektonický kontext (dôležité)

Tagy už dnes fungujú ako:

discovery vrstva,
SEO vrstva,
linkbuilding input,
article identity enrichment.

Pozri:

Linkbuilding MVP
Editorial Copilot strategic direction

Tento helper NESMIE:

vytvárať nový source of truth,
robiť paralelný tag storage,
meniť tagy,
validovať tagy.

Iba:

číta existujúce tagy,
serializuje ich,
kopíruje do clipboardu.
11. Enterprise guardrails
Žiadna business logika v FE

FE:

render,
copy formatting,
UX state.
Žiadna AI vrstva

Neriešiť:

relevance,
ranking,
semantic cleanup,
hashtag intelligence.
Žiadne side effects

Feature:

nič neukladá,
nič nemení,
nič neloguje (zatiaľ).

---

## Implementačný task (Jira paste — samostatný, bez prílohy context packu)

Skopírovať celý blok nižšie do Jiry. Text musí stačiť na grooming a implementáciu bez iného dokumentu.

### Summary

```
Article Detail + Editor — „Kopírovať tagy“ (Echobox metadata, nie hashtagy)
```

### Description

```
Problém:
Social/media tím potrebuje rýchlo skopírovať tagy článku do nástroja Echobox ako metadata pre internú kategorizáciu postov, analytiku a grouping — nie ako public hashtagy na FB/IG a nie ako social copy formatting. Tagy v CMS už existujú; dnes sa kopírujú ručne s friction a context switching.

Čo to je:
Lightweight clipboard helper nad existujúcim article tag systémom. Iba číta tagy, serializuje, kopíruje do schránky. Source of truth ostáva existujúca tag infra.

Čo to NIE JE (mimo scope):
• Hashtag generator, AI tagging, metadata enrichment, validácia/ranking tagov
• Echobox integrácia, sync layer, automation, API do Echoboxu
• Nový source of truth, paralelný storage, zmena/ukladanie tagov
• DAM sync tagov na fotky/assety
• Export módy (#hashtag), formatter settings, konfigurovateľné formáty
• Logovanie tejto akcie v tomto tickete

Kde (oba v tomto tickete):
1) Article Detail (/article/{id}) — PRIMARY: inline pri sekcii/zozname tagov; používatelia bez edit práv musia vedieť copy len z detailu.
2) Article Editor — SECONDARY: rovnaké správanie pri tagoch v editore (referenčný pattern: Social Post Generator — „aj-aj“ umiestnenie).

UX (reuse existujúceho admin patternu):
• Použiť existujúce admin „copy to clipboard“ tlačidlo/komponent + existujúci toast pattern — žiadny nový custom UI reinvent.
• Label: „Kopírovať tagy“ (alternatíva ak sedí DS: „Skopírovať tagy do schránky“).
• Tooltip/helptext: „Skopíruje tagy článku do schránky pre ďalšie použitie.“
• Po kliknutí: clipboard API + success toast (text podľa existujúceho admin patternu, napr. „Tagy skopírované“).
• Bez tagov: disabled + tooltip „Článok nemá žiadne tagy.“
• Clipboard error: user-visible hláška (nie silent fail).

Formát schránky (fixné):
• Všetky tagy článku zobrazené v danej obrazovke (Detail / Editor), bez filtrácie typu.
• Serializácia: tag1, tag2, tag3 — tags.join(", ") — čiarka + medzera, bez # prefixu.
• Poradie = ako v UI tagov na danej obrazovke.
• Použitie: vloženie do Echoboxu ako metadata tagging, nie public hashtag line.

Technické pravidlá:
• Zdroj: ten istý tag model/API ako zobrazenie tagov na danej obrazovke (reuse, žiadny nový BE endpoint).
• FE: minimálny wrapper ak treba; žiadna nová business logika tagov.
• Side effects: nič neukladá, nesynchronizuje, nemení tagy.

Odhad: malý FE slice (2 miesta, shared helper). Ak chýba reusable copy komponent, vytvoriť minimalistický wrapper — stále bez formatter complexity.
```

### Akceptačné kritériá

```
1. Article Detail: pri tagoch je copy akcia (existujúci admin pattern) s labelom „Kopírovať tagy“ (alebo schválený ekvivalent DS).
2. Article Editor: pri tagoch rovnaká copy akcia a rovnaké správanie ako na detaile.
3. Článok s tagmi: po kliknutí na oboch miestach je v schránke „tag1, tag2, …“ (join ", ", bez #, všetky tagy z UI, poradie ako v UI).
4. Success feedback cez existujúci admin toast pattern.
5. Bez tagov: disabled + tooltip „Článok nemá žiadne tagy.“ na oboch miestach.
6. Žiadna zmena tagov po akcii; žiadne ukladanie/sync/log z tejto feature.
7. Používateľ bez edit práva úspešne skopíruje tagy z Article Detail.
8. Neúspech clipboardu: zrozumiteľná chyba používateľovi.
```

### Definition of Done

```
• AC 1–8 na stage/QA.
• Social tím informovaný: copy slúži pre Echobox metadata (čiarkou oddelené tagy), nie pre public hashtagy.
```
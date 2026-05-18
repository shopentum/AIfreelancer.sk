CONTEXT PACK — Article Tags Copy / Social Tags Helper (NMH)
1. Čo je reálny problém

Redakcia + social media tím potrebujú rýchlo dostať tagy článku pre:

Echobox
social linkposty
FB posty
distribúciu článkov

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

PRIMARY:

Social media manager otvorí Article Detail
klikne:
"Kopírovať tagy"
vloží ich do Echobox / social postu

To je celé.

5. Kde to musí byť
MUST HAVE

Article Detail

Dôvod:

social media tím nemusí mať edit práva,
nemusí ísť do editácie článku.

Príklad z produkcie:
/article/{id}

NICE TO HAVE

Article Editor

Ale nie je to primary flow.

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
Článok nemá žiadne tagy na kopírovanie.
8. Formát výstupu (MVP)

Predvolený:

tag1, tag2, tag3

Dôvod:

univerzálne,
funguje pre Echobox,
funguje pre social workflows,
jednoduché.
9. DATA GAP

Treba overiť:

DG-1

Chce social tím:

tag1, tag2

alebo:

#tag1 #tag2
DG-2

Kopírujeme:

všetky tagy,
alebo len selected typy.

MVP odporúčanie:

všetky tagy,
bez filtrácie.
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
Article Detail — „Kopírovať tagy“ do schránky (social / Echobox)
```

### Description

```
Problém:
Social media tím a redakcia potrebujú rýchlo použiť tagy článku v Echobox, linkpostoch a FB postoch. Tagy pri článku už existujú, ale dnes sa kopírujú ručne a často treba ísť do Article Editora. Social manažéri často nemajú edit práva na článok — potrebujú riešenie na Article Detail.

Čo to je:
Lightweight distribučná utility — copy helper nad existujúcou article tag infra. Číta tagy, serializuje, kopíruje do clipboardu.

Čo to NIE JE (mimo scope):
• AI feature, smart tagging, ranking, hashtag inteligencia, validácia tagov
• Nový source of truth, paralelný tag storage, zmena tagov v DB
• DAM automatika ani kopírovanie article tagov na fotky/assety (článkové tagy ≠ metadata fotky; slepý sync by kazil DAM vyhľadávanie)
• Logovanie/analytika tejto akcie v tomto tickete
• Article Editor — v tomto tickete neimplementovať (prípadný copy v editore = samostatný follow-up)

Kde (MUST):
Article Detail, route typu /article/{id}. Tlačidlo inline pri sekcii / zozname tagov článku (vedľa tagov, nie v editore).

UX:
• Label tlačidla: „Kopírovať tagy“
• Klik → obsah clipboardu + success toast: „Tagy skopírované“
• Žiadne tagy → tlačidlo disabled, tooltip: „Článok nemá žiadne tagy na kopírovanie.“
• Zlyhanie clipboard API → user-visible chyba (nie silent fail)

Formát clipboard (fixné pre tento ticket):
• Všetky tagy článku zobrazené na detaile, bez filtrácie podľa typu
• Reťazec: tag1, tag2, tag3 (mená oddelené čiarkou a medzerou; bez # prefixu)
• Poradie tagov = rovnaké ako na Article Detail v UI

Technické pravidlá:
• Zdroj dát: ten istý article tag model/API ako zobrazenie tagov na Article Detail (žiadny nový tag endpoint; len reuse)
• FE: render, serializácia reťazca, stavy tlačidla/toast; žiadna business logika tagov na BE v rámci tohto ticketu
• Side effects: nič neukladá, nič nemení; po refreshi tagy nezmenené
• Používateľ len s právom na čítanie detailu článku musí akciu vedieť dokončiť

Odhad: malý FE slice (1 obrazovka). Ak detail tagy dnes neťahá z API vhodného na copy, najprv overiť existujúci kontrakt — nie nová tag služba.
```

### Akceptačné kritériá

```
1. Na Article Detail (/article/{id}) je pri tagoch viditeľné tlačidlo „Kopírovať tagy“.
2. Článok s tagmi: po kliknutí je v schránke reťazec „tag1, tag2, …“ (čiarka + medzera, bez #, všetky tagy z detailu, poradie ako v UI).
3. Zobrazí sa toast „Tagy skopírované“ (alebo ekvivalent podľa design systému CMS).
4. Článok bez tagov: tlačidlo disabled + tooltip „Článok nemá žiadne tagy na kopírovanie.“
5. Žiadna zmena tagov v systéme po akcii; žiadne ukladanie/logovanie z tejto feature v tomto tickete.
6. Používateľ bez edit práva na článok úspešne skopíruje tagy z Article Detail.
7. Pri neúspechu clipboardu používateľ dostane zrozumiteľnú chybovú hlášku.
```

### Definition of Done

```
• AC 1–7 overené na stage/QA.
• Social tím vie nájsť tlačidlo na Article Detail (krátka poznámka v release / internom kanáli stačí).
```
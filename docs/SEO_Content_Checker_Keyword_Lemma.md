# SEO Content Checker – lemma match (zadanie / grooming)

**Podklad pre Jira / preplanning & grooming**  
**Status:** pripravené na analýzu a naplánovanie dev sprintu  
**Súvisí s:** SEO Content Checker (SEO full / SEO friendly); linkbuilding pipeline – **zhoda knižnice** (SpaCy SK); výber vhodnosti riešenia je na produkte, **nie súčasť dev analýzy tohto tasku**.

---

## Účel dokumentu

Jedna zmena v existujúcej kontrole výskytu **hlavného kľúčového slova**: namiesto **presnej textovej zhody** sa použije **porovnanie na úrovni lemma** (lemmatizácia). Ostatné pravidlá SEO Content Checker a zmysel validácie ostávajú, mení sa iba spôsob zhody medzi HS a textom v definovaných poliach.

Implementácia **SpaCy** s modelom **`sk_core_news_lg`**.

---

## Kontext – súčasná funkcionalita (SEO Content Checker)

- Kontrola požadovaných parametrov pre **SEO full** a **SEO friendly** články.
- Účel: **korektné dáta** pre SEO aktivity, článok musí prejsť kontrolami pred uložením / publikovaním (podľa aktuálnych pravidiel).

---

## Problém

Ak HS v texte nie je v **presnej** lexikálnej podobe ako v poli kľúčového slova, **uloženie / publikácia zlyhá**. V slovenčine je prirodzené **skloňovanie** („kreatín“ vs. „kreatínu“, „kreatínom“…). Redakcie potom umelo skladajú vetu kvôli presnej zhode alebo opakovane prepisujú.

**Dôsledok:** skreslená redakčná prax, horší UX a obchádzanie zmyslu SEO pravidiel.

---

## Čo sa nemení (rámec validácie)

- Kontrola výskytu HS ostáva na **rovnakých troch poliach** ako dnes: **nadpis**, **perex**, **telo článku** (presné názvy polí podľa CMS/API v implementácii).
- Ostáva požiadavka „HS sa musí vyskytovať“ v týchto poliach – mení sa len **spôsob porovnania**: z exact match na **lemma match**.

---

## Návrh riešenia

- Porovnanie: **lemma(HS)** vs. **lemma(tokenov / výrazov)** v obsahu tých istých troch polí (konkrétny spôsob segmentácie – tokenizácia SpaCy – v implementácii).
- Ak sa aspoň jeden relevantný výskyt zhoduje na úrovni **lemma** s HS, kontrola v danom poli **prejde** (podľa existujúcich pravidiel, len nástroj zhody).
- Validácia nie je „fuzzy“ podľa edit-distance ani podobnosti znakov – ide o **explicitné lemma** z modelu, nie heuristiku podľa vizuálnej podobnosti.

### Fallback (povinné AC)

Pri **zlyhaní lematizácie / NLP** (chyba modelu, výnimka, timeout, nedostupnosť): **fallback na súčasné správanie – presná textová zhoda** v rovnakých troch poliach. Cieľ: neblokovať publish kvôli výpadku NLP.

---

## Očakávané správanie – príklady pre dev / QA

Hl. kľúčové slovo **„kreatín“** (jednoslovné; lemma modelu pre základný tvar zodpovedá „kreatín“).

| Kategória | Príklad v texte | Očakávanie po zmene |
|-----------|-----------------|----------------------|
| Typicky **validné** (skloňovanie) | „kreatín“, „kreatínu“, „kreatínom“, „kreatíne“, „kreatína“ … | **pass**, ak lemma zhoda s HS |
| **Na doladenie v QA** | viacslovné frázy s HS, špeciálne znaky, zmiešaný SK/EN v jednom článku | doplniť konkrétne QA scenáre podľa rovnakého pravidla lemma-vs-lemma |
| **Nemajú byť validné** len kvôli „podobnosti“ bez zhody lemy | náhodný výraz bez lemma zhody s HS (napr. iné slovo / iný význam bez zhody lemy) | **fail** |

Účel tabuľky: rýchla zjednotená predstava **čo má kontrola akceptovať**.

---

## Čo je v scope tohto zadania

- Napojiť **SpaCy (`sk_core_news_lg`)** do existujúcej validačnej vetvy SEO Content Checker pre výskyt HS v **nadpis / perex / telo**.
- Nahradiť (resp. doplniť) porovnanie: **exact → lemma**, pri zachovaní existujúceho správania okolo kontroly (správy, kód chýb – podľa aktuálnej konvencie projektu).
- Implementovať **fallback na exact match** pri chybe NLP.
- Testy (unit / integrácia podľa štandardu tímu) + **AC pre QA**: skloňovanie podľa príkladov vyššie; negatívne prípady bez lemma zhody.
- Krátka poznámka pre implementáciu: **performance** – napr. inicializácia modelu / caching, ak to backend už rieši podobne pri iných NLP volaniach.

---

## Závislosti a prepojenia

- **Linkbuilding MVP1** už počíta so **SpaCy `sk_core_news_lg`** (NLP pipeline / ST-1 v linkbuilding spec – DataHub). Pre SEO Content Checker je rovnaká **knižnica + model** produktovo daná; ideálne je **nezavádzať druhý paralelný „SpaCy svet“**, ak už existuje nasadená vrstva z linkbuildingu.
- **Preferovaný postup pri grooming:** zistiť, kde presne beží ST-1 pipeline; ak validácia článku má prístup do **tej istej služby**, použiť **zdieľaný helper / modul** (jedna inicializácia modelu, jedna verzia závislostí). Ak validácia beží **inde** (iný runtime alebo proces), zmysel má **interné API alebo RPC** na už existujúcu NLP vrstvu namiesto duplicitného načítania modelu v ďalšom uzle – náročnosť je vtedy typicky **stredná** (kontrakt, latencia pri uložení, error handling), nie mesačný projekt.
- **Výnimka (časovanie):** ak by SEO Checker lemma task vstúpil **pred** dostupnosťou NLP vrstvy z linkbuildingu, krátkodobo je akceptovateľná lokálna integrácia SpaCy v mieste validácie s **explicitnou backlog položkou** na konsolidáciu po doručení ST-1 – aby sa predišlo dvom rozchádzajúcim nasadeniam modelu bez potreby.

---

## Kroky pre grooming (checklist)

0. **Architektúra:** overiť dostupnosť NLP vrstvy z linkbuildingu (ST-1); ak áno, napojiť validáciu na ňu alebo zdieľaný modul namiesto duplicity modelu.
1. Integrovať SpaCy (`sk_core_news_lg`) do existujúceho validačného bodu pre HS v troch poliach (alebo cez zdieľanú NLP vrstvu podľa bodu 0).
2. Zmeniť porovnanie výskytu: exact → lemma; zachovať zvyšok validačného rámca.
3. Dodať **fallback na exact match** pri zlyhaní lematizácie.
4. Doplniť automatické testy a QA scenáre (skloňovanie, negatívne prípady, edge cases podľa potreby).

---

## Záver

Ide o **jednu zmenu porovnávacieho primitívu** v rámci už definovanej validácie v troch poliach. Knižnica a smer sú dané (**SpaCy `sk_core_news_lg`**); dev task je **implementácia, testy a fallback**, nie opätovná produktová analýza výberu NLP nástroja.

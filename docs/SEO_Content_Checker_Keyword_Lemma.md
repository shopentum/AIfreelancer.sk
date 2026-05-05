# SEO Content Checker - lematizácia kľúčového slova

**Analýza a návrh úpravy (úzky scope)**  
**Status:** podklad pre Jira / refine  
**Súvisí s:** SEO Content Checker (dashboard, SEO full / SEO friendly), čiastočne s linkbuilding pipeline (SpaCy / lematizácia - samostatný task v analýze)

---

## Účel dokumentu

Oddeliť **jeden konkrétny problém** od širšieho SEO Copilot / linkbuildingu: validácia hlavného kľúčového slova pri ukladaní článku má byť **lingvisticky rozumná** (skloňovanie), nie striktná zhoda reťazcov. Tento text **nie je roadmapa** celého Content Checkera.

---

## Aktuálna funkcionalita (súčasť SEO Content Checker)

- kontrola požadovaných parametrov pre **SEO full** a **SEO friendly** články
- účel: **korektné dáta v dashboarde** pre SEO aktivity
- článok musí prejsť kontrolami pred uložením / publikovaním (podľa pravidiel produktu)

---

## Problém

Ak **hlavné kľúčové slovo** v tele článku nie je v presnej lexikálnej podobe ako v poli „kľúčové slovo“, **uloženie / publikácia zlyhá** (kontrola vyhodnotí neúspech).

V slovenčine je prirodzené **skloňovanie** („kreatín“ vs. „kreatínu“, „kreatínom“…). Redakcie potom:

- umelo skladajú vetu tak, aby sedela **presná reťazcová zhoda**, nie aby text bol prirodzený
- alebo opakovane prepisujú, kým kontrola „prejde“

**Dôsledok:** skreslená redakčná prax, horší UX, signály pre dashboard môžu vyzerať „OK“ pri nekvalitnom obchádzaní pravidla.

---

## Návrh riešenia (MVP tohto tasku)

**Zmeniť kontrolu výskytu kľúčového slova** tak, aby porovnanie používalo **lemmatizáciu** (alebo ekvivalent: základný tvar / normalizácia) **hlavného kľúčového slova** a kandidátnych výrazov v texte.

- **bez LLM** - samostatná knižnica (napr. existujúca NLP pipeline v stacku - poznámka pre **Lukáš Šaghy**: dohľadať knižnicu a zosúladenie s CMS / infra)
- ak sa výskyt v texte zhoduje na úrovni **lemma** s hlavným kľúčovým slovom, kontrola **prejde**
- ak lemma nenájdená / technická chyba: **definovať fail-safe** (napr. fallback na dnešné správanie alebo explicitný error) - na refine s backendom

---

## Čo je v scope tohto zadania

| Áno | Nie |
| Úprava logiky kontroly „výskyt hlavného kľúčového slova v článku“ (lemmatizované porovnanie) | Nový Copilot modul, návrhy tagov, linkbuilding UI |
| Zachovanie účelu: dáta pre dashboard a SEO pravidlá stále zmysluplné | Prekopanie celého SEO full / friendly checklistu |
| Dokumentácia / AC pre QA: skloňované slovo = pass ak lemma sedí | Riešenie synonym, preklepov, viacerých kľúčových slov naraz (ak nie sú v tomto tasku) |

---

## Závislosti a prepojenia

- **Linkbuilding / SpaCy (`sk_core_news_lg`)** v analýze: **zdieľaný smer** (lemmatizácia v SK) - **nie** automaticky ten istý kód v tomto tasku; ide o **zhodu prístupu** a prípadne **zjednotenie knižnice** po rozhodnutí architekta.
- **Rozhodnutie knižnice:** owner **Lukáš Šaghy** (alebo náhradník) - bez tohto kroku nie je presný technický odhad.

---

## DATA GAP / otvorené body

| ID | Otázka | Poznámka |
| DG-CC1 | Ktorá knižnica a kde beží (CMS, služba, batch)? | zladenie s existujúcim AI / DH stackom |
| DG-CC2 | Presný rozsah: len „tel článku“ alebo aj nadpisy / perex? | podľa aktuálnej definície SEO Checker |
| DG-CC3 | Fallback pri zlyhaní lematizácie | nesmie „zamknúť“ redakciu horšie ako dnes bez vysvetlenia |

---

## Navrhované kroky (nie záväzný plán)

1. **Konkrétnuť** formu kľúčového slova v CMS (jedno pole, viac slov, špeciálne znaky).
2. **Vybrať knižnicu** a miesto v architektúre (DG-CC1).
3. **Upraviť kontrolu** v Content Checker logike + unit / integračné testy (básne skloňovacie páry SK).
4. **QA scenáre:** aspoň 3 články - neurčitok vs. iný pád, zhoda lemma PASS; úplne iné slovo FAIL.
5. **Komunikácia redakciám:** krátka poznámka v release notes - „kontrola berie do úvahy skloňovanie“.

---

## Záver

Tento task je **výrazne menší scope** než SEO Copilot Linkbuilding: ide o **jednu validačnú skrinku** v SEO Content Checker, nie o generovanie návrhov ani nový editor flow. Lematizácia ako prístup je **zladiteľná** s tým, čo rieši linkbuilding v dokumentácii, ale implementácia môže byť **minimálna a izolovaná**, kým sa nezdieľa spoločný NLP modul.

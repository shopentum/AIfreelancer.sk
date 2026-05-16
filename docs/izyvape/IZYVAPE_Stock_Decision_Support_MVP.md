IZYVAPE - Stock Decision Support Layer (MVP)

Účel dokumentu: technicko-predajný podklad pre rozhodnutie o prvom MVP - jazyk vhodný pre CEO a prevádzkový tím.  
Čo dokument nie je: finálna zmluva, cenová ponuka ani špecifikácia jednotlivých API integrácií bez discovery.  
Súvisiaci kontext: rozšírené princípy a „master lock“ v [`kontext.txt`](./kontext.txt).

Dátum: 2026-05-14

---

1. Executive summary

IZYVAPE potrebuje jednu vrstvu operational clarity nad existujúcimi systémami (WooCommerce, Money S, Metorik, B2B API), nie ďalší dashboard ani AI demo.

MVP produkt: Stock Decision Support Layer - systém, ktorý denne zjednotí dáta do kanonického modelu, uchováva immutable denné snapshoty, vyhodnocuje nálezy (riziká a príležitosti okolo zásob) a prezentuje prioritizované odporúčania akcií. Človek rozhoduje a vykonáva zmeny v zdrojových systémoch - MVP nemení sklad, ceny ani kampane automaticky.

Prečo práve to ako prvé: okamžite pochopiteľný biznis dopad, vysoká denná frekvencia použitia, relatívne jasné vstupy, nízke „magické AI“ riziko, dobrá auditovateľnosť a silný základ pre neskoršiu marketing alebo širšiu intelligence okolo predaja a zásob (omnichannel).

---

2. Problém a výsledok

Problém: Rozhodnutia o zásobách, dostupnosti a kapitalizácii zásob sú rozptýlené medzi viacerými nástrojmi. Chýba stabilná jednotná pravda o produkte, historická porovnateľnosť (trendy, výnimky) a spoločný jazyk priority medzi vedením, prevádzkami, logistikou a online kanálom.

Výsledok MVP: Tím dostáva každý deň (alebo podľa dohody) zoznam prioritizovaných issues typu stockout risk, dead stock, overstock, expirácia - s odôvodnením, odporúčanou akciou, confidence a vlastníkom. Vedenie vie povedať či systém „niečo chytil“ a či sa to dá spočítať - nie či „AI niečo cíti“.

---

3. Positioning - čo predávame

| Framing | Poznámka |
| Predávame | Operational clarity a decision support nad prevádzkovými a predajnými dátami (omnichannel) |
| Nepredávame | Generický „AI systém“, chatbot ako jadro, autonómneho „AI zamestnanca“ |

Kľúčový rozdiel: Dashboard ukazuje dáta. Decision Support interpretuje priority a navrhuje ďalší krok. MVP je operational decision system, nie prezentácia grafov.

---

4. MVP cieľ (striktne)

Jeden cieľ: Pomôcť tímu robiť lepšie a rýchlejšie rozhodnutia okolo skladu, dostupnosti a viazaného kapitálu v zásobách.

Mimo MVP (zámerne): content AI, autonómne pricing, orchestrácia kampaní, enterprise „predict everything“ platforma. Marketing intelligence prichádza ako fáza 2 až po fungujúcom stock intelligence.

---

5. Architektúra MVP (päť vrstiev)

5.1 Data ingestion  
Minimálne napojenia dohodnuté v discovery (baseline): WooCommerce, Money S, Metorik, B2B API. Bez zbytočného rebuildu existujúceho stacku - API-first, reuse systémov ktoré už firma má.

5.2 Normalization - canonical product model  
Jedna interná definícia produktu so stabilnými join kľúčmi (`sku`, `barcode`, mapovanie `source_ids`, atď.). Bez tejto vrstvy vzniká nekonzistentná interpretácia medzi zdrojmi.

5.3 Snapshot layer  
Každý deň immutable snapshot agregovaného stavu (podľa definovaného grain). Dôvod: trendy, porovnanie deň oproti dňu, výnimky, auditovateľnosť rozhodnutí a základ pre anomaly detection bez hádanía nad „živým“ stavom bez histórie.

5.4 Findings engine  
Generovanie nálezov v kategóriách (príklad):

| Úroveň | Príklady nálezov |
| Critical | stockout risk, negatívna zásoba alebo inconsistencia, expiration risk |
| Important | slow movers, dead stock, overstock |
| Opportunities | napr. high margin / nízka viditeľnosť - ak sú vstupy k dispozícii |

Pravidlá a prahy sú verzovateľné (aspoň konceptuálne v MVP - aby bolo jasné „podľa čoho“ systém flaguje).

5.5 Decision layer (presentácia)  
Pre každý nález minimálne: Issue → Why it matters → Recommended action → Confidence → Owner → Priority. Žiadna autonómna exekúcia v predajných systémoch ani ERP napojení v MVP.

---

6. Core MVP flows (maximum tri)

Flow 1 - Stockout risk  
Otázka: Ktoré produkty sa s vysokou pravdepodobnosťou vypredajú v horizonte X dní?  
Vstupy (podľa dostupnosti): sales velocity, sklad, rezervácie, lead time dodávateľa.  
Výstup: urgency, odhad dní do problému, confidence, odporúčaná akcia (doplniť, stiahnuť promo, atď.).

Flow 2 - Dead stock / Overstock  
Otázka: Ktoré produkty viažu kapitál alebo stagnujú?  
Vstupy: dni bez predaja, hodnota zásoby, kategória alebo benchmark, trend predaja.  
Výstup: kandidáti na výpredaj, promo, bundling - prioritizované.

Flow 3 - Expiration risk  
Otázka: Čo expiruje skôr ako sa to rozpredá?  
Vstupy: expiračné dáta, velocity, aktuálny stock.  
Výstup: urgency, odporúčaná operatívna priorita.

Ak v discovery chýba spoľahlivá expirácia v dátach, Flow 3 sa presunie do DATA GAP alebo fázy 1.1 - systém nebude predstierať istotu.

---

7. Princípy a governance

| Princíp | Implementačný záväzok MVP |
| AI navrhuje, človek rozhoduje | Žiadna autonómna zmena skladu, cien alebo kampaní |
| DATA GAP | Ak chýba vstup, explicitný gap - žiadna fake istota |
| Descriptive first | Priorita ide interpretácii a prioritizácii pred „magickou“ predikciou |
| Shape nad completeness | Stabilný dataset a konzistentná štruktúra sú dôležitejšie než dokonalá úplnosť dňom jedna |
| Runtime ≠ snapshot | Aktuálny stav zdroja a auditovateľný denný rez sú oddelené koncepty |

Zákaz hype vo komunikácii projektu: „AI employee“, plná autonómia obchodu, neoverené ROI tvrdenia, pseudo-príčinné výklady bez dát.

---

8. Meranie úspechu MVP (bez rozprávok)

Merateľné príklady úspechu:

- Počiatočná báza: systém vie ukázať konkrétny počet SKU flagged ako stockout risk za definované obdobie a tím vie ručne potvrdiť zmysluplnosť TOP položiek.
- Dead stock flow produkuje zoznam s hodnotou zásoby alebo počtom dní bez pohybu - kontrolovateľné voči skutočnosti.
- Vedenie dostane jednostranové zhrnutie (digest) typu „koľko critical issues, čo si vyžaduje akciu tento týždeň“.

Nie je povinné v MVP: dokázanie jednotného „AI ROI“ naprieč celým marketingom. Stačí operational KPI a adopcia tímu.

---

9. Závislosti a úlohy strán

| Strana | Typická úloha |
| IZYVAPE | Prístupy k API, business definície (lead time, vlastníci procesov), validácia nálezov v prvých týždňoch |
| Dodávka | Ingest pipeline, model, snapshot job, findings pravidlá v1, UI alebo report + školenie na čítanie výstupov |

Konkrétny rozpad dodávky a harmonogram sú predmetom samostatnej ponuky po krátkom discovery (ktoré API polia sú pravda pre stock, ako sa páruje SKU medzi systémami).

---

10. Fáza 2 (náhľad - nie súčasť MVP záväzku)

Po stabilizácii dát a dôvere v stock nálezy: marketing intelligence (čo podporiť v kanáloch, sezónne príležitosti), rozšírené alerting scenáre a prípadná hlbšia predikcia - stále v režime human-in-the-loop - systém zachováva plnú kontrolu rozhodnutí na strane tímu.

---

Záver

Tento MVP je zámerne úzky: stock a dostupnosť ako najčastejšie a najlacnejšie validovateľné rozhodovanie v omnichannel maloobchode (prevádzky aj online). Ak CEO schváli smer „decision layer nie dashboard“, projekt má jasný narativ, kontrolovateľné riziko a priestor na rozumnú laterálnu expanziu bez prepísania architektúry.

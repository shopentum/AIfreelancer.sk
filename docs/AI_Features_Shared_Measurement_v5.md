# AI Features - Shared Measurement (Draft v5)

> **Nadväzuje na:** `docs/AI-Features_Shared-Measurement.txt` (Draft v4)  
> **Zohľadňuje:** štruktúru Article message (`Article-message_final.txt`), feedback Core (Lukáš Š.), audit zhody a medzier oproti realite, zarovnanie s `docs/SEO_Copilot_Linkbuilding_MVP1_Spec.md` (Sekcia 15, DG-L7 až DG-L9).

Dátum: 2026-05-06

---

## 1. Kontext

Pri viacerých AI iniciatívach v CMS sa opakuje ten istý problém:

- vieme implementovať AI feature,
- vieme zachytiť základné usage informácie,
- vieme cez DataHub vyhodnotiť performance článku,

ale chýba jednotný rámec, ktorý spája:

- dôvod vzniku feature (hypotéza, baseline),
- používanie feature redaktorom (interaction),
- výsledný dopad článku po publishi (impact).

Výsledkom sú rozdielny prístup medzi modulmi, ťažšie vyhodnocovanie a vysoká závislosť od ad-hoc DataHub požiadaviek.

---

## 2. Ciele a non-goals

**Cieľ:** jednoduchý spoločný smer pre AI measurement, experimentovanie a vyhodnocovanie v CMS - bez náhrady DataHubu alebo stavby nového BI systému.

**Non-goals:**

- Nahradiť DataHub / Looker.
- Unifikovať všetky metriky do jedného dashboardu v jednom šprinte.
- Tvrdiť, že každý interaction klik má priamu atribúciu na CTR alebo revenue.

---

## 3. Zdroj pravdy - Article message (Core)

Kmeňová entita obsahu je **article message** (napr. `DonRecommendArticle`), nie izolovaný „study log“ mimo článku.

V message existuje kolekcia **`AiFeaturesUsageLog`** (`DonAiFeatureUsageLogEmbed`) s poliami (aktuálny stav podľa Core):

| Pole | Typ (orientačný) | Poznámka |
| UserId | long | kto |
| SiteId | long? | kde |
| ArticleId | long? | legacy / interné ID |
| ArticleDocumentId | Guid? | **preferovaný kandidát na join** (explicitne v embede) |
| AiFeatureType | string | ktorá feature |
| CreatedAt | DateTime | kedy |

**Princíp od Core:** zápis využitia AI **nevnímať ako úplne samostatný paralelný event model** mimo message. Message je viazaná na jednoznačnú identitu článku; k nej patrí zoznam logov „ktoré AI features boli použité“. Tieto dáta idú ďalej (napr. DataHub), kde sú k dispozícii aj performance metriky článku - **prepojenie adopcie / správania pri AI s business dopadom cez DataHub** je očakávaná cesta pri zložitejších otázkach (analogicky porovnanie AI vs manuál pri kvízoch a pod.).

---

## 4. Kanonický join kľúč (DATA_GAP DG-L7)

V message sú **viaceré identifikátory článku** (napr. `DocumentId`, `EntityId`, `EntityUuid`; v logu ešte `ArticleId`, `ArticleDocumentId`).

**Odporúčanie pre nové zápisy a dokumentáciu:**

- **Preferovať `ArticleDocumentId`** ako kandidáta na kanonický join medzi CMS usage, detailnými logmi feature a DataHub performance vrstvou, keďže je explicitne prítomný v `AiFeaturesUsageLog`.
- **Finálne rozhodnutie** (vrátane alternatív pri migráciách alebo historických dátach) ostáva u **Core** - v linbuilding špecifikácii ako `[DATA_GAP DG-L7]`.

V textoch typu „`article_id`“ treba buď nahradiť konkrétnym názvom poľa, alebo vysvetliť alias (napr. `article_id` v príkladoch = placeholder pre dokument, v implementácii `ArticleDocumentId`).

---

## 5. Model troch vrstiev

### 5.1 Ideation Layer (Product)

Otázka: *Prečo feature vzniká a čo považujeme za úspech?*

- hypotéza,
- success metric a **baseline**,
- spôsob porovnania (segmenty, časové okno),
- **definícia populácie pre adoption** (pozri 5.2.3).

### 5.2 Interaction Data Layer (CMS / Dev)

Otázka: *Ako redaktor feature reálne používa?*

- workflow dáta viazané na editor a lifecycle článku,
- **nie** náhrada DataHubu.

#### 5.2.1 Čo dnes znamenajú usage logy

Aktuálny embed primárne signalizuje: **„feature bola použitá“** (`AiFeatureType` + čas + identifikátory) - nie plný enum editor akcií (accept, reject, …).

#### 5.2.2 Navrhované rozšírenie MVP (interaction signal)

Cieľ: konzistentný signál naprieč modulmi. **Toto nie je automaticky súčasť Core message** - ide o **dohodu** a implementáciu:

| Rozsah | Popis |
| A | Rozšírenie schémy embedu (napr. typ interakcie) - po dohode s Core |
| B | Paralelný **feature-špecifický detail** (JSON / event pipeline) s **rovnakým kanonickým kľúčom** ako message (pozri linkbuilding Sekcia 9) |
| C | Kombinácia A+B podľa záťaže a citlivosti |

**Navrhované typy interakcií (MVP zoznam):** `generated`, `opened`, `accepted`, `rejected`, `ignored`, `regenerated` (presný finálny enum produkt + dev).

**Dôležité:** json príklady s číslom `"123"` sú **placeholdery**; v implementácii používať skutočné typy (`Guid` pre document id, `long` kde treba).

#### 5.2.3 Adoption metriky - definovať menovateľa

Otázka z praxe: ak „QA“ alebo cohort pokrýva 10 500 článkov, reálne sa feature dostala na 8 000 a report berie 1 000 pilotných - **adoption rate** musí explicitne povedať:

- trieda **všetky eligible** vs **exposed** vs **pilot**,
- či baseline je z celej populácie alebo z filterovaného setu.

Bez toho **rovnaké číslo adoption** môže znamenať tri rôzne príbehy.

#### 5.2.4 Dvojstopý model a linkbuilding

Globálny smer **nemení** potrebu detailu u konkrétnych feature.

- **`SEO_Copilot_Linkbuilding_MVP1_Spec.md`:** detail správania redaktora v JSON eventoch (Sekcia 9) + zosúladenie so **`AiFeaturesUsageLog`** (trigger `[DATA_GAP DG-L8]`).
- **Shared layer** definuje **minimum** (join kľúč, `feature` identifikátor, časová os); **feature môže mať bohší lokálny log** podľa potreby QA a produktu.

### 5.3 Impact Layer (DataHub / reporting)

Otázka: *Aký mal AI-assisted prístup reálny dopad po publikovaní?*

- Business impact primárne na **úrovni článku**, nie jednotlivého kliku v editore.
- Interaction signály (accept rate, ignored) sú **kvalitatívne / diagnostické** - nie priama atribúcia každej metriky na jednu feature, ak je na článku viac AI prvkov.
- Porovnania: AI-assisted vs manuál, segmenty podľa typu obsahu (napr. kvíz), pilot vs baseline - často cez **DataHub požiadavku** s jasnou definíciou cohortu.

#### Príklady impact metrik

CTR, ATS, scroll depth, time spent, engagement, prípadne konverzie - podľa dostupnosti a hypotézy.

**Poznámka:** otázky typu „súvisiace články - AI vs lepšie AI a meranie CTR“ patria do **hypotézy a cohort definície** v Ideation; ak nie sú v MVP scope, explicitne ich označiť ako out of scope alebo follow-up.

---

## 6. Lifecycle boundary

Kritický moment: **publish / prechod do REVIEW** (presná definícia podľa vášho workflow).

- interaction dáta sa **uzatvárajú** pre danú fázu editora (semantika: po dohode),
- článok vstupuje ako kandidát na **impact** hodnotenie,
- **`ArticleDocumentId` (alebo finálny DG-L7 kľúč)** zostáva hlavný bod spojenia CMS ↔ performance.

---

## 7. MVP metriky (Interaction strana)

| Metrika | Poznámka |
| adoption_rate | musí mať definovaný menovateľ (5.2.3) |
| acceptance_rate | podobne cohort |
| rejection_rate | |
| regenerate_frequency | |

**Next po stabilizácii základu:** `edit_distance`, `time_to_accept`, `publish_with_ai`, feature abandonment - podľa technickej realizovateľnosti a miesta uloženia (CMS vs warehouse).

---

## 8. Shared AI Interaction Contract (MVP) - minimálny tvar

Cieľ: kompatibilita modulov. **Nie finálny JSON Schema** - minimálna dohoda.

Príklad (placeholder hodnoty označené v komentári logicky v texte):

| Pole | Popis |
| feature_type | napr. `linkbuilding`, `hero_image` |
| interaction_type | napr. `accepted` - enum z 5.2.2 |
| article_document_id | Guid - **preferovaný join** |
| created_at | časová značka |

Ak detail ostáva len vo feature pipeline, musí **obsahovať aspoň tieto alebo mapovateľné** polia pre spätný join na message / článok.

---

## 9. Decision Workspace (Experiment)

Lightweight vrstva medzi interaction dátami, DataHubom a rozhodnutím produktu: prehľad pilotov, vlastník, hypotéza, stav **continue / iterate / stop** - bez budovania nového enterprise BI.

---

## 10. Čo budeme potrebovať od DataHub

- **Stabilný join layer** - v súlade s DG-L7 (preferencia `ArticleDocumentId`).
- **AI-assisted vs manuál** porovnania s dohodnutou definíciou cohortu.
- Ad-hoc vs opakované reporty - podľa frekvencie; cieľ znížiť čisto one-off žiadosti cez spoločné definície (5.2.3, 5.3).

---

## 11. Navrhovaný flow (súhrn)

1. **IDEA** - hypotéza, metrika, baseline, cohort.
2. **CMS / Interaction** - usage v message a/alebo detail; rovnaký join kľúč.
3. **DataHub / Impact** - správanie publika, článok ako jednotka.
4. **Decision** - interpretácia, ďalší pilot alebo stop.

---

## 12. Záver

AI feature bez measurement ostáva len nástroj. Cieľom v5 nie je merať všetko naraz, ale:

- ukotviť **article message** ako nosič usage a identitu článku,
- oddeliť **súčasný stav embedu** od **MVP rozšírenia** interakcií,
- zjednotiť **join** cez DG-L7 rozhodnutie (preferencia `ArticleDocumentId`),
- nechať **feature špecifický detail** (napr. linkbuilding) koexistovať so shared minimom,
- spísať **adoption** tak, aby menovateľ nebol dvojzmyselný.

**Cieľom je vytvoriť konzistentný základ pre budúce AI-assisted decision workflows v CMS.**

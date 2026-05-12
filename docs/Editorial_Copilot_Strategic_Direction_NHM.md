# Editorial Copilot - strategický smer a MVP (NMH)

> **Typ dokumentu:** strategické zadanie / smer pre stakeholderov - **nie technická špecifikácia**.  
> **Účel:** zjednotiť narratívu „kam ideme“ a ukázať, že veľkú časť hodnoty prinesie **zoradenie a orchestrácia už rozbehnutých schopností** okolo článku, nie nový AI model ako taký.  
> **Forma prezentácie:** **Plný prototyp editora** s pravým panelom asistenta je dostupný na ceste **`/nmh`** v locale routingu (napr. `/sk/nmh`) - rovnaký modul ako workflow s prijatím / odmietnutím návrhov.

Dátum: 2026-05-08 (úprava: MVP rámec — article state, lifecycle odporúčania, runtime vs publish)

---

## 1. Executive summary

**Editorial Copilot** je v tomto zmysle **sprievodný panel**: redaktor vidí **zjednotený pohľad na stav článku**, dostáva **zoradené odporúčania** z už pripravovaných oblastí a **vždy rozhoduje on**. Systém má podporovať **jednu konzistentnú identitu článku** naprieč modulmi a logmi (article identity v zmysle Core / editorial analytics), aby šlo neskôr zmysluplne vyhodnocovať dopad.

**Orchestrácia v MVP sa opiera najmä o tieto línie práce:**

- **SEO Content Checker** - validácia hlavného kľúčového slova a súvisiacich SEO pravidiel formulára (napr. smer lemma match bez LLM).
- **Linkbuilding** - interné prelinkovanie a návrhy odkazov v kontexte článku (nadväznosť na linkbuilding / Article Performance iniciatívy).
- **Tagy** - práca s tagmi ako vstupom a kontextom pre ďalšie kroky v editore.
- **Editorial validation - pilierová vrstva** - **štýl** a **dôvera**; v paneli súdržne aj **SEO** ako pilier (návrh → rozhodnutie redaktora → záznam).
- **Meranie v editore (ankety, krátke dotazy)** - adopcia a správanie redaktora pri nástrojoch a návrhoch; **nie** čitateľské Q&A na fronte článku; reportovanie môže ísť **bez závislosti na okamžitom napojení na DataHub**.

**Odporúčaný prístup (náklad vs. dopad):** prvý krok nech je **orchestrácia a súhrn v paneli**, nie investícia do nového foundation modelu ani do paralelných „samostatných AI aplikácií“ bez väzby na článok.

---

## 2. Problém, ktorý riešime

| Symptóm | Dôsledok |
| Roztrúsené AI / SEO nástroje v editore | časté prepínanie kontextu, slabšia adopcia |
| Moduly na seba nenadväzujú v UX | ťažko predajiť celkovú hodnotu vedeniu |
| Chýba jeden zrozumiteľný súhrn pred publishom | redaktor netuší, čo je teraz najdôležitejšie |
| Rozštiepené logovanie rozhodnutí | ťažké spoľahlivo spojiť interakciu s výkonom článku |

---

## 3. Produktová definícia (jedna veta)

**Editorial Copilot vedie redaktora kontextom článku**: číta dostupné signály z modulov, zoraďuje odporúčania, drží dohodnutý workflow a zapisuje rozhodnutia tak, aby ich bolo možné vyhodnotiť voči výkonu obsahu po publikácii.

---

## 4. Strategické princípy (nezávislé od stacku)

| Princíp | Význam |
| AI navrhuje, človek rozhoduje | žiadna autonómna publikácia; súlad s governance / MDIE |
| Článok ako jedna os | jedna identita článku naprieč modulmi a analytikou |
| Deterministické nástroje tam, kde stačia | knižnice a pravidlá namiesto „magického LLM všade“ |
| Meranie od začiatku | spoločný rámec pre AI features v CMS, nie izolované reporty |
| Odolnosť voči výpadkom | výpadok jednej služby nesmie zablokovať celú prácu redaktora |

---

## 5. Existujúce iniciatívy, na ktoré MVP nadväzuje

Nižšie uvedené oblasti **nenahrádzame** - MVP ich **prepája v jednom sprievodnom paneli** a zjednodušuje redaktorovi orientáciu:

| Oblast | Príspevok do Copilotu |
| Editorial validation v CMS | model návrh → rozhodnutie redaktora → záznam; piliere vrátane dôvery, štýlu a SEO |
| SEO Content Checker - smer úpravy kľúčového slova | lematizácia / základný tvar bez LLM; otvorené body okolo rozsahu textu a bezpečného fallbacku |
| Meranie v editore (ankety, krátke dotazy, adopcia) | analytika správania redaktora pri nástrojoch a návrhoch; **nie** čitateľské Q&A na fronte článku; bez závislosti na okamžitom napojení na DataHub |
| Zdieľaný merací rámec AI features | jednotná väzba usage logov na článok v zmysle Article message a editorial identity |

Širší strategický rámec Article Performance / MDIE zostáva nadväznosťou na úrovni vízie produktu.

---

## MVP rámec — tri doplnenia (scope MVP)

Nasledujúce tri body **nezväčšujú zámer na novú architektúru**; upresňujú rámec pre vývoj a stakeholder alignment.

### A. Article state (jednotná identita článku)

Editorial Copilot pracuje nad **jednotnou identitou článku (article state)**, ktorá agreguje signály z viacerých modulov editora (SEO, dôvera, štýl, tagy, linkbuilding, využitie AI prostriedkov, workflow stav podľa dohody s Core).

Pravý panel **nie je samostatný AI nástroj**, ale **orchestrujúca vrstva nad stavom článku**: zoraďuje pozornosť a akcie redaktora a nemá zakladať paralelnú „druhú pravdu“ mimo zdieľaného stavu článku v CMS.

### B. Životný cyklus odporúčania (návrh → rozhodnutie → záznam)

Každý návrh zobrazený v paneli predstavuje **explicitný decision point** redaktora.

MVP vyžaduje, aby systém vedel evidovať aspoň tieto výsledky rozhodnutia (v zmysle jednotného logovacieho kontraktu s Core):

- prijatie návrhu,
- odmietnutie,
- ignorovanie,
- manuálna úprava namiesto priameho prijatia návrhu.

**Účel:** umožniť neskoršie vyhodnocovanie adopcie odporúčaní a ich dopadu **bez** budovania plného recommendation enginu v prvej vlne — stačí jednoznačný priebeh **návrh → rozhodnutie → záznam**.

### C. Runtime vs publikačný výsledok (náznak smeru)

**MVP** sa primárne zameriava na **runtime podporu rozhodovania** počas práce redaktora v editore (čo riešiť teraz, v akom poradí, s akým výsledkom akcie v danom okamihu).

**Dlhodobý smer** (mimo záväzného rozsahu prvého MVP): prepojiť rozhodnutia a interakcie zaznamenané v editore s **výkonom článku po publikovaní**, tam kde existuje merateľná analytická väzba na editorial identitu — bez predpokladu plnej validačnej ani prediktívnej vrstvy už v MVP.

---

## 6. MVP - orchestrácia a bočný panel

### 6.1 Podstata MVP

**Primárna práca:** Jednotný **sprievodný panel** v editore, ktorý:

- ukáže **jasný postup** (kontrola nálezov → práca v záložkách → súhrn pred odoslaním),
- zníži **súčasný vizuálny šum** - namiesto paralelného kopa výstražných hlásení **priorita a krátky súhrn**,
- zosúladí **identitu článku** v logoch naprieč modulmi podľa dohodnutého meracieho rámca.

**Sekundárna práca (minimum novej logiky):**

- **Prioritizácia** - napríklad niekoľko kľúčových položiek pred publishom (závažnosť: blokujúce / upozornenie / príležitosť) bez budovania plného recommendation engine,
- **Súhrnný pohľad pripravenosti článku** - agregácia z už existujúcich kontrol (nie nový bodový scoring model v prvej vlne).

### 6.2 Pravý panel ako výkladná skriňa (čo tam redaktor vidí)

Paralelne bežia oblasti ako **SEO kontrola**, **dôvera**, **štýl** - často s **aktívnymi návrhmi na prijatie** alebo úpravu. Bez jednej „výkladnej skrine“ nie je zvonka zrejmé, **čo práve čaká na rozhodnutie** a **v akom poradí** to má zmysel riešiť.

**Zmysel tejto sekcie v paneli:** nie nový obsahový pilier, ale **jeden zrozumiteľný rámec**, ktorý:

| Vrstva panelu | Funkcia pre redaktora |
| Hlavička alebo horný blok | súhrn pripravenosti článku, počet vyriešených nálezov a krátka **Odporúčaná pozornosť** pred odoslaním |
| Stav kontroly | či už prebehla validácia a či v pilieroch ostávajú otvorené položky — bez povinného vizuálneho „wizard“ krokovania |
| Pilierové sekcie | **Dôvera**, **Štýl**, **SEO** - pod každým stav (v poriadku / vyžaduje pozornosť) a **zoznam aktívnych návrhov**, ktoré čakajú na prijatie alebo odmietnutie |
| Spodný súhrn | odstránený v prospech súhrnu v hornej časti panelu (pripravenosť + nálezy); ďalšie detaily v záložkách |

Panel tým nie je len súhrn chýb - je **vitrínou aktívnej práce**: kde systém ponúka konkrétny krok a kde už redaktor niečo schválil alebo odmietol. Detailná vizuálna špecifikácia je predmetom návrhu UX - tento odsek fixuje **informačný zámer**, aby nevznikal pocit „ďalší sidebar bez mapy“.

**Prototyp v editore (`/nmh`):** po spustení kontroly pravý panel ukáže **sticky pripravenosť** (vrátane priebehu vyriešených nálezov), **Odporúčanú pozornosť** ako kompaktný textový zoznam (vrátane tagov a interných odkazov v poradí priority) a záložky **Dôvera**, **Štýl**, **SEO** s priebehom prijatia / odmietnutia návrhov.

### 6.3 Čo je zámerne mimo prvého MVP

| Mimo prvého MVP | Dôvod |
| Samostatný „globálny“ LLM riadiaci celý editor | náklad, riziko, komplexná auditovateľnosť |
| Plná Performance Intelligence (napr. predikcia CTR) | závislosť na kalibrácii dát - vhodné pre neskoršiu fázu |

### 6.4 Rozumné minimum nových prvkov

| Nový prvok | Účel |
| Panel ako jeden vstupný rámec v editore | orientácia namiesto roztrúsených ovládacích prvkov |
| Vrstvená štruktúra „výkladnej skrine“ | súlad s informačným zámerom z odseku 6.2 |
| Jednotný priebeh práce v paneli | kontrola → záložky → súhrn pripravenosti hore (bez samostatného workflow stripu ako povinného prvku) |
| Jednotný kontrakt na udalosti v logoch | zrozumiteľné reportovanie a napojenie na analytiku |
| Sekcia súhrnu pripravenosti článku | riadenie pozornosti redaktora pred odoslaním |

Konkrétny rozsah práce a rozdelenie úloh riadi vývoj cez existujúce epicy - tento text **viaže zámer**, nie implementačný detail.

---

## 7. Meranie úspechu MVP (strategicky)

Orientačné signály:

- dokončenie podmienených krokov tam, kde na seba moduly nadväzujú,
- čas do úspešného uloženia alebo publikácie v kontexte rovnakej úlohy,
- podiel prijatých vs. odmietnutých návrhov,
- neskôr väzba na výkon článku cez existujúcu analytickú vrstvu - **bez zjednodušeného sľubu priamej kauzality**.

---

## 8. Riziká a zmiernenie

| Riziko | Zmiernenie |
| Rozširovanie scope každým sprintom | držať MVP na orchestrácii a paneli; nové capability ako samostatné rozhodnutia |
| Nejasná identita článku medzi modulmi | explicitný vlastník dát a triggerov logov na strane Core / backendu |
| Únava z príliš mnohých návrhov | prioritizácia a stlmenejšie upozornenia pre nízku závažnosť |
| Očakávanie okamžitého nárastu tržieb | nastaviť očakávanie na infraštruktúru, adopciu a baseline pre ďalšie experimenty |

---

## 9. Fázy po MVP (smer bez záväzných dátumov)

1. **MVP:** orchestrácia v paneli, súhrn pripravenosti, konzistentné logovanie naprieč vybranými modulmi.  
2. **MVP2 (scoped rozšírenie):** samostatný strategický dokument bez opakovania MVP — [Editorial_Copilot_MVP2.md](./Editorial_Copilot_MVP2.md) (CMS moduly v paneli, SEO/checker hĺbšie, tagy/linkbuilding v orchestrácii, adopcia a minimum governance).  
3. **Rozšírenie:** hlbšie prepojenie editorialnych rozhodnutí s výkonom článku v číslach (tam, kde sú dáta a metodika).  
4. **Personalizácia a spätná väzba:** systematické sledovanie toho, čo redakcie prijímajú vs. ignorujú - nadväznosť na adopčné metriky z **merania v editore** (ankety, dotazy) a ďalších modulov.

---

## 10. Zápisnica nápadov mimo MVP

Tu patria veci, ktoré **nepatria do prvého MVP**, ale treba ich mať uložené pri stratégii, aby sa nestratili v diskusii.

| Nápad | Poznámka |
| Označenie úseku textu a žiadosť o pregenerovanie | Redaktor označí blok textu v článku a vyžiada nový návrh znenia v kontexte článku a značky (tone of voice). Vyžaduje silný HITL priebeh: náhľad návrhu, porovnanie s originálom, explicitné prijať / zahodiť; zvláštnu pozornosť pri citlivých témach (dôvera, medicína, právo). Zaradiť až po stabilnej orchestrácii panelu, jednotnom logovaní základných akcií a jasných pravidlách governance. |

---

## 11. Jednovetové posolstvo pre vedenie

**Nejde o ďalší izolovaný AI nástroj - ide o jeden sprievodný panel, ktorý zoradí už rozbehnuté schopnosti okolo článku a spraví rozhodnutia redaktora merateľnými.**

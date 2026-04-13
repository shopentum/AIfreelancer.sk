# MDIE B: Projektový rámec & delivery
## Media Decision Intelligence Engine (MDIE)
> **Autor:** Daniel Budziňák, Solution Architect  
> **Verzia:** 2.0 | Dátum: 2026-04-12

---

## 1. Stakeholder Management & Komunikačný rámec

Pre úspech MDIE v prostredí NMH definujeme jasnú štruktúru zodpovednosti a operatívny rytmus spolupráce:

- **Steering Committee (Mesačne):** Strategické smerovanie a schvaľovanie rozširovania systému do ďalších divízií (CTO, Head of Content).
- **Pilot Operatíva (Týždenne):** 30-minútový status (Pilot Owner + Solution Architect) na rýchle riešenie operatívnych blokov.
- **Pilot Owner:** Šéfredaktor pilotnej značky (napr. Nový Čas) – zodpovedá za biznisovú adopciu a spätnú väzbu z newsroomu.
- **Compliance & Legal:** Dohľad nad integritou Audit Trailu a súlad s korporátnou politikou spracovania dát.
- **Mechanizmus rozhodovania:** Pri sporoch o prioritu medzi technickými limitmi a redakčnými potrebami má rozhodujúce slovo Pilot Owner.

---

## 2. Delivery tím & Role

| Rola | Zodpovednosť |
|------|-------------|
| **Solution Architect** | Stavová logika MDIE, systémová integrita a integrácia cez adaptér do EAGLE CMS |
| **AI/Data Engineer** | Kalibrácia a správa validačných pravidiel v Shared Intelligence Core |
| **Backend/Integration Dev** | Zabezpečenie prevádzkovej resiliencie a implementácia Explicit Commit logiky |
| **Zástupca redakcie** | Onboarding redaktorov, školenia a zber spätnej väzby pre znižovanie kognitívnej záťaže |

---

## 3. Implementačný framework (Phasing)

- **Fáza 1: Pilot (4–6 týždňov):** Nasadenie MDIE cez CMS-nezávislé API; nastavenie Editorial Identity Layer (tón a pravidlá konkrétnej značky).
- **Fáza 2: Optimalizácia (4 týždne):** Iteratívne ladenie na základe reálnej prevádzky a kalibrácia pravidiel.
- **Fáza 3: Full Scale-up:** Postupné rozširovanie na celé portfólio NMH s centrálnym riadením cez Governance Layer.

---

## 4. Indikatívna efektivita a UX princípy (Overené prototypom)

- **Radikálne zrýchlenie korektúr:** MDIE skracuje čas na vyriešenie kritických nálezov z minút na desiatky sekúnd.
- **Vysoká miera akceptácie:** Redaktori plynule delegujú rutinné SEO a štylistické úpravy na AI, čím sa uvoľňuje kapacita na exkluzívny obsah.
- **Psychológia kontroly (Safety Net):** Mechanizmy ako Undo stack a Atribúcia zmien garantujú redaktorom status finálneho schvaľovateľa.
- **Ekonomický potenciál:** Odhadovaná úspora v rádoch hodín práce denne na jednu veľkú značku.

---

## PRÍLOHA: Technicko-ekonomická optimalizácia (Token Management)

> *Táto sekcia definuje mechanizmy Shared Intelligence Core, ktoré zabezpečujú nákladovú efektivitu systému pri vysokej záťaži.*

- **Native Prompt Caching:** Využitím efemérnej cache na úrovni API sa redakčné kódexy a Identity Layer načítavajú len raz za reláciu, čím sa znižujú náklady na vstupné tokeny až o 90 %.
- **Stateless Context Management:** Systém neposiela do LLM celý archív, ale iba relevantné fragmenty (Context Sharding) filtrované v reálnom čase, čo minimalizuje zbytočný tok dát.
- **Tiered Model Routing:** MDIE inteligentne smeruje rutinné úlohy na nízkonákladové modely (Tier 1) a drahšie, vysoko-inteligentné modely (Tier 2) aktivuje len pri identifikácii kritického rizika.
- **Batch Processing:** Pre magazínový a nadčasový obsah systém využíva spracovanie v dávkach (Batch API), ktoré poskytuje až 50 % zľavu oproti bežnej cene volaní.

### Súhrnný ekonomický dopad optimalizácií

| Technika | Typ úspory | Odhadovaný dopad |
|----------|-----------|-----------------|
| Prompt Caching | Input tokeny | −60 % až −90 % |
| Tiered Routing | Výpočtový čas | −40 % až −70 % |
| Batch Processing | Celková cena API | −50 % |

> **Metodická poznámka:** Hodnoty sú odhadované na základe dostupných ceníkov AI providerov. Presné čísla sa stanovia po pilotnom meraní skutočného token usage v prostredí NMH (Fáza 2: Optimalizácia).

---

## História dokumentu

| Verzia | Dátum | Autor | Zmena |
|--------|-------|-------|-------|
| 1.0 | 2026-04-12 | Daniel Budziňák | Prvá verzia |
| 2.0 | 2026-04-12 | Daniel Budziňák | Finálna verzia, kompaktná forma, Príloha Token Management |

---

*Dokument pripravený v rámci výberového konania na pozíciu PM/Produktový architekt. Súvisí s MDIE A (strategická vízia) a MDIE C (Jira feature spec: `MDIE_C_Jira_Spec.md`).*

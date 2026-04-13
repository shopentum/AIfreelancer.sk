# ČASŤ A: STRATEGICKÁ VÍZIA A KONCEPT MDIE
## Enterprise Strategy & Architectural Vision

> **Projekt:** Media Decision Intelligence Engine (MDIE)  
> **Autor:** Daniel Budziňák, Solution Architect  
> **Verzia:** 1.2 | Dátum: 2026-04-12

---

## 1. EXECUTÍVNE ZHRNUTIE

Media Decision Intelligence Engine (MDIE) nie je len ďalší AI asistent pre redaktorov. Je to operačný systém pre kvalitu a integritu obsahu v modernom newsroome. Cieľom systému je transformovať redakčný proces z reaktívneho (oprava chýb po publikácii) na proaktívny (prevencia rizík počas tvorby), a to pri súčasnom radikálnom znížení prevádzkových nákladov.

---

## 2. ZÁKLADNÉ ARCHITEKTONICKÉ PRINCÍPY

MDIE stojí na troch pilieroch, ktoré definujú jeho identitu a odlišujú ho od generických LLM riešení:

### 2.1 AI navrhuje, Človek rozhoduje (Human-in-the-loop)

Systém striktne dodržiava princíp zákazu autonómnej exekúcie. Žiadna zmena v článku, žiadna úprava SEO ani publikácia sa nedeje bez explicitného schválenia redaktorom. Tento prístup buduje dôveru a zachováva autorskú integritu.

### 2.2 Shared Intelligence Core

MDIE využíva centralizované „vedomie" redakcie. Tento core obsahuje:

- **Editorial Identity Layer:** Unikátny tón hlasu (Tone of Voice) a pravidlá každej značky v portfóliu NMH.
- **Governance & Trust Layer:** Pravidlá pre faktickú správnosť, právnu bezpečnosť a medicínsku validáciu.
- **Context Trace Object (CTO):** Každé odporúčanie systému je spätne dohľadateľné k auditným dátam a konkrétnemu stavu systému v čase rozhodnutia.

### 2.3 State-based Logika

Odporúčania, UI prvky a kroky systému sú funkciou aktuálneho STATE (stavu) článku. Systém neposkytuje generické rady, ale reaguje na konkrétny progres textu a jeho Readiness Score.

---

## 3. KĽÚČOVÉ FUNKČNÉ VRSTVY

### 3.1 Validation & Education Layer

Systém nefunguje ako „červené pero", ktoré len označuje chyby. Prostredníctvom Education Layer (`whyFlagged`) vysvetľuje redaktorovi logiku za každým nálezom. Tým zvyšuje mediálnu gramotnosť tímu a znižuje odpor voči AI technológiám.

### 3.2 Audit Trail & Compliance

Všetky interakcie medzi človekom a AI sú immutable (nemenné) a zaznamenané v Audit Logu. NMH tak získava absolútnu kontrolu nad pôvodom a úpravami obsahu, čo je kľúčové pre právnu ochranu a transparentnosť voči čitateľom.

### 3.3 Readiness Score

Každý článok pred publikáciou prechádza kvantitatívnym vyhodnotením pripravenosti. Readiness Score integruje dáta z dôveryhodnosti, štýlu a SEO do jednej metriky, ktorá slúži ako „vstupná brána" pre publikáciu (Publish Gate).

---

## 4. EKONOMICKÁ A TECHNICKÁ RESILIENCIA

MDIE je navrhnutý ako Enterprise-ready systém, ktorý počíta s reálnymi podmienkami prevádzky:

- **Graceful Degradation:** V prípade výpadku AI služieb systém neblokuje redaktora, ale prechádza do Safety módu, pričom zachováva plnú editačnú schopnosť.
- **Shared Intelligence Core:** Architektúra optimalizovaná na hromadné spracovanie článkov s minimálnymi nákladmi na tokeny (viď detail v Časti B, Príloha Token Management).

---

## 5. ZÁVER

MDIE predstavuje novú kategóriu rozhodovacej inteligencie. Nie je to nástroj na generovanie textu, ale nástroj na garanciu kvality, ktorý umožňuje NMH škálovať produkciu obsahu pri zachovaní najvyšších žurnalistických štandardov.

---

## HISTORIA DOKUMENTU

| Verzia | Dátum | Autor | Zmena |
|--------|-------|-------|-------|
| 1.0 | 2026-04-12 | Daniel Budziňák | Prvá verzia |
| 1.2 | 2026-04-12 | Daniel Budziňák | Finálna verzia, čistý Markdown pre PDF export |

---

*Dokument pripravený v rámci výberového konania na pozíciu PM/Produktový architekt. Nadväzuje na Časť B (`CAST_B_Projektovy_Ramec.md`) a Časť C (`CAST_C_Jira_Spec.md`).*

# Editorial Copilot — MVP2 (ďalšia vlna)

> **Typ dokumentu:** strategické rozšírenie zámeru po MVP — **nie opakovanie MVP** ani implementačná špecifikácia.  
> **Nadväzuje na:** [Editorial_Copilot_Strategic_Direction_NHM.md](./Editorial_Copilot_Strategic_Direction_NHM.md) (MVP = orchestrácia, panel, pripravenosť, základné pilierové nálezy a logovanie) a na širšiu víziu vrstiev v [Editorial_Copilot.md](./Editorial_Copilot.md).

Dátum: 2026-05-07

---

## 1. Na čo slúži tento text

Zachytáva **druhú produktovú vlnu**: čo má zmysel stavať **až keď** má redakcia stabilný panel, jednotné logovanie základných akcií a overenú adopciu MVP. MVP2 **nenahrádza** dokument MVP — predpokladá, že zámer z NHM je naplnený alebo je naplnenie záväzne v toku.

---

## 2. Produktová téza MVP2

**Z orchestrácie nástrojov na interpretáciu „stavu článku“ naprieč CMS.** Panel už neorganizuje len validáciu a SEO formulára, ale **číta aj signály z ďalších modulov redakčného systému**, zosúladzuje ich s editorialnou politikou a vracia redaktorovi **jasné rozhodnutia s minimálnym „impact storytellingom“** — štítky a poradie namiesto nekalibrovaných percent a predikcií.

---

## 3. Rozsah MVP2 (čo pridávame oproti MVP)

| Oblasť | Zámer MVP2 | Poznámka |
| **Reálne CMS moduly v paneli** | Čítať **stav** modulov (napr. anketa Q&A, blok súvisiacich článkov), ktoré už v CMS existujú; zobraziť **deterministické odporúčania / medzery** (napr. anketa chýba, rozpracovaná, pripravená). | Bez inventára nových AI modelov — najprv **signály a API z Core/CMS**. |
| **Tagy a interné odkazy v orchestrácii** | Tagy a návrhy interného linkbuildingu sú **súčasť riadenia pozornosti** v paneli (nie izolovaný flow len v nastaveniach), s jednotným logovaním rozhodnutí. | Nadväzuje na existujúcu infra tagov a link flow z vízie. |
| **SEO intelligence (deterministická)** | Hlbšie napojenie na **SEO Content Checker** (lemma / základný tvar, rozsah textu, bezpečný fallback), prípadne **jasné rozlíšenie** „čo ešte nesedí“ vs. „už vyhovuje“. | Žiadne **sľuby CTR alebo +X % výkonu** bez kalibrácie. |
| **Zladenie súvislostí** | Ľahká kontrolná logika: napr. **súlad** medzi vybranými súvisiacimi článkami a návrhmi interných odkazov v tele (kde dáta dovolia). | Produktové pravidlá musí definovať CMS vlastník obsahu. |
| **Article state (zjednodušene)** | Jednovetové alebo štítkové **agregované stavy** podľa pilierov (kvalita textu, SEO pripravenosť, zapojenie/moduly) — čitateľné pre vedenie, nie nový dashboard tímu BI. | Mapuje sa na vrstvy z Editorial_Copilot.md bez budovania všetkých siedmich naraz. |
| **Adopcii a únava** | Agregácia z existujúcich logov: **prijaté vs. zamietnuté**, čas do rozhodnutia, počet otvorených návrhov v čase; **stlmenie** frekvencie pri nízkej závažnosti. | Nadväznosť na Learning & Adoption vrstvu vo vízii. |
| **Governance (minimum)** | Pri **blokujúcich / vysokorizikových** nálezoch krátka **explainability**: odkiaľ signál, čo redaktor riskuje ak ignoruje (bez právnického tonu). | HITL zostáva; žiadna autonómna publikácia. |

---

## 4. Mimo rozsahu MVP2 (zámerne neskôr alebo samostatné rozhodnutie)

| Téma | Dôvod odkladu |
| **Globálny LLM ako „riaditeľ editora“** | náklad, auditovateľnosť, governance — už vylúčené z MVP, MVP2 to nemení. |
| **Predikcie výkonu (CTR, predaj)** ako súčasť panelu | vyžaduje kalibrované dátové modely a etické zarámovanie; vízia v Editorial_Copilot.md zostáva smerom na **MVP3+** alebo samostatný initiative gate. |
| **Plná Performance Intelligence** | snapshoty po publikácii môžu byť **read-only odkaz** alebo tenká integrácia — nie povinná súčasť MVP2 bez DataHub dohody. |
| **Hluboká personalizácia Copilotu per redaktor** | až pri dostatočnej histórii adopcie z MVP/MVP2. |

---

## 5. Závislosti a predpoklady

- **Article identity** a jednotný kontrakt udalostí z MVP sú funkčné alebo fixované v backlogu.
- **API alebo čitateľné signály** z modulov Q&A, súvisiacich článkov (a prípadne ďalších) — bez toho ostáva MVP2 v režime prototypu.
- **Vlastník produktových pravidiel** pre „čo je blokujúce“ pri moduloch vs. pri SEO — aby panel nehlásil konfliktné priority.

---

## 6. Meranie úspechu MVP2 (additive)

Okrem signálov z MVP pridať orientačne:

- podiel článkov s **vyriešeným** stavom modulu Q&A / súvisiacich článkov tam, kde ich redakcia požaduje,
- **menej opakovaných otvorení** rovnakej kategórie návrhu bez rozhodnutia (signál únavy alebo zlej priority),
- čiastočná väzba **adopcie tagov / interných odkazov** na dostupné výkonové metriky — len tam, kde je metodika dohodnutá a **bez prezentácie ako jednoduchej kauzality**.

---

## 7. Riziká špecifické pre MVP2

| Riziko | Zmiernenie |
| **Scope creep cez „ešte jednu vrstvu vízie“** | MVP2 držať na riadkoch tabuľky §3; všetko ďalšie do backlogu vízie alebo MVP3. |
| **Dve pravdy** (CMS modul vs. AI návrh) | explicitné UX pravidlá, ktorý zdroj je „zdroj pravdy“ pre publish. |
| **Čísla bez dát** | zákaz falošných percent dopadu v UI — iba štítky a poradie dohodnuté s legal/editorial. |

---

## 8. Mapovanie na víziu (Editorial_Copilot.md)

MVP2 zámerne posúva časť **SEO Intelligence**, **Discovery & Distribution** (iba cez CMS signály, nie predikcie), **Performance Intelligence** (max. tenké napojenie), **Editorial Decision** (priorita a štítky), **Learning & Adoption** (agregácia) a **Governance & Trust** (minimum explainability). Nevybuduje sa celých sedem vrstiev naraz — dokument slúži ako **scoped druhá vlna** voči tej mape.

---

## 9. Jednovetové posolstvo pre vedenie (MVP2)

**Po tom, čo máme jeden panel a merateľné základné rozhodnutia, MVP2 pridá čítanie reálneho stavu článku v CMS a rozumnú SEO/adoptičnú vrstvu — stále bez autonómnej publikácie a bez predstieraných čísel výkonu.**

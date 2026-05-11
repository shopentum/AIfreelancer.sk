# Jira - AI Decision Layer (MVP architektúra)

> **Účel:** uchovať dohodnutý smer pre MVP - webhook, vlastný AI Decision Service, Jira komentár a minimálne custom fields.  
> **Nadväzuje na:** diskusiu o oddelení Jiry (workflow truth), vlastnej decision logike a meracom kontexte (shared measurement).

Dátum: 2026-05-07

---

## 1. Jadro produktovej myšlienky

**Najväčšia hodnota je v kvalite rozhodnutia pred PRODUCT, nie v automatizácii Jiry.**

AI nestavia náhradu za PM ani za workflow. Stráži **zmysluplnosť rozhodnutia** (hypotéza, metriky, baseline, závislosti) v momente, keď sa práca posúva do produktovej fázy.

---

## 2. Odporúčaný MVP (kompromis)

**Nie** Forge panel ako prvý krok.  
**Nie** Rovo ako hlavný systém rozhodovania.

**Áno:** webhook + vlastný **AI Decision Service** + Jira komentár + **1-2 custom fields**.

### Prečo tento kompromis

| Aspekt | Dôvod |
| Rýchlosť dodania | Rýchlejšie než Forge panel a vlastné UI v Jire |
| Kontrola | Kontrolovanejšie než spoliehať sa primárne na Rovo |
| Náklady | Lacnejší MVP - bez Forge vývoja a distribúcie |
| Reporting | Stavy v poliach sa dajú filtrovať a reportovať |
| Mantinel | Drží pravidlo: **AI navrhuje, človek rozhoduje** |

---

## 3. Rozdelenie rolí (mentálny model)

| Vrstva | Úloha |
| Jira | Workflow a zdroj pravdy o stave práce (issue ako entita) |
| Confluence | Kontext a dlhšia dokumentácia (v MVP sa **neťahá celý** kontext automaticky) |
| DataHub | Impact a meranie požiadaviek (závislosti v checkliste) |
| AI Decision Layer | Kontroluje, či je rozhodnutie pripravené - odporúča, neblokuje |

---

## 4. MVP flow

1. **Trigger:** Jira transition napr. IDEA → PRODUCT alebo stav typu **Ready for Review** (konkrétne prechody sa nastavia v projekte).
2. **Webhook:** Jira zavolá vlastný endpoint (payload issue / transition metadata).
3. **AI Decision Service:** načíta issue kontext (summary, description, komentáre, linky, custom fields podľa dohody).
4. **Rules + prompt:** fixná sada pravidiel vo verzii **v1.x** + prompt šablóna.
5. **Štruktúrovaný výstup:** determinovaný formát (pre pole + komentár).
6. **Zápis do Jiry:** komentár (detail) + custom fields (stav a verzia pravidiel).

**Blokovanie transition sa v MVP nerobí** - review je informačné a opakovateľné.

---

## 5. Príklad výstupu (komentár)

```
Decision Readiness: PARTIAL
Rules version: v1.0

Missing:
- baseline
- DataHub impact metric

Recommended human action:
- doplniť success metric
- potvrdiť skupinu článkov na porovnanie

Rerun available: yes
```

**Konvencia:** pole nesie **stav** a **verziu pravidiel**; komentár nesie **detail a odporúčania**.

---

## 6. Custom fields (minimum)

| Pole | Účel | Hodnoty / typ |
| Decision Readiness | Agregovaný stav pripravenosti | READY / PARTIAL / NOT READY |
| Decision Review Version | Auditovateľná verzia rules + prompt | napr. `rules v1.0` |

Voliteľné neskôr: dátum posledného review, JSON payload checksum, odkaz na interný run ID.

---

## 7. Čo MVP zámerne nerobí

- Neblokuje transition (žiadny hard gate v Jire).
- Neposúva status automaticky.
- Nerobí komplexný scoring model.
- Netiahne celý Confluence kontext do jedného promptu (iba dohodnuté excerpt / linky ak treba).
- Nezačína Forge panelom ani hlavnou záťažou na Rovo Agent ako systém pravdy.

---

## 8. Technické guardrails

| Téma | Odporúčanie |
| Idempotentnosť | Kľúč napr. `issue_id` + `transition_id` + `rules_version` - zabrániť duplicitným komentárom pri retry |
| Spracovanie | Asynchrónne (fronta / worker) - webhook okamžite ACK, výsledok neskôr do Jiry |
| Verziovanie | Prompt aj rules ako verzovaný artefakt (aspoň git tag alebo semver v poli) |
| Logovanie | Žiadne plné logovanie promptov s citlivými dátami; minimalizovať PII v logoch |
| Rerun | Explicitná akcia „prepočítať review“ (napr. endpoint alebo label-trigger), bez nutnosti nového transition |

---

## 9. Bezpečnosť a prevádzka (skrátene)

- OAuth / scoped token pre Jira REST zápis (iba potrebné scopes).
- Rate limits Jira API a backoff pri chybách.
- Jasná politika, ktoré polia a komentáre sa posielajú do LLM a kam sa výsledok zapisuje.

---

## 10. Možná evolúcia po MVP

- Forge issue panel (lepší UX, stále tá istá služba pod kapotou).
- Hybrid s Rovo pre ad-hoc otázky v orgánnej vrstve Atlassianu.
- Rozšírené štruktúrované polia alebo jedno JSON pole pre reporting.

---

## 11. Jednovetové zhrnutie pre stakeholderov

**Jira ostáva miestom práce a workflowu; AI Decision Layer pred PRODUCT kontroluje kvalitu rozhodnutia a zapisuje zrozumiteľný výstup do poľa a komentára.**

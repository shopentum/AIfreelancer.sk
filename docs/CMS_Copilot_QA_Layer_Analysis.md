# CMS Copilot – Q&A Layer

**Analýza, vyhodnotenie a smerovanie (Post-MVP)**

**Status:** Návrh na zdieľanie s tímom (review)  
**Súvisí s:** EAGLE CMS 2026-2027 – Inteligentný Copilot redakcie, Article Performance Layer

---

## Kontext

Q&A modul v aktuálnom stave predstavuje AI funkciu na generovanie obsahu v editore článku.

**Ciele tohto dokumentu:**

- posunúť vnímanie Q&A z „AI nástroja“ na **Decision Copilot** modul
- definovať minimálne **dátové základy** (JSON layer)
- ukázať **strategické smerovanie** v súlade s EAGLE CMS 2026-2027 – Inteligentný Copilot redakcie

---

## 1. Reálny charakter modulu

### Aktuálny stav

- AI generuje Q&A
- redaktor upravuje / akceptuje / zahodí
- systém nemá spätnú väzbu (logging / metriky)

### Cieľový stav

- Q&A modul ako súčasť **Article Performance Layer**
- AI návrh → redaktor interakcia → **logging** → vyhodnotenie → odporúčanie

**Posun:** z generovania obsahu na **rozhodovanie nad obsahom**.

---

## 2. JSON Layer (kľúčový základ)

### 2.1 JSON #1 – Editorial Behavior Layer (MVP+)

**Účel:** Zachytiť správanie redaktora a kvalitu AI výstupu.

```json
{
  "feature": "qa_generation_v1_logging",
  "events": [
    "qa_generated",
    "qa_edited",
    "qa_accepted",
    "qa_rejected"
  ],
  "core_metrics": [
    "acceptance_rate",
    "edit_distance",
    "generation_rate"
  ]
}
```

**Hodnota:** prvý reálny insight do adopcie AI, kvality výstupu a správania redakcie. Táto vrstva predstavuje **Data Acquisition Layer**.

---

### 2.2 JSON #2 – Performance & Decision Layer (Post-MVP)

**Účel:** Vyhodnotiť dopad Q&A na výkon článku a umožniť rozhodovanie.

```json
{
  "feature": "qa_copilot_decision_layer",
  "layers": [
    "event_decision_layer",
    "trigger_engine_v2",
    "quality_feedback_loop",
    "cross_module_integration",
    "performance_layer",
    "content_expansion_mode",
    "copilot_recommendation_engine"
  ]
}
```

**Hodnota:** prepája editorial behavior, user behavior a business impact. Táto vrstva predstavuje **Decision Intelligence Layer**.

---

## 3. Analýza hodnoty

### 3.1 Krátkodobá hodnota (MVP+)

- získanie dát: acceptance rate, edit distance, usage
- **Bez tohto:** optimalizácia je len pocitová

### 3.2 Strednodobá hodnota

- optimalizácia triggerov, kvality výstupu a adopcie

### 3.3 Dlhodobá hodnota

- Copilot **odporúča akciu**, nečaká len na input redaktora

---

## 4. Kľúčový posun

| FROM | TO |
| AI generuje obsah | AI odporúča rozhodnutia |

---

## 5. Architektonický kontext

Q&A modul kopíruje rovnaký **pattern vrstiev** ako ostatné Copilot moduly:

| Vrstva | Význam |
| Generation | AI výstup |
| Interaction | redaktor |
| Feedback | logging |
| Evaluation | analýza |
| Decision | odporúčanie |

**Kompatibilita:** DataHub (eventy), SEO Copilot logika, časť Article Performance Layer.

---

## 6. Riziká

| ID | Rizikum | Poznámka |
| R1 | Feature bez dopadu | bez napojenia na performance |
| R2 | Noise generator | príliš jednoduchý trigger (napr. 1500 znakov) |
| R3 | Nesprávne metriky | acceptance rate sám o sebe ≠ kvalita; doplniť **edit distance** |
| R4 | Bez učenia | bez feedback loopu AI stagnuje |

---

## 7. DATA GAP

| ID | Gap |
| DG1 – Baseline | chýba porovnanie „bez Q&A“ |
| DG2 – Performance napojenie | chýba: ATS, CTR, scroll (alebo ekvivalent podľa zdroja dát) |
| DG3 – Typológia článkov | chýba klasifikácia obsahu pre segmentáciu výkonu |

---

## 8. Cross-module prepojenie

- **SEO Copilot:** Q&A → kontext / entity → interné linky
- **Tags:** Q&A → entity → tagy
- **Performance Layer:** Q&A → engagement → rozhodovanie

**Výsledok:** jednotná AI vrstva nad obsahom (nie izolovaný widget).

---

## 9. Priority (Suggestion Hub)

1. **MUST:** implementovať JSON #1 (logging)
2. **HIGH IMPACT:** zaviesť **edit distance** ako core metriku
3. **STRATEGICKÉ:** posun smerom k proactive copy typu **„Odporúčame pridať Q&A“** (nie len tlačidlo „Vygenerovať“)

---

## 10. Strategické smerovanie

V súlade s:

- proactive copiloting
- data-driven rozhodovanie
- AI-native CMS

(viď dokumentáciu **EAGLE CMS 2026-2027 – Inteligentný Copilot redakcie**)

**Cieľový stav:** CMS neponúka len nástroje - CMS **navrhuje rozhodnutia**.

---

## 11. Finálny insight

Q&A nie je izolovaný **feature** - je to **prvý krok k Decision Intelligence CMS** v rámci redakčného workflow.

---

## Záver

- **JSON #1** = základ (bez neho sa neposunieme v optimalizácii ani v dôvere dát)
- **JSON #2** = smer (bez neho hrozí rozptyl bez jasného „prečo“ v produktových rozhodnutiach)

**Spolu** vytvárajú základ Copilot architektúry a prepájajú editor → dáta → výkon → rozhodovanie.

---

## Ďalší krok (voliteľné)

- prepis do **Jira Epic + Stories** (ready na refinement)

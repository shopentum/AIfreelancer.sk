# Príklady — Greenfield MVP DNA

## Example prompts

```
Použi greenfield-mvp-dna: navrhni MVP scope pre [produkt/klient]. 
Deadline [dátum]. Jedna user journey. STOP check.
```

```
Je to spike alebo MVP delivery? Rozdeľ na Phase 2 backlog.
```

```
Skráť tento návrh — stakeholder chce demo, nie framework.
```

```
Klient chce ROI reporting v MVP — aplikuj STOP CONDITIONS.
```

```
Kde je DATA GAP pred tým, než začneme kódovať?
```

---

## Flow 1: Nový klientský pilot

1. Typ = klientský delivery; deadline = áno → **STOP**  
2. Jedna journey, 3–5 AC  
3. Externý doc = scope template; interný = stack + riziká + Phase 2  
4. Integrácie len ak blokujú demo  
5. Žiadny causal ROI v MVP sľube  

**Výstup:** 1 strana pre klienta + interný backlog.

---

## Flow 2: Vlastný produkt (Shopentum / side project)

1. Reuse: existujúci monorepo path? (site vs `apps/*`)  
2. Slice: čo je **dôkaz hodnoty** za 1–2 týždne  
3. AI feature = HITL + log eventov  
4. Phase 2: analytics, polish, scale  

---

## Flow 3: „Chceme AI copilota“ (generic)

1. Nie „LLM všade“ — ktoré **signály** už existujú?  
2. TOP N odporúčaní, nie 30 panelov  
3. Usage logy v MVP; outcome metriky Phase 2 ak chýbajú  
4. DATA GAP: zdroj pravdy entity  

---

## Flow 4: Scope creep v polovici sprintu

1. Spusti **STOP check (30 s)**  
2. Nový request → Phase 2 alebo vymeniť niečo z in-scope  
3. Aktualizuj AC, nie tichý rozšírený kód  

---

## Flow 5: Po úspešnom MVP

1. Čo sa **overilo** (signály)  
2. Čo je **Phase 2** (metodika, scale, reporting)  
3. Samostatné tasky — nie nafúknutie pôvodného MVP ticketu  

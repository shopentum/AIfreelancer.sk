# DHUB-3138 — Pent **sub-task** (finálne znenie)

V Jire nastaviť **Parent:** DHUB-3138.

---

## Summary

```
[Penta] AI adopcia + doplnenie performance polí (5 modulov)
```

---

## Description

```
Parent: DHUB-3138.

Jednorazové podklady pre Pentu. Cieľ: existujúce zdroje, tabuľky/grafy — bez otvárania novej metodickej agendy v tomto ticketi.

Mimo scope tohto ticketu: vyhodnotenie / interpretácia dát (čo čísla „znamenajú“ pre biznis) — to bude riešiť CMS tím; DH dodáva výstupy podľa dohody.

1) Adopcia — všetky AI nástroje v súčasnom AI reportinge
• Tabuľky a grafy ako doteraz (periodicita / dashboard podľa zvyku DH).
• Spájanie na článok cez kanonický identifikátor: ArticleDocumentId / article_id (alebo ekvivalent, ktorý používate ako zdroj pravdy).
• CAP / eligible: dodržať existujúce pravidlá AI reportingu pre jednotlivé nástroje. Pri adopčných podieloch a „baseline“ menovateľoch nejde o počet všetkých článkov na webe, ale o bázu tam, kde bola daná AI funkcia pre daný typ obsahu reálne dostupná / použiteľná (podľa tých istých eligible pravidiel). Číslo má odrážať túto realitu, nie umelo nafúknutý celkový počet článkov.

2) Performance polia — len týchto 5 modulov
• Tag Generator
• Poll Generator
• Related articles (auto-suggestion)
• Video subtitles Generator
• Audio Transcript
• K výstupu priradiť dostupné web / DH performance údaje na úrovni článku cez rovnaký článkový kľúč ako vyššie (ArticleDocumentId / article_id), alebo tak, ako viete spočítať pri použití feature — konkrétne polia (views, CTR, engagement, …) podľa dostupnosti.

• Nie všetky AI features musia mať dostupné performance metriky v tomto kole.
• Chýbajúce metriky nie sú blokér pre vznik ani dodanie výstupu.

Deliverable: dohodnutý formát (tabuľka / export / úprava dashboardu) + grafy pre Pentu podľa potreby produktu.

Acceptance: NMH potvrdí dodanie bodu 1 podľa existujúcich CAP pravidiel a bodu 2 pre uvedených päť modulov v dohodnutom rozsahu; vyhodnotenie dát ostáva na CMS tíme.
```
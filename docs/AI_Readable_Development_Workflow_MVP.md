# AI-Readable Development Workflow (MVP koncept)

> **Účel:** zjednotiť execution workflow okolo Jiry a Confluence ako source of truth, s AI ako copilotom - bez autonómneho „AI vývoja“.  
> **Súvisí s:** `docs/Jira_AI_Decision_Layer_MVP.md` (gated decision pred PRODUCT), meracím rámcom v `docs/AI_Features_Shared_Measurement_v5.md`.

Dátum: 2026-05-07

---

## Ciele

Znížiť:

- context switching,
- onboarding čas,
- chaos v taskoch,
- neaktuálnu dokumentáciu,
- stratu decision kontextu počas delivery.

**Nejde o** autonómny AI development.

**Ide o:**

- AI-assisted execution workflow,
- kde **Jira + Confluence** tvoria source of truth,
- a AI pomáha s **execution**, **review** a **context understanding**.

---

## Základný model

```text
Jira = workflow truth
Confluence = context truth
Cursor / AI IDE = execution workspace
AI = context-aware copilot
Developer = review + decision layer
```

**Posun role (MVP smer):** developer trávi relatívne viac času **architektúrou, prípravou taskov a reviewom výstupov AI**, menej času rutinným prepínaním kontextu a hľadaním informácií. Nie náhrada za senioritu - ale **silnejší dôraz na governance a clarity**.

---

## Workflow

### 1. Ideation / Product

Vzniká:

- hypotéza,
- success metric,
- scope,
- baseline,
- acceptance criteria,
- DATA_GAP (explicitné medzery namiesto domnienok).

Výstup:

- Epic / task v Jire,
- linked Confluence dokumentácia.

---

### 2. Structured Context

**Jira** obsahuje napr.:

- summary,
- description,
- subtasks,
- labels,
- dependencies,
- linked docs.

**Confluence** obsahuje napr.:

- architektúru,
- business rules,
- workflow,
- boundaries,
- MVP scope,
- out-of-scope.

**Link discipline:** čokoľvek netriviálne má mať **čiaru na Confluence** alebo jasný dôvod v tickete, prečo stačí samotný Jira popis.

---

### 3. Definition of Ready (pre AI execution)

Pred väčším AI-assisted coding loop odporúčame minimal checklist:

| Položka | Poznámka |
| Ticket má jasný problém a scope | vrátane non-goals ak treba |
| AC sú testovateľné | nie vagón viet |
| Confluence link | ak sa dotýka architektúry / pravidiel |
| Known DATA_GAP | ak niečo chýba - AI nesmie vymýšľať |

Ak checklist nie je splnený - prvý krok je **doplniť ticket / Confluence** alebo vygenerovať DATA_GAP, nie „len napísať kód“.

---

### 4. AI Context Retrieval

**Cursor / AI IDE:**

- načíta Jira ticket (napr. cez Atlassian MCP / plugin alebo ručne prilepí kontext),
- načíta linked Confluence pages,
- použije ich ako **single source of truth** pre daný task.

**Prompt pattern:**

```text
Use Jira issue + linked Confluence pages as source of truth.
Do not infer missing behavior.
If information is missing, create DATA_GAP section.
```

**Retrieve → confirm → implement:** krátke potvrdenie porozumenia (bullet summary) pred väčšou zmenou kódu znižuje drift a halucinácie.

---

### 5. AI-assisted Execution

AI pomáha napr.:

- pochopiť task,
- navrhnúť implementation plan,
- identifikovať missing edge cases,
- navrhovať boilerplate,
- generovať implementation draft,
- upozorniť na dependencies alebo riziká.

**Developer:**

- reviewuje,
- upravuje,
- rozhoduje.

**Task chopping:** AI môže navrhnúť rozklad epicu na tasky; **finálna štruktúra a závislosti** sú ľudská zodpovednosť.

---

### 6. Review-first Development

Posun:

**Od:**

```text
manual coding heavy workflow
```

**K:**

```text
AI-first execution
+
human review / governance
```

Developer trávi viac času:

- reviewom,
- architektúrou,
- quality kontrolou,
- decision makingom.

Menej času:

- context switchingom,
- boilerplatom,
- hľadaním dokumentácie,
- opakovanej rutine.

**Review gates (ľahké MVP pravidlá):**

| Gate | Účel |
| Po implementation plan | súlad so scope a AC |
| Po významnom AI drafte | security, edge cases, naming |
| Pred merge | mapovanie na Jira AC, minimálna veľkosť zmien |

**PR evidence:** stručná väzba na ticket (napr. „covers PROJ-XXX AC 1-3“) - navigácia späť na workflow truth.

---

### 7. Decision Continuity

Výhoda workflowu:

- decision kontext zostáva v Jire,
- architektúra zostáva v Confluence,
- AI vie čítať aktuálny workflow stav (pri napojení nástrojmi alebo pri dodanom kontexte),
- onboarding nového človeka je výrazne rýchlejší.

**Lightweight decisions:** krátke záväzné rozhodnutia (ADR alebo „Decision“ blok v Confluence pod epicom) znižujú náhodné inferovanie v AI.

---

### 8. Praktický dopad

Workflow cieli na:

- rýchlejší execution loop,
- nižší mentálny load,
- menej meetingov,
- menej opakovaného vysvetľovania,
- konzistentnejší implementation context,
- **AI-readable** workflow systém.

---

### 9. Metriky úspechu MVP (orientačné)

| Signál | Čo meria |
| Lead time: ticket open → confident coding start | friction kontextu |
| Počet pingov na PM/architecta na task | kvalita prepared context |
| Podiel ticketov so structured links + DoR | disciplína workflowu |

Nie primárne „riadky kódu od AI“.

---

### 10. Riziká a mitigácie

| Riziko | Mitigácia |
| Documentation drift | owner stránky, ritual pri merge alebo release notes |
| Ticket ako textový dump | šablóna polí / sekcií v Jire |
| Veľké monolitné AI diffy | malé commity, staged rollout, feature flags kde zmysluplné |

---

## Dôležité mantinely

### Workflow NIE JE:

- autonómny agent,
- auto-deployment bez ľudského rozhodnutia,
- AI bez kontroly,
- replacement developerov.

### Workflow JE:

- AI-assisted execution system,
- workflow acceleration layer,
- context-aware development workflow,
- decision-support oriented delivery model.

---

## MVP princíp

**Najväčšia hodnota nie je** AI generovanie kódu samo o sebe.

**Ale:**

- zníženie context switchingu,
- udržiavanie workflow truth (Jira + Confluence),
- zrýchlenie **understanding → execution** flow,
- posilnenie **review a architectural clarity** v tíme.

---

## Jednovetové zhrnutie

**Jira a Confluence držia pravdu o práci a kontexte; IDE je miesto execution; AI urýchľuje porozumenie a draft - developer drží rozhodnutia a kvalitu.**

# Terminológia — NMH Decision Intelligence

Jedna konzistentná slovná zásoba naprieč CMS, DH a produktom.

## Identita a join

| Termín | Význam |
|--------|--------|
| **ArticleDocumentId / article_id** | Kanonický identifikátor článku; spine pre logy, analytics, Copilot |
| **Grain** | Úroveň riadku datasetu (typicky článok; prípadne dohodnutý agregát) |
| **SoT** | Source of truth — ktorý systém vlastní daný identifikátor alebo metriku |

## Meranie AI

| Termín | Význam |
|--------|--------|
| **Usage / interaction / adoption** | Správanie v CMS: použitie nástroja, prijatie návrhu, regenerácie |
| **Performance signals** | Web metriky po publikácii (views, CTR, engagement, revenue, …) |
| **CAP / eligible / použiteľná báza** | Množina článkov, kde bola daná AI feature produktovo použiteľná |
| **Enrichment** | Doplnenie performance polí k článku / usage záznamu |
| **Adoption** | Typicky použité vs eligible v rámci CAP pre daný nástroj |

## Porovnávanie (Phase 2+)

| Termín | Význam |
|--------|--------|
| **Within eligible, same period** | Porovnanie used vs not-used len v eligible kohorte a období |
| **Baseline (operatívne)** | Referenčné obdobie alebo báza pre daný rez — **nie** „všetky články navždy“ |
| **Popisné porovnanie** | Deskriptívne zarovnanie signálov; nie causal záver |

## Produkt a delivery

| Termín | Význam |
|--------|--------|
| **Delivery** | Konkrétne dáta / UI / export pre termín — minimálna metodická záťaž |
| **Phase 2 / upratovanie** | Metodika, recurring dataset, dokumentácia rezov po dodaní |
| **DATA GAP** | Explicitne pomenovaná medzera v rozhodnutí alebo dátach |
| **Parent / sub-task** | Epic kontajner vs implementačný / dodávkový detail |

## Editorial Copilot

| Termín | Význam |
|--------|--------|
| **Article Performance State** | Súhrnný stav článku (SEO, kvalita, discovery, performance, …) |
| **ERI** | Evidence → Reasoning → Impact (rámec odporúčania) |
| **HITL** | Human-in-the-loop — rozhodnutie redaktora povinné |
| **Orchestrácia** | Agregácia signálov z modulov + cielený LLM, nie monolit |

## Čo nepoužívať predčasne (voči DH / delivery)

- „AI impact“, „garantované ROI“, „causal“, „univerzálny baseline framework“  
- „Bridge“ ako externý názov závislosti (interný koncept áno, DH ticket nie)  
- „Deskriptívna komparačná logika“ v Pent delivery — až Phase 2 / interné docs  

## Mapovanie rolí

| Rola | Typická zodpovednosť |
|------|---------------------|
| **Produkt / architektúra** | Smer, CAP pravidlá, výber nástroja, interpretácia pre biznis |
| **DataHub** | Dataset, export, dashboard, performance polia podľa náleznosti |
| **CMS tím** | Workflow, logovanie rozhodnutí, vyhodnotenie dát pre redakciu |
| **Dev** | Implementácia podľa uzavretého AC; follow-up pri blokácii |

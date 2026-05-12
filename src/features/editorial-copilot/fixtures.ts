/**
 * Mock fixtures pre Editorial Copilot panel — žiadna sieť, žiadny CMS.
 */

import type { ArticleAudit } from "@/eagle_admin/geminiService";
import type {
  CopilotPriorityRow,
  EditorialCopilotFixtureId,
  EditorialCopilotPanelViewModel,
  ResolvedClaimViewModel,
} from "./types";

/** Reprezentatívny audit zhodný s demo v EagleCMS (zjednodušené linky/tagy pre veľkosť súboru). */
export const DEMO_ARTICLE_AUDIT: ArticleAudit = {
  readinessScore: 84,
  seoAudit: {
    title: {
      status: "fail",
      message:
        "Titulok je príliš dlhý (92 znakov). Odporúčané maximum je 70.",
      suggestion:
        "Skráťte titulok na: O krok bližšie k liečbe Alzheimera? Vedci odhalili zázrak v prášku",
    },
    seoTitle: {
      status: "warning",
      message: "SEO Titulok by mohol byť údernejší.",
      suggestion:
        "EXKLUZÍVNE: O krok bližšie k liečbe Alzheimera? Stojí pár eur!",
    },
    url: {
      status: "warning",
      message: "Slug je dlhý; kratší URL môže zlepšiť zdieľanie.",
      suggestion: "alzheimer-kreatin-doplnok-studia",
    },
    perex: {
      status: "warning",
      message: "Perex môže byť konkrétnejší v prvej vete.",
      suggestion:
        "Kreatín z fitiek mieri do výskumu Alzheimerovej choroby. Čo zatiaľ ukazujú dáta a čo odborníci odporúčajú?",
    },
  },
  editorialAudit: {
    tone: "Informatívny / Bulvárny (vhodný pre Nový Čas)",
    brandAlignment: {
      status: "pass",
      message: "Obsah plne rešpektuje redakčné smernice Nového Času.",
    },
    clickbaitScore: 6,
    suggestions: [
      "Zvážte pridanie viac citácií",
      "Zvýšte počet interných prelinkov",
    ],
  },
  linkSuggestions: [],
  tagSuggestions: [],
  claims: [
    {
      id: "claim-1",
      text: "kreatín monohydrát mohol predstavovať prelom v doplnkovej liečbe neurodegeneratívnych ochorení",
      risk: "high",
      reason: "Tvrdenie je príliš silné",
      explanation:
        'Slovo "prelom" v kontexte liečby Alzheimera môže byť vnímané ako zavádzajúce.',
      whyFlagged:
        "Systém nenašiel v texte konkrétny zdroj, ktorý by podložil toto medicínske tvrdenie.",
      recommendedAction:
        'Zmiernite tón tvrdenia na "potenciálny prínos".',
      recommendationShort:
        "Zjemniť formuláciu a vyhnúť sa slovu „prelom“ bez zdroja.",
      startIndex: 0,
      endIndex: 0,
    },
    {
      id: "claim-2",
      text: "stojí pár eur",
      risk: "medium",
      reason: "Chýba konkrétna cena",
      explanation:
        'Výraz "pár eur" je subjektívny.',
      recommendedAction:
        "Uveďte približnú cenovú reláciu.",
      recommendationShort: "Doplňte konkrétnu cenu alebo rozumné rozpätie.",
      startIndex: 0,
      endIndex: 0,
    },
  ],
  linguisticClaims: [
    {
      id: "ling-1",
      text: "Podľa najnovších štúdií publikovaných v prestížnom vedeckom časopise Nature, by kreatín monohydrát mohol predstavovať prelom v doplnkovej liečbe neurodegeneratívnych ochorení.",
      risk: "medium",
      reason: "Text je príliš odborný",
      explanation:
        "Čitatelia Nového Času preferujú priamejší štart.",
      recommendedAction: "Preformulujte úvod údernejšie.",
      recommendationShort: "Skrátiť a zjednodušiť úvod.",
      startIndex: 0,
      endIndex: 0,
    },
  ],
};

const SEO_APPLIED_COPY =
  "Tip z kontroly sme prepísali do formulára. Skontrolujte ešte raz znenie.";

function demoPriorities(): CopilotPriorityRow[] {
  return [
    {
      rowKey: "trust-high",
      kind: "block",
      done: false,
      title: "Tvrdenie je príliš silné",
      subtitle: "Dôvera · otvorte nález a rozhodnite sa",
    },
    {
      rowKey: "tags-links",
      kind: "warn",
      done: false,
      title: "Tagy a interné prelinkovania",
      subtitle: "Spustite sprievodcu",
    },
    {
      rowKey: "seo-title",
      kind: "warn",
      done: false,
      title: "Titulok je príliš dlhý",
      subtitle: "SEO · skráťte znenie",
    },
  ];
}

const resolvedClaim1: ResolvedClaimViewModel = {
  claimId: "claim-1",
  tab: "trust",
  reason: "Tvrdenie je príliš silné",
  beforeText:
    "kreatín monohydrát mohol predstavovať prelom v doplnkovej liečbe neurodegeneratívnych ochorení",
  afterText:
    "kreatín monohydrát môže predstavovať možný prínos v doplnkovej liečbe neurodegeneratívnych ochorení",
  actorName: "Demo Editor",
  resolvedAt: Date.now() - 120_000,
};

function auditTitleApplied(): ArticleAudit {
  const a = DEMO_ARTICLE_AUDIT;
  return {
    ...a,
    seoAudit: {
      ...a.seoAudit,
      title: {
        status: "pass",
        message: SEO_APPLIED_COPY,
        suggestion: undefined,
      },
    },
  };
}

const FIXTURE_BUILDERS: Record<
  EditorialCopilotFixtureId,
  () => EditorialCopilotPanelViewModel
> = {
  empty_before_audit: () => ({
    fixtureLabel: "Pred prvou validáciou",
    audit: null,
    isValidating: false,
    displayedScore: 0,
    findingsProgress: null,
    activeAuditTab: "trust",
    selectedFindingId: null,
    sidebarBanner: null,
    assistantPriorities: [],
    claimAiProposal: null,
    claimAiProposalLoading: false,
    resolvedClaimDetail: null,
    seoAppliedKeys: [],
    ignoredSeoKeys: [],
    collaborationLocked: false,
    articleUndoDepth: 0,
  }),

  validating: () => ({
    fixtureLabel: "Validácia prebieha",
    audit: null,
    isValidating: true,
    displayedScore: 42,
    findingsProgress: null,
    activeAuditTab: "trust",
    selectedFindingId: null,
    sidebarBanner: null,
    assistantPriorities: [],
    claimAiProposal: null,
    claimAiProposalLoading: false,
    resolvedClaimDetail: null,
    seoAppliedKeys: [],
    ignoredSeoKeys: [],
    collaborationLocked: false,
    articleUndoDepth: 0,
  }),

  trust_list: () => ({
    fixtureLabel: "Zoznam — Dôvera",
    audit: DEMO_ARTICLE_AUDIT,
    isValidating: false,
    displayedScore: DEMO_ARTICLE_AUDIT.readinessScore,
    findingsProgress: { resolved: 0, total: 8 },
    activeAuditTab: "trust",
    selectedFindingId: null,
    sidebarBanner: null,
    assistantPriorities: demoPriorities(),
    claimAiProposal: null,
    claimAiProposalLoading: false,
    resolvedClaimDetail: null,
    seoAppliedKeys: [],
    ignoredSeoKeys: [],
    collaborationLocked: false,
    articleUndoDepth: 2,
  }),

  trust_detail_with_proposal: () => ({
    fixtureLabel: "Detail nálezu + AI návrh",
    audit: DEMO_ARTICLE_AUDIT,
    isValidating: false,
    displayedScore: DEMO_ARTICLE_AUDIT.readinessScore,
    findingsProgress: { resolved: 0, total: 8 },
    activeAuditTab: "trust",
    selectedFindingId: "claim-1",
    sidebarBanner: null,
    assistantPriorities: demoPriorities(),
    claimAiProposal: {
      claimId: "claim-1",
      proposedText:
        "kreatín monohydrát môže predstavovať možný prínos v doplnkovej liečbe neurodegeneratívnych ochorení",
    },
    claimAiProposalLoading: false,
    resolvedClaimDetail: null,
    seoAppliedKeys: [],
    ignoredSeoKeys: [],
    collaborationLocked: false,
    articleUndoDepth: 1,
  }),

  trust_detail_resolved: () => ({
    fixtureLabel: "Detail — vyriešené (HITL)",
    audit: DEMO_ARTICLE_AUDIT,
    isValidating: false,
    displayedScore: DEMO_ARTICLE_AUDIT.readinessScore,
    findingsProgress: { resolved: 1, total: 8 },
    activeAuditTab: "trust",
    selectedFindingId: "claim-1",
    sidebarBanner: null,
    assistantPriorities: demoPriorities(),
    claimAiProposal: null,
    claimAiProposalLoading: false,
    resolvedClaimDetail: resolvedClaim1,
    seoAppliedKeys: [],
    ignoredSeoKeys: [],
    collaborationLocked: false,
    articleUndoDepth: 3,
  }),

  seo_tab_list: () => ({
    fixtureLabel: "Zoznam — SEO",
    audit: DEMO_ARTICLE_AUDIT,
    isValidating: false,
    displayedScore: DEMO_ARTICLE_AUDIT.readinessScore,
    findingsProgress: { resolved: 0, total: 8 },
    activeAuditTab: "seo",
    selectedFindingId: null,
    sidebarBanner: null,
    assistantPriorities: demoPriorities(),
    claimAiProposal: null,
    claimAiProposalLoading: false,
    resolvedClaimDetail: null,
    seoAppliedKeys: [],
    ignoredSeoKeys: [],
    collaborationLocked: false,
    articleUndoDepth: 0,
  }),

  seo_detail_suggestion: () => ({
    fixtureLabel: "SEO detail — návrh",
    audit: DEMO_ARTICLE_AUDIT,
    isValidating: false,
    displayedScore: DEMO_ARTICLE_AUDIT.readinessScore,
    findingsProgress: { resolved: 0, total: 8 },
    activeAuditTab: "seo",
    selectedFindingId: "title",
    sidebarBanner: null,
    assistantPriorities: demoPriorities(),
    claimAiProposal: null,
    claimAiProposalLoading: false,
    resolvedClaimDetail: null,
    seoAppliedKeys: [],
    ignoredSeoKeys: [],
    collaborationLocked: false,
    articleUndoDepth: 0,
  }),

  seo_detail_applied: () => {
    const audit = auditTitleApplied();
    return {
      fixtureLabel: "SEO detail — po použití",
      audit,
      isValidating: false,
      displayedScore: audit.readinessScore,
      findingsProgress: { resolved: 2, total: 8 },
      activeAuditTab: "seo",
      selectedFindingId: "title",
      sidebarBanner: null,
      assistantPriorities: demoPriorities(),
      claimAiProposal: null,
      claimAiProposalLoading: false,
      resolvedClaimDetail: null,
      seoAppliedKeys: ["title"],
      ignoredSeoKeys: [],
      collaborationLocked: false,
      articleUndoDepth: 1,
    };
  },

  sidebar_banner_only: () => ({
    fixtureLabel: "Banner (simulácia výpadku)",
    audit: null,
    isValidating: false,
    displayedScore: 0,
    findingsProgress: null,
    activeAuditTab: "trust",
    selectedFindingId: null,
    sidebarBanner:
      "AI Validácia je dočasne nedostupná. Môžete pokračovať v manuálnej editácii.",
    assistantPriorities: [],
    claimAiProposal: null,
    claimAiProposalLoading: false,
    resolvedClaimDetail: null,
    seoAppliedKeys: [],
    ignoredSeoKeys: [],
    collaborationLocked: false,
    articleUndoDepth: 0,
  }),
};

export function getEditorialCopilotFixture(
  id: EditorialCopilotFixtureId,
): EditorialCopilotPanelViewModel {
  return FIXTURE_BUILDERS[id]();
}

export const EDITORIAL_COPILOT_FIXTURE_IDS = Object.keys(
  FIXTURE_BUILDERS,
) as EditorialCopilotFixtureId[];

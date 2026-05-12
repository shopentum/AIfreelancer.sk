/**
 * Editorial Copilot — pravý panel: kontrakty pre FE blueprint a budúcu extrakciu z EagleCMS.
 * Žiadny fetch ani CMS logika — iba view-model + callbacks pre host.
 */

import type { ArticleAudit, Claim, SeoAuditKey } from "@/eagle_admin/geminiService";

export type CopilotAuditTab = "trust" | "linguistic" | "seo";

/** Identifikátory mock scenárov — jedna story / jedna položka v playground selectore. */
export type EditorialCopilotFixtureId =
  | "empty_before_audit"
  | "validating"
  | "trust_list"
  | "trust_detail_with_proposal"
  | "trust_detail_resolved"
  | "seo_tab_list"
  | "seo_detail_suggestion"
  | "seo_detail_applied"
  | "sidebar_banner_only";

export interface CopilotPriorityRow {
  rowKey: string;
  kind: "block" | "warn" | "opportunity" | "info";
  done: boolean;
  title: string;
  subtitle: string;
}

/** Rekapitulácia vyriešeného nálezu (HITL) zobrazená v detaile. */
export interface ResolvedClaimViewModel {
  claimId: string;
  tab: "trust" | "linguistic";
  reason: string;
  beforeText: string;
  afterText: string;
  actorName: string;
  resolvedAt: number;
}

/**
 * Kompletný vstup pre render pravého panelu (bez routera a bez globálneho CMS stavu).
 * Host (`EagleCMS` alebo budúci kontajner) mapuje skutočný stav na tento model.
 */
export interface EditorialCopilotPanelViewModel {
  /** Popis scenára — len pre demo / Storybook chrome. */
  fixtureLabel?: string;
  audit: ArticleAudit | null;
  isValidating: boolean;
  displayedScore: number;
  findingsProgress: { resolved: number; total: number } | null;
  activeAuditTab: CopilotAuditTab;
  selectedFindingId: string | null;
  sidebarBanner: string | null;
  assistantPriorities: readonly CopilotPriorityRow[];
  claimAiProposal: { claimId: string; proposedText: string } | null;
  claimAiProposalLoading: boolean;
  resolvedClaimDetail: ResolvedClaimViewModel | null;
  seoAppliedKeys: readonly SeoAuditKey[];
  ignoredSeoKeys: readonly SeoAuditKey[];
  collaborationLocked: boolean;
  /** Hĺbka undo zásobníka článku — 0 = tlačidlo undo v blueprinte disabled. */
  articleUndoDepth: number;
}

/**
 * Všetky akcie, ktoré má host napojiť na Core / API / editor.
 * Blueprint ich volá pri kliknutí; v mocku môžu byť `noop` alebo `console.log`.
 */
export interface EditorialCopilotPanelCallbacks {
  onValidate: () => void;
  onSelectFinding: (id: string) => void;
  onClearFindingSelection: () => void;
  onAuditTabChange: (tab: CopilotAuditTab) => void;
  onRequestClaimAiProposal: (claimId: string) => void;
  onApplyClaimAiProposal: (claimId: string) => void;
  onIgnoreClaim: (claimId: string) => void;
  onApplySeoSuggestion: (key: SeoAuditKey) => void;
  onIgnoreSeoSuggestion: (key: SeoAuditKey) => void;
  onPriorityActivate: (rowKey: string) => void;
  onOpenTagsLinksWizard: () => void;
  onUndoArticleSnapshot: () => void;
}

function noop(): void {}

export const noopCopilotCallbacks: EditorialCopilotPanelCallbacks = {
  onValidate: noop,
  onSelectFinding: noop,
  onClearFindingSelection: noop,
  onAuditTabChange: noop,
  onRequestClaimAiProposal: noop,
  onApplyClaimAiProposal: noop,
  onIgnoreClaim: noop,
  onApplySeoSuggestion: noop,
  onIgnoreSeoSuggestion: noop,
  onPriorityActivate: noop,
  onOpenTagsLinksWizard: noop,
  onUndoArticleSnapshot: noop,
};

export function isCopilotSeoKey(id: string | null): id is SeoAuditKey {
  return (
    id === "title" ||
    id === "seoTitle" ||
    id === "url" ||
    id === "perex"
  );
}

export function findClaimById(
  audit: ArticleAudit,
  id: string,
): Claim | undefined {
  return [...audit.claims, ...(audit.linguisticClaims ?? [])].find(
    (c) => c.id === id,
  );
}

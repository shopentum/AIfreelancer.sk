/**
 * Prototype stubs for EAGLE Admin — replace with real API / multi-model routing in production.
 */

export type RiskLevel = "high" | "medium" | "low";

export type Claim = {
  id: string;
  text: string;
  risk: RiskLevel;
  reason: string;
  explanation: string;
  recommendedAction: string;
  startIndex: number;
  endIndex: number;
};

export type SeoAuditField = {
  status: "fail" | "warning" | "pass";
  message: string;
  suggestion?: string;
};

export type ArticleAudit = {
  readinessScore: number;
  seoAudit: {
    title: SeoAuditField;
    seoTitle: SeoAuditField;
    url: SeoAuditField;
    perex: SeoAuditField;
  };
  editorialAudit: {
    tone: string;
    brandAlignment: { status: string; message: string };
    clickbaitScore: number;
    suggestions: string[];
  };
  claims: Claim[];
  linguisticClaims?: Claim[];
};

export type SeoAuditKey = keyof ArticleAudit["seoAudit"];

/** Reserved for future holistic analysis — prototype uses inline mock in UI. */
export async function analyzeArticleHolistic(
  _plainText: string,
): Promise<ArticleAudit> {
  await new Promise((r) => setTimeout(r, 800));
  throw new Error("analyzeArticleHolistic is not wired in the prototype.");
}

/**
 * Simulates targeted LLM rewrite for usability testing (no external API).
 */
export async function fixClaimWithAI(
  claimText: string,
  _fullArticle: string,
): Promise<string> {
  await new Promise((r) => setTimeout(r, 900));
  const trimmed = claimText.trim();
  if (!trimmed) return claimText;
  return `[Upravené — prototyp] ${trimmed}`;
}

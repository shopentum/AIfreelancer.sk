/** Canonical site origin, no trailing slash. Override with NEXT_PUBLIC_SITE_URL on deploy. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://aifreelancer.sk";
  return raw.replace(/\/$/, "");
}

export const siteUrl = getSiteUrl();

export const siteName = "aifreelancer.sk";

/** Legal / branding name for structured data */
export const businessLegalName = "aifreelancer.sk — Daniel Budziňák";

export const founderName = "Mgr. Daniel Budziňák";

export const founderEmail = "daniel.budzinak@gmail.com";

export const defaultTitle = "aifreelancer.sk · Decision Intelligence";

/** Homepage `<title>` — brand + intent + GEO */
export const homePageTitle = "AI vývojár Slovensko · Cursor AI development | aifreelancer.sk";

/**
 * GEO + služby pre meta description a JSON-LD (Slovensko, región, špecializácia).
 * Obsahuje kľúčové slová prirodzene v texte.
 */
export const seoDescription =
  "Externý AI vývojár a technologický partner pre firmy na Slovensku — Bratislava, celá SR aj remote v EÚ. Špecializácia: AI development s využitím Cursor editora, Next.js, rozhodovacie systémy a automatizácie. Decision Intelligence, produkčný kód bez zbytočných prototypov. Mgr. Daniel Budziňák — aifreelancer.sk.";

/** Kratší variant pre OG/Twitter ak by bol dlhý text problematický (voliteľné) */
export const defaultDescription = seoDescription;

/** Špecializácia — jedna jasná veta pre schema + konzistentné použitie */
export const specialization =
  "AI development s využitím Cursor editora";

/** Shorter line for generated OG image layout */
export const ogImageTagline =
  "AI development s Cursor · Slovensko & remote — Decision Intelligence";

export const seoKeywords = [
  "AI vývojár Slovensko",
  "freelance AI development Slovensko",
  "Cursor editor AI development",
  "externý developer Slovensko",
  "Bratislava AI konzultant",
  "Next.js vývojár Slovensko",
  "decision intelligence",
  "AI automatizácia firmy",
  "technologický partner Slovensko",
  "Shopentum",
  "aifreelancer.sk",
  "Daniel Budziňák",
] as const;

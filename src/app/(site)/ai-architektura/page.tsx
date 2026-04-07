import type { Metadata } from "next";
import AIArchitecture from "@/components/AIArchitecture";
import { siteName, siteUrl } from "@/lib/site";

const path = "/ai-architektura";

export const metadata: Metadata = {
  title: "Enterprise AI architektúra | Decision Intelligence | Slovensko · aifreelancer.sk",
  description:
    "Governance, audit trail a riadené AI workflowy: návrh Intelligence Engine pre firmy na Slovensku. Bezpečnosť, multi-tenant identita, nie len prompty.",
  alternates: { canonical: `${siteUrl}${path}` },
  openGraph: {
    title: `Enterprise AI architektúra | ${siteName}`,
    description:
      "Od chaosu k riadenému výkonu — decision intelligence, governance vrstva a architektúra pod kontrolou.",
    url: `${siteUrl}${path}`,
    siteName,
  },
  twitter: {
    title: "Enterprise AI architektúra | aifreelancer.sk",
    description: "Decision Intelligence a governance pre váš biznis — Slovensko.",
  },
  keywords: [
    "AI architektúra Slovensko",
    "decision intelligence",
    "enterprise AI governance",
    "auditovateľné AI",
  ],
};

export default function AIArchitecturePage() {
  return <AIArchitecture />;
}

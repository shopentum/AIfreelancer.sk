import type { Metadata } from "next";
import Agency from "@/components/Agency";
import { siteName, siteUrl } from "@/lib/site";

const path = "/agency";

export const metadata: Metadata = {
  title: "AI Agency & externý vývoj | Partner pre štúdiá | Slovensko",
  description:
    "Externý AI engine pre agentúry a tímy na Slovensku: AI-native architektúra, frontend, backend a workflowy. Produkčný kód, nie prototyp — Bratislava, celá SR, remote.",
  alternates: { canonical: `${siteUrl}${path}` },
  openGraph: {
    title: "AI Agency & externý vývoj | aifreelancer.sk",
    description:
      "Technologický partner pre agentúry: AI development s Cursor, rýchle dodanie, decision-ready systémy. Firmy v SR a EÚ.",
    url: `${siteUrl}${path}`,
    siteName,
  },
  twitter: {
    title: "AI Agency & externý vývoj | aifreelancer.sk",
    description:
      "Externý AI vývoj pre agentúry na Slovensku — architektúra, dodanie, škálovanie.",
  },
  keywords: [
    "AI agency Slovensko",
    "externý vývojár agentúra",
    "Cursor development partner",
    "Bratislava AI vývoj",
  ],
};

export default function AgencyPage() {
  return <Agency />;
}

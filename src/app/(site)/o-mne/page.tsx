import type { Metadata } from "next";
import AboutMe from "@/components/AboutMe";
import { founderName, siteName, siteUrl } from "@/lib/site";

const path = "/o-mne";

export const metadata: Metadata = {
  title: "O mne | Mgr. Daniel Budziňák · AI & produkt | Slovensko",
  description:
    `${founderName} — produktový a projektový manažér prepájajúci biznis a AI. Shopentum, AI workflowy, technologický stack a skúsenosti z celého Slovenska a remote projektov.`,
  alternates: { canonical: `${siteUrl}${path}` },
  openGraph: {
    title: `O mne | ${founderName} | aifreelancer.sk`,
    description:
      "Profil AI architekta a konzultanta — filozofia, stack, časová os, referencie. Slovensko.",
    url: `${siteUrl}${path}`,
    siteName,
  },
  twitter: {
    title: `O mne | ${founderName}`,
    description: "AI, produkt a systémy — profil pre firmy na Slovensku.",
  },
  keywords: [
    "Daniel Budziňák AI",
    "AI product owner Slovensko",
    "Shopentum architekt",
    "freelance PM Slovensko",
  ],
};

export default function AboutPage() {
  return <AboutMe />;
}

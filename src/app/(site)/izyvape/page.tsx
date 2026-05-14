import type { Metadata } from "next";
import IzyvapeMvpLanding from "@/components/IzyvapeMvpLanding";
import { siteName, siteUrl } from "@/lib/site";

const path = "/izyvape";

export const metadata: Metadata = {
  title: "IZYVAPE · Stock Decision Support MVP | Decision Intelligence",
  description:
    "Návrh praktickej decision vrstvy nad skladom a dostupnosťou pre ecommerce (WooCommerce, Money S, Metorik). Operational clarity namiesto AI demo – Stock Decision Support Layer.",
  alternates: { canonical: `${siteUrl}${path}` },
  openGraph: {
    title: "IZYVAPE · Stock Decision Support Layer (MVP) | aifreelancer.sk",
    description:
      "MVP pre CEO: prioritizované rozhodnutia okolo zásob, denný snapshot, human-in-the-loop. Technický a predajný framing.",
    url: `${siteUrl}${path}`,
    siteName,
  },
  twitter: {
    title: "IZYVAPE · Stock Decision Support MVP | aifreelancer.sk",
    description:
      "Decision support pre sklad a dostupnosť – nie ďalší dashboard. Architektúra, tri core flow, governance.",
  },
  keywords: [
    "decision intelligence ecommerce",
    "stock decision support",
    "WooCommerce inventory intelligence",
    "operational clarity MVP",
    "IZYVAPE",
  ],
};

export default function IzyvapeMvpPage() {
  return <IzyvapeMvpLanding />;
}

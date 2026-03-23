import type { Metadata } from "next";
import ShopentumUseCase from "@/components/ShopentumUseCase";
import { siteName, siteUrl } from "@/lib/site";

const path = "/use-case/shopentum";

export const metadata: Metadata = {
  title: "Shopentum Case Study | Decision Intelligence System | SR",
  description:
    "Use case Shopentum: decision intelligence pre e-shopy na Slovensku — prepojenie dát, jasné rozhodnutia, architektúra novej generácie. AI-native vývoj a škálovateľnosť.",
  alternates: { canonical: `${siteUrl}${path}` },
  openGraph: {
    title: "Shopentum | Decision Intelligence | aifreelancer.sk",
    description:
      "Ako Shopentum prepája marketingové a technické dáta na rozhodnutia — case study pre firmy v SR.",
    url: `${siteUrl}${path}`,
    siteName,
  },
  twitter: {
    title: "Shopentum Decision Intelligence — case study",
    description: "Decision Intelligence System — referenčný projekt zo Slovenska.",
  },
  keywords: [
    "Shopentum",
    "decision intelligence e-shop",
    "case study AI Slovensko",
    "marketing dáta e-commerce SR",
  ],
};

export default function ShopentumCasePage() {
  return <ShopentumUseCase />;
}

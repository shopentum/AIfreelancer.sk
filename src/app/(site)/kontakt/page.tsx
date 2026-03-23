import type { Metadata } from "next";
import Contact from "@/components/Contact";
import { siteName, siteUrl } from "@/lib/site";

const path = "/kontakt";

export const metadata: Metadata = {
  title: "Kontakt | AI Konzultácie a Vývoj Bratislava",
  description:
    "Kontaktujte AI konzultanta a vývojára v Bratislave a na celom Slovensku — dopyt na projekt, konzultáciu alebo decision intelligence riešenia. Email, telefón, formulár.",
  alternates: { canonical: `${siteUrl}${path}` },
  openGraph: {
    title: "Kontakt | AI konzultácie a vývoj | aifreelancer.sk",
    description:
      "Spojte sa ohľadom AI vývoja, Cursor workflowov a konzultácií — Bratislava, SR, remote.",
    url: `${siteUrl}${path}`,
    siteName,
  },
  twitter: {
    title: "Kontakt | AI konzultácie Bratislava",
    description: "Dopyt na AI vývoj a konzultácie — Slovensko, Bratislava.",
  },
  keywords: [
    "kontakt AI vývojár Bratislava",
    "AI konzultácie Slovensko",
    "freelance developer kontakt SR",
    "decision intelligence konzultácia",
  ],
};

export default function ContactPage() {
  return <Contact />;
}

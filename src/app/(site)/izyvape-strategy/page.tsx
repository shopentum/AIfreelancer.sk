import type { Metadata } from "next";
import IzyvapeStrategyLanding from "@/components/IzyvapeStrategyLanding";
import { siteName, siteUrl } from "@/lib/site";

const path = "/izyvape-strategy";

export const metadata: Metadata = {
  title: "IZYVAPE · Stratégia rozšírenia decision vrstvy | MPV2",
  description:
    "Šesť smerov rozšírenia po Stock Decision Support: commerce, B2B kanály, profitabilita, digesty, publishing assistance a predikcia. Prezentácia pre vedenie.",
  alternates: { canonical: `${siteUrl}${path}` },
  openGraph: {
    title: "IZYVAPE · Stratégia decision vrstvy (MPV2) | aifreelancer.sk",
    description:
      "Šesť vrstiev operational intelligence nad spoločným dátovým základom – nie AI feature roadmap.",
    url: `${siteUrl}${path}`,
    siteName,
  },
  twitter: {
    title: "IZYVAPE · Stratégia rozšírenia | aifreelancer.sk",
    description: "Commerce, B2B, profitabilita, digesty, publishing, predikcia – postupný decision systém.",
  },
  keywords: [
    "decision intelligence roadmap",
    "IZYVAPE strategy",
    "omnichannel retail intelligence",
    "operational decision system",
  ],
};

export default function IzyvapeStrategyPage() {
  return <IzyvapeStrategyLanding />;
}

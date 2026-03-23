import type { Metadata } from "next";
import GDPR from "@/components/GDPR";
import { siteName, siteUrl } from "@/lib/site";

const path = "/gdpr";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov (GDPR)",
  description:
    "Zásady spracovania osobných údajov podľa GDPR pre návštevníkov a klientov aifreelancer.sk na Slovensku a v EÚ.",
  alternates: { canonical: `${siteUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "GDPR | aifreelancer.sk",
    description: "Informácie o ochrane osobných údajov.",
    url: `${siteUrl}${path}`,
    siteName,
  },
};

export default function GDPRPage() {
  return <GDPR />;
}

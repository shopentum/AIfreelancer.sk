import type { Metadata } from "next";
import Cookies from "@/components/Cookies";
import { siteName, siteUrl } from "@/lib/site";

const path = "/cookies";

export const metadata: Metadata = {
  title: "Zásady cookies",
  description:
    "Informácie o používaní cookies na aifreelancer.sk — transparentné pravidlá pre návštevníkov zo Slovenska a EÚ.",
  alternates: { canonical: `${siteUrl}${path}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Zásady cookies | aifreelancer.sk",
    description: "Ako používame cookies na tom webe.",
    url: `${siteUrl}${path}`,
    siteName,
  },
};

export default function CookiesPage() {
  return <Cookies />;
}

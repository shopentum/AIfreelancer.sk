import type { Metadata } from "next";
import AIStudio from "@/components/AIStudio";
import {
  homePageTitle,
  seoDescription,
  siteName,
  siteUrl,
  specialization,
} from "@/lib/site";

export const metadata: Metadata = {
  title: homePageTitle,
  description: seoDescription,
  alternates: {
    canonical: siteUrl,
    languages: {
      sk: siteUrl,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    title: homePageTitle,
    description: seoDescription,
    url: siteUrl,
    siteName,
  },
  twitter: {
    title: homePageTitle,
    description: seoDescription,
  },
  keywords: [
    "AI development Cursor",
    "Cursor AI Slovensko",
    "freelance developer Slovakia",
    specialization,
    "Decision Intelligence Slovensko",
  ],
};

export default function HomePage() {
  return <AIStudio />;
}

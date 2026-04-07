import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const paths: MetadataRoute.Sitemap = [
  { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { url: `${siteUrl}/agency`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${siteUrl}/ai-architektura`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
  { url: `${siteUrl}/use-case/shopentum`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${siteUrl}/o-mne`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${siteUrl}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
  { url: `${siteUrl}/cookies`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${siteUrl}/gdpr`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths;
}

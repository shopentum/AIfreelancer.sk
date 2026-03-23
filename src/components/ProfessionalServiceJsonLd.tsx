import {
  businessLegalName,
  founderEmail,
  founderName,
  seoDescription,
  siteName,
  siteUrl,
  specialization,
} from "@/lib/site";

/** Schema.org ProfessionalService — pôsobenie na Slovensku + špecializácia (Cursor AI development). */
export function ProfessionalServiceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: businessLegalName,
    alternateName: siteName,
    url: siteUrl,
    description: seoDescription,
    image: `${siteUrl}/opengraph-image`,
    areaServed: [
      {
        "@type": "Country",
        name: "Slovakia",
        alternateName: "Slovensko",
      },
      {
        "@type": "AdministrativeArea",
        name: "Bratislavský kraj",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "SK",
    },
    availableLanguage: ["Slovak", "English"],
    knowsAbout: [
      specialization,
      "Decision Intelligence",
      "Next.js",
      "AI workflow automation",
      "Product architecture",
    ],
    serviceType: specialization,
    founder: {
      "@type": "Person",
      name: founderName,
      email: founderEmail,
      jobTitle: "AI vývojár a systémový architekt",
      areaServed: "Slovensko",
    },
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

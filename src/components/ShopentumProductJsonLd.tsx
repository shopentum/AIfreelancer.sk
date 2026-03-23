import { siteName, siteUrl } from "@/lib/site";

/**
 * Product JSON-LD for Search Console:
 * includes Merchant Listing & Product Snippet recommended fields.
 */
export function ShopentumProductJsonLd() {
  const productUrl = `${siteUrl}/use-case/shopentum`;

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Shopentum Decision Intelligence System",
    description:
      "AI-native decision intelligence system pre e-commerce: prepája marketingové a technické dáta, identifikuje bariéry rastu a generuje odporúčania v reálnom čase.",
    category: "SoftwareApplication",
    image: `${siteUrl}/opengraph-image`,
    brand: {
      "@type": "Brand",
      name: siteName,
    },
    sku: "shopentum-decision-intelligence",
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EUR",
      price: "0.00",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "SK",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "SK",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 2,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Organization",
          name: "Shopentum",
        },
        reviewBody:
          "Implementácia decision intelligence systému výrazne zrýchlila rozhodovanie a zlepšila prehľad nad výkonom marketingu a e-commerce procesov.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}


"use client";

import { usePathname } from "next/navigation";

export default function StructuredData() {
  const pathname = usePathname();
  
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "G3 CrossFit Berlin",
    "description": "Dein CrossFit Gym im Herzen Berlins. Familiäre Atmosphäre, zertifizierte Coaches, alle Fitnesslevel.",
    "url": "https://www.g3crossfit.de",
    "logo": "https://www.g3crossfit.de/logo.png",
    "image": "https://www.g3crossfit.de/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Musterstraße 123",
      "addressLocality": "Berlin",
      "postalCode": "10115",
      "addressCountry": "DE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.5200",
      "longitude": "13.4050"
    },
    "telephone": "+493012345678",
    "email": "info@g3crossfit.de",
    "priceRange": "€€",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "06:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday", "Sunday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "200"
    }
  };

  // Page-specific structured data
  let pageSpecificData = null;

  if (pathname === "/") {
    pageSpecificData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "G3 CrossFit Berlin",
      "url": "https://www.g3crossfit.de",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.g3crossfit.de/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };
  } else if (pathname === "/training") {
    pageSpecificData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Fitness Training",
      "provider": {
        "@type": "SportsActivityLocation",
        "name": "G3 CrossFit Berlin"
      },
      "areaServed": {
        "@type": "City",
        "name": "Berlin"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }
    };
  } else if (pathname === "/coaches") {
    pageSpecificData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "Person",
          "name": "Dave",
          "jobTitle": "Head Coach & Gründer",
          "worksFor": {
            "@type": "SportsActivityLocation",
            "name": "G3 CrossFit Berlin"
          }
        },
        {
          "@type": "Person",
          "name": "Flo",
          "jobTitle": "Olympic Weightlifting Coach",
          "worksFor": {
            "@type": "SportsActivityLocation",
            "name": "G3 CrossFit Berlin"
          }
        }
      ]
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(baseStructuredData),
        }}
      />
      {pageSpecificData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pageSpecificData),
          }}
        />
      )}
    </>
  );
}


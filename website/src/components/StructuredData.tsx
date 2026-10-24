import { serializeJsonLd } from "@/lib/serialize-json-ld";
import { site } from "@/lib/site";
export default function StructuredData() {
  const data = {
    "@context": "https://schema.org", "@type": "SportsActivityLocation", name: site.name,
    url: site.url, logo: `${site.url}/logo.png`, image: `${site.url}/images/g3-team.jpg`,
    description: "CrossFit am Gleisdreieck in Berlin, nahe Potsdamer Platz.",
    address: { "@type": "PostalAddress", streetAddress: site.street, postalCode: site.postalCode, addressLocality: site.city, addressCountry: "DE" },
    telephone: site.phoneHref.slice(4), email: site.email, hasMap: site.mapsUrl,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}

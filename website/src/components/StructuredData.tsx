import { studio } from '@/lib/studio';

export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: studio.name,
    description: 'CrossFit in kleinen Gruppen mit persönlichem Coaching am Berliner Gleisdreieck.',
    url: studio.url,
    logo: `${studio.url}/wp-content/uploads/2015/07/cropped-G3-logo1-e1436209495409.png`,
    address: { '@type': 'PostalAddress', streetAddress: studio.street, addressLocality: studio.city, postalCode: studio.postcode, addressCountry: 'DE' },
    telephone: studio.phoneHref.replace('tel:', ''),
    email: studio.email,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

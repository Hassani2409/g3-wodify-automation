# G3 premium website

Approved direction: retain the existing Next.js website and Python backend, replace the public homepage visual identity and simplify shared navigation. Do not replace the repository with a separate static site.

Audience: prospective G3 members in Berlin, including first-time CrossFit visitors. Primary action: request a free personal trial via the existing /contact#booking form. A request is not a confirmed booking.

Design: green G3 identity, near-black surfaces, large locally hosted condensed headings, real existing G3 photographs. Editorial sports composition with intentional shutter image entrance, restrained scroll reveals, reduced-motion alternatives and mobile-specific layout.

Scope: homepage, header/footer, truthful structured data/metadata, verified public contact details, request confirmation language. Preserve routes, backend interfaces and auth provider. Do not expose unverified course capacity, testimonials, discounts, review scores or urgency. Website content source: g3crossfit.com, retrieved 2026-10-24. Image/team freshness and tariffs require owner confirmation before public cutover.

Approaches: a new standalone site would duplicate the existing lead integration; a superficial restyle would preserve a crowded unsubstantiated pitch. Selected: substantial visual redesign inside website/ with existing component/library infrastructure.

Verification: baseline TypeScript check, full Next production build, request/error behavior checks, browser desktop/mobile QA where infrastructure supports it. Keep production domain and automation credentials unchanged. Work in feat/g3-premium-website; no merge or production domain cutover.

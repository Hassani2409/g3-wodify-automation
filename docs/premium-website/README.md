# G3 Premium website — review version

First iteration in the existing Next.js application: new homepage, shared header/footer and contact page. Python automation backend unchanged; no production deployment or main-branch merge.

## Design
Forest green, warm paper and lime; locally hosted Manrope and Barlow Condensed; studio photography; training/tariff selectors; native FAQ; reduced-motion support. The primary action requests a trial; it never confirms an appointment automatically.

## Validation
Node acceptance tests: 2 passed. Changed TSX files: ESLint passed. TypeScript and production build passed. Browser: desktop and mobile iframe widths 390/320; menu, Escape, training selection, student pricing and missing-API error checked. Narrow headline/header adjusted after inspection. No real leads or Wodify requests sent.

Build emits a baseline-browser-mapping freshness warning. One run also printed location-is-not-defined messages during prerender while still exiting successfully; final log retained at /tmp/g3-final-build.log for session inspection.

## Before public launch
Configure NEXT_PUBLIC_API_URL and test the complete request flow on a test backend. Owner must confirm prices, coaching team, photographs and studio facts. Existing secondary pages, including legal texts, shop and schedules, need separate review. They were not redesigned in this iteration.

## Content provenance
Facts and tariff model: g3crossfit.com. Owner freshness approval outstanding. Studio photos reused for the authorized redesign:
- team.jpg: https://g3crossfit.com/wp-content/uploads/2021/09/DSC02364-2-1536x1036.jpg
- training.jpg: https://g3crossfit.com/wp-content/uploads/2021/09/DSC03430.jpg
- community.jpg: https://g3crossfit.com/wp-content/uploads/2021/12/DSC01859-2-scaled.jpg
- coach.jpg: https://g3crossfit.com/wp-content/uploads/2021/10/g3crossfit-trainer-zeno-behm-819x1024.jpg

Google Fonts Barlow Condensed/Manrope under SIL OFL; licenses accompany local font files. Existing logo retained. No fabricated reviews, ratings or scarcity rendered on the new homepage.

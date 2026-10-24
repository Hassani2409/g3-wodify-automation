# G3 refinement review — 2026-10-24

## Before
Original source commit df2c79b19298fac85a838a251ea48df642c14537. Browser inspection: enormous repeated logo, decorated green gradient, urgency pill, review/count strips, repeated icon cards, invented testimonials/profiles. In the first screen the actual proposition arrived late. Fonts depended on Google network requests and could fail during preview loading.

## Argument and proof
- Personal first visit: contact request with explicit appointment follow-up.
- Coaching in a small group: public studio description, max eight.
- Training choices: CrossFit, weightlifting, personal training and mobility.
- A real Berlin box: actual address and site photography.
- Membership choice: published rates, explicit duration and student selection.

## After and review
The original identity is retained. Familiar navigation, orange action, centered headline; the logo is in the masthead rather than occupying most of the first screen. Three unique studio photos replace stock testimonials and mock coaches. Distinct section arrangements replace card repetition. No invented individual qualifications.

Taste direction editorial-report, seed 1026592505, adapted to the user's explicit existing-layout preference. Impeccable detector: no findings. Taste source lint: no failures/warnings after removing unnecessary menu shadow. Automated browser inspector is not used because the supported browser-control path is the cloud browser; manual browser measurements/screenshots substitute and must not be presented as an automated inspector pass.

Visual critique: clear first-screen title/action, consistent margins, stable image geometry. This is a professional refinement rather than a uniquely novel concept. Three unique photos and a repeated team image limit visual variety; contemporary owner-supplied photography is the most useful next improvement. Provisional design 6.5, usability 8, creativity 6, content 7.5 (self-assessment, not external certification).

## Validation and boundaries
Changed TSX: targeted ESLint, TypeScript and full production build. Two Node tests verify strict lead acceptance. Production build exits successfully but existing dashboard prerender emits location-is-not-defined messages; this separate portal issue remains before public release. No backend credentials changed, no real leads submitted, no payment executed.

Existing registration/shop/portal/legacy legal content is not certified by these frontend checks. Current legal text, photos/team membership and prices require owner approval. Missing NEXT_PUBLIC_API_URL must show an error with direct contact alternatives rather than false acceptance.

## Asset provenance
Photos are reused from g3crossfit.com for the authorized redesign:
- team.jpg: /wp-content/uploads/2021/09/DSC02364-2-1536x1036.jpg
- training.jpg: /wp-content/uploads/2021/09/DSC03430.jpg
- community.jpg: /wp-content/uploads/2021/12/DSC01859-2-scaled.jpg

Existing logo retained. Fonts: Google Fonts Barlow Condensed and Open Sans, SIL OFL; license files stored with fonts. No generated photography.

Manual browser results: desktop 1363px, tablet fixture 768px and phone fixtures 390/320px inspected. No horizontal overflow measured. Menu opens and Escape closes; student/6-month/Unlimited selection correctly shows 130 EUR monthly. Missing-API submit shows the honest error and retains inputs. At 320px the hero first line initially wrapped; corrected with a 40px narrow-screen heading. Contact consent wrapping corrected after inspection.

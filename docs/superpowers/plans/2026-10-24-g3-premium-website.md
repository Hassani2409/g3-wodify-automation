# G3 Premium Website Implementation Plan

Goal: a distinctive animated G3 homepage inside the existing application.
Architecture: retain Next.js routes and backend; isolate new homepage styles, simplify shared chrome, centralize confirmed studio facts.
Tech stack: Next.js, TypeScript, CSS modules, Framer Motion and existing Lucide icons.
Spec: docs/superpowers/specs/2026-10-24-g3-premium-design.md

## Constraints
No invented reviews, scarcity, capacity or membership counts. No claimed automatic booking. No backend schema or credentials changes. Preserve existing form endpoint. Respect reduced motion and keyboard navigation.

## Tasks
- [x] Capture baseline type check and install existing locked dependencies.
- [x] Create shared confirmed studio data; replace metadata/structured-data placeholders.
- [x] Replace homepage with photographic hero, training explorer, team, trial sequence, tariff explorer, FAQ and location/action section.
- [x] Simplify header/footer; preserve routes; remove floating assistant chrome from marketing layout.
- [x] Correct request-success copy/contact data without changing API contract.
- [x] Run type check and production build; inspect desktop/mobile and interaction states; commit and push review branch.

## Review focus
Mobile menu dismissal and focus; reduced-motion content visibility; tariff selection labels; anchors and links; API failure versus accepted request versus confirmed appointment. Existing mocked routes remain outside homepage navigation.

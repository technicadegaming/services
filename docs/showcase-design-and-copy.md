# Technicade showcase design and copy standard

Status: initial implementation in `index.html`, `products.html` and `showcase.css` (October 12, 2026).

## Creative direction
Match the approved mockup's premium dark-navy, purple-to-teal aesthetic without sacrificing readable content or the genuine value of existing products. Design for real customers, not visual decoration alone. Use clear product names, current features, honest limitations, and direct links to the live products.

## Homepage structure
1. **Hero:** "Practical tools. Real-world fixes." with supporting promise: "Software, repairs, custom parts, and operational tools built to solve everyday problems and make the work easier to manage."
2. **Key categories:** arcade repair and maintenance; custom software and tools; 3D printing/replacement parts; operational documents.
3. **Primary action:** Explore software. **Secondary actions:** See services; Get a quote. Keep the existing `#quote` form and all privacy / policy links.
4. **Device/window illustrations:** a larger arcade-services view plus small DoneDate and ExceptionDesk task lists. These are deliberately labelled illustrative, NOT actual production account screenshots.
5. **Featured work:** six clickable cards—Arcade Repair & Custom Games, 3D Printing & Custom Parts, Digital Documents & Tools, DoneDate, EquipmentQR, ExceptionDesk. Do not claim unverified customers, project outcomes or revenue.
6. **Confidence strip:** hands-on experience, practical workflows, custom requests welcome, based in Wausau WI.
7. **Software follow-up:** one focused link to software comparison rather than duplicating all six featured-work cards. ProjectUnstuck and FEC Digital Store remain discoverable via existing bands.
8. Preserve all service pricing/individual request paths below and the existing Web3Forms form.

## Software catalog structure
1. Outcome-led hero: "Less chasing details. More getting things done."
2. Small illustrative EquipmentQR window, explicitly labelled.
3. Real-use-case navigation: recurring work / asset history / shift handoffs.
4. Cards for DoneDate, EquipmentQR, ShiftCheck and ExceptionDesk with clear, compact interface illustrations based on product workflows; never represent invented example rows as live data.
5. ProjectUnstuck remains a separate free planner; FEC digital documents remain below software apps. Keep real product pricing, status and payment information on each app's own site.
6. End with an open-ended custom-request CTA.

## Fidelity and assets
- **Current visual previews are original HTML/CSS illustrations, not captured app screenshots.** This avoids inaccurate or stale screenshots and private client data.
- Future asset upgrade: capture **public landing pages and sanitized demo workspaces** of DoneDate, EquipmentQR and ExceptionDesk at desktop and mobile widths. Strip email addresses and customer records, and publish optimized WebP/AVIF screenshots with width/height, lazy loading, descriptive alt text, and correct product ownership.
- Never publish screenshots of real user records or login sessions. Never show fabricated reviews, false scarcity, misleading live numbers or scannable-looking QR codes that link nowhere.

## UI QA and acceptance
- Keep WCAG-friendly focus outlines, color contrast and functional keyboard navigation.
- Check 375px, 768px, 1024px, 1440px and 200% browser zoom; break device clusters into a readable single column on mobile.
- Check light/dark preference for basic page navigation, buttons, pricing copy and form contrast.
- Ensure `prefers-reduced-motion` disables hover movement transitions.
- Verify all six featured links, the three hero buttons, software grid, Digital Store, ProjectUnstuck, and the quote form/terms remain intact.
- Run GitHub Static Site Quality CI; test **published GitHub Pages** separately because the Technicade Vercel Services portal is a different Next.js site.
- Later use privacy-conscious analytics for views → software clicks → lead inquiries rather than designing artificial purchase pressure.

## Reference
This design is based on the user's approved Technicade neon landing-page mockup and the walkthrough review logged in Services Issue #30. The implementation intentionally recreates the **look** rather than inserting a single inaccessible full-page promotional picture.

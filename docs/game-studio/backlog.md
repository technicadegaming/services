# Technicade Game Studio backlog
## P0 — Verify the real deployment
- [ ] Verify technicade.tech/arcade-empire.html responds 200 publicly, and inspect Pages deployment settings. Earlier user reported 404.
- [ ] Confirm labs.html links all playable games; investigate broken links and sitemap.
- [ ] Establish real browser smoke tests on desktop and mobile, not merely Vercel service portal readiness.

## P1 — Arcade Empire pilot
- [x] Local simulation: repair, salvage auction, upgrades, daily revenue, milestones, local autosave.
- [ ] Gameplay QA: test cash accounting, capacity, offline saves and event integrity.
- [ ] Improve game economy and long-term goals; add daily customer events and meaningful decisions.
- [ ] Introduce save migration and player-facing export/import.
- [ ] Add visual arcade floor and animated customer interactions.
- [ ] Create Supabase server-authoritative action endpoints and authentication; database schema is a proposal, not applied.
- [ ] Balance early-game earn/repair costs, test across 30+ simulated days.
- [ ] Protect player save data and implement clear account deletion/export.
- [ ] Cosmetics-only Stripe test checkout and verified idempotent webhooks, owner approval required.

## P2 — Game Studio agent
- [x] Agent instructions and game registry.
- [x] Draft branch/PR safety process.
- [ ] Set up PR-only CI game checks and preview URL verification.
- [ ] Choose a controlled coding-agent runtime and budget; configure least-privilege GitHub credentials.
- [ ] Set up optional scheduled worker after owner approval.
- [ ] Create a private admin dashboard for game/backlog/activity/approvals.

### Status definitions
idea → planned → developing → testing → preview-ready → approval → published → improving

### Work authorization
The owner authorizes development and tests on branches, but production publishing and any changes involving payments, account security, or database access need explicit review.

### Arcade Empire pass 1 update (2026-10-14)
- TESTED locally: responsive floor, reachable placement, visitor-driven sales, pricing, last-day cabinet sales, scheduled service, migration/export/import, persistent onboarding milestones and explicit emergency support accounting. See `docs/arcade-empire/development-progress.md` for exact scope and tests.
- PARTIAL: animated visitors, economy balance, comparative analytics, mobile polish and save UX need more work. Physical mobile devices were not tested.
- BLOCKED / unverified: public Pages route and GitHub Pages settings could not be inspected from this environment. No deployment was performed.
- NEXT: comparative analytics, varied 30+ day balance tests and physical-device interaction review.

### Arcade Empire pass 2 update (2026-10-14)
- TESTED locally: seven-day cabinet comparison backed by a bounded 14-day save history; technician shifts can be paused to avoid wages and wear benefits; scheduled service respects mandatory daily expenses. The VIP Prize Counter has game-cash stock packs, completed-play tickets, bounded redemption and an estimated after-stock margin.
- TESTED locally: customer satisfaction affects reputation and replay reactions; visual replay shows at most three customers and stops on import/reset. History migration/reload/reconciliation, 35-day fair versus unaffordable pricing and prize inventory, blocked placement feedback and keyboard floor movement, and desktop/portrait/landscape browser emulation with shift and prize flows passed without local page errors. Physical devices remain untested.
- BLOCKED: public `technicade.tech` route and GitHub Pages settings remain unverified because HTTPS and GitHub API access were denied in this runner. No production changes made.
- NEXT: broader economy balance across prize and cabinet strategies, replay pacing and art polish, full keyboard focus review, and real-device review.

### Arcade Empire pass 3 update (2026-10-14)
- TESTED locally: visitor replay samples at most 12 journeys with a finish control; rebuilt cabinet controls retain keyboard focus. Desktop and two touch-emulated viewports passed local browser checks, including reduced motion. Physical devices remain untested.
- TESTED locally: a stocked VIP counter attracts more traffic; only prize fans redeem visitor tickets. The counter's game-cash cost and upkeep were reduced after 40-day comparisons. Three fixed-seed 40-day strategies cover one to three cabinets, unaffordable prices, stock, cash reconciliation and support. Prize counter cash payback remains a balance task.
- BLOCKED / unverified: read-only public game, Labs and GitHub Pages API web requests were inaccessible. No 200/404 or Pages setting was established; no deployment or external-service change occurred.
- NEXT: longer VIP payback tests and cash-flow reporting, then physical-device and accessibility review. Preserve local saves and verify the public route from an owner-accessible network.

### Arcade Empire pass 4 update (2026-10-14)
- TESTED locally: 30-entry cash activity records game-cash purchases, operating net, support and balances without changing the version 2 save key. Older saves gain an empty activity history. The arcade floor now has one Tab stop with arrow navigation.
- TESTED locally: three fixed-seed 90-day comparisons preserve cash, stock and ticket invariants. A stocked VIP counter narrowly exceeds the no-counter cash result with three maintained cabinets by day 90, but trails with two; the upgrade description now advises several healthy cabinets. Desktop and portrait/landscape touch emulation pass browser smoke. Physical devices and screen readers remain untested.
- BLOCKED / unverified: public game/Labs URLs and GitHub Pages API remained inaccessible to read-only web requests, so no live HTTP status or Pages source is known. No commit, PR or deployment was made.
- NEXT: physical-device and screen reader review, plus further human and seeded VIP stocking/cash-flow balance review. Verify the public route from an owner-accessible network.

### Arcade Empire pass 5 update (2026-10-14)
- TESTED locally: seven-day VIP stock use and after-stock operating summary, level 5 plush guidance, save migration of old unknown prize history, and three-viewport browser smoke. A button-size audit found 30–39 px targets; local CSS now enforces 44 px minimum on buttons and floor cells, and all three viewport checks pass. No save key or version change.
- TESTED locally: two additional 90-day stocking cadences at seeds 11 and 29. Buying two packs whenever stock ran low increased gross but produced lower ending cash than stocking every other day in these scenarios; this is a balance finding, not a universal rule.
- BLOCKED / unverified: public game/Labs URLs and GitHub Pages API again inaccessible to read-only web requests. No live route status, physical device, screen reader, commit, PR or deployment verification.
- NEXT: review prize counter economics with human play and broader scenarios; then physical-device and screen reader interaction review. Verify the public route from an owner-accessible network.

### Arcade Empire pass 6 update (2026-10-14)
- TESTED locally: three saved opening plans add a daily operating decision. Extended hours add eight potential visitors for $30 operating; preventive checks reduce base daily cabinet wear for $3 operating. Regular hours preserve prior behavior and old saves default to it. Deterministic accounting, migration, three seeded 35-day plan comparisons and three-viewport local browser smoke pass.
- PARTIAL: the new plans need broader comparative balance and human-play review alongside VIP stocking. Browser evidence uses emulated touch, not physical devices or a screen reader.
- BLOCKED / unverified: read-only public game, Labs and GitHub Pages API requests remained inaccessible. Live HTTP status and Pages source are unknown. No external service, commit, PR or deployment was changed.
- NEXT: compare opening-plan and VIP choices across different cabinet counts and longer play, then test touch and accessibility on physical devices. Obtain public route and Pages evidence from an owner-accessible network.

## P1 next product track — Accounts, identity and ethical optional purchases (2026-10-14)
- [x] Architecture and security planning: `docs/arcade-empire/accounts-and-currency-roadmap.md`.
- [ ] Let player rename arcade location; add editable player display/username preview in local prototype without falsely implying account sync.
- [ ] Deepen staff hiring/shift/wages, machine upgrades, multiple locations and earnable achievements.
- [ ] Supabase Google OAuth, unique user handles, server-authoritative cross-device saves, conflict detection, player export/deletion — requires project credentials and reviewed RLS/migrations.
- [ ] Separate earnable game cash from optional paid Empire Tokens and add user-friendly purchase confirmation and free alternatives.
- [ ] Stripe test-mode token purchases, verified webhooks, idempotent wallet ledger, refunds/restoration, transaction integrity and age/consumer safeguards — design only until approved.
- [ ] Installable PWA phone QA, service worker update strategy and real Android/iOS testing.

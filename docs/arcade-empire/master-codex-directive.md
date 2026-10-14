# Arcade Empire — Master Codex build directive (Technicade Game Studio)
Version: 2026-10-14. This is an implementation brief, not proof that any feature is complete.

## Mission and priority
Continue the EXISTING `arcade-empire.html` in `technicadegaming/services`, using the development branch `game-studio/arcade-empire-pilot`. Read `AGENTS.md`, `docs/game-studio/backlog.md`, `docs/game-studio/registry.json`, `docs/arcade-empire-plan.md`, and existing tests first. Audit current source and preserve working functionality, local browser saves, and original artwork/IP. Do not replace the game with a disconnected demo. Existing reported 404 on technicade.tech is unresolved; distinguish public hosting from services.technicade.tech.

**Product vision:** a distinctive, fun, responsive arcade-business simulation featuring a LIVING ARCADE ECONOMY. Players begin with a tiny venue and damaged machines, repair, buy, price, position, improve and expand; see customers enter and interact; make decisions with consequences; eventually manage redemption, technicians, marketing and multiple locations. Support 3–5 minute returns and 20–40 minute sessions without punitive streaks or coercive waiting. Do not claim originality is proven, retention is guaranteed, or legal clearance performed.

## Implementation sequence — work, test, continue
Phase 0: Document current source, save schema, tests, installed tooling, current status, deployment blockers. Do not merely plan; implement.
Phase 1 (highest priority): Responsive top-down/2.5D arcade floor, owned machine tiles, entrance/exit, machine selection, valid placement and movement, collision/pathway rules, visible health/popularity/status/earnings. Original game art only. Machine placement must influence visibility/visitor routing where feasible.
Phase 2: Animated customers with arrival, pathfinding, queue/wait, play, reaction and exit; preferences, budgets, patience and satisfaction. No walking through machines or walls. Bound visible NPC count and animations; honor reduced motion.
Phase 3: Connect actual successful visitor play transactions to revenue EXACTLY ONCE. No money for mere animation; broken games cannot earn. Prices, demand, reliability, machine wear, upgrades, marketing, reviews, traffic, staffing and satisfaction must genuinely influence one another, not be decorative. Keep daily gross sales, operating costs, net profit and capital purchases distinct. Ensure fair recovery when low on money.
Phase 4: Clear onboarding (inspect machine, repair/position, watch first customer, earn first sale), interactive objectives, unlocks, achievements, arcade identity, better progress and return summaries; avoid needless click repetition.
Phase 5: Add business depth in order of demonstrated value: adjustable play pricing, comparative machine analytics, maintenance scheduling, meaningful staffing and labor costs, ticket-redemption catalog/cost/inventory/restocking/margins, occasional events and optional personalization. Prize tickets must follow verified plays and cannot duplicate or go negative.
Phase 6: Polish desktop mouse/keyboard and mobile touch/pan/placement/zoom; portrait/landscape, focus/contrast, accessibility, performance and sound opt-in. Avoid unnecessary dependencies and mobile keyboard pop-ups.
Phase 7: Prepare multi-location and later attraction architecture (food, bowling, parties, laser tag) without prematurely implementing large unfinished subsystems.
Phase 8: Produce a commercial readiness assessment, analytics and optional monetization design with no real charges.

## Save security and technical correctness
Inspect existing localStorage key, value shape and version before touching persistence. Preserve and test old saves. Use explicit migrations, validation, corrupt-save recovery and user export/import where feasible. Separate simulation state, economy/actions, placement/pathfinding, visual rendering and persistence so frame rate does not change outcomes. Use deterministic seeds or controlled randomness for tests; bound background-tab catchup. Never trust browser-controlled cash or entitlements when designing future cloud saves. Do not introduce secret keys or credentials into source.

## Fair monetization proposal (DESIGN ONLY; suggested prices are unvalidated)
- Base game: Free, fully enjoyable and completable.
- Arcade Style Packs: $1.99–$4.99 for decorations and visual themes.
- Expansion Packs: $4.99–$9.99 for optional additional locations, scenarios and content.
- Supporter Edition: $9.99 for cosmetics and recognition.
No paid random loot boxes, pay-to-win advantages, misleading discounts, forced ads, predatory timers, targeted purchase pressure toward children, or artificial progression pain. Separate game cash from any hypothetical paid currency. Prepare `docs/arcade-empire/monetization-plan.md` identifying proposed SKUs, pricing, entitlements, refund/revocation policy, content restoration, age/privacy/consumer protection considerations and Stripe test integration requirements. **Do not enable or change Stripe production configuration or claim checkout works.**

## External services / permissions
Implement safe LOCAL code and tests autonomously. If Supabase/auth/cloud saves, database migration, Stripe, external API, analytics, hosting, DNS, secret, permissions or paid infrastructure changes become necessary, first write a precise dependency item to `docs/arcade-empire/integration-needs.md`: service/project, exact files/env var NAMES (not values), purpose, read/write scope, cost, security implications, SQL/migration proposal, and whether blocked or optional. Continue independent tasks rather than stopping just to ask. Do not execute migrations or modify remote production systems, payment flows, secrets, live deployments, or unrelated apps. This is approval-first development, not authorization for automatic remote changes. If local temporary mock/stub allows safe progress, use it and label it clearly.

## Originality
Use original fictional arcade games, original graphics/sounds or assets with documented commercial-use licenses. Do not copy existing game's protected expression. Track provenance, attribution and trademark checks in `docs/arcade-empire/originality-and-assets.md`. Candidate fictional names are provisional.

## Tests and acceptance
Expand `scripts/game-studio/check_arcade_empire.py` without weakening the existing deterministic accounting tests. Test creation, save migration/reload/corruption, purchases, insufficient funds, placement/pathfinding/blockage, customer decisions, broken machine behavior, cash accounting and no duplicate revenue, wear/repair, prices, reputation, objectives, simulations over 30+ days, resize, keyboard/touch, and performance if browser tools are available. Run `py -3 scripts/game-studio/check_arcade_empire.py`, `git diff --check`, available browser smoke tests and console checks. Distinguish actual-device tests from emulated ones. Fix failures before reporting done.

## Working contract: keep going
Do not stop after planning or a tiny edit. Build verified, playable vertical slices, fix test failures, then take the NEXT unblocked task while time and Codex allowance remain. Avoid sprawling unverified rewrites. When there are blockers, document them, switch to independent work, and keep momentum. Never claim full completion if acceptance tests, visuals or deployment verification are missing.
After each slice update `docs/arcade-empire/development-progress.md` and the Game Studio backlog with DONE / PARTIAL / BLOCKED / TESTED and remaining work. The final session report must include completed systems, visual and gameplay changes, desktop/mobile evidence, test results, save compatibility, files changed, originality/licensing, external integration needs, known defects, ranked next steps and Git state.
**Do not commit/push/merge/create PR or deploy from the local unattended runner; prepare local changes for the owner to review.**

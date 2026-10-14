# Arcade Empire — Persistence and purchase security plan

Status: browser-playable prototype. GitHub files: `arcade-empire.html`; listing: `labs.html`.
Current saves are browser localStorage, not yet Supabase. No payments are enabled.

## Milestone 1 — Playable loop (implemented)
Salvage auctions, individual machine condition and repairs, parts, game upgrades, daily sales and operating expenses, ads, floor expansion, reputation, goals, local save and reset.

## Milestone 2 — Account-backed persistence (design only)
Use existing Technicade authentication only after checking the correct Supabase project and callback domains. Migrate local save with explicit user confirmation. Create server endpoints for actions: acquire_game, repair_game, upgrade_machine, buy_parts, open_day, buy_upgrade, advertise, expand. Never accept arbitrary client-provided cash/parts/inventory or whole-state overwrites.

Enforce one operation per user per idempotency key, consistent locking (row-level) for each economy action, max input sizes and action rates, authenticated user mapping, and server-generated clock/turn counters. This prevents replay, negative balances, duplicated grants, and client tampering. Provide account export and deletion before real accounts launch.

### Proposed Supabase schema
See `docs/arcade-empire-schema.sql`. Row level security permits users to read only their own rows. State mutations only from trusted server-side handlers or verified SECURITY DEFINER functions. Do not expose service-role credentials in the browser.

## Milestone 3 — Stripe optional cosmetic store (design only)
Products: cabinet skins, decorative wall/floor themes, optional visual effects. Purchases should provide no gameplay advantage. One-time purchases are the preferred initial model; no loot boxes, gambling, timers pressuring purchases, or pay-to-win.

Flow: authenticated player clicks cosmetic SKU -> server verifies SKU from allowlist, creates Checkout session with trusted server-side Stripe price ID and identity binding -> Stripe hosted checkout -> signed webhook verifies event type and paid status -> idempotently records Stripe event and permanent entitlement under the authenticated user ID -> client refreshes entitlement by server request. Never credit purchases based on success redirect, price provided by browser, or unverified webhook data. Refund/dispute procedures must revoke eligible entitlements with audit trail and appropriate customer communication.

Never add Stripe secret keys to GitHub; use Vercel environment variables. Start in Stripe test mode. Confirm business registration/tax/privacy/age policy requirements before monetization.

## Milestone 4 — Quality
Autosave conflict handling, offline recovery, a balanced economic curve, daily return reasons, mobile usability, accessibility, achievements, asset art, analytics without personal tracking by default, smoke tests, and anti-abuse rules.

## Current limitation
Local progress will be lost if browser storage is cleared or another device is used. Do not represent localStorage as cloud persistence.

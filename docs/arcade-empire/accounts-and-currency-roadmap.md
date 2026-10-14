# Arcade Empire accounts, locations, and optional paid acceleration
Status: DESIGN SPECIFICATION. No authentication, purchase, currency entitlement, remote migration, or server backend has been deployed.

## Player journey
1. Free anonymous play immediately; existing local saves remain available. Sign in is optional for the free game.
2. "Save across devices" offers Google Sign-In through Supabase Auth with an OAuth redirect configured for the actual playtest/production origin. Do not pretend sign-in works before configuring the Supabase project and redirect allowlist.
3. First successful sign-in prompts for a unique case-insensitive player handle, display name and optional named arcade location. A player may skip naming and edit later. Reject impersonation/offensive or unsafe names; reserve known brands and admin handles; rate-limit changes.
4. On first sign-in, show an explicit local-save import choice: upload the current browser game as an initial legacy save, keep the existing cloud save, or cancel. Never silently replace either. Legacy locally-controlled balances cannot become a spendable/purchasable currency balance without server-side validation and a migration policy.
5. The player can hire staff (technician, floor attendant, prize clerk, shift supervisor), schedule shifts, pay wages from game cash, upgrade tools, layout and machines, open additional locations, earn achievements and view profile/arcade stats.
6. Signed-in game state syncs across devices with conflict handling and last-known-good backups. Sign-out must not erase saves. Account deletion/export and purchase restoration require explicit flows.

## Gameplay economies
- `game_cash`: EARNED simulation cash for cabinet purchases, wages, parts, repairs, marketing and expansions. Continue letting players progress fully through normal play.
- `empire_tokens`: OPTIONAL real-money purchased currency, never an alias of game cash. Tokens can be used for transparent, capped convenience such as optional renovation acceleration, cosmetic customization or a clearly displayed instant-supply delivery; no exclusive competitive advantage. Some in-game earnable convenience must remain.
- No cash-out, transfer, gambling, user-to-user exchange, randomized paid rewards or obscured exchange rates.
- Clearly display token price, exact balance, exact item benefit, confirmation, refund/chargeback implications, and free alternative. Avoid cooldown pain or slower gameplay engineered to induce purchases.
- If minors may play, review eligibility, purchase limits, consent and applicable policies before permitting charges.

## Backend and threat model
- Supabase Auth: Google provider; PKCE-based web sessions or existing supported auth pattern; protect callback URLs, CSRF/state, account linking, RLS.
- Tables (names provisional): `players` (auth uid, unique canonical username, public display name, preferences, consent/version), `arcade_locations` (owner uid, name, layout, capacity), `game_saves` (version, revision, checksum, data, server timestamp), `staff`, `machines`, `achievements`, `game_wallets`, `wallet_ledger`, `purchases`, `entitlements`, `payment_events`.
- All authoritative game actions handled via authenticated, rate-limited server endpoints / RPC: validate ownership, action preconditions, economy balances, unique idempotency key, optimistic revision and transaction. No client-generated balances, staff, paid currency or achievements accepted as authoritative.
- Wallet ledger is append-only. Charges and rewards are atomic: update wallet and ledger inside one transaction, forbid negative balances and duplicate action IDs; verify reconciliation against purchase events.
- Stripe: server-created allowlisted Checkout sessions or an equivalent compliant purchase flow, verify signature and event type on server; record event IDs once, grant purchased token bundles only after verified payment; handle refund/dispute revocation according to explicit policy; account and purchase restoration.
- Never expose service-role keys or Stripe secrets in browser JS, Git history, or PWA cache. Use separate testing and production environments; secure webhooks and API rate limits.
- Browser PWA offline mode: queue ONLY safe nonfinancial local cosmetic/settings changes where appropriate; never promise offline purchases, spend tokens offline, or count an offline transaction as final. Clearly label when online auth/sync is required.
- Provide data export/deletion, privacy documentation, audit logging without unnecessary personal data, retention policies, and admin recovery controls.

## Suggested milestones
M0 (safe local): account/username/arcade naming UI prototypes, future wallet/shop previews, staff and achievement gameplay using game cash; no live auth/payment claims.
M1 (requires project/config approval): Supabase Google OAuth; player profile with unique username; cloud save conflict/backup; real-device cross-sync tests.
M2 (requires approved backend): authoritative simulation actions, locations, staff, achievements, migrations/RLS, security/invariant tests.
M3 (requires approval): test-mode Stripe token catalog, signed webhooks, idempotent token credit and spends, refunds, restoration, clear pricing/consent, abuse tests.
M4: usability/balance playtests, payment policy and legal review, monitoring and deployment controls before any live payment launch.

## Integration prerequisites / decisions
Identify actual Supabase project and hosting endpoint, Google OAuth consent screen and callback domains, user policy for existing saves, player handle uniqueness policy, account deletion/export procedures, Stripe account and test-mode SKU prices, refund policy, tax/age review and privacy requirements. Build an integration checklist with names/SQL proposals but do not apply migrations or turn on live payments without separate review.

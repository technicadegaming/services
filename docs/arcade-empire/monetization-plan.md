# Arcade Empire monetization proposal — design only

The complete base game should remain free and completable. No checkout, prices, entitlements or paid advantages are enabled in the local prototype. Suggested prices below are unvalidated and need owner, market and policy review.

| Proposed SKU | Suggested price | Entitlement |
| --- | --- | --- |
| Arcade Style Pack | $1.99–$4.99 once | Decorative cabinet, floor and wall themes only. |
| Expansion Pack | $4.99–$9.99 once | Optional location or scenario content; base arcade completion remains free. |
| Supporter Edition | $9.99 once | Cosmetic theme and supporter recognition, with no gameplay benefit. |

Entitlements would bind to an authenticated account, not local cash or a client flag. A server would allowlist SKU/Stripe price IDs, create Checkout, verify signed paid webhooks, and record each event once. The game would restore purchases from server entitlements after sign-in. Refunds and disputes would revoke eligible entitlements with an audit trail and clear customer communication. Account deletion/export and content restoration policy must be specified before launch.

No paid random rewards, power boosts, forced ads, artificial scarcity, misleading discounts, or pressure targeted at children. Review age suitability, privacy notice, tax and consumer protection obligations with qualified owners before any test checkout or release. Actual willingness to pay, margins, support burden and legal clearance remain unverified.

See `integration-needs.md` for test account, secret-name, schema and approval dependencies.

## Additional requested monetization track — optional acceleration
Player also wants the ability to buy premium in-game currency to speed up selected upgrades/unlocks. This is a **new planned option**, not implemented or enabled. Proposed Empire Tokens are distinct from earnable game cash, with clearly disclosed cost and benefit, reasonable limits, and free-play routes. Do not make advancement intentionally painful or sell randomized rewards. Grant and spend purchased tokens only through an authenticated, server-authoritative and audited ledger after a verified test-mode Stripe event; no direct browser-wallet writes. Refund/revocation and cross-device restoration require explicit tests before production. See `accounts-and-currency-roadmap.md`.

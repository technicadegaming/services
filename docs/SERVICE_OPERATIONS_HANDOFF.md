# Technicade Services - Operating Handoff and Launch Checklist

**Updated:** October 11, 2026  
**Owner:** Technicade (sole proprietorship)  
**Goal:** Maintain a low-cost, repeatable workflow for selling technical services without premature infrastructure spending.

## Source of truth and locations

- Public site: https://technicade.tech/ and /services.html
- Service-specific customer policy: https://technicade.tech/service-policy.html
- Terms: /terms.html ; Privacy: /privacy.html
- GitHub repository: `technicadegaming/services` (static web pages + separate dormant portal app)
- Customer intake: existing Web3Forms form on `services.html`, plus email. No live ticket database.
- Separate portal Vercel project: `technicade-service-portal` (root `portal`); deployed app shell, but **NOT an operational intake backend** without database, secrets and tests.
- SaaS products and digital store have their **own** code and production systems; avoid global Stripe changes.

## Live payment products - private/manual distribution

**DO NOT publish links or promise immediate service while remote-support tooling is paused.** Approve scope and scheduling first. Send a link only when the work can be delivered.

| Product | Base USD | Active payment link | Stripe tax category |
| --- | ---: | --- | --- |
| Quick Tech Help - up to 30 minutes | 30 | https://buy.stripe.com/3cI3cvbUG5Zs3vZaZ200003 | Technical Support Services `txcd_20060017` |
| Standard Tech Support - up to 60 minutes | 60 | https://buy.stripe.com/9B69ATgaWevY4A39UY00004 | Technical Support Services `txcd_20060017` |

Features verified through Stripe API: one-time pricing, auto tax enabled, customer billing address required, request-reference field, post-purchase invoice enabled, Managed Payments disabled on these links. The older service payment links were deactivated to prevent untaxed duplicate checkout. Existing SaaS billing and digital-store flows are unaffected.

**Tax caveat:** The owner reports obtaining a Wisconsin Sales and Use Tax number from DOR on October 9, 2026. Stripe account shows an active Wisconsin tax registration and active Stripe Tax settings. This does **not** replace checking seller's permit effective date, taxable scope, reporting requirements, and actual remittance. No actual tax test or full paid checkout test is recorded. Do not set all business products to Technical Support; classify each separately.

## Current email-first service flow

1. Customer submits existing form or email request; collect name, contact, device type, issue, location, and preferred time. Never ask for login passwords or sensitive data through email.
2. Review scope, eligibility, availability, and expected time. Confirm in writing the applicable service tier, work limits, taxes, cancellation/refund policy, and whether remote work is available.
3. Only after acceptance, email correct private Stripe link or a custom Stripe invoice.
4. Verify successful payment within the Stripe dashboard before providing the paid service.
5. For remote assistance, obtain active, explicit customer consent and ensure approved support software is configured and tested first. Avoid unattended access, permanent passwords, and unexpected file transfers.
6. Record service start/end, description of work, customer approval for extra charges, outcome, and receipt/reference in a manual log.
7. Send completion summary and directions for follow-up. Process refunds promptly if unable to perform work, according to service policy and applicable law.

**Suggested manual tracker**: created date, ticket/reference (manual), customer name, email, service, issue summary, quoted amount, Stripe payment reference, paid status, scheduled time, completion, refund and notes. Avoid storing credentials or unnecessary personal data.

## Paused work (do not reactivate without express approval)

### Customer ticket system
- DB SQL migrations: `db/001_service_tickets.sql` and `db/002_intake_rpc.sql`.
- Next.js intake app in `portal/`; see `portal/README.md`.
- Vercel portal deployment exists, but necessary Supabase project, secrets, Turnstile, Upstash and end-to-end tests are missing. Main website remains Web3Forms.
- Owner is at Supabase free plan project limit and chose to avoid upgrade/extra monthly costs.

### Remote assistance
- RustDesk was tested as technician-side configuration but not connection-tested with Android; owner decided against RustDesk for reputation/customer trust concerns.
- Zoho Assist was considered as a possible low-cost replacement; **not set up or tested**.
- Public remote-support page removed in merged PR #12; do not restore customer-facing checkout or support claims until actual software, technician permissions, consent flow and customer testing are complete.

## Completed GitHub PRs

- PR #9: expanded service catalog and initial support page (later hidden)
- PR #10: DB schema for tickets (unapplied)
- PR #11: portal/intake API skeleton (inactive)
- PR #12: hide remote-support page
- PR #13: service policy and catalog links

## Service policy and website guardrails

- `service-policy.html`: fixed session duration, scope approval, customer cancellations/refunds, no guaranteed fix, express remote-access consent, backup/security guidance, contact path.
- `terms.html` and `privacy.html` continue to cover wider Technicade operations. Policy text requires business/legal review, especially consumer rights and actual practices.
- Customer-facing support email is `support@technicade.tech` in the policies; existing service forms and page footer use `technicadegaming@gmail.com`. **Verify forwarding/receiving and standardize** to a monitored address before increased traffic.
- Do not publish a support checkout until a real service-delivery mechanism and schedule exist.
- Avoid changing SaaS/digital store pricing, account tax defaults, subscriptions, webhook settings or deployed infrastructure as a side effect of service work.

## Launch checklist for the next Technicade service

- [ ] Define the exact customer problem, deliverable, eligibility and excluded work
- [ ] Choose service type: fixed-price, diagnostic deposit, or custom quote
- [ ] Price labor/time, transaction fees, refunds and actual delivery capacity
- [ ] Determine sales-tax treatment for the **specific** service, not account default
- [ ] Create specifically named Stripe product, **explicit tax code**, one-time Price and Payment Link; for custom work, use invoice instead
- [ ] Configure billing details, customer reference, completion text and relevant tax
- [ ] Privately test checkout, confirmation, invoice, tax and refund path without accidentally charging a card
- [ ] Confirm public support contact works and policies match the real workflow
- [ ] Update site service description and intake form (only when ready to deliver)
- [ ] Perform a test customer request and fulfillment with documented handoffs
- [ ] Release; track conversion, issues, refunds and time spent before expanding

## Priorities

1. Keep existing Technicade service requests and payments operational with minimal expense.
2. Finish quick checkout/contact/tax validation before advertising paid support.
3. Focus revenue efforts on current SaaS products/digital store; do not start additional infrastructure.
4. Revisit remote software only when ready for hands-on customer delivery.
5. Revisit ticket database after sufficient volume justifies cost and maintenance.

## Reusable next-chat prompt

> Continue Technicade from `technicadegaming/services`, using `docs/SERVICE_OPERATIONS_HANDOFF.md` as the operating source of truth. Keep the ticket system and remote-support rollout paused. Do not alter current SaaS or digital-store payment settings. First verify production behavior and list remaining launch blockers; then implement one small, reviewable GitHub PR at a time. Prioritize low-cost, revenue-producing improvements and provide exact manual instructions only when necessary.

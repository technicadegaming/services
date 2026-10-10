# Technicade service ticket backend: rollout

The public website in this repository is static and submits service requests to Web3Forms today. This PR adds a secure database **schema only**, not a functioning API or admin dashboard. Keep the current quote form until its replacement is tested.

## Setup steps
1. Select a Supabase project for Technicade service operations. Prefer a separate project from customer-facing SaaS.
2. Review db/001_service_tickets.sql and execute once using the Supabase SQL editor or CLI migration mechanism.
3. Confirm all six tables have RLS enabled and no SELECT/INSERT/UPDATE/DELETE grants to anon/authenticated.
4. Build a separate Next.js backend on Vercel. Put SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in **server-only** environment variables. Never add them to the static site.
5. Build POST /api/service-requests with schema validation, bot challenge, IP-based rate limiting, normalization, transactional inserts for customer + ticket, and an idempotency key. Return a receipt without exposing internal customer IDs.
6. Build admin sign-in with Supabase Auth, verified staff membership server-side, MFA, restricted routes; then implement ticket list/detail with status change audit events.
7. Replace Web3Forms only after verified staging tests end-to-end. The old site stays operational meanwhile.
8. Connect Stripe service deposits/quotes with Checkout and signed webhooks. Store external payment references only; do not expose payment identifiers in public lookup.
9. Add customer ticket status access via authenticated session or expiring signed link. Never use ticket numbers as authentication.
10. Introduce remote sessions only after vendor selection, approval and consent flows.

## Security and privacy test checklist
- Anonymous database reads/writes fail.
- Authenticated non-staff database reads/writes fail.
- Unauthorized requests to admin API return 401/403.
- Fake/duplicate form requests do not create repeated tickets or notify repeatedly.
- Invalid email, oversized body, disallowed file type and missing captcha are rejected.
- Webhook signature validated and replay events processed idempotently.
- Customer can see only their own ticket, never another customer record.
- No secret keys in git, generated client JS, or browser/network inspection.
- Passwords, authentication codes, card data, and remote access credentials are never collected in the ticket form.

## Notes
Ticket status is deliberately controlled server-side; the public submission endpoint may create **new** tickets only. Do not directly expose Supabase service-role API routes without validation.

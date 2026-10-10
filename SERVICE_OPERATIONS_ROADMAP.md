# Technicade Service Operations Roadmap

## Current site architecture
- Public site: static HTML/CSS in technicadegaming/services.
- Existing quote form: Web3Forms submission that emails the business; no structured ticket database or private admin.
- Digital downloads: separate technicadegaming/technicade-digital-store Next.js application using Stripe.
- Do not place Supabase service-role keys or Stripe secret keys into this static site.

## Phase 1 (this PR)
- Add public support.html introducing remote PC help, business IT, automation, arcade/FEC, migrations and software projects.
- Add links from homepage and service catalog.
- Extend the existing quote form with device types and relevant service categories.
- Preserve current $30 quick-help and $60/hour pricing.
- Remote access is described as a future, opt-in capability; nothing automatically installs or connects.

## Phase 2: protected ticket API
Choose a backend hosted separately from the static site (e.g. Next.js API on Vercel + Supabase).
- Tables: customers, tickets, ticket_events, ticket_messages, estimates, service_sessions, attachments, payments.
- Ticket ID, status (new/triage/quoted/approved/scheduled/in_progress/waiting/completed/closed), timestamps, service type, device type, assigned staff, consent timestamps.
- Public endpoint: validated request form, captcha, per-IP rate limit, idempotency handling, server-side schema validation, attachment allowlisting and size limits.
- Store and send notifications without leaking sensitive data in email. Use Supabase RLS and private attachments; admin role granted server-side only.
- Migrate form to API only after backend is deployed and tested; avoid breaking current Web3Forms lead delivery.
- Admin views: searchable queue, filters, ticket detail, notes, customer messages, status change history, follow-up reminders.
- Customer status access requires authenticated login or expiring signed links; ticket number alone never grants access.

## Phase 3: quote and payments
- Reuse Stripe account, but create dedicated service products/prices or PaymentIntents from a trusted backend.
- Never trust browser-supplied prices; calculate authorized amounts server-side.
- Store Stripe Checkout session/payment IDs against tickets, record verified webhooks idempotently.
- Support estimate acceptance, deposit requests, refunds, invoices, and payment statuses.
- Do not require payment to submit an initial quote.

## Phase 4: secure remote support
- Evaluate Splashtop SOS vs RustDesk commercial/self-hosted licensing before production.
- For one-time sessions: customer manually initiates the approved client and explicitly consents to screen sharing/control.
- Provide a signed, expiring session-link button only after a ticket is approved.
- MFA for tech accounts, minimal permissions, session logs, approved file transfer, no credential collection.
- Android/iOS session abilities vary by OS; never promise iPhone/iPad full control.
- Persistent unattended access should be disabled by default and require separate explicit consent.
- Vendor remote-control backend should not be built into an untrusted static client or deployed on Vercel serverless.

## Acceptance criteria
- Public site retains old quote submission functionality and existing navigation.
- New support page makes no false claim that sessions or payments are already integrated.
- Before ticket system launch: test rate limits, RLS, admin authorization, notifications and webhook signature verification.
- Before remote service launch: independently test a session from two devices, termination/revocation, MFA, file-transfer permissions, audit logs, and recovery procedure.

## Deployment
- Review PR changes and verify GitHub Pages hosting configuration.
- Merge to main after mobile and desktop preview checks.
- Public page: https://technicade.tech/support.html (after deployment).

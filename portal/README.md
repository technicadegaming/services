# Technicade Service Intake API — Deployment Plan

This folder is an **isolated Next.js app**. It does not replace the static website. Deploy it as a separate Vercel project, with project root set to `portal`.

## What is implemented
- `GET /api/health` — basic health check.
- `POST /api/service-requests` — accepts customer name, email, service category, subject, description, optional device type, and Cloudflare Turnstile token.
- Checks exact website origin, server-side Zod validation, Cloudflare challenge, and Upstash sliding-window rate limit (3 requests / hour / IP).
- Writes an atomic ticket and event using Supabase RPC `tc_create_ticket`. Returns numeric ticket reference only.
- No admin login, ticket browsing, messaging, Stripe or actual remote access yet.

## Prerequisites
1. In a dedicated Supabase project, apply `../db/001_service_tickets.sql` then `../db/002_intake_rpc.sql`.
2. In Cloudflare Turnstile, configure a site key for your actual website domain. Save the **secret** in Vercel, never in Git.
3. Create an Upstash Redis database for shared rate limiting across deployments.
4. Deploy from the `portal` root to a new Vercel project (do not overwrite the existing static website deployment). Use an API subdomain or Vercel deployment URL.
5. Add the exact five required environment variables from `.env.example`; restrict secrets to server-side env vars and protect the Vercel project.
6. Run `npm install`, `npm run typecheck`, and `npm run build` from `portal`, then test the deployed health route and API.
7. Test Turnstile invalid token, invalid origin, malformed JSON, malformed fields, rate limit, SQL insert, ticket event, and database security.
8. **Only after tests pass:** modify the existing static quote form to use this API, implement Turnstile widget, and preserve a rollback path to Web3Forms.

## Example request body
```json
{
  "name": "Sample Customer",
  "email": "test@example.com",
  "service": "Remote PC assistance",
  "deviceType": "Windows PC",
  "subject": "Printer connection failure",
  "description": "Windows cannot connect to my network printer.",
  "turnstileToken": "<token obtained from approved Cloudflare widget>"
}
```

## Known limitations / next work
- Browser Origin header is not an authentication mechanism. Turnstile + rate limits protect public intake; don't put private operations in this endpoint.
- IP-based limits may group users sharing an IP address. Monitor abuse and adjust thresholds before production.
- Ticket references are *not* access tokens. Never implement unauthenticated ticket lookup by reference.
- Admin dashboard requires robust staff login, authorization, and MFA before enabling customer-data reads.
- The current service quote form still uses Web3Forms; it is intentionally unchanged in this PR.
- Service-role credentials bypass RLS and must never reach a browser, Git commit, or public environment variable.

## Acceptance checklist
- [ ] Database migration successfully applied and tested
- [ ] Secrets configured in separate Vercel project
- [ ] Typecheck/build pass
- [ ] Correct Turnstile hostname and widget setup
- [ ] Request creates ticket + event
- [ ] Invalid submissions blocked
- [ ] Anonymous database reads blocked
- [ ] Existing quote form unaffected

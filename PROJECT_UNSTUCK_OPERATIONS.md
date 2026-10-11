# ProjectUnstuck — live order operations

## Product status
- Free planner: https://technicade.tech/project-unstuck.html
- One-time personalized service: $19.99 through Stripe Payment Link (Technicade live account).
- Orders are **manual fulfillment**. Do not advertise instant personalized PDF generation or guaranteed delivery dates.
- No subscription, trial, auto-renewal, API key, or new Supabase project required.
- The free planner uses curated static templates, **not** a generative AI model.
- Stripe product: `prod_VQ9azAjpSp66TN`; price: `price_1UPJHJE6iFZ7rLW0zZJd4kZT`; link: `plink_1UPJHZE6iFZ7rLW0kfVknSvA`.
- Stripe link: https://buy.stripe.com/3cI3cve2O5Zs4A32sw00005

## Before promoting paid orders
1. Load the published planner page in a normal browser, test mobile view, five template categories, reset, print, TXT download and links.
2. Visit the Stripe Checkout link without paying. Verify its price, one-time terms and custom fields.
3. In **Stripe Dashboard > Payments**, confirm new successful charges can be identified for this product. Turn on merchant payment notifications or arrange a manual order-check schedule. Do not rely solely on an email notification without verification.
4. Check the account's Stripe Tax / Managed Payments settings and Wisconsin tax obligations. The Payment Link currently has automatic_tax disabled and Managed Payments disabled; do not assume taxes are handled automatically.
5. Verify `support@technicade.tech` receives messages and can send completed plans.
6. Confirm realistic delivery availability before starting to promote. If unable to fulfill, deactivate the Stripe Payment Link promptly.
7. End-to-end checkout must be tested in sandbox before selling broadly; do not make a real payment simply to test.

## Handling an order
1. Open Stripe > Payments. Verify the relevant payment succeeded (not pending, refunded, or disputed).
2. Open associated checkout/session metadata and collect project name, description, approximate budget, and purchaser email. Never accept or store card details in email.
3. If project is safety-sensitive, outside the offered planning scope, or missing required details, contact buyer to clarify or offer refund before drafting.
4. Draft a genuinely tailored document: project goal, scope/assumptions, dependencies, phased milestones, numbered tasks, material/measurement checklist, budget caveats, likely risks, and sources where relevant.
5. Clearly distinguish prices/measurements that are estimates from verified facts. Do not instruct unqualified work involving electrical, gas, structural, hazardous material, or other high-risk situations.
6. Email the document securely to the checkout email, ideally as a PDF, and note order/session ID and delivered date in a private operational log.
7. If delivery fails, investigate before sending duplicates. Resolve refunds through Stripe when appropriate.

## Future automation plan
- Migrate paid checkout from static Payment Link to verified hosted Checkout in a backend.
- Add signed Stripe webhook, durable order table, idempotency by session ID, and staff notification.
- Generate a custom draft only after verified successful payment and human approval.
- Send through Resend with auditable delivery status and retry/reconciliation support.
- Test duplicate webhooks, delayed payments, refund cases, data privacy, and failed delivery.
- Avoid linking the generic digital-store webhook directly: it only fulfills cataloged static files.

## Promotion
Position the free planner as a lead magnet. Sell $19.99 personalized plans only to buyers who need tailored assistance. Measure actual visits, completed plans, inquiries, purchases, delivery effort, refunds and support tickets before expanding.

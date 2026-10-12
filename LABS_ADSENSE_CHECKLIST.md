# Technicade Labs: AdSense launch-readiness checklist

## Current state — October 12, 2026
Technicade Labs contains seven original browser experiments on technicade.tech. Cloudflare Web Analytics has recorded early pageviews; Google Search Console ownership is verified, but the sitemap previously returned a Google processing error even though an October 12 live URL Inspection reported crawl allowed and a successful fetch. Recheck the submitted sitemap status in Search Console; a successful URL fetch is not a sitemap-ingestion confirmation. The site has been submitted for Google AdSense review; the last user-confirmed status was **Getting ready**, not approved or revenue-producing.

- Domain ownership metadata includes actual publisher ID `ca-pub-6059025745588128`. This is for verification, not proof of ad-serving approval.
- Root `ads.txt` exists in the repository: `google.com, pub-6059025745588128, DIRECT, f08c47fec0942fa0`. Last user evidence confirmed public accessibility; Google had not yet recognized it. Check Sites > ads.txt status again after crawling.
- **No live ad units, Auto ads, ad-impression claims or revenue are authorized.** Do not add or activate them before account approval and privacy/consent review.
- PR #59 corrected social PNG generation; PRs #73, #76 and #77 added two games, seven-game social previews and automated tests. The launch PR passed 23/23 Chromium gameplay/responsive/WCAG tests; physical-device and production fetch checks remain distinct.

## October 12 AdSense ads.txt follow-up
- Last user screenshot: **Getting ready**, **ads.txt: Not found**. Google account-level recognition remains pending.
- The root `ads.txt` publisher record is present, plain text and served HTTP 200 over HTTPS in a live GitHub Actions diagnostic. Confirm plain HTTP redirects to the same bytes with dedicated crawler diagnostic CI.
- Official Google steps to request a recheck: **Sites > technicade.tech > Check for updates**. If unavailable, wait for Google's next crawl.
- Google advises several days, and potentially up to a month when there are few ad requests/low traffic. Avoid unnecessary edits to a correctly configured file. Keep ad units disabled while awaiting site approval.
## Ongoing readiness and before serving ads
1. Test all seven games on desktop and mobile, including keyboard controls, scores, share behavior, and the challenge wheel layout.
2. In Google Search Console, recheck the sitemap fetch status and inspect important game URLs. Search indexing is not guaranteed.
3. Review every public page for complete original content, functional navigation and links, and accurate descriptions.
4. Confirm the privacy policy, contact details, terms, and disclosures match how the live site actually operates.
5. Creator utility concepts are currently hidden from the public Labs hub. Do not add any new sensitive-content category to ad-served pages without a separate policy and consent review.
6. Review Google Publisher Policies and ad placement policies before serving any ads.
7. Obtain your own AdSense publisher ID and verification method. Never use a made-up ca-pub ID. Put AdSense verification code only on the correct approved site.
8. Consider consent requirements for users in applicable jurisdictions before enabling personalized advertising. Configure Google's certified consent management platform if necessary.
9. Once accepted, start with conservative ad placement away from gameplay controls, spin buttons, or target surfaces. Never encourage ad clicks.

## Manual AdSense application
- Sign in at https://adsense.google.com/start/
- Add **technicade.tech** under Sites (do not add every path as a separate site).
- Complete identity, payments, and address steps required by the AdSense dashboard.
- Copy the supplied verification code or publisher ID so it can be installed in this GitHub Pages repository.
- Request review only when the site is ready.
- Approval can take days or weeks and is not guaranteed.

## Current exclusions and release gate
Account verification metadata and publisher-specific ads.txt **are installed**. No ad placements or Auto ads have been enabled by the Labs rollout; payment onboarding details remain unknown. Site must show **Ready** in AdSense before ad activation. If serving ads to EEA/UK/Swiss visitors, review Google-certified CMP and TCF requirements first (https://support.google.com/adsense/answer/13554116). Recheck the official Sites status and ads.txt status (https://support.google.com/adsense/answer/12170222).

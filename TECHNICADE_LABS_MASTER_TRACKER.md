# Technicade Labs — Master Tracker and Next-Chat Handoff
Updated: 2026-10-12
Status definitions: MERGED = in GitHub main; USER-VERIFIED = confirmed by user's screenshots/browser; NEEDS QA = no reliable live test; BLOCKED = waiting on third party; IDEA = not implemented.

## October 12 earlier follow-up audit (historical snapshot; later verified updates above)
- **P0 social preview pipeline: FIXED IN CODE AND CI.** PR #59 merged. Generator now accepts PNG URLs already present in HTML, validates 1200x630 PNG output, and is tested for repeatable output on PRs. GitHub Actions post-merge regeneration succeeded, adding a new commit `91c55813826f18a69b6c7f0c3b92a1c791bf13aa`; `assets/labs-labs-share.png` changed from recorded stale blob SHA `8650faeeae370700458a5926f85dc4595e7876c3` to `7de693573e04bfa2a8793451207654fa57236eb4` (56,537 bytes). **The corrected bytes are committed in main.** Public Pages deployment and Facebook re-scrape remain separate checks. The other four preview blobs were unchanged because only the Labs SVG numeral changed.
- **Static code review of five games: IN PROGRESS, not end-to-end browser verified.** Wheel computes uniform choices and rotates chosen sector center to the top pointer. Known remaining risk: high label density at 16 challenges, long descriptions, wheel selection after entries edits and mobile view; test 1, 2, 8 and 16 entries with repeated spins. Reflex game's timer uses a `performance.now()` deadline, saves personal best, and ends when tab is hidden. Achievement maker uses four-line canvas wraps which may overlap footer for long entries. Would You Rather shows fictional random split figures rather than user poll data. Button progress stores local per-browser data.
- **CI evidence:** static-site quality and social preview generation checks passed for PR #59. This is not a substitute for functional click/touch QA or independent Lighthouse/axe tests.
- **Site availability limitation during audit:** external text fetch from public `technicade.tech` via automated browser/search failed; cannot claim live production HTML, Sitemap, ads.txt, or pixels verified in this audit beyond previously user-verified evidence. Recheck live Pages once publication settles.
- **Monetization:** AdSense site review remains pending, no evidence of approval or ad revenue. Never enable live ad units or Auto ads before approval and relevant consent review. Keep Cloudflare script and `ads.txt` unchanged.

### Audit priorities after PR #59
1. **P0** Open production `/assets/labs-labs-share.png` and Facebook Sharing Debugger, confirm corrected visible 5 and force re-scrape; capture desktop/mobile screenshots.
2. **P0** Manually run every game on desktop and a phone; wheel 1/2/8/16 slices, long labels, repeated spins, changes and reset, touch; reflex full 30 seconds plus tab changes; PNG export on phone and desktop; Would You Rather twenty cards and replay; Button thresholds and reset.
3. **P1** Add automated browser smoke tests (Playwright), responsive snapshots at 320/375/768/1280, accessibility checks including reduced motion/keyboard/focus, performance budget, and pixel diff snapshots.
4. **P1** Address long award canvas text clipping, wheel compact labeling and accessibility, game navigation consistency, keyboard announcements, and unified mobile styles in isolated PRs.
5. **P1** Verify Search Console sitemap state, indexed pages, canonical/robots and AdSense/account-level status. Verify site and policy content for real monetization eligibility and consent requirements.
6. **P2** Add privacy-respecting interaction signals (no personal prompts/names), then prioritize retention features based on real pageviews/returning usage, without assuming any existing audience.

## Confirmed follow-up delivery — October 12 (after handoff)
- **PR #59 MERGED:** fix idempotent social PNG generator and GitHub Actions. PNG action completed successfully; new PNG blob SHA `7de693573e04bfa2a8793451207654fa57236eb4` on main. Pages deployment for its generated commit (`91c558138`) completed successfully. Facebook's cached preview still requires Scrape Again or independent visual confirmation; do not conflate with GitHub blob proof.
- **PR #60 MERGED:** update this tracker with source-linked checks and open manual QA gates.
- **PR #61 MERGED:** wheel displays readable numbered sectors and matching challenge legend for 9–16 items. Static CI and GitHub Pages deployment passed.
- **PR #62 MERGED:** achievement PNG export bounds long text inside fixed canvas regions. Static CI and GitHub Pages deployment passed.
- **PR #63 MERGED:** new `.github/workflows/labs-browser-smoke.yml` and `tests/labs.spec.mjs`; first Chromium run **11/11 PASSED** (run 38282375500, 2026-10-12). Checked hub links; local button counts/achievements across reload; full Would You Rather deck; Challenge Wheel text and measured pointer alignment at 1/2/8/16 entries; empty-wheel behavior; 1200×630 PNG download with long inputs; reflex round and timer; no horizontal overflow at 320, 390, 768 and 1280px for all five pages. Runs against local static HTTP server using Playwright Chromium, **not a production browser audit**.
- **PR #64 MERGED:** correct AdSense readiness checklist so verification metadata and ads.txt are properly recorded; status remains pending and no ads activated.

### Still-open audit work (not falsely marked done)
- Human inspect public social preview PNG and rescrape in Facebook Sharing Debugger, verify visible numeral. Check all five share previews using external scrapers.
- Physical Android/iPhone and Safari/Firefox gameplay and visual checks; keyboard-only and screen reader audit, reduced motion, focus recovery, high-contrast, long text/localization, audio/visual clarity; run axe or equivalent accessibility audit.
- PageSpeed Insights / Lighthouse production mobile performance and Core Web Vitals; verify actual image bytes and compression, lazy resource behavior.
- Search Console sitemap status, game URL index coverage, per-page SEO social preview fetchers; inspect live analytics by page (no claims of real traffic beyond prior user samples).
- AdSense dashboard site approval and ads.txt Authorized status, region-appropriate consent plan, payout/tax account setup; no live ads until ready/approved.
- Discovery/retention: review actual Cloudflare metrics before adding features; improve cohesive game layouts and navigation in subsequent scoped visual PRs.

## Final verified audit addendum — October 12, 2026
- **PR #66 MERGED:** Added axe-core WCAG 2 A/AA + WCAG 2.1 A/AA automated accessibility checks for Labs plus four game pages. First run exposed one genuine defect: achievement progress used `aria-label` without valid semantics. Fixed by assigning `role=progressbar` with explicit range and dynamically updated `aria-valuenow`. Final GitHub Actions run **38282980043**: 16/16 tests PASS, including all five automated axe checks, eleven gameplay/responsive tests. Browser tests are Chromium on local HTTP, not Safari/Firefox/physical phone production tests.
- **PR #67 MERGED:** consistent 1200x630 large social card metadata for Labs and four games; descriptive OG image alt text and mobile theme-color. This affects metadata, not actual social-platform cache. Re-scrape still needed.
- **P0 fixed in code:** stale SVG vs PNG generator failure, stale PNG committed and deployed, numbered wheel segments for crowded lists, bounded award PNG export, accessibility progress semantics. **Release blockers still needing external verification:** public social crawler refresh and actual mobile/Safari/Firefox visuals.
- **Protect monetization:** publisher verification and ads.txt kept; AdSense account approval, publisher status and consent conditions not verified as approved. No active ads were enabled by these fixes.
- **Next quality gates:** manual keyboard/screen reader and Android/iOS QA; Lighthouse performance/SEO audits on actual production; real Search Console sitemap/index inspection; social preview scraper cache; measurable referral/returning traffic; visual design polish and feature selection from audience data.

## Live crawler diagnostics and screenshot follow-up — October 12, 2026

### User screenshots and verified external state
- User opened the production `/assets/labs-labs-share.png`: numeral **5** is visible correctly, no empty-square glyph.
- Meta Sharing Debugger screenshot still displayed the **previous empty-square cached preview** shortly after a scrape. Debugger showed 206 and warnings about `og:url`, `og:type`, `fb:app_id`; the actual `labs.html` HTML already contains explicit `og:url` and `og:type`. Do not invent a Facebook app ID. 206 is a normal response to a byte-range request; it does not establish why Meta's debugger displayed old pixels.
- Search Console domain-property screenshot: `https://technicade.tech/sitemap.xml` submitted October 12; `Couldn't fetch`, Unknown type and **0 discovered via that sitemap**. This does not imply that no pages are indexed.
- AdSense screenshot: site status **Getting ready**, `ads.txt` **Not found** at last crawler check, last updated October 12. No approval or revenue is confirmed; live ads remain disabled.

### Independent production HTTP verification
- PR **#69 MERGED**, GitHub Actions run **38286741709 PASSED**. A GitHub-hosted runner made actual public requests from another network (rather than relying on repo contents). All **11 fetches returned HTTP 200**: homepage, Labs (regular / Googlebot-like / facebookexternalhit-like user agents), sitemap (regular / Googlebot-like), robots, ads.txt (regular / Googlebot-like), Labs PNG (regular / Meta-like).
- Public `sitemap.xml` was `application/xml` and parsed **15 expected Technicade URLs** with correct domain. `robots.txt` declared the sitemap.
- Public `ads.txt` was `text/plain`, contained the configured `google.com, pub-6059025745588128, DIRECT, f08c47fec0942fa0` record.
- Public social PNG was `image/png`, **56,537 bytes**, and byte-identical to the corrected version in GitHub main. A deliberate `Range: bytes=0-1023` request returned HTTP 206 as expected.
- These checks simulate Googlebot/Meta user-agent strings. They **do not** prove that Google's real crawlers or Meta cache fetched the same content, nor can they query protected account statuses.

### Social asset cache refresh
- PR **#70 MERGED:** existing corrected Labs PNG now uses a stable versioned `og:image` and `twitter:image` URL (`?v=20261012-verified`) so Meta requests a new image cache identity. All **16 Chromium gameplay / automated WCAG tests PASSED** in PR CI; normal site metadata and AdSense unaffected.
- Check latest GitHub Pages deployment success, then in Meta Sharing Debugger enter `https://technicade.tech/labs.html`, click **Scrape Again**, and confirm the thumbnail shows **5** and the constructed `og:image` URL includes the version query. Do not mark Meta-side P0 done until that is observed.

### Google crawl follow-up (no speculative code changes)
- In Search Console click the failed sitemap row for error details, use URL Inspection live test for `https://technicade.tech/sitemap.xml` and important Labs pages, and inspect Page availability / crawl allowed / page fetch. If needed, request indexing on the Labs hub and a few key game URLs. The site is newly launched and the sitemap was submitted today; allow processing time rather than repeatedly changing a valid sitemap.
- In AdSense, leave `ads.txt` in place and do not delete/re-add the site or enable ads. Google documents potential delays of days or up to a month on low-traffic sites; recheck the Sites status periodically. Consent/CMP and policy checks still apply before actual ads.
- Official guidance: https://support.google.com/webmasters/answer/7451001 and https://support.google.com/adsense/answer/7679060

## Ownership and hosting
- Primary repo: https://github.com/technicadegaming/services (not SaaS factory /anvil).
- Production: https://technicade.tech/labs.html
- GitHub Pages: main branch, root, custom domain technicade.tech, HTTPS enforced — USER-VERIFIED.
- Pricing and subscriptions: five games free. Ads NOT enabled. No new Supabase, Vercel, or Stripe resource required.

## Games and features (all MERGED, live edge-case testing remains)
1. labs.html — Don't Push the Button: 30 random reactions; thresholds at 1/10/25/50/100 pushes, local-storage achievements, reset/share.
2. would-you-rather.html — 20 prompts, randomized order, selection/share. Displayed split is fictional, not actual votes.
3. fake-achievement.html — Editable name/title/reason, random ideas, browser-side PNG canvas export; test long text and mobile downloads.
4. challenge-wheel.html — Editable custom list up to 16, wheel/spin/results; PR #43 corrected selection math; PR #44 added labels; PR #46 corrected labels floating outside wheel. USER-REPORTED bug and correction merged; rerun mobile/desktop and test alignment for 1, 2, 8, 16 items.
5. one-more-second.html — 30-second timed target game; personal best saved locally; share/replay. NEEDS QA for touch, timer end, tab switching, local persistence.

## Homepage and UX — MERGED
- Labs added to main site navigation (desktop and relevant mobile links).
- Quick Play cards link to five games; info/FAQ/how-to sections; inter-game navigation.
- Daily challenge rotates with device local date and links to corresponding game; copy challenge, mark completed locally.
- Local daily visit streak; share Labs and copy link. Daily prompt selection/completion are not server verified.
- Creator earnings tracker, streaming profile/menu designer and schedule builder remain RESEARCH CONCEPTS ONLY; no product integrations, billing, or adult content.

## Analytics / SEO / AdSense
- Cloudflare Web Analytics on main home, services, products, Labs and four standalone games; user screenshot: 7 pageviews, 0 visits in early sample. USER-VERIFIED ingestion. Reevaluate metric definitions and coverage of remaining site pages.
- Google Search Console DNS-domain property USER-VERIFIED. Sitemap: https://technicade.tech/sitemap.xml submitted but screenshot showed 'Couldn't fetch', while direct XML loads and Labs live URL inspection reported indexable. Pending recheck.
- AdSense publisher: pub-6059025745588128; site verification and 'Review requested' USER-VERIFIED on October 12, 2026, 11:31 AM. Status 'Getting ready'. NOT approved. No live ads / ad units / Auto ads.
- Root ads.txt record USER-VERIFIED publicly:
  google.com, pub-6059025745588128, DIRECT, f08c47fec0942fa0
  AdSense previously showed 'Not found'; await crawl update.
- privacy.html updated for analytics and future ads. Audit wording, real-world implementation, regional consent and ad placement before enabling ads.

## Social preview assets and OPEN ISSUE P0
- Five 1200x630 share PNGs and source SVGs are in assets/; og:image/twitter metadata points at PNGs.
- Facebook Sharing Debugger USER-VERIFIED it reads preview/title/description. Reported warnings og:url, og:type, fb:app_id although explicit og:url and og:type are now present; fb:app_id is not necessary for ordinary link sharing.
- PRIOR P0: stale preview PNG (old blob 8650faeeae370700458a5926f85dc4595e7876c3) has been regenerated by fixed PR #59 workflow, new blob 7de693573e04bfa2a8793451207654fa57236eb4; visually verify published URL and social re-scrape.
- Workflow: .github/workflows/labs-social-previews.yml; generator scripts/build-labs-social-previews.py. Investigate GitHub Actions trigger/permissions/output and SHA. Generate and commit actual corrected PNG, compare SHA, verify at public URL, then Facebook 'Scrape Again'. Inspect all other four PNGs for unsupported glyphs and potential need to replace icons with ASCII/numerals.
- Do not falsely report preview fixed until actual PNG bytes change and social scraper sees new artwork.

## Status of user testing
- USER-VERIFIED: GitHub Pages live; DNS/HTTPS; Labs loaded; first four games manually tried; wheel label bug reproduced; Cloudflare recording; Search Console verification and successful Labs live inspection; public ads.txt; AdSense review requested; Facebook preview retrieved.
- NEEDS QA: corrected wheel layout at rest/spinning and dynamic list lengths; one-more-second full 30 second run and persisted best; fake achievement exported PNG and long input on desktop/mobile; all links/navigation and external policy links; cross-browser/mobile/responsive/accessibility/performance; cookie/privacy disclosures; social previews.
- NOTE: GitHub merged PRs often had no reported commit status checks. GitHub merge is not equivalent to browser/functional test.

## Priority backlog for next full audit
P0
[x] Replace stale Labs preview PNG bytes in GitHub main (PR #59, generated new blob SHA).
[ ] Confirm new PNG on public GitHub Pages, purge/refresh social cache; test all five previews.
[ ] Complete end-to-end browser QA on all five games; repair visual regressions and interaction errors before promotion.
[ ] Verify production scripts, meta tags, sitemap, analytics and ads.txt via deployed pages, not just repo.
P1
[ ] Full UI/UX audit: responsive 320px–desktop; visual consistency; modern arcade aesthetic; accessible contrast/focus; touch controls; layout/no text overflow.
[ ] Game fairness: wheel pointer + exact selected sector, varying list lengths, full labels; timer focus/hidden tab behavior; long text wrapping and image export.
[ ] Improve structured descriptions, landing page layout, CTA design, game thumbnails, share and replay flows without intrusive ads.
[ ] Google Search Console: recheck sitemap fetch; indexed URL coverage, canonical and robots behavior.
[ ] Review AdSense policies, privacy/cookie/consent implementation, appropriate ads.txt detection and pending decision. NO ads until approval.
P2
[ ] Measure at least several weeks of pageviews, referrers, repeats and popular pages; decide game roadmap from actual use rather than assumptions.
[ ] Prepare organic launch assets/posts; share only where allowed; test links and preview images first.
[ ] Explore additional tiny games, daily challenges, achievement depth and retention. Avoid backend/cost until justified.
[ ] Optional later creator tools: validate real demand, platform and payment processor eligibility separately from consumer games.

## Audit checklist (carry to new chat)
1. Read this file, LABS_ROLLOUT.md, LABS_ADSENSE_CHECKLIST.md, and actual GitHub source on main.
2. Inspect all Labs pages / source, identify broken elements, inconsistent components, responsiveness and accessibility problems.
3. Verify merged claims against current deployment and user screenshots. Never assume QA done just because PR merged.
4. Fix P0 bugs first; make focused branches/PRs; run feasible checks and inspect output before merging.
5. Produce ranked UI enhancement plan, feature backlog, expected costs, testing matrix and user-manual steps.
6. Preserve existing Technicade professional SaaS/services site, verified analytics, ads.txt and AdSense account.
7. Do not invent publisher IDs, tracking data, site traffic, revenue, approval or testing results.

## Useful history
PR #39 Labs hub; #40 Would You Rather; #41 Achievement + Wheel; #42 SEO/social metadata; #43 wheel selection alignment; #44 wheel labels; #45 Cloudflare analytics; #46 wheel containment; #47 daily challenge; #48 reflex game; #49 quick-play/FAQ; #50 AdSense readiness; #51 ownership meta and ads.txt; #52 game cross-links/guidance; #53 visit streak; #54 share SVG and completion; #55 PNG generator; #56 og tags/SVG numeral correction; #57 workflow; #58 attempted PNG regeneration. All reported merged, but remaining bugs as above.

## Manual tasks
- NOW: none strictly required to continue code audit. User can supply desktop/mobile screenshots of any bugs.
- Once corrected PNG deployed: visit https://technicade.tech/assets/labs-labs-share.png and Facebook Sharing Debugger -> Scrape Again.
- Review AdSense status in account and any requests for payout/tax/consent details; never claim approval before confirmed.
- Revisit Search Console sitemap 'Couldn't fetch' and inspect important URLs.
- When social preview verified: publish carefully targeted organic promotion; no paid acquisition required.

## Next chat prompt
"Continue Technicade Labs. Read TECHNICADE_LABS_MASTER_TRACKER.md in technicadegaming/services, plus the live repo. Perform a full code/UI/UX/SEO/accessibility and functional audit, prioritize bugs and improvements, fix the stale share PNG first, test all five games on desktop and mobile, then implement and merge safe improvements with progress updates. Preserve AdSense/Cloudflare setup, don't enable live ads. Give me exact manual steps only when needed."

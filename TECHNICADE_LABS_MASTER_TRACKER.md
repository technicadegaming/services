# Technicade Labs — Master Tracker and Next-Chat Handoff
Updated: 2026-10-12
Status definitions: MERGED = in GitHub main; USER-VERIFIED = confirmed by user's screenshots/browser; NEEDS QA = no reliable live test; BLOCKED = waiting on third party; IDEA = not implemented.

## Cross-site organic Guides & Article Studio — October 12, 2026

This is a **Technicade website acquisition project**, not a released Labs game or an AdSense approval milestone. Full articles stay freely accessible without login or reading quotas; optional paid Technicade Tools/credits are a separate later experiment.

**Progress:**
- [x] New public Guides hub, article directory/search, homepage navigation, sitemap and share-friendly article layout staged in **[services PR #89](https://github.com/technicadegaming/services/pull/89)** (**OPEN, NOT MERGED/LIVE** at last verification).
- [x] Owner-only AI Article Studio with paste-question -> research -> edit/approve -> GitHub publish and copyable social reply staged in **[anvil PR #120](https://github.com/technicadegaming/anvil/pull/120)** (**OPEN, NOT DEPLOYED/TESTED**). Tool path proposed: `https://tools.technicade.tech/studio`.
- [x] Marketing rule: answer the original Facebook/FEC operator question helpfully first; share the article link only where permitted; no automated group posting or intrusive paywall.
- [ ] First Intercard iTeller Plus package-specific upsells guide is NOT published; exact configuration menus must be verified before making authoritative how-to claims.

**To do:** Review/merge/deploy both PRs (public hub first); configure owner email plus server-only OpenAI/GitHub credentials; verify non-owner denial, publishing reliability, source accuracy, generated social metadata and mobile browser behavior; publish and source-check first guide; test public URL/Facebook share; track ethical referrals and conversions. Later explore optional interactive AI preview tied to Credits while keeping articles free.

See **[Anvil master launch tracker #93](https://github.com/technicadegaming/anvil/issues/93)** for the detailed P0/P1/P2 launch checklist; avoid duplicating the full SaaS backlog here.


## AdSense follow-up — October 12, 2026 (user screenshot)
- **AdSense Sites:** `technicade.tech` still shows **Getting ready** (review pending) and **ads.txt: Not found**; the definition in the tooltip is about the AdSense crawler's last crawl, not the GitHub repository state.
- **Verified repo/public evidence:** root `ads.txt` is an ASCII/plain-text one-line record `google.com, pub-6059025745588128, DIRECT, f08c47fec0942fa0`. Existing production check run `38298060009` returned HTTPS HTTP 200 and `text/plain`; `robots.txt` allows crawling. An additional GitHub-run check now tests HTTP redirect and a Mediapartners-Google-like user agent.
- **User-confirmed AdSense screen (Oct 12):** ownership is verified and review was requested, but the site-detail screen does **not offer** a `Check for updates` button. Do not keep searching Ads settings or change verification methods just to find this button. Leave the working file alone and await the automatic crawl/approval update.
- **Official guidance:** it can take several days for ads.txt status to update, potentially up to one month for a low-traffic site. Do **not** delete/recreate the site or repeatedly edit a correct `ads.txt` file. Sources: https://support.google.com/adsense/answer/12171612 and https://support.google.com/adsense/answer/7679060
- **Release gate:** do not enable Auto ads or live ad placements until Google site review is Ready and applicable consent/privacy requirements are checked. `ads.txt: Not found` is not approval status and neither status implies revenue.
## Live Google Search Console index and SEO audit — October 12, 2026
- **PROPERTY / SOURCE:** Authenticated GSC Wizard property `sc-domain:technicade.tech`. This is Google data from the user's verified property, not a simulated user-agent or a search-engine guess.
- **Index Inspection (17 of 17 sitemap URLs):** Google confirmed homepage `/` and Labs hub `/labs.html` as **Submitted and indexed** (PASS). All other **15 URLs** report **URL is unknown to Google**; none returned an explicit block or coverage failure. These are current indexing states, not promises of future inclusion.
- **Live technical crawl (17 URLs):** all HTTP 200 and indexable, 0 critical/high SEO issues. Exactly **3 medium-severity missing canonical tags** found on `services.html`, `arcade-repair-custom-games.html`, and `project-unstuck.html`; addressed in focused SEO PR once deployed and independently recrawled. Other issues were low-severity descriptions, thin-but-functional game content and optional structured data. Avoid keyword stuffing or fake ratings.
- **Search analytics:** current Google API returned 0 web clicks / 0 impressions over its default 28-day period and no query/page rows, but also failed to establish a confirmed settled-through date. **Do not equate zero Google Search impressions with zero site visits.** Cloudflare is separate and known installed; Google Analytics 4 isn't connected via GSC Wizard.
- **Sitemap API:** `https://technicade.tech/sitemap.xml` listed as **pending** with 0 warnings / 0 errors; no confirmed completed ingestion yet. Previously verified public XML is well formed and lists all 17 URLs. Do not repeatedly resubmit pending sitemap or claim all URLs indexed.
- **Performance evidence:** GSC Wizard CrUX API key not configured; field Core Web Vitals unavailable. Existing Chromium game CI is not a substitute for production RUM/mobile browser testing.
- **Follow-up:** after GitHub Pages publish, re-crawl 3 corrected pages; allow Google to process the new URLs. Manually use URL Inspection > Request Indexing for highest-priority pages (e.g. services, products) when appropriate. Prioritize first-party content and direct B2B marketing rather than expecting immediate search traffic.
- **Monetization:** AdSense site still Getting ready; do not enable live ads, change `ads.txt` or tamper with Cloudflare Analytics.

## Latest delivery — seven-game Labs launch (October 12, 2026)
- **SEVEN FREE LIVE-DEPLOYED GAME PAGES / NO ACCOUNTS / NO LIVE ADS:** Five previously released games plus `rate-my-duck.html` and `useless-job-simulator.html`. Both added to hub Quick Play cards, detailed experiment grid, inter-game navigation, share links and daily challenge rotation. The primary home and SaaS/services site remain intact.
- **PR #73 MERGED:** Rate My Duck — name, mood, optional image preview using browser-local object URLs, explicitly **fictional randomized rating** (not AI or image analysis), three funny metrics, local-only top-six Hall of Fame, PNG verdict export and web-share/copy fallback. 19/19 Chromium checks on its PR. Photos are never uploaded, scored by vision, or stored.
- **PR #75 MERGED:** Hide unpublished Creator Earnings Tracker, Menu & Profile Designer and Stream Schedule Builder section from public Labs. Ideas remain for later; not released or advertised.
- **PR #74 CLOSED unmerged**, superseded after shared CSS landed; **PR #76 MERGED** Useless Job Simulator — office busywork, coffee/energy, five promotion tiers to Senior Vice Potato, decision memos every fifth task, five achievements, local persistence/reset, share/copy. 22/22 Chromium checks on #76.
- **PR #77 MERGED:** Seven-game Labs hub/discoverability launch. **23/23 browser checks PASS**, covering seven pages' navigation/mobile widths, new game interactions, WCAG axe checks, existing games and social metadata. Static quality and seven-image SVG-to-PNG CI passed. Sitemaps now list **17 URLs** (Labs page includes Don't Push the Button; six other games have dedicated URLs).
- **Production:** GitHub Actions post-merge preview generator committed all seven PNGs to main in **`9df4d652bdc415a9dceba6b041df99590f6e4a29`**. Updated Labs preview PNG SHA **`798e48fd59b4e2c77e7b76bcb538a64eeb3448c6`**, plus duck share PNG SHA `9b836d928f3d068852c84677be426496fe8a2ba4`, job share PNG SHA `252bea36c99067865bff1af0933dd2a60776772a`. GitHub Pages deployment **run 38297820632 passed** for generated commit.
- **Search Console (user screenshot):** Live inspection of `https://technicade.tech/sitemap.xml` reports **URL available to Google, Crawled as Google Inspection Tool smartphone, Crawl allowed Yes, Page fetch Successful, Indexing allowed Yes** at October 12, 2:14 PM local. This proves Google's *live inspection fetched XML*, but the separately submitted sitemap still showed **Sitemap could not be read / 0 discovered via sitemap**. Don't request indexing on XML solely to fix ingestion. Wait and recheck submitted sitemap; inspect any new error details.
- **AdSense** last user-confirmed status: `technicade.tech` **Getting ready**, `ads.txt` **Not found** in account, despite public HTTP 200 correct publisher record. This is not approval. No ad placements enabled. Preserve Cloudflare Analytics, ads.txt, privacy/terms and Google account verification.
- **Still-needed:** user mobile/Safari/Firefox visual/gameplay QA; actual Meta Sharing Debugger for refreshed **7**-game social image and each new game; Google sitemap ingestion recheck and AdSense recognition/approval; performance Lighthouse + focus/keyboard manual audit. No real traffic/revenue claims made.
- **Read-only production diagnostics** have been expanded in a follow-up PR to verify the 17-entry sitemap, all seven pages, shared CSS and each new PNG, after the new Pages deployment. Record its GitHub Actions run result before closing that QA gate.

## Current verified state — October 12, 2026, after Meta/GSC screenshots

### Meta Facebook Sharing Debugger: P0 CLOSED — USER-VERIFIED
- Fresh user screenshot of `https://technicade.tech/labs.html` shows the corrected **5** inside the Facebook link-preview image; `og:url`, `og:type`, `og:title`, `og:description` and the versioned `og:image` URL are all present in debugger's resolved properties.
- Only remaining debugger warning is **`fb:app_id` missing**. An App ID is not required for normal sharing of a web page; no need to create an app or add an invented ID.
- Confirmed completion of previously open homepage share-image cache P0 from PR #70. **Four other standalone game previews remain to be checked individually** if promotion uses their URLs.

### Google Search Console sitemap: ACCOUNT-REPORTED ERROR, NOT CODE-VERIFIED FAILURE
- User screenshot of the sitemap detail page: `https://technicade.tech/sitemap.xml`, **Last read 10/12/26**, **Sitemap could not be read**, **0 discovered pages via this sitemap**. This is not evidence that all website URLs are unindexed.
- User browser screenshot shows the XML tree and 15 absolute Technicade URLs. The browser's "does not appear to have any style information" is expected for raw XML and **not an error**.
- Independent GitHub Actions run **38286741709** (PR #69) already retrieved the live sitemap over HTTPS as HTTP **200**, `application/xml`, valid XML with 15 URLs; same for simulated Googlebot UA. `robots.txt` is public and allows crawling, references sitemap.
- **No demonstrated sitemap encoding, structure or public HTTP defect to fix in code.** Search Console still reports a read/processing problem; actual Google crawl/index state cannot be verified from GitHub's simulated-agent tests. Google may retry failed sitemap fetches for a few days, per official Search Console Help.
- Recommended one-time user diagnostic: Search Console URL Inspection for `https://technicade.tech/sitemap.xml`, **Test live URL**, expand `Page availability` / `Page fetch` / `Crawl allowed?`. For a sitemap XML file, indexability itself is irrelevant; the live fetch status is what matters. Also test `https://technicade.tech/labs.html` and review **Security & Manual Actions → Manual actions**. If Google can fetch both, wait a few days and recheck sitemap status; do not repeatedly replace/resubmit the unchanged sitemap. If a concrete Google fetch error is reported, investigate that exact error.
- Official guidance: https://support.google.com/webmasters/answer/7451001 and https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

### AdSense: PENDING — NO LIVE ADS
- Last account screenshot: `technicade.tech` **Getting ready**, `ads.txt` **Not found**, despite live public `/ads.txt` being HTTP 200 `text/plain` with configured publisher record. Google status has not been checked again in this new screenshot set.
- Leave verification metadata, `ads.txt`, Cloudflare Analytics and no-live-ad posture unchanged; wait for Google recognition/approval before considering actual ad serving and applicable consent requirements.

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
5. one-more-second.html — 30-second timed target game; personal best saved locally; share/replay. Automated full round and persistence verified; mobile touch still needs manual QA.
6. rate-my-duck.html — fictional duck verdicts, local photos, six-entry browser-only Hall of Fame, share/canvas PNG; Chromium interactions passed.
7. useless-job-simulator.html — rank/energy/CEO memo office game, local save/reset/share; Chromium interactions passed.

## Homepage and UX — MERGED
- Labs added to main site navigation (desktop and relevant mobile links).
- Quick Play cards link to seven games; info/FAQ/how-to sections; inter-game navigation.
- Daily challenge rotates with device local date and links to corresponding game; copy challenge, mark completed locally.
- Local daily visit streak; share Labs and copy link. Daily prompt selection/completion are not server verified.
- Creator Earnings Tracker, Menu/Profile Designer and Stream Schedule Builder are hidden from public Labs by PR #75. Future concepts only; no product integrations, billing or ads.

## Analytics / SEO / AdSense
- Cloudflare Web Analytics on main home, services, products, Labs and six standalone games; user screenshot: 7 pageviews, 0 visits in early sample. USER-VERIFIED ingestion. Reevaluate metric definitions and coverage of remaining site pages.
- Google Search Console DNS-domain property USER-VERIFIED. Sitemap: https://technicade.tech/sitemap.xml submitted but screenshot showed 'Couldn't fetch', while direct XML loads and Labs live URL inspection reported indexable. Pending recheck.
- AdSense publisher: pub-6059025745588128; site verification and 'Review requested' USER-VERIFIED on October 12, 2026, 11:31 AM. Status 'Getting ready'. NOT approved. No live ads / ad units / Auto ads.
- Root ads.txt record USER-VERIFIED publicly:
  google.com, pub-6059025745588128, DIRECT, f08c47fec0942fa0
  AdSense previously showed 'Not found'; await crawl update.
- privacy.html updated for analytics and future ads. Audit wording, real-world implementation, regional consent and ad placement before enabling ads.

## Social preview assets — historical P0 now closed for Labs share image
- Seven 1200x630 share PNGs and source SVGs are in assets/; og:image/twitter metadata points at PNGs.
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
[x] Confirm new Labs homepage PNG on public GitHub Pages and verify corrected image in Meta Sharing Debugger (user screenshot 2026-10-12).
[ ] Verify all four standalone game URLs' social previews separately.
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

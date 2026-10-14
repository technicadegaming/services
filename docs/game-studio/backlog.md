# Technicade Game Studio backlog
## P0 — Verify the real deployment
- [ ] Verify technicade.tech/arcade-empire.html responds 200 publicly, and inspect Pages deployment settings. Earlier user reported 404.
- [ ] Confirm labs.html links all playable games; investigate broken links and sitemap.
- [ ] Establish real browser smoke tests on desktop and mobile, not merely Vercel service portal readiness.

## P1 — Arcade Empire pilot
- [x] Local simulation: repair, salvage auction, upgrades, daily revenue, milestones, local autosave.
- [ ] Gameplay QA: test cash accounting, capacity, offline saves and event integrity.
- [ ] Improve game economy and long-term goals; add daily customer events and meaningful decisions.
- [ ] Introduce save migration and player-facing export/import.
- [ ] Add visual arcade floor and animated customer interactions.
- [ ] Create Supabase server-authoritative action endpoints and authentication; database schema is a proposal, not applied.
- [ ] Balance early-game earn/repair costs, test across 30+ simulated days.
- [ ] Protect player save data and implement clear account deletion/export.
- [ ] Cosmetics-only Stripe test checkout and verified idempotent webhooks, owner approval required.

## P2 — Game Studio agent
- [x] Agent instructions and game registry.
- [x] Draft branch/PR safety process.
- [ ] Set up PR-only CI game checks and preview URL verification.
- [ ] Choose a controlled coding-agent runtime and budget; configure least-privilege GitHub credentials.
- [ ] Set up optional scheduled worker after owner approval.
- [ ] Create a private admin dashboard for game/backlog/activity/approvals.

### Status definitions
idea → planned → developing → testing → preview-ready → approval → published → improving

### Work authorization
The owner authorizes development and tests on branches, but production publishing and any changes involving payments, account security, or database access need explicit review.

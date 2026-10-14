# Arcade Empire commercial readiness assessment

Assessment date: 2026-10-14. Status: **prototype, not ready for a commercial launch**. The playable local slice has deterministic tests and emulated browser smoke checks, but production routing, physical-device behavior, identity, data portability across devices, asset clearance and purchase obligations are unresolved.

| Gate | Current evidence | Remaining decision or test |
| --- | --- | --- |
| Core game | Local arcade floor, customer sales, prices, repairs, scheduled service, visitor tickets and stock redemption, milestones and cash activity pass tests. Three fixed-seed 90-day cabinet/prize scenarios pass accounting checks; the counter pays back narrowly with three maintained cabinets by day 90 but trails with two. Two further seeded cadence comparisons show eager double stocking raises gross but lowers ending cash versus alternate-day stocking. The in-game seven-day after-stock report is arcade-wide, not counter-specific return. | Human play sessions, broader counter stocking/balance review, richer visual feedback and performance review. |
| Reliability | Local save key migration, import/export, corrupt-save download and deterministic accounting tests pass. Floor keyboard Tab order passes local Edge smoke. | Cross-browser, physical-device and screen reader tests; save conflict/recovery UX and accessibility audit. |
| Deployment | Labs contains a local link; local HTTP assets load in Edge. | Verify GitHub Pages source and all public routes from a network with access; resolve reported 404 before publishing claims. |
| Identity and cloud saves | No account connection. Browser state is not authoritative. | Confirm correct Supabase project/auth flow, review SQL/RLS and server action design, approve migration and data export/deletion. |
| Monetization | Design only, no real charges. | Validate whether optional cosmetics/content are suitable, complete legal/tax/privacy/age review, then separately approve Stripe test integration and restore/refund flows. |
| Originality | New floor styling and game logic authored locally; emoji and fictional names documented. | Commission or license polished artwork/sound and perform trademark/similarity review. |
| Analytics | No Arcade Empire telemetry added. | Define a privacy-respecting aggregate measurement plan, retention and consent rules before considering any provider. Useful local, non-identifying indicators: completed plays, walkouts, per-cabinet sales, and day net by game version. |

Later multi-location and attraction work should reuse validated economy actions, explicit location IDs and route grids, with each location's operating costs and inventory separated. This is architecture direction only; no unfinished location subsystem is exposed to players.

No conversion, retention, financial return, legal compliance or public availability claims are verified by this assessment.

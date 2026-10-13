# Technicade Project Status and Next Actions

Last updated: 2026-10-12
This is a portfolio-level index, not a declaration that every Technicade product is tested or live.

## WhatToDoNow (formerly WausauNow)
- Repo: https://github.com/technicadegaming/WausauNow
- Product: https://whattodonow.technicade.tech
- Vercel: Technicade team / wausau-now
- Status: Git-connected production build READY, Vercel custom domain DNS correctly configured; live search not verified because production environment variables are NOT added.
- Immediate user task: add GOOGLE_PLACES_API_KEY and optional TICKETMASTER_API_KEY (plus weather/Supabase only where needed) in Vercel Production environment, then redeploy.
- Next engineering tasks: end-to-end search verification, accurate event/date/free filters and ranking, city geocoding/radius, multi-source events, rate limiting/quota and security checks.
- Detailed tracker: https://github.com/technicadegaming/WausauNow/blob/main/TECHNICADE_WHATTODO_NOW_TRACKER.md

## Portfolio context
- Technicade Software & Tools catalog includes WhatToDoNow.
- Other products discussed in project: Technicade Tools/FixFinder, DoneDate, ShiftCheck, EquipmentQR, ExceptionDesk, Digital Store, Labs, and content/article system. Do not infer production health from this index; audit their respective repositories and runtime checks before changing statuses.
- Separate Labs tracker: TECHNICADE_LABS_MASTER_TRACKER.md.

## Important global follow-ups
- Recheck public product landing links after deployments.
- Check all product environment configs, API usage controls and billing/webhooks individually.
- Keep consistent product inventory, current status, blockers, URLs, source repos, Vercel and Supabase project ownership, costs, tests, and next actions.

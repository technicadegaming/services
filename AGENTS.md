# Technicade Game Studio — Codex instructions

Read `.github/agents/technicade-game-studio.agent.md` first.
Read `docs/game-studio/backlog.md` and `docs/game-studio/registry.json` before selecting tasks.

## Coding boundaries
- Work on a development branch; open a draft pull request. Never merge or publish without owner approval.
- Arcade Empire (`arcade-empire.html`) is the pilot. Respect existing game saves and the `technicade.tech` public deployment.
- Run `python3 scripts/game-studio/check_arcade_empire.py` after each Arcade Empire edit. Check link health and browser behavior separately.
- Do not edit payments, authentication, security configuration, Supabase databases, GitHub secrets or deployment domains without separate approval.
- Prefer a small, testable change and a PR to broad speculative rewrites.
- Reports must distinguish committed, tested, deployed and user-verified statuses.

## Recommended first task
Investigate the reported 404 on `https://technicade.tech/arcade-empire.html` using GitHub Pages hosting and GitHub Actions, then diagnose without guessing. Once route is verified, test Arcade Empire in-browser on mobile and desktop and improve the gameplay loop.

## Development mode
Use ChatGPT-signed-in Codex where available. No OpenAI API key or additional paid service is required for interactive Codex. An unattended GitHub Actions coding runner is not enabled.

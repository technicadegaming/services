# Windows Codex scheduled development — operator guide

**Status:** safe local automation starter. Requires user-side installation, local testing, and Task Scheduler activation. Does not activate from a GitHub commit.

## Why
Codex CLI supports ChatGPT sign-in and non-interactive `codex exec`. It can work inside a local checkout on your Windows PC. No API key is necessary if CLI sign-in uses eligible ChatGPT access. Subscription limits still apply.

## Initial one-time setup (PowerShell)
1. Install Git for Windows, Python 3, and Codex CLI. Official Windows install: `npm install -g @openai/codex` (Node.js required); alternatively use the OpenAI standalone installer. Verify using `git --version`, `py -3 --version`, `codex --version`.
2. Run `codex` interactively and choose **Sign in with ChatGPT**, not API key.
3. Clone locally:
   ```powershell
   New-Item -ItemType Directory -Force "$HOME\TechnicadeGameStudio" | Out-Null
   git clone https://github.com/technicadegaming/services.git "$HOME\TechnicadeGameStudio\services"
   Set-Location "$HOME\TechnicadeGameStudio\services"
   git switch game-studio/arcade-empire-pilot
   ```
4. Check that `git status --short` returns no output, then run `py -3 scripts/game-studio/check_arcade_empire.py`.
5. Manually test the local runner **once**, and inspect output and diff before scheduling:
   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\game-studio\run-local.ps1
   git diff
   ```
   The runner **intentionally refuses a dirty working tree**. If it edits files, manually review, commit to a development branch, and reset to clean before another run. It never auto-pushes or merges. This also means it will not run another editing task while an unreviewed change remains.

## Schedule using Windows Task Scheduler (GUI; safer first)
1. Start > search **Task Scheduler** > **Create Basic Task**.
2. Name: `Technicade Game Studio Review`. Trigger: Daily, choose e.g. 9:00 AM.
3. Action: **Start a program**. Program: `powershell.exe`. Arguments:
   `-NoProfile -ExecutionPolicy Bypass -File "%USERPROFILE%\TechnicadeGameStudio\services\scripts\game-studio\run-local.ps1"`
4. Run only when user is logged on initially (Codex sign-in credentials must be available). Choose **Do not start a new instance** in Task Settings. Do not choose highest privileges.
5. Ensure the PC is awake, online and logged in. Run task manually once from Task Scheduler, check `.game-studio-logs`.

## Important boundaries
- The task is **disabled until you create and enable it on your own Windows PC**.
- A ChatGPT login might expire, and Codex may hit plan limits; inspect logs.
- Script is cautious: no push, merge, billing operations or web deployment.
- Codex might modify local files, so use a non-sensitive test checkout and review diffs.
- Windows process time limit is not enforced by the runner parameter; set **Stop the task if it runs longer than 1 hour** in Task Scheduler.
- Daily unattended production publishing is **not enabled**.
- GitHub PR #102 remains approval-first.

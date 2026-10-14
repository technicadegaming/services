# Arcade Empire goal-driven local Codex sessions

Use this when you want more than one small edit. This is a **bounded, multi-pass local worker**, not an endless process.

## Start
1. Open PowerShell.
2. `cd "$HOME\TechnicadeGameStudio\services"`
3. `git pull --ff-only` (only with a clean tree).
4. `git status --short` should show nothing.
5. Run `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\game-studio\run-goal.ps1 -MaxMinutes 45 -MaxPasses 4`.

The terminal prints timestamped updates before and after each Codex pass. While a pass runs, watch detailed output in **another PowerShell window**:
```powershell
cd "$HOME\TechnicadeGameStudio\services"
Get-ChildItem .game-studio-logs\session-*-pass-*.txt | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | Get-Content -Tail 20 -Wait
```
Use Ctrl+C to stop **watching**; it doesn't stop the worker.

## Completion and safeguards
- Codex must write DONE or INCOMPLETE in per-pass result files. DONE is a **self-report**, not proof. Review tests and actual visuals.
- No pushes, commits, merges, or live releases. Browser-local save format must remain compatible.
- The next pass builds on local modifications instead of failing because the tree is dirty.
- MaxMinutes is checked **between passes**, so one long pass may exceed it. If you need a hard cutoff, launch through Windows Task Scheduler with its execution-time limit.
- Each pass uses some ChatGPT Codex allowance. Rate limits, failures and crashes may stop execution earlier. Do not assume it can always finish.
- If you're on the wrong branch or have unreviewed edits before starting, runner refuses to start.
- After finishing: `py -3 scripts/game-studio/check_arcade_empire.py`, `git diff --check`, `git diff --stat`, visually test browser, and review full diff.

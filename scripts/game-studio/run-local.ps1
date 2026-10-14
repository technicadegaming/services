param(
  [string]$RepoPath = "$HOME\TechnicadeGameStudio\services",
  [int]$MaxMinutes = 45
)
$ErrorActionPreference = "Stop"
$branch = "game-studio/arcade-empire-pilot"
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logs = Join-Path $RepoPath ".game-studio-logs"
New-Item -ItemType Directory -Force -Path $logs | Out-Null
$logFile = Join-Path $logs "run-$stamp.log"
try {
  Set-Location $RepoPath
  if (!(Test-Path "AGENTS.md") -or !(Test-Path "docs/game-studio/backlog.md")) { throw "Missing Game Studio files. Check out the pilot branch." }
  if ((git status --porcelain).Length -gt 0) { throw "Working tree not clean. Do not overwrite local edits." }
  $current = (git branch --show-current).Trim()
  if ($current -ne $branch) { throw "Wrong branch: $current. Expected $branch." }
  # Fetch is read-only to local working files. Avoid unattended pull/rebase, push, merges, or deployment.
  # Git writes fetch progress to stderr even on success; do not treat it as a PowerShell terminating error.
  $previousErrorAction = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    git fetch --quiet origin $branch 2>> $logFile
    $fetchExit = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previousErrorAction
  }
  if ($fetchExit -ne 0) { throw "Git fetch failed with exit code $fetchExit. See $logFile" }
  $task = @'
Read AGENTS.md, docs/game-studio/backlog.md and docs/game-studio/registry.json.
Run Arcade Empire source tests and inspect the highest-priority unblocked Arcade Empire task.
Make ONE focused, reversible improvement to arcade-empire.html or its local tests.
Do not change payments, Supabase schema, auth, production deployment, or secrets.
Do not git commit, push, merge, create PRs, or contact external services.
Do not use the Internet to download scripts or packages.
Run python3 scripts/game-studio/check_arcade_empire.py (or py -3 on Windows) if available.
Summarize changed files, test results, risks and next steps.
If the repository or tests are not ready, stop and report blockers without changing files.
'@
  $cmd = Get-Command codex -ErrorAction Stop
  Write-Output "Starting Codex (no automatic Git publishing)" | Tee-Object -FilePath $logFile -Append
  # Invoke through PowerShell so Windows npm-installed codex.ps1 shims work correctly.
  # Prompt is passed as a single argument; output is captured for review.
  & $cmd.Source exec --sandbox workspace-write --ephemeral $task *> (Join-Path $logs "output-$stamp.txt")
  $resultCode = $LASTEXITCODE
  "Codex exit code: $resultCode" | Tee-Object -FilePath $logFile -Append
  git status --short | Tee-Object -FilePath $logFile -Append
  Write-Output "Review results in $logs. Changes stay local; never auto-pushed." | Tee-Object -FilePath $logFile -Append
} catch {
  "Game Studio stopped safely: $_" | Tee-Object -FilePath $logFile -Append
  exit 1
}

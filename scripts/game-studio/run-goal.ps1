param(
  [string]$RepoPath = "$HOME\TechnicadeGameStudio\services",
  [int]$MaxMinutes = 45,
  [int]$MaxPasses = 4
)
$ErrorActionPreference = "Stop"
$branch = "game-studio/arcade-empire-pilot"
$startTime = Get-Date
$session = $startTime.ToString("yyyyMMdd-HHmmss")
$logs = Join-Path $RepoPath ".game-studio-logs"
New-Item -Path $logs -ItemType Directory -Force | Out-Null
$activity = Join-Path $logs "session-$session.log"
function Report([string]$text) {
  $line = "[$(Get-Date -Format 'HH:mm:ss')] $text"
  Write-Host $line
  Add-Content -Path $activity -Value $line
}
try {
  Set-Location $RepoPath
  if (!(Test-Path "AGENTS.md") -or !(Test-Path "docs/game-studio/backlog.md")) { throw "Game Studio instructions missing" }
  if ((git branch --show-current).Trim() -ne $branch) { throw "Switch to $branch first" }
  if (@(git status --porcelain).Count -gt 0) { throw "Unreviewed local changes. Save or commit them before running." }
  $cmd = Get-Command codex -ErrorAction Stop
  Report "Starting goal-driven Arcade Empire development, maximum $MaxMinutes minutes and $MaxPasses passes."
  Report "Source checkout $RepoPath; all changes stay local."
  $done = $false
  for ($pass=1; $pass -le $MaxPasses; $pass++) {
    $elapsed = ((Get-Date) - $startTime).TotalMinutes
    if ($elapsed -ge $MaxMinutes) { Report "Time budget reached between passes."; break }
    $remaining = [math]::Max(1,[math]::Floor($MaxMinutes - $elapsed))
    $output = Join-Path $logs "session-$session-pass-$pass.txt"
    $report = Join-Path $logs "session-$session-pass-$pass-result.txt"
    $prompt = @"
Read AGENTS.md, docs/game-studio/backlog.md, and docs/game-studio/registry.json.
Goal: FINISH the Arcade Empire visual simulation milestone rather than one isolated edit.
Acceptance: (1) animated responsive arcade floor showing owned machines,
(2) customers visibly walking and interacting with machines, with behavior consistent with the daily economy,
(3) working visual condition/popularity/earnings feedback, (4) desktop/mobile usability,
(5) existing local save compatibility, (6) automated tests updated and passing.
This is pass $pass of at most $MaxPasses, with approximately $remaining minutes left in the overall session.
Inspect uncommitted changes from earlier passes; build on them rather than overwriting them.
Write and run tests. Fix failures. Do not claim full completion without verifying every criterion.
NO changes to payments, Supabase, auth, hosting, secrets or other applications. Do not commit, push, merge, publish, or create PRs.
Stay within the existing project and don't install new dependencies or make external network calls.
Update this pass report at $report with first line exactly DONE if all criteria pass, otherwise INCOMPLETE,
then list criteria completed, tests run, blockers, and remaining work.
Keep going until the milestone is truly satisfied or this pass ends; do not stop after only one small edit unless blocked.
"@
    Report "Pass $pass/$MaxPasses running. Elapsed $([math]::Round($elapsed,1)) min. Detailed log: $output"
    # Prevent Windows PowerShell 5.1 from treating native stderr diagnostics as terminating errors.
    $oldAction = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    try {
      & $cmd.Source exec --sandbox workspace-write --ephemeral $prompt *> $output
      $exitCode = $LASTEXITCODE
    } finally {
      $ErrorActionPreference = $oldAction
    }
    Report "Pass $pass finished with Codex exit code $exitCode."
    if ($exitCode -ne 0) { Report "Stopping due to Codex error. Inspect $output"; break }
    if (Test-Path $report) {
      $first = Get-Content $report -TotalCount 1
      Report "Reported status: $first"
      if ($first -eq "DONE") { $done = $true; break }
    } else { Report "No completion report found; task remains unverified." }
    $testOutput = & py -3 scripts/game-studio/check_arcade_empire.py 2>&1
    $testExit = $LASTEXITCODE
    $testOutput | Out-File -FilePath (Join-Path $logs "session-$session-test-$pass.txt")
    Report "Regression tests exit code: $testExit"
    if ($testExit -ne 0) { Report "Tests failed; next pass should fix. See test log." }
  }
  $changes = @(git status --short)
  Report "Session finished; reported complete: $done; changed entries: $($changes.Count)."
  $changes | ForEach-Object { Report $_ }
  Report "Run tests, inspect git diff and browser-test before any commit or publishing. No automatic push."
} catch { Report "Stopped safely: $_"; exit 1 }

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
Read and follow docs/arcade-empire/master-codex-directive.md as the FULL implementation specification, after reading AGENTS.md and the Game Studio backlog.
This is Codex development pass $pass of a maximum of $MaxPasses in this session, with approximately $remaining minutes remaining.
Continue the existing Arcade Empire project; pick the highest-value unfinished safe task in the master directive and progress tracker.
IMPORTANT: Implement, test and fix multiple related features toward full milestone completion. Do not stop merely because you finished a plan or a small edit.
Inspect uncommitted changes made by earlier passes, build on them safely, and do not overwrite working changes.
Update docs/arcade-empire/development-progress.md and docs/arcade-empire/integration-needs.md as needed, including precise blockers for optional Supabase, Stripe or other external services.
Do not modify external services or credentials, commit, push, merge, open PRs or deploy. No unapproved spending.
Run regression tests, document browser testing limitations and preserve local saves. Do not mistake self-reported success for verification.
Write a UTF-8 pass summary to this exact path: $report
The FIRST LINE must be exactly DONE if the entire CURRENT milestone acceptance criteria are implemented and verified, or INCOMPLETE otherwise.
Subsequent lines must list what changed, exact tests and results, remaining tasks and external-service blockers. If incomplete, propose the next safe task for the next pass.
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
      if ($first -eq "DONE") { $done = $true }
    } else { Report "No completion report found; task remains unverified." }
    $testOutput = & py -3 scripts/game-studio/check_arcade_empire.py 2>&1
    $testExit = $LASTEXITCODE
    $testOutput | Out-File -FilePath (Join-Path $logs "session-$session-test-$pass.txt")
    Report "Regression tests exit code: $testExit"
    if ($testExit -ne 0) { $done = $false; Report "Tests failed; next pass should fix. See test log." }
    if ($done -and $testExit -eq 0) { Report "Self-reported completion and source tests passed; browser review still required."; break }
  }
  $changes = @(git status --short)
  Report "Session finished; reported complete: $done; changed entries: $($changes.Count)."
  $changes | ForEach-Object { Report $_ }
  Report "Run tests, inspect git diff and browser-test before any commit or publishing. No automatic push."
} catch { Report "Stopped safely: $_"; exit 1 }

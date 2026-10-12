#!/usr/bin/env bash
# Read-only production HTTP verification from a GitHub-hosted runner.
set -euo pipefail
base="https://technicade.tech"
temp="$(mktemp -d)"
trap 'rm -rf "$temp"' EXIT
errors=0

echo "Checking publicly deployed Technicade URLs at $base"
echo "DNS addresses:"
getent ahostsv4 technicade.tech | awk '{print $1}' | sort -u || true

fetch() {
  local label="$1" url="$2" ua="$3"
  local headers="$temp/$label.headers" body="$temp/$label.body" status
  status="$(curl --silent --show-error --location --max-time 25 --retry 2 \
    --user-agent "$ua" --dump-header "$headers" --output "$body" \
    --write-out '%{http_code}' "$url")" || status="000"
  local mime
  mime="$(awk 'BEGIN{IGNORECASE=1} /^content-type:/ {x=$0} END{gsub("\r","",x);print x}' "$headers")"
  local length
  length="$(wc -c <"$body" | tr -d ' ')"
  echo "$label: HTTP $status, $mime, $length bytes"
  if [[ "$status" != "200" ]]; then
    echo "::error::$label did not return HTTP 200 (got $status)"
    errors=$((errors+1))
  fi
}
normal='Mozilla/5.0 (compatible; TechnicadeSiteHealth/1.0)'
google='Googlebot/2.1 (+http://www.google.com/bot.html)'
meta='facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'

fetch home "$base/" "$normal"
fetch labs "$base/labs.html" "$normal"
fetch labs-google "$base/labs.html" "$google"
fetch labs-meta "$base/labs.html" "$meta"
fetch sitemap "$base/sitemap.xml" "$normal"
fetch sitemap-google "$base/sitemap.xml" "$google"
fetch robots "$base/robots.txt" "$google"
fetch ads "$base/ads.txt" "$normal"
fetch ads-google "$base/ads.txt" "$google"
fetch social "$base/assets/labs-labs-share.png" "$normal"
fetch social-meta "$base/assets/labs-labs-share.png" "$meta"

if ! grep -q 'google.com, pub-6059025745588128, DIRECT, f08c47fec0942fa0' "$temp/ads.body"; then
  echo "::error::ads.txt publisher record missing"
  errors=$((errors+1))
fi
if ! grep -q 'Sitemap: https://technicade.tech/sitemap.xml' "$temp/robots.body"; then
  echo "::error::robots.txt missing sitemap declaration"
  errors=$((errors+1))
fi
if ! grep -q 'property="og:type"' "$temp/labs-meta.body" ||
   ! grep -q 'property="og:url"' "$temp/labs-meta.body" ||
   ! grep -q 'assets/labs-labs-share.png' "$temp/labs-meta.body"; then
  echo "::error::Meta-like UA could not read required Open Graph metadata"
  errors=$((errors+1))
fi
if [[ -s "$temp/social.body" ]] && ! cmp -s "$temp/social.body" assets/labs-labs-share.png; then
  echo "::warning::Public Labs social PNG differs from repository image"
fi
if [[ ! -s "$temp/social.body" ]]; then
  echo "::error::Social PNG is empty"
  errors=$((errors+1))
fi
python3 - "$temp/sitemap.body" <<'PY'
import sys
from xml.etree import ElementTree
root = ElementTree.parse(sys.argv[1]).getroot()
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
urls = [n.text for n in root.findall("s:url/s:loc", ns)]
assert len(urls) >= 15, f"Expected >=15 sitemap URLs; found {len(urls)}"
assert "https://technicade.tech/labs.html" in urls
assert all(u.startswith("https://technicade.tech/") for u in urls)
print(f"XML sitemap parsed: {len(urls)} Technicade URLs")
PY

echo "HEAD and byte-range checks (206 is normal for a Range request):"
curl --silent --show-error --location --max-time 20 --head \
  --user-agent "$meta" "$base/labs.html" \
  | grep -Ei '^(HTTP/|content-type:|cache-control:|vary:|content-range:)' || true
curl --silent --show-error --location --max-time 20 --range 0-1023 \
  --user-agent "$meta" -o /dev/null --write-out 'Range GET social PNG: HTTP %{http_code}\n' \
  "$base/assets/labs-labs-share.png" || true

if [[ "$errors" -ne 0 ]]; then
  echo "::error::$errors public crawler checks failed"
  exit 1
fi
echo "All required crawler-visible URLs returned HTTP 200 with expected content."

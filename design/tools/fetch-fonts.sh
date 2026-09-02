#!/usr/bin/env bash
# Downloads the Google Fonts used by the concept variations and the video
# compositions into design/fonts/ so the HTML renders identically offline
# (and so the screenshot / video renderers never fall back to system fonts).
# Only the latin subset is kept.
#
# Usage: design/tools/fetch-fonts.sh
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
dir="$root/fonts"
mkdir -p "$dir"
ua="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

fetch() {
  local name="$1" query="$2"
  local css="$dir/$name.css"
  curl -sS -A "$ua" "https://fonts.googleapis.com/css2?${query}&display=swap" -o "$dir/.raw.css"
  # keep only the latin blocks
  awk 'BEGIN{keep=0} /^\/\* /{keep=($0=="/* latin */")} keep{print}' "$dir/.raw.css" > "$css"
  local n=0
  grep -o "https://fonts.gstatic.com[^)]*" "$css" | while read -r url; do
    n=$((n+1))
    local file="${name}-$(echo "$url" | md5sum | cut -c1-8).woff2"
    [ -f "$dir/$file" ] || curl -sS -o "$dir/$file" "$url"
    sed -i "s#${url}#${file}#" "$css"
  done
  rm -f "$dir/.raw.css"
  echo "fetched $name -> $(grep -c '@font-face' "$css") faces"
}

fetch fraunces   "family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400"
fetch dmsans     "family=DM+Sans:wght@400;500;600;700"
fetch jetbrains  "family=JetBrains+Mono:wght@400;500"
fetch newsreader "family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400"
fetch publicsans "family=Public+Sans:wght@400;500;600;700"
fetch bricolage  "family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800"
fetch plexsans   "family=IBM+Plex+Sans:wght@400;500;600"
fetch plexmono   "family=IBM+Plex+Mono:wght@400;500;600"
fetch archivo    "family=Archivo:wght@700;800"
fetch nunito     "family=Nunito:wght@500;600;700;800"
fetch caveat     "family=Caveat:wght@600"

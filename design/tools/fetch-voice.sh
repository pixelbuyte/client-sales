#!/usr/bin/env bash
# Downloads a Piper voice (default en_US-ryan-high) for the demo voiceover.
# Models are ~60-120 MB, so they are not committed; run this once per machine.
# Usage: design/tools/fetch-voice.sh [voice] [dir]
set -euo pipefail
voice="${1:-en_US-ryan-high}"
dir="${2:-$(cd "$(dirname "$0")/.." && pwd)/video/03-demo/voices}"
mkdir -p "$dir"
IFS=- read -r lang name quality <<<"$voice"      # en_US ryan high
base="https://huggingface.co/rhasspy/piper-voices/resolve/main/${lang%%_*}/${lang}/${name}/${quality}/${voice}"
for ext in onnx onnx.json; do
  [ -f "$dir/$voice.$ext" ] || curl -sSL -o "$dir/$voice.$ext" "$base.$ext"
done
python3 -c "import piper" 2>/dev/null || pip install -q piper-tts
echo "voice ready: $dir/$voice.onnx"

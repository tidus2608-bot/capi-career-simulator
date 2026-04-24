#!/usr/bin/env bash
# ============================================================
#  Capi — Push update → Cloudflare auto-deploys
#  Usage: bash update.sh "your commit message"
# ============================================================
MSG="${1:-update: rebuild from Cowork}"
git add -A
git commit -m "$MSG"
git push
echo ""
echo "✅ Pushed to GitHub — Cloudflare is deploying now."
echo "   Watch: https://dash.cloudflare.com → Workers & Pages → capi-career-simulator"

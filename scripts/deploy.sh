#!/usr/bin/env bash
# Publish dist/ to the gh-pages branch.
#
# This exists because the GitHub token here lacks the `workflow` scope, so the
# Actions workflow in .github/workflows/deploy.yml cannot be pushed yet. Once
# someone runs `gh auth refresh -s workflow` and commits that file, Pages builds
# itself on every push to main and this script becomes redundant.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

REMOTE="$(git config --get remote.origin.url)"

npm run check:boards
npm run build

# A throwaway repo inside dist/: the outer repo ignores dist/, so this never
# touches the source history.
rm -rf dist/.git
git -C dist init -q
git -C dist add -A
git -C dist -c user.name="Jens" -c user.email="jens.stijn@gmail.com" \
  commit -q -m "Deploy Flipdown ($(git rev-parse --short HEAD))"
git -C dist push -q -f "$REMOTE" HEAD:gh-pages
rm -rf dist/.git

echo "deployed $(git rev-parse --short HEAD) to gh-pages"

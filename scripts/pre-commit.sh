#!/usr/bin/env bash
set -e

echo "preparing for commit..."

git pull
git pull --tags
npm run lint
npm run test
npm run build
git add -A

echo "preparing for commit complete!"

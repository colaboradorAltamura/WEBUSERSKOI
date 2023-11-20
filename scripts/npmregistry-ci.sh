#!/usr/bin/env bash
set -e

echo "deploying... ${VS_GITHUB_NPM_TOKEN}"

echo "//npm.pkg.github.com/:_authToken=${VS_GITHUB_NPM_TOKEN}" >> .npmrc

echo "deploy complete!"

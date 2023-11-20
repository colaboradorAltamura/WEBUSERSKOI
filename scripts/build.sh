#!/usr/bin/env bash
set -e

echo "building..."

next build

next export

echo "build complete!"

#!/usr/bin/env bash
set -e

echo "Starting local firebase ..."

export PORT=3006
craco start

echo "Finished local firebase!"

 #!/usr/bin/env bash
set -e
nvm-guard

echo "making files pretty..."

prettier --write "**/*.{json,md,yml,js,ts,tsx}"

echo "files are now pretty!"

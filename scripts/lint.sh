#!/usr/bin/env bash
set -e

echo "linting..."

npm run prettier
eslint . --fix --cache --max-warnings=0 --ext ts,tsx,js,jsx

# eslint --fix \"src/**/*.{js,jsx,ts,tsx}\"

echo "lint complete!"

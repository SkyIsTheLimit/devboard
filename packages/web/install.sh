#!/bin/bash
set -e

echo "Starting install process..."
echo "VERCEL_ENV: $VERCEL_ENV"

if [ "$VERCEL_ENV" = "production" ]; then
  echo "🚀 Production install: installing from npm registry"
  cd ../..
  npm install
else
  echo "🔧 Preview install: installing with workspace dependencies"

  # Navigate to monorepo root and install all workspace dependencies
  cd ../..
  npm install
fi

echo "✅ Install complete!"

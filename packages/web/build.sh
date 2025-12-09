#!/bin/bash
set -e

echo "Starting build process..."
echo "VERCEL_ENV: $VERCEL_ENV"

if [ "$VERCEL_ENV" = "production" ]; then
  echo "🚀 Production build: using npm registry package"
   # Navigate to monorepo root
  cd ../..

  # Build the UI package first
  echo "Building UI package..."
  npm run build --workspace=packages/ui

  # Navigate back to web package
  cd packages/web

  # Build the web app
  echo "Building web app..."
  
  npm run build
else
  echo "🔧 Preview build: using local workspace package"

  # Navigate to monorepo root
  cd ../..

  # Build the UI package first
  echo "Building UI package..."
  npm run build --workspace=packages/ui

  # Navigate back to web package
  cd packages/web

  # Build the web app
  echo "Building web app..."
  npm run build
fi

echo "✅ Build complete!"

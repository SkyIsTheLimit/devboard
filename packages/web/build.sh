#!/bin/bash
set -e

# Run Prisma migration (only in production environment or if needed)
if [ -n "$DATABASE_URL" ]; then
  npx prisma migrate deploy
fi

# Build using Turbo from the root
# This ensures @devboard-interactive/ui is built first, then @devboard-interactive/web
cd ../..
npx turbo run build --filter=@devboard-interactive/web...

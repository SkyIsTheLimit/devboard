#!/bin/bash
set -e

[ "$VERCEL_ENV" = "production" ] && npm run build || (cd ../.. && npm run build --workspace=packages/ui && cd packages/web && npm run build)

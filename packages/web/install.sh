#!/bin/bash
set -e

[ "$VERCEL_ENV" = "production" ] && npm install --no-workspaces || (cd ../.. && npm install)

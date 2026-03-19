#!/bin/bash
set -e

# Always install dependencies from root (monorepo structure)
cd ../..
npm ci

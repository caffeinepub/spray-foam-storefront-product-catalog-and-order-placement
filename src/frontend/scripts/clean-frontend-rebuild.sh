#!/bin/bash

# Foam Daddy Storefront - Clean Frontend Rebuild Script
# This script performs a deterministic, clean rebuild of the frontend
# to ensure reliable deployments without altering application behavior.

set -e  # Exit on any error

echo "🧹 Starting clean frontend rebuild..."

# Navigate to frontend directory
cd "$(dirname "$0")/.."

echo "📦 Step 1: Removing build artifacts and caches..."
rm -rf dist
rm -rf node_modules/.vite
rm -rf .turbo

echo "📦 Step 2: Reinstalling dependencies..."
pnpm install --frozen-lockfile

echo "🔍 Step 3: Running TypeScript type check..."
pnpm typescript-check

echo "🔨 Step 4: Building frontend..."
pnpm build:skip-bindings

echo "✅ Step 5: Verifying build output..."
if [ ! -d "dist" ]; then
  echo "❌ Error: dist directory not created"
  exit 1
fi

if [ ! -f "dist/index.html" ]; then
  echo "❌ Error: dist/index.html not found"
  exit 1
fi

if [ ! -f "dist/404.html" ]; then
  echo "❌ Error: dist/404.html not found"
  exit 1
fi

echo "✅ Clean frontend rebuild completed successfully!"
echo ""
echo "📊 Build summary:"
echo "  - Build directory: $(pwd)/dist"
echo "  - Total files: $(find dist -type f | wc -l)"
echo "  - Total size: $(du -sh dist | cut -f1)"
echo ""
echo "🚀 Ready for deployment!"

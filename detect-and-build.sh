#!/bin/bash
set -e

echo "🚀 Starting Build System for app: $DEPLOY_APP (triggered by Coolify Watch Paths)"

TARGET_APP="$DEPLOY_APP"

if [ -z "$TARGET_APP" ]; then
    echo "❌ CRITICAL ERROR: DEPLOY_APP build argument was not provided by Coolify."
    exit 1
fi

if [ ! -d "apps/$TARGET_APP" ] || [ ! -f "apps/$TARGET_APP/package.json" ]; then
    echo "❌ Cannot build: apps/$TARGET_APP is not a valid app directory or missing package.json."
    echo "   (DEPLOY_APP was set to: $TARGET_APP)"
    exit 1
fi

echo ""
echo "🎯 BUILDING APP: $TARGET_APP"
echo "📍 App directory: apps/$TARGET_APP"
echo ""
echo "🔨 Starting build for $TARGET_APP..."

# This assumes your Next.js apps are NOT using output: 'standalone' based on previous clarifications.
# If they were, the build command is the same, but the runner stage would differ.
if pnpm --filter="$TARGET_APP" run build; then
    echo "✅ Successfully built $TARGET_APP using pnpm filter."
    echo "status:success;app:$TARGET_APP" > /tmp/build-summary.txt
else
    BUILD_EXIT_CODE=$?
    echo "❌ Build failed for $TARGET_APP with exit code $BUILD_EXIT_CODE."
    # Attempt to show scripts from package.json for debugging
    if [ -f "apps/$TARGET_APP/package.json" ]; then
        echo "Available scripts in apps/$TARGET_APP/package.json:"
        cat "apps/$TARGET_APP/package.json" | grep -A 10 '"scripts"' || true
    fi
    echo "status:failed;app:$TARGET_APP" > /tmp/build-summary.txt # Indicate failure
    exit $BUILD_EXIT_CODE
fi

echo "$TARGET_APP" > /tmp/target-app.txt # For runner stage

# Optional: Create .build-meta for human debugging
mkdir -p "/app/apps/$TARGET_APP/.build-meta"
date -Iseconds > "/app/apps/$TARGET_APP/.build-meta/build-time" 2>/dev/null || date > "/app/apps/$TARGET_APP/.build-meta/build-time"

# Try to get commit hash if .git directory is available in build context
COMMIT_HASH_TO_STORE="unknown-commit"
if [ -n "$COOLIFY_COMMIT_SHA" ]; then # Prioritize Coolify's commit SHA
    COMMIT_HASH_TO_STORE="$COOLIFY_COMMIT_SHA"
elif [ -n "$GITHUB_SHA" ]; then # Fallback to GitHub SHA
    COMMIT_HASH_TO_STORE="$GITHUB_SHA"
elif git rev-parse --git-dir > /dev/null 2>&1 && git rev-parse HEAD > /dev/null 2>&1; then
    # Fallback to git rev-parse if .git dir exists and other vars are missing
    COMMIT_HASH_TO_STORE=$(git rev-parse HEAD)
else
    echo "⚠️ Could not determine commit hash from ENV vars or local .git directory."
fi
echo "$COMMIT_HASH_TO_STORE" > "/app/apps/$TARGET_APP/.build-meta/commit-hash"
echo "$TARGET_APP" > "/app/apps/$TARGET_APP/.build-meta/app-name"

echo ""
echo "🎉 Build process completed for $TARGET_APP!"
echo "📋 Final Summary: $(cat /tmp/build-summary.txt)"


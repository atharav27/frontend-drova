#!/bin/bash
set -e
echo "🚀 Starting Single App Runtime..."
if [ -f /tmp/target-app.txt ]; then TARGET_APP=$(cat /tmp/target-app.txt); APP_BUILD_SUMMARY_CONTENT=$(cat /tmp/build-summary.txt); echo "📋 Target app: $TARGET_APP"; echo "📄 Build summary: $APP_BUILD_SUMMARY_CONTENT";
else echo "❌ No target app information found!"; exit 1; fi

APP_BUILD_STATUS=$(echo "$APP_BUILD_SUMMARY_CONTENT" | cut -d";" -f1 | cut -d":" -f2)
# If Coolify Watch Paths works, a skipped build won't reach runtime.
# This check is defensive for "failed" status.
if [ "$APP_BUILD_STATUS" != "success" ]; then
    echo "❌ Application $TARGET_APP build was not successful or was skipped (status: $APP_BUILD_STATUS). Cannot start. Exiting."
    exit 1
fi

APP_DIR="./apps/$TARGET_APP"
if [ ! -d "$APP_DIR" ]; then echo "❌ App directory $APP_DIR not found!"; ls -la ./apps/ || true; exit 1; fi

echo "🔍 Starting $TARGET_APP from $APP_DIR..."
cd "$APP_DIR"

echo "📁 Contents of current directory ($APP_DIR):"; ls -la . || true
echo "Contents of .next in $APP_DIR:"; ls -la .next/ || true

# Prefer standalone output if available (smaller runtime)
STANDALONE_SERVER=".next/standalone/server.js"
if [ -f "$STANDALONE_SERVER" ]; then
    echo "▶️  Starting $TARGET_APP using standalone server"
    cd .next/standalone
    # Set PORT environment variable for the server
    export PORT=${PORT:-3000}
    exec node server.js
elif [ -d ".next/standalone" ]; then
    # Check if server.js exists in standalone directory (might be in subdirectory)
    echo "▶️  Found standalone directory, searching for server.js..."
    cd .next/standalone
    if [ -f "server.js" ]; then
        export PORT=${PORT:-3000}
        exec node server.js
    else
        echo "⚠️  Standalone directory found but server.js not found, listing contents:"
        ls -la . || true
        cd ../..
    fi
fi

# Fallback to traditional Next.js start
if [ -f ".next/BUILD_ID" ] && [ -d ".next" ]; then
    echo "▶️  Starting $TARGET_APP using Next.js (npx next start -p $PORT)"
    exec npx next start -p $PORT
elif [ -f "package.json" ] && grep -q '"start"' package.json; then
    echo "▶️  Starting $TARGET_APP using npm start script"
    exec npm start
else
    echo "❌ No valid startup method found for $TARGET_APP in $PWD (expected .next/standalone/server.js or .next/BUILD_ID or npm start script)."
    exit 1
fi


# Use Node.js LTS
FROM node:20.17.0-alpine AS base
RUN apk add --no-cache libc6-compat curl git bash # git is still useful for metadata if .git is present
RUN npm install -g pnpm@9.1.1
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/ ./apps/
RUN pnpm install --frozen-lockfile --prod=false # Ensure devDeps (e.g. PostCSS plugins) are available for builds
COPY . .

FROM base AS builder
ARG DEPLOY_APP
ENV DEPLOY_APP=${DEPLOY_APP}
# Environment variables needed for build time (client inlining).
# NEXT_PUBLIC_API_BASE_URL: backend origin only (e.g. https://backend-drova.onrender.com), no /api/v1 suffix.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_AUTH_BASE_URL
ARG NEXT_PUBLIC_MARKETPLACE_URL
ARG NEXT_PUBLIC_DRIVERJOBS_URL
ARG NEXT_PUBLIC_MARKETPLACE_BASE_URL
ARG NEXT_PUBLIC_DRIVERJOBS_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_AUTH_BASE_URL=${NEXT_PUBLIC_AUTH_BASE_URL}
ENV NEXT_PUBLIC_MARKETPLACE_URL=${NEXT_PUBLIC_MARKETPLACE_URL}
ENV NEXT_PUBLIC_DRIVERJOBS_URL=${NEXT_PUBLIC_DRIVERJOBS_URL}
ENV NEXT_PUBLIC_MARKETPLACE_BASE_URL=${NEXT_PUBLIC_MARKETPLACE_BASE_URL}
ENV NEXT_PUBLIC_DRIVERJOBS_BASE_URL=${NEXT_PUBLIC_DRIVERJOBS_BASE_URL}
# Git SHA variables are still useful if Coolify provides them for metadata
ARG COOLIFY_COMMIT_SHA
ENV COOLIFY_COMMIT_SHA=${COOLIFY_COMMIT_SHA}
ARG GITHUB_SHA
ENV GITHUB_SHA=${GITHUB_SHA}

# --- SIMPLIFIED /detect-and-build.sh ---
COPY detect-and-build.sh /detect-and-build.sh
RUN chmod +x /detect-and-build.sh && /detect-and-build.sh

# --- RUNNER STAGE (For traditional Next.js build, NOT standalone) ---
FROM node:20.17.0-alpine AS runner
RUN npm install -g pnpm@9.1.1
ENV NODE_ENV=production PORT=3000 HOSTNAME="0.0.0.0"
# Ensure public envs exist at runtime as well (server usage)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_AUTH_BASE_URL
ARG NEXT_PUBLIC_MARKETPLACE_URL
ARG NEXT_PUBLIC_DRIVERJOBS_URL
ARG NEXT_PUBLIC_MARKETPLACE_BASE_URL
ARG NEXT_PUBLIC_DRIVERJOBS_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_PUBLIC_AUTH_BASE_URL=${NEXT_PUBLIC_AUTH_BASE_URL}
ENV NEXT_PUBLIC_MARKETPLACE_URL=${NEXT_PUBLIC_MARKETPLACE_URL}
ENV NEXT_PUBLIC_DRIVERJOBS_URL=${NEXT_PUBLIC_DRIVERJOBS_URL}
ENV NEXT_PUBLIC_MARKETPLACE_BASE_URL=${NEXT_PUBLIC_MARKETPLACE_BASE_URL}
ENV NEXT_PUBLIC_DRIVERJOBS_BASE_URL=${NEXT_PUBLIC_DRIVERJOBS_BASE_URL}
RUN apk add --no-cache curl bash wget libc6-compat
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/ /app/apps/
COPY --from=builder --chown=nextjs:nodejs /app/packages/ /app/packages/

COPY --from=builder /tmp/target-app.txt /tmp/target-app.txt
COPY --from=builder /tmp/build-summary.txt /tmp/build-summary.txt

RUN \
    TARGET_APP=$(cat /tmp/target-app.txt) && \
    BUILD_SUMMARY_CONTENT=$(cat /tmp/build-summary.txt) && \
    BUILD_STATUS=$(echo "$BUILD_SUMMARY_CONTENT" | cut -d";" -f1 | cut -d":" -f2) && \
    APP_FROM_SUMMARY=$(echo "$BUILD_SUMMARY_CONTENT" | cut -d";" -f2 | cut -d":" -f2) && \
    \
    echo "Runner Stage - Target App: $TARGET_APP" && \
    echo "Runner Stage - Build Status: $BUILD_STATUS" && \
    echo "Runner Stage - App from Summary: $APP_FROM_SUMMARY" && \
    \
    ( \
        if [ "$BUILD_STATUS" = "success" ] && [ "$TARGET_APP" = "$APP_FROM_SUMMARY" ]; then \
            if [ -d "apps/$TARGET_APP" ] && [ -f "apps/$TARGET_APP/package.json" ]; then \
                echo "Runner: Build was successful for $TARGET_APP. Installing dependencies..."; \
                # Install only production deps for the target app and its workspace deps
                pnpm install --frozen-lockfile --prod --filter="...{./apps/$TARGET_APP}" && \
                echo "Runner: pnpm install completed for $TARGET_APP."; \
            else \
                echo "Runner: Warning - App $TARGET_APP was marked as success, but its directory/package.json missing. Skipping pnpm install."; \
            fi; \
        elif [ "$BUILD_STATUS" = "skipped" ]; then \
            # This case should ideally not happen if Coolify "Watch Paths" is working,
            # as the build wouldn't have been triggered. But handling it defensively.
            echo "Runner: Build was marked as skipped (unexpected if Watch Paths are active). Skipping pnpm install."; \
        else \
            echo "Runner: Build for $TARGET_APP was not successful (status: $BUILD_STATUS) or app mismatch. Skipping pnpm install."; \
        fi \
    ) && \
    echo "Changing ownership of /app" && \
    chown -R nextjs:nodejs /app && \
    echo "Ownership change complete."

COPY start-app.sh /start-app.sh
RUN chmod +x /start-app.sh && chown nextjs:nodejs /start-app.sh

USER nextjs
EXPOSE 3000
CMD ["/start-app.sh"]

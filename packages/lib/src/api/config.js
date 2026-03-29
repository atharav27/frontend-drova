"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = void 0;
exports.getApiBaseUrl = getApiBaseUrl;
/**
 * Get API base URL for different environments
 */
function getApiBaseUrl() {
    // Prefer NEXT_PUBLIC_* for client-side usage; fall back to server var
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
    if (!baseUrl) {
        // During build time or if env vars aren't set
        if (typeof window === 'undefined') {
            // Server-side or build time - use placeholder to allow build
            console.warn('⚠️ API_BASE_URL not set during build, using placeholder');
            console.warn('   Set NEXT_PUBLIC_API_BASE_URL as a Docker build arg in Coolify');
            return 'http://localhost:3000'; // Placeholder for build time
        }
        // Client-side fallback - this should NOT happen in production!
        // If you see this error, NEXT_PUBLIC_API_BASE_URL was not embedded during build
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.error('❌ CRITICAL: API_BASE_URL not embedded during build!');
            if (window.location) {
                // eslint-disable-next-line no-console
                console.error('   Current location:', window.location.origin);
            }
            // eslint-disable-next-line no-console
            console.error('   This means NEXT_PUBLIC_API_BASE_URL was not set as a build arg');
            // eslint-disable-next-line no-console
            console.error('   API calls will fail because they\'re going to the wrong origin');
            // eslint-disable-next-line no-console
            console.error('   FIX: Set NEXT_PUBLIC_API_BASE_URL in Coolify Build Args');
            // Return empty string instead of window.location.origin to make the problem obvious
            // This will cause API calls to fail immediately rather than silently going to wrong URL
            return '';
        }
        // Last resort - return empty string instead of throwing
        console.error('❌ API_BASE_URL not available, API calls will fail');
        return '';
    }
    return baseUrl;
}
/**
 * API configuration with environment-aware settings
 */
exports.apiConfig = {
    // Use getter to avoid calling getApiBaseUrl() during module load/build time
    get baseUrl() {
        return getApiBaseUrl();
    },
    timeout: 30000, // 30 seconds
    retries: 3,
    // Common headers
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
    // API version
    version: 'v1',
    // Get full API URL
    getApiUrl: (endpoint) => {
        const base = getApiBaseUrl();
        // In the browser (client-side), use relative paths to go through Next.js rewrites
        // This avoids CORS issues and allows Next.js to proxy requests to the backend
        if (typeof window !== 'undefined') {
            // Client-side: use relative path so Next.js rewrites can proxy it
            return `/api/v1/${endpoint}`;
        }
        // Server-side (SSR, API routes, build time): use full backend URL if available
        // This is required for proper cookie handling with Set-Cookie headers
        if (/^https?:\/\//i.test(base)) {
            return `${base}/api/v1/${endpoint}`;
        }
        // Fallback to relative path if no base URL (shouldn't happen in production)
        return `/api/v1/${endpoint}`;
    },
};

import { createBaseConfig, getApiBaseUrl } from './base.js';

/**
 * Creates a Next.js config for a specific app with shared base configuration
 * @param {Object} options - App-specific configuration options
 * @param {string} options.appDir - The app directory path
 * @param {boolean} options.enableApiRewrite - Whether to enable API rewrites (default: true)
 * @param {string} options.apiRewriteDestination - Custom API rewrite destination
 * @param {Object} options.customConfig - Additional Next.js config to merge
 */
export function withApp(options = {}) {
  const {
    appDir,
    enableApiRewrite = true,
    apiRewriteDestination,
    customConfig = {},
  } = options;

  if (!appDir) {
    throw new Error('appDir is required in withApp options');
  }

  const baseConfig = createBaseConfig(appDir);

  // Environment variables configuration
  const env = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL,
    ...customConfig.env,
  };

  // API rewrites configuration
  const rewrites = enableApiRewrite ? async () => {
    // For rewrites, we always want to use the backend URL, not the client-side fallback
    const backendUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
    const destination = apiRewriteDestination || `${backendUrl}/api/v1`;

    console.log('🔍 API rewrite destination:', `${destination}/:path*`);

    return [
      {
        source: '/api/v1/:path*',
        destination: `${destination}/:path*`,
      },
    ];
  } : undefined;

  // Merge configurations
  const config = {
    ...baseConfig,
    ...customConfig,
    env,
  };

  // Add rewrites if enabled
  if (rewrites) {
    config.rewrites = rewrites;
  }

  return config;
}

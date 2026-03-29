import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get API base URL for different environments
 */
function getApiBaseUrl() {
  // Always use the direct backend URL for both client and server
  return process.env.API_BASE_URL;
}

/**
 * Base Next.js configuration shared across all apps
 * Updated: Fixed standalone mode issue
 */
export function createBaseConfig(appDir) {
  return {
    transpilePackages: ["@repo/ui", "@repo/lib", "@repo/hooks", "@repo/schemas"],

    experimental: {
      outputFileTracingRoot: join(appDir, '../../'),
    },

    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "user-profiles.localhost",
          port: "4566",
          pathname: "/**",
        },
        // Add more common image patterns here
      ],
    },

    // Common webpack configurations can go here
    webpack: (config, { isServer }) => {
      // Add common webpack modifications
      return config;
    },
  };
}

export { getApiBaseUrl };

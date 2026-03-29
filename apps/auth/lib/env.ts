/**
 * Environment variable validation utility
 * Validates required environment variables and provides helpful error messages
 */

export interface EnvConfig {
  NEXT_PUBLIC_API_BASE_URL?: string;
  NEXT_PUBLIC_AUTH_BASE_URL?: string;
  NEXT_PUBLIC_MARKETPLACE_URL?: string;
  NEXT_PUBLIC_DRIVERJOBS_BASE_URL?: string;
  NEXT_PUBLIC_MARKETPLACE_BASE_URL?: string;
  NEXT_PUBLIC_DRIVERJOBS_URL?: string;
}

/**
 * Validates that required environment variables are set
 * Logs warnings in production, throws errors in development
 */
export function validateEnv(): EnvConfig {
  const env: EnvConfig = {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
    NEXT_PUBLIC_MARKETPLACE_URL: process.env.NEXT_PUBLIC_MARKETPLACE_URL,
    NEXT_PUBLIC_DRIVERJOBS_BASE_URL: process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL,
    NEXT_PUBLIC_MARKETPLACE_BASE_URL: process.env.NEXT_PUBLIC_MARKETPLACE_BASE_URL,
    NEXT_PUBLIC_DRIVERJOBS_URL: process.env.NEXT_PUBLIC_DRIVERJOBS_URL,
  };

  // Check for missing critical variables
  const critical = ['NEXT_PUBLIC_API_BASE_URL', 'NEXT_PUBLIC_MARKETPLACE_URL', 'NEXT_PUBLIC_DRIVERJOBS_BASE_URL'] as const;
  const missing = critical.filter((key) => !env[key]);

  if (missing.length > 0) {
    const errorMsg = `
⚠️  Missing Critical Environment Variables:
${missing.map((key) => `  - ${key}`).join('\n')}

These variables must be set during Docker build time as build args.
In Coolify, add these as Build Args (not just Runtime Env Vars):

${missing.map((key) => `  ${key}=https://your-domain.com`).join('\n')}

Current values:
${Object.entries(env).map(([key, value]) => `  ${key}=${value || 'undefined'}`).join('\n')}
`;

    if (process.env.NODE_ENV === 'development') {
      console.error(errorMsg);
      // Don't throw in dev to allow local development without all env vars
    } else {
      console.warn(errorMsg);
    }
  } else {
    console.log('✅ All critical environment variables are set');
  }

  return env;
}

/**
 * Get a safe environment variable value with fallback
 */
export function getEnvVar(key: keyof EnvConfig, fallback: string = ''): string {
  const value = process.env[key];
  if (!value) {
    console.warn(`⚠️  Environment variable ${key} is not set, using fallback: "${fallback}"`);
    return fallback;
  }
  return value;
}

/**
 * Check if we're running in a browser context
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get the current origin (useful for API fallbacks)
 */
export function getCurrentOrigin(): string {
  if (isBrowser() && window.location) {
    return window.location.origin;
  }
  return '';
}


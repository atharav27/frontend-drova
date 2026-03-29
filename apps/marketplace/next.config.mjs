/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { withApp } from '@repo/next-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Debug only in non-production to avoid noisy logs in build systems
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log('🔍 NEXT_PUBLIC_API_BASE_URL from process.env:', process.env.NEXT_PUBLIC_API_BASE_URL);
}

const nextConfig = withApp({
  appDir: __dirname,
  // Browser calls NEXT_PUBLIC_API_BASE_URL directly; no same-origin /api/v1 proxy
  enableApiRewrite: false,
  customConfig: {
    env: {
      NEXT_PUBLIC_AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
      NEXT_PUBLIC_DRIVERJOBS_BASE_URL: process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL,
      NEXT_PUBLIC_MARKETPLACE_URL: process.env.NEXT_PUBLIC_MARKETPLACE_URL,
    },
  },
});

export default nextConfig;


/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { withApp } from '@repo/next-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = withApp({
  appDir: __dirname,
  // Enable rewrites so the auth app can proxy /api/v1/* to the backend and avoid CORS in the browser
  enableApiRewrite: true,
  customConfig: {
    // Produce a minimal server bundle for slimmer Docker images
    output: 'standalone',
    env: {
      NEXT_PUBLIC_AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
      NEXT_PUBLIC_DRIVERJOBS_BASE_URL: process.env.NEXT_PUBLIC_DRIVERJOBS_BASE_URL,
      NEXT_PUBLIC_MARKETPLACE_URL: process.env.NEXT_PUBLIC_MARKETPLACE_URL,
    },
  },
});

export default nextConfig;

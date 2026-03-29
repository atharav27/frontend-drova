import { NextConfig } from 'next';

export interface AppConfigOptions {
  appDir: string;
  enableApiRewrite?: boolean;
  apiRewriteDestination?: string;
  customConfig?: Partial<NextConfig>;
}

export function createBaseConfig(appDir: string): NextConfig;
export function withApp(options: AppConfigOptions): NextConfig;

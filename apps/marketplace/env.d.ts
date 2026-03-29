// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    API_BASE_URL: string;
    NEXT_PUBLIC_API_BASE_URL: string;
    PORT?: string;
  }
}

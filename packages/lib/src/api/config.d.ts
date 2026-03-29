/**
 * Get API base URL for different environments
 */
declare function getApiBaseUrl(): string;
/**
 * API configuration with environment-aware settings
 */
export declare const apiConfig: {
    readonly baseUrl: string;
    timeout: number;
    retries: number;
    defaultHeaders: {
        'Content-Type': string;
    };
    version: string;
    getApiUrl: (endpoint: string) => string;
};
export type ApiConfig = typeof apiConfig;
export { getApiBaseUrl };
//# sourceMappingURL=config.d.ts.map
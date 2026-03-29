"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosClient = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./api/config");
// Flag to track if a token refresh is already in progress
let isRefreshing = false;
// Queue to store failed requests while refresh is in progress
let failedQueue = [];
/**
 * Process the queue of failed requests after token refresh completes
 */
const processQueue = (error = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        }
        else {
            prom.resolve();
        }
    });
    failedQueue = [];
};
/**
 * Create and configure Axios instance
 */
const createAxiosInstance = () => {
    const instance = axios_1.default.create({
        // Don't set baseURL - we'll use full URLs in apiFetch to avoid build-time issues
        timeout: config_1.apiConfig.timeout,
        withCredentials: true, // Include cookies for authentication
    });
    /**
     * Response interceptor to handle 401 errors and token refresh
     */
    instance.interceptors.response.use((response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;
        // Check if error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                    return instance(originalRequest);
                })
                    .catch((err) => {
                    return Promise.reject(err);
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                // Attempt to refresh the token using the full API URL
                const refreshUrl = config_1.apiConfig.getApiUrl('auth/refresh');
                await axios_1.default.post(refreshUrl, {}, { withCredentials: true });
                // Token refresh successful, process queued requests
                processQueue();
                isRefreshing = false;
                // Retry the original request
                return instance(originalRequest);
            }
            catch (refreshError) {
                // Token refresh failed, reject all queued requests
                processQueue(refreshError);
                isRefreshing = false;
                // Reject the original request
                return Promise.reject(refreshError);
            }
        }
        // For all other errors, reject immediately
        return Promise.reject(error);
    });
    return instance;
};
/**
 * Singleton Axios instance with interceptors configured
 */
exports.axiosClient = createAxiosInstance();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFetch = apiFetch;
const axios_1 = require("axios");
const config_1 = require("./api/config");
const axiosClient_1 = require("./axiosClient");
async function apiFetch(endpoint, options = {}, requiresAuth = false) {
    // Convert RequestInit to AxiosRequestConfig
    const fullUrl = config_1.apiConfig.getApiUrl(endpoint);
    const axiosConfig = {
        method: options.method || 'GET',
        url: fullUrl,
        withCredentials: true, // Always include cookies for authentication
    };
    // Log to verify Axios-based apiFetch is being used with correct URL
    console.log(`🚀 [AXIOS apiFetch] ${axiosConfig.method} ${fullUrl}`);
    // Handle headers
    const headers = {};
    if (options.headers) {
        if (options.headers instanceof Headers) {
            options.headers.forEach((value, key) => {
                headers[key] = value;
            });
        }
        else if (Array.isArray(options.headers)) {
            // HeadersInit as array of tuples
            options.headers.forEach(([key, value]) => {
                headers[key] = value;
            });
        }
        else {
            // HeadersInit as object
            Object.entries(options.headers).forEach(([key, value]) => {
                headers[key] = value;
            });
        }
    }
    // Handle body - convert to data for Axios
    if (options.body) {
        if (options.body instanceof FormData) {
            axiosConfig.data = options.body;
            // Don't set Content-Type for FormData - browser will set it with boundary
        }
        else if (typeof options.body === 'string') {
            axiosConfig.data = options.body;
            // Set Content-Type to application/json if not already set
            if (!headers['Content-Type'] && !headers['content-type']) {
                headers['Content-Type'] = 'application/json';
            }
        }
        else {
            // Assume it's an object and needs to be stringified
            axiosConfig.data = options.body;
            if (!headers['Content-Type'] && !headers['content-type']) {
                headers['Content-Type'] = 'application/json';
            }
        }
    }
    // Set headers if we have any
    if (Object.keys(headers).length > 0) {
        axiosConfig.headers = headers;
    }
    try {
        // Make the request using Axios
        const response = await axiosClient_1.axiosClient.request(axiosConfig);
        // Return response.data directly
        return response.data;
    }
    catch (err) {
        // Handle Axios errors
        if (err instanceof axios_1.AxiosError) {
            const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
            const error = new Error(errorMessage);
            error.status = err.response?.status;
            throw error;
        }
        // Re-throw non-Axios errors
        throw err;
    }
}

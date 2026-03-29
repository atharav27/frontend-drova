"use strict";
/**
 * Centralized API endpoint definitions
 * This provides type-safe endpoint definitions across the application
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoints = exports.jobEndpoints = exports.vehicleEndpoints = exports.userEndpoints = exports.authEndpoints = void 0;
// Auth endpoints
exports.authEndpoints = {
    login: 'auth/login',
    signup: 'auth/signup',
    logout: 'auth/logout',
    refreshToken: 'auth/refresh',
    verifyToken: 'auth/verify',
};
// User endpoints
exports.userEndpoints = {
    profile: 'user/profile',
    updateProfile: 'user/profile',
    uploadAvatar: 'user/avatar',
    verifyEmail: 'user/verify-email',
};
// Vehicle/Marketplace endpoints
exports.vehicleEndpoints = {
    posts: 'vehicle-posts',
    createPost: 'vehicle-posts',
    updatePost: (id) => `vehicle-posts/${id}`,
    deletePost: (id) => `vehicle-posts/${id}`,
    getPost: (id) => `vehicle-posts/${id}`,
    userPosts: 'vehicle-posts/user',
    uploadImages: 'vehicle-posts/images',
};
// Driver Jobs endpoints
exports.jobEndpoints = {
    jobs: 'jobs',
    createJob: 'jobs',
    getJob: (id) => `jobs/${id}`,
    updateJob: (id) => `jobs/${id}`,
    deleteJob: (id) => `jobs/${id}`,
    applications: 'job-applications',
    applyToJob: 'job-applications',
    getApplications: 'job-applications/user',
    getJobApplications: (jobId) => `jobs/${jobId}/applications`,
};
// Export all endpoints
exports.endpoints = {
    auth: exports.authEndpoints,
    user: exports.userEndpoints,
    vehicle: exports.vehicleEndpoints,
    jobs: exports.jobEndpoints,
};

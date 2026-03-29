/**
 * Centralized API endpoint definitions
 * This provides type-safe endpoint definitions across the application
 */

// Auth endpoints
export const authEndpoints = {
  login: 'auth/login',
  signup: 'auth/signup',
  logout: 'auth/logout',
  refreshToken: 'auth/refresh',
  verifyToken: 'auth/verify',
} as const;

// User endpoints
export const userEndpoints = {
  profile: 'user/profile',
  updateProfile: 'user/profile',
  uploadAvatar: 'user/avatar',
  verifyEmail: 'user/verify-email',
} as const;

// Vehicle/Marketplace endpoints
export const vehicleEndpoints = {
  posts: 'vehicle-posts',
  createPost: 'vehicle-posts',
  updatePost: (id: string) => `vehicle-posts/${id}`,
  deletePost: (id: string) => `vehicle-posts/${id}`,
  getPost: (id: string) => `vehicle-posts/${id}`,
  userPosts: 'vehicle-posts/user',
  uploadImages: 'vehicle-posts/images',
} as const;

// Driver Jobs endpoints
export const jobEndpoints = {
  jobs: 'jobs',
  createJob: 'jobs',
  getJob: (id: string) => `jobs/${id}`,
  updateJob: (id: string) => `jobs/${id}`,
  deleteJob: (id: string) => `jobs/${id}`,
  applications: 'job-applications',
  applyToJob: 'job-applications',
  getApplications: 'job-applications/user',
  getJobApplications: (jobId: string) => `jobs/${jobId}/applications`,
} as const;

// Export all endpoints
export const endpoints = {
  auth: authEndpoints,
  user: userEndpoints,
  vehicle: vehicleEndpoints,
  jobs: jobEndpoints,
} as const;

export type Endpoints = typeof endpoints;

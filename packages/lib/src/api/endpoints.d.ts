/**
 * Centralized API endpoint definitions
 * This provides type-safe endpoint definitions across the application
 */
export declare const authEndpoints: {
    readonly login: "auth/login";
    readonly signup: "auth/signup";
    readonly logout: "auth/logout";
    readonly refreshToken: "auth/refresh";
    readonly verifyToken: "auth/verify";
};
export declare const userEndpoints: {
    readonly profile: "user/profile";
    readonly updateProfile: "user/profile";
    readonly uploadAvatar: "user/avatar";
    readonly verifyEmail: "user/verify-email";
};
export declare const vehicleEndpoints: {
    readonly posts: "vehicle-posts";
    readonly createPost: "vehicle-posts";
    readonly updatePost: (id: string) => string;
    readonly deletePost: (id: string) => string;
    readonly getPost: (id: string) => string;
    readonly userPosts: "vehicle-posts/user";
    readonly uploadImages: "vehicle-posts/images";
};
export declare const jobEndpoints: {
    readonly jobs: "jobs";
    readonly createJob: "jobs";
    readonly getJob: (id: string) => string;
    readonly updateJob: (id: string) => string;
    readonly deleteJob: (id: string) => string;
    readonly applications: "job-applications";
    readonly applyToJob: "job-applications";
    readonly getApplications: "job-applications/user";
    readonly getJobApplications: (jobId: string) => string;
};
export declare const endpoints: {
    readonly auth: {
        readonly login: "auth/login";
        readonly signup: "auth/signup";
        readonly logout: "auth/logout";
        readonly refreshToken: "auth/refresh";
        readonly verifyToken: "auth/verify";
    };
    readonly user: {
        readonly profile: "user/profile";
        readonly updateProfile: "user/profile";
        readonly uploadAvatar: "user/avatar";
        readonly verifyEmail: "user/verify-email";
    };
    readonly vehicle: {
        readonly posts: "vehicle-posts";
        readonly createPost: "vehicle-posts";
        readonly updatePost: (id: string) => string;
        readonly deletePost: (id: string) => string;
        readonly getPost: (id: string) => string;
        readonly userPosts: "vehicle-posts/user";
        readonly uploadImages: "vehicle-posts/images";
    };
    readonly jobs: {
        readonly jobs: "jobs";
        readonly createJob: "jobs";
        readonly getJob: (id: string) => string;
        readonly updateJob: (id: string) => string;
        readonly deleteJob: (id: string) => string;
        readonly applications: "job-applications";
        readonly applyToJob: "job-applications";
        readonly getApplications: "job-applications/user";
        readonly getJobApplications: (jobId: string) => string;
    };
};
export type Endpoints = typeof endpoints;
//# sourceMappingURL=endpoints.d.ts.map
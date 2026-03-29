import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@repo/lib/apiFetch";

// Job Types enum based on API
export enum JobType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  TEMPORARY = "TEMPORARY",
  INTERN = "INTERN",
  FREELANCE = "FREELANCE"
}

// Job Status enum
export enum JobStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  FILLED = "FILLED",
  PAUSED = "PAUSED"
}

// Application Status enum
export enum ApplicationStatus {
  APPLIED = "APPLIED",
  UNDER_REVIEW = "UNDER_REVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN"
}

// Job Application interface (updated based on API response)
export interface JobApplication {
  id: string;
  status: ApplicationStatus;
  statusNote: string | null;
  yearsOfExperience: number;
  availableFrom: string;
  motivation: string;
  licenseNumber: string;
  licenseCategory: string;
  appliedAt: string;
  job: JobPostResponse;
  user: {
    id: string;
    fullName: string | null;
    userName: string;
    phone: string;
    city: string | null;
  };
}

// Form Data for Creating Job Posts (matches API payload)
export interface CreateJobPostData {
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: JobType;
  minSalary: number | null;
  maxSalary: number | null;
  experience: number | null;
  requirements: string | null;
}

// Job Post Response (based on API response)
export interface JobPostResponse {
  id: string;                    // UUID
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: JobType;
  minSalary: number | null;
  maxSalary: number | null;
  experience: number | null;
  requirements: string | null;
  status: JobStatus;             // "OPEN" by default
  createdAt: string;             // ISO date string
  updatedAt: string;             // ISO date string
  createdBy: {
    id: string;
    fullName: string | null;
    userName: string;
    phone: string;
    city: string | null;
  };
  applications: JobApplication[]; // Array of applications
  savedBy: any[];                // Array of users who saved this job
  isSaved?: boolean;             // Whether current user has saved this job
}

// Paginated list response for OPEN jobs
export interface JobListMetadata {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface OpenJobsList {
  items: JobPostResponse[];
  metadata: JobListMetadata;
}

// Saved Jobs list item extends JobPostResponse with saved-specific fields
export interface SavedJobListItem extends JobPostResponse {
  applicationCount?: number;
  savedCount?: number;
  savedAt?: string; // ISO string when the user saved the post
}

// Response for user's saved job posts
export interface SavedJobsList {
  items: SavedJobListItem[];
  metadata: JobListMetadata;
}

// User applications list types
export interface UserApplicationListItem {
  id: string;
  status: ApplicationStatus;
  statusNote: string | null;
  yearsOfExperience: number;
  availableFrom: string; // YYYY-MM-DD or ISO
  motivation: string;
  licenseNumber: string;
  licenseCategory: string;
  appliedAt: string; // ISO
  job: JobPostResponse;
}

export interface UserApplicationsList {
  items: UserApplicationListItem[];
  metadata: JobListMetadata;
}

// Job Application Create Request (matches API payload)
export interface JobApplicationCreateRequest {
  fullName: string;           // Required, 1-100 characters (must match user profile)
  contactNumber: string;      // Required (must match user profile)
  licenseNumber: string;      // Required (must match user profile)
  licenseCategory: string;    // Required (must match user profile)
  yearsOfExperience: number;  // Required, 0-50 years
  availableFrom: string;      // Required, ISO date string (YYYY-MM-DD)
  motivation: string;         // Required, 50-1000 characters
}

// Create new job post hook
export const useCreateDriverJob = () => {
  const queryClient = useQueryClient();

  return useMutation<JobPostResponse, Error, CreateJobPostData>({
    mutationFn: async (payload: CreateJobPostData) => {
      console.log("🚀 Creating job post with payload:", payload);
      return apiFetch("job-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((res) => res.data);
    },
    onSuccess: (data) => {
      console.log("✅ Job post created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["driver-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["user-driver-jobs"] });
    },
    onError: (error) => {
      console.error("❌ Error creating job post:", error);
    },
  });
};

// Get all OPEN job posts with pagination and optional search
export const useOpenDriverJobs = (
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  });

  return useQuery<OpenJobsList, Error>({
    queryKey: ["open-driver-jobs", page, limit, search],
    queryFn: async () => {
      const res = await apiFetch<{ statusCode: number; timestamp: string; message: string; data: OpenJobsList }>(
        `job-posts?${params.toString()}`,
        { method: "GET" }
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Get current user's job applications with pagination and optional search
export const useMyJobApplications = (
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  });

  return useQuery<UserApplicationsList, Error>({
    queryKey: ["my-job-applications", page, limit, search],
    queryFn: async () => {
      const res = await apiFetch<{
        statusCode: number;
        timestamp: string;
        message: string;
        data: UserApplicationsList;
      }>(`job-posts/my/applications?${params.toString()}`, { method: "GET" });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Apply to job post hook
export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation<JobApplication, Error, { jobId: string; payload: JobApplicationCreateRequest }>({
    mutationFn: async ({ jobId, payload }) => {
      console.log("🚀 Applying to job with payload:", { jobId, payload });
      return apiFetch(`job-posts/${jobId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then((res) => res.data);
    },
    onSuccess: (data) => {
      console.log("✅ Job application submitted successfully:", data);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      queryClient.invalidateQueries({ queryKey: ["user-applications"] });
      // Note: We don't invalidate open-driver-jobs or user-driver-jobs
      // since applying to a job doesn't change job listings
    },
    onError: (error) => {
      console.error("❌ Error applying to job:", error);
    },
  });
};

// Save job post hook
export const useSaveJobPost = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (jobId: string) => {
      try {
        console.log('🔖 Saving job post with ID:', jobId);
        const response = await apiFetch(`job-posts/${jobId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Include cookies for authentication
        });
        console.log('📤 Save response:', response);
        return response.data;
      } catch (error) {
        console.error('❌ Error saving job post:', error);
        throw error;
      }
    },
    onSuccess: (data, jobId) => {
      console.log('✅ Job post saved successfully:', data);

      // Update the single job cache immediately if it exists
      queryClient.setQueryData<JobPostResponse>(['job-posts', jobId], (old) =>
        old ? { ...old, isSaved: true } : old
      );

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['open-driver-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-posts', jobId] });
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] }); // This will refresh saved jobs list
      queryClient.invalidateQueries({ queryKey: ['job-post-saved-status', jobId] }); // Invalidate saved status
    },
    onError: (error) => {
      console.error('❌ Save job post failed:', error);
    },
  });
};

// Unsave job post hook
export const useUnsaveJobPost = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (jobId: string) => {
      try {
        console.log('🗑️ Unsaving job post with ID:', jobId);
        const response = await apiFetch(`job-posts/${jobId}/unsave`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Include cookies for authentication
        });
        console.log('📤 Unsave response:', response);
        return response.data;
      } catch (error) {
        console.error('❌ Error unsaving job post:', error);
        throw error;
      }
    },
    onSuccess: (data, jobId) => {
      console.log('✅ Job post unsaved successfully:', data);

      // Update the single job cache immediately if it exists
      queryClient.setQueryData<JobPostResponse>(['job-posts', jobId], (old) =>
        old ? { ...old, isSaved: false } : old
      );

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['open-driver-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-posts', jobId] });
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] }); // This will refresh saved jobs list
      queryClient.invalidateQueries({ queryKey: ['job-post-saved-status', jobId] }); // Invalidate saved status
    },
    onError: (error) => {
      console.error('❌ Unsave job post failed:', error);
    },
  });
};

// Saved status response interface
export interface SavedStatusResponse {
  isSaved: boolean;
}

// Get saved status hook - checks if a specific job is saved by the current user
export const useGetJobSavedStatus = (jobId: string, enabled: boolean = true) => {
  return useQuery<SavedStatusResponse, Error>({
    queryKey: ['job-post-saved-status', jobId],
    queryFn: async () => {
      try {
        console.log('🔍 Checking saved status for job:', jobId);
        const response = await apiFetch(`job-posts/${jobId}/saved-status`, {
          method: 'GET',
          credentials: 'include' // Include cookies for authentication
        });
        console.log('✅ Saved status response:', response);
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error checking saved status:', error);
        console.error('❌ Error details:', {
          message: error instanceof Error ? error.message : String(error),
          status: (error as any)?.status,
          stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
    },
    enabled: enabled && !!jobId, // Only fetch when enabled and jobId is provided
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes (shorter than other queries since this changes frequently)
    retry: 1,
  });
};

// Get user's saved/bookmarked job posts with pagination and optional search
// Deprecated: moved to @repo/hooks (useGetSavedJobPosts)

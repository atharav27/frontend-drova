import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@repo/lib/apiFetch';

// Shared list metadata
export interface ListMetadata {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

// ===================== VEHICLE POSTS =====================
export interface VehicleSavedListItem {
  id: string;
  vehicleName: string;
  price: number;
  vehicleCategory: string;
  location: string;
  fuelType: string;
  kmsDriven: number;
  seatingCapacity: number;
  engineDisplacement: number;
  mileage: number;
  maxPower: number;
  description: string;
  features: string[];
  images: string[];
  contactName: string;
  contactNumber: string;
  yearOfManufacture: number;
  transmission: string;
  status: string;
  autoPublish: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
}

export interface VehicleSavedList {
  items: VehicleSavedListItem[];
  metadata: ListMetadata;
}

export const useGetSavedVehiclePosts = (
  userId: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true,
) => {
  return useQuery<VehicleSavedList, Error>({
    queryKey: ['user-saved-posts', userId, page, limit],
    queryFn: async () => {
      const response = await apiFetch<VehicleSavedList>(`vehicle-post/saved/${userId}?page=${page}&limit=${limit}`, {
        method: 'GET',
      });
      // marketplace api returns { data }
      // @repo/lib apiFetch returns full body; normalize
      // If the endpoint returns wrapper { data }, prefer that
      // We attempt both to be resilient
      const maybe = (response as any)?.data ?? response;
      return maybe as VehicleSavedList;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useUnsaveVehiclePostShared = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (postId: string) => {
      const response = await apiFetch(`vehicle-post/${postId}/unsave`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      return (response as any)?.data ?? response;
    },
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['user-saved-posts'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-post', postId] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-post-saved-status', postId] });
    },
  });
};

// ===================== JOB POSTS =====================
export interface JobSavedListItem {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN' | 'FREELANCE';
  minSalary: number | null;
  maxSalary: number | null;
  experience: number | null;
  requirements: string | null;
  status: 'OPEN' | 'CLOSED' | 'FILLED' | 'PAUSED';
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
  savedAt?: string;
}

export interface JobSavedList {
  items: JobSavedListItem[];
  metadata: ListMetadata;
}

export const useGetSavedJobPosts = (
  userId: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true,
  search?: string,
) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), ...(search ? { search } : {}) });
  return useQuery<JobSavedList, Error>({
    queryKey: ['user-saved-job-posts', userId, page, limit, search],
    queryFn: async () => {
      const response = await apiFetch<{
        statusCode: number;
        message: string;
        timestamp: string;
        data: JobSavedList;
      }>(`job-posts/saved/${userId}?${params.toString()}`, { method: 'GET' });
      return response.data;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useUnsaveJobPostShared = () => {
  const queryClient = useQueryClient();
  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (jobId: string) => {
      const response = await apiFetch(`job-posts/${jobId}/unsave`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      return (response as any)?.data ?? response;
    },
    onSuccess: (_data, jobId) => {
      queryClient.invalidateQueries({ queryKey: ['user-saved-job-posts'] });
      queryClient.invalidateQueries({ queryKey: ['job-posts', jobId] });
      queryClient.invalidateQueries({ queryKey: ['job-post-saved-status', jobId] });
    },
  });
};



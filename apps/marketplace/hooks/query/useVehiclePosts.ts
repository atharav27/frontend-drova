import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@repo/lib/apiFetch";

// API Response for vehicle posts list
export interface VehicleImage {
  id: string;
  key: string;
  vehiclePostId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface VehiclePost {
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
  images: VehicleImage[];
  contactName: string;
  contactNumber: string;
  yearOfManufacture: number;
  transmission: string;
  status: string;
  autoPublish: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface VehiclePostResponse {
  items: VehiclePost[];
  metadata: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}


// API Payload for creating/updating posts (matches backend exactly)
export interface PostFormData {
  vehicleName: string;
  price: number;
  vehicleCategory: 'HATCHBACK' | 'SEDAN' | 'SUV' | 'TRUCK';
  location: string;
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
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
  transmission: 'MANUAL' | 'AUTOMATIC';
  status: 'DRAFT' | 'PUBLISHED' | 'SOLD';
  autoPublish: boolean;
}
// API Response for single post (same as PostFormData but with additional fields)
export interface SinglePostData extends PostFormData {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  approvalNote?: string;
  isSaved?: boolean;
  activeListingCount?: number;
}


export type UpdatePayload = {
  id: string;
  data: PostFormData;
};

export const useVehiclePosts = (page: number, limit: number) => {
  return useQuery<VehiclePostResponse, Error, VehiclePostResponse, [string, number, number]>({
    queryKey: ["vehicle-posts", page, limit],
    queryFn: async () => {
      return apiFetch(`vehicle-post?page=${page}&limit=${limit}`, {
        method: "GET",
      }).then((res) => res.data);
    },
    staleTime: 5 * 60 * 1000,
    // keepPreviousData: true,
  });
};

//Create post
export const useCreateVehiclePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PostFormData) => {
      return apiFetch('vehicle-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-vehicle-posts'] });
    },
  });
};
//Getting an single post by id
export const useGetVehiclePostById = (id: string) => {
  return useQuery<SinglePostData, Error>({
    queryKey: ['vehicle-post', id],
    queryFn: async () => {
      try {
        const response = await apiFetch(`vehicle-post/${id}`, {
          method: 'GET',
        });

        return response.data;
      } catch (error) {
        console.error('Error fetching vehicle post:', error);
        throw error;
      }
    },
    enabled: !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// Delete response interface based on API documentation
interface DeleteVehiclePostResponse {
  success: boolean;
  message: string;
}

// delete an single post with id
export const useDeleteVehiclePost = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteVehiclePostResponse, Error, string>({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting post with ID:', id);
      return apiFetch(`vehicle-post/${id}`, {
        method: 'DELETE',
      }).then((res) => res.data);
    },
    onSuccess: (data, id) => {
      console.log('✅ Delete successful:', data);
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['vehicle-posts'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-post', id] });
      queryClient.invalidateQueries({ queryKey: ['user-vehicle-posts'] });

      // Remove the specific post from cache immediately
      queryClient.removeQueries({ queryKey: ['vehicle-post', id] });
    },
    onError: (error) => {
      console.error('❌ Delete failed:', error);
    },
  });
};

// update post
export const useUpdateVehiclePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postid, data }: { postid: string; data: PostFormData }) => {
      console.log('🔄 Updating post with payload:', data);
      return apiFetch(`vehicle-post/${postid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.data);
    },
    onSuccess: (data, variables) => {
      console.log('✅ Update successful:', data);
      queryClient.invalidateQueries({ queryKey: ['vehicle-posts'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-post', variables.postid] });
      queryClient.invalidateQueries({ queryKey: ['user-vehicle-posts'] });
    },
    onError: (error) => {
      console.error('❌ Update failed:', error);
    },
  });
};


//user posts
export const useUserVehiclePosts = (userId: string, page: number, limit: number) => {
  return useQuery<VehiclePostResponse, Error, VehiclePostResponse, [string, string, number, number]>({
    queryKey: ["user-vehicle-posts", userId, page, limit],
    queryFn: async () => {
      return apiFetch(`vehicle-post/user/${userId}?page=${page}&limit=${limit}`, {
        method: "GET",
      }).then((res) => res.data);
    },
    // staleTime: 5 * 60 * 1000,
  });
};

export const useGetContactDetails = (postId: string, enabled: boolean = true) => {
  return useQuery<ContactDetailsResponse, Error>({
    queryKey: ['vehicle-post-contact', postId],
    queryFn: async () => {
      try {
        const response = await apiFetch(`vehicle-post/${postId}/contact`, {
          method: 'GET',
          credentials: 'include' // Include cookies for authentication
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching contact details:', error);
        throw error;
      }
    },
    enabled: !!postId && enabled, // Only run query if postId is provided and enabled
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};


// Save post hook - saves a vehicle post to user's bookmarks
export const useSaveVehiclePost = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (postId: string) => {
      try {
        console.log('🔖 Saving post with ID:', postId);
        const response = await apiFetch(`vehicle-post/${postId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Include cookies for authentication
        });
        console.log('📤 Save response:', response);
        return response.data;
      } catch (error) {
        console.error('❌ Error saving vehicle post:', error);
        throw error;
      }
    },
    onSuccess: (data, postId) => {
      console.log('✅ Post saved successfully:', data);

      // Update the single post cache immediately
      queryClient.setQueryData<SinglePostData>(['vehicle-post', postId], (old) =>
        old ? { ...old, isSaved: true } : old
      );

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['vehicle-posts'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-post', postId] });
      queryClient.invalidateQueries({ queryKey: ['user-saved-posts'] }); // This will refresh saved posts list
      queryClient.invalidateQueries({ queryKey: ['vehicle-post-saved-status', postId] }); // Invalidate saved status
    },
    onError: (error) => {
      console.error('❌ Save post failed:', error);
    },
  });
};

// Unsave post hook - removes a vehicle post from user's bookmarks
export const useUnsaveVehiclePost = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: async (postId: string) => {
      try {
        console.log('🗑️ Unsaving post with ID:', postId);
        const response = await apiFetch(`vehicle-post/${postId}/unsave`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Include cookies for authentication
        });
        console.log('📤 Unsave response:', response);
        return response.data;
      } catch (error) {
        console.error('❌ Error unsaving vehicle post:', error);
        throw error;
      }
    },
    onSuccess: (data, postId) => {
      console.log('✅ Post unsaved successfully:', data);

      // Update the single post cache immediately
      queryClient.setQueryData<SinglePostData>(['vehicle-post', postId], (old) =>
        old ? { ...old, isSaved: false } : old
      );

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['vehicle-posts'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle-post', postId] });
      queryClient.invalidateQueries({ queryKey: ['user-saved-posts'] }); // This will refresh saved posts list
      queryClient.invalidateQueries({ queryKey: ['vehicle-post-saved-status', postId] }); // Invalidate saved status
    },
    onError: (error) => {
      console.error('❌ Unsave post failed:', error);
    },
  });
};

// Get saved vehicle posts hook - retrieves user's saved/bookmarked posts
export const useGetSavedVehiclePosts = (userId: string, page: number = 1, limit: number = 10, enabled: boolean = true) => {
  return useQuery<VehiclePostResponse, Error>({
    queryKey: ['user-saved-posts', userId, page, limit],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching saved vehicle posts with params:', { userId, page, limit });
        const response = await apiFetch(`vehicle-post/saved/${userId}?page=${page}&limit=${limit}`, {
          method: 'GET'
        });
        console.log('✅ Saved posts response:', response);
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error fetching saved vehicle posts:', error);
        console.error('❌ Error details:', {
          message: error instanceof Error ? error.message : String(error),
          status: (error as any)?.status,
          stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
    },
    enabled: enabled && !!userId, // Only fetch when enabled and userId is provided
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });
};

// Contact details response interface based on API documentation
export interface ContactDetailsResponse {
  contactName: string;
  contactNumber: string;
}

// Saved status response interface
export interface SavedStatusResponse {
  isSaved: boolean;
}

// Get saved status hook - checks if a specific post is saved by the current user
export const useGetSavedStatus = (postId: string, enabled: boolean = true) => {
  return useQuery<SavedStatusResponse, Error>({
    queryKey: ['vehicle-post-saved-status', postId],
    queryFn: async () => {
      try {
        console.log('🔍 Checking saved status for post:', postId);
        const response = await apiFetch(`vehicle-post/${postId}/saved-status`, {
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
    enabled: enabled && !!postId, // Only fetch when enabled and postId is provided
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes (shorter than other queries since this changes frequently)
    retry: 1,
  });
};

interface UpdateVehiclePostStatusPayload {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "SOLD";
}

export const useUpdateVehiclePostStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateVehiclePostStatusPayload) => {
      const response = await apiFetch(`vehicle-post/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["vehicle-posts"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-post", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["user-vehicle-posts"] });
    },
  });
};

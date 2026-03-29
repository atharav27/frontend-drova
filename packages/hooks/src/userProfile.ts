import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@repo/lib/apiFetch";

// Document interface
export interface UserDocuments {
  aadhaarNumber: string | null;
  aadhaarCardImage: string | null;
  panNumber: string | null;
  panCardImage: string | null;
  licenseNumber: string | null;
  licenseCategory: string | null;
  licenseFrontImage: string | null;
}

// Base profile interface with common fields
export interface BaseProfile {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  phone: string;
  city: string;
  role: ('BUYER' | 'DRIVER' | 'SELLER')[]; // Array of all roles user has
  isVerified: boolean;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  verificationNote: string | null;
  avatar: string | null;
  documents: UserDocuments;
  activeListingCount: number;
  createdAt: string;
  updatedAt: string;
}

// Since role is now an array, we don't need separate role-specific interfaces
// The Profile type is just BaseProfile
export type Profile = BaseProfile;

// Interface for updating user profile
export interface UpdateUserInput {
  email?: string;
  fullName?: string;
  phone?: string;
  city?: string;
  avatar?: string;
}

// Interface for adding a new role to user
export interface AddRoleRequest {
  userId: string;                    // Required: User's ID
  // Driver fields (all required together for DRIVER role)
  dateOfBirth?: string;             // Format: "YYYY-MM-DD"
  licenseNumber?: string;           // Max 20 characters
  licenseCategory?: string;         // e.g., "LMV", "HMV"
  licenseFrontImage?: string;       // Image filename/path

  // Aadhaar fields (required for BUYER or SELLER)
  aadhaarNumber?: string;           // Exactly 12 digits
  aadhaarCardImage?: string;        // Image filename/path

  // PAN fields (required for SELLER along with Aadhaar)
  panNumber?: string;               // Exactly 10 characters
  panCardImage?: string;            // Image filename/path
}

// Interface for add role response
export interface AddRoleResponse {
  success: boolean;                 // Always true on success
  message: string;                  // Success message with role name
  addedRole: "DRIVER" | "BUYER" | "SELLER";  // The role that was added
  availableRoles: string[];         // All roles user now has
}

interface UseUserProfileOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch user profile data
 * @param options - Configuration options for the query
 * @returns React Query result with user profile data
 */
export function useUserProfile(options: UseUserProfileOptions = {}) {
  const { enabled = true } = options;

  return useQuery<Profile, Error>({
    queryKey: ['user-profile'],
    queryFn: async (): Promise<Profile> => {
      const response = await apiFetch('user/profile', {
        method: 'GET',
        credentials: 'include' // Include cookies for authentication
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled,
  });
}

/**
 * Hook to update user profile
 * @returns React Query mutation for updating user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation<Profile, Error, UpdateUserInput>({
    mutationFn: async (payload) => {
      const response = await apiFetch(
        "user",
        {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        }
      );
      return response.data;
    },
    onSuccess: async (updatedProfile) => {
      // Update the cache with new data
      queryClient.setQueryData(["user-profile"], updatedProfile);

      // Invalidate and refetch to ensure consistency
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
}

/**
 * Hook to logout user
 * @returns React Query mutation for logging out
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_BASE_URL;

  return useMutation<{ statusCode: number; message: string; data: { role: string; message: string } }, Error, void>({
    mutationFn: async () => {
      const response = await apiFetch(
        "auth/logout",
        {
          method: "POST",
          credentials: 'include', // Include cookies for authentication
        }
      );
      return response;
    },
    onSuccess: () => {
      // Clear all cached data after successful logout
      queryClient.clear();
      // Broadcast cross-app logout for immediate UI updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:logout'));
        // Redirect to centralized auth login page
        if (AUTH_BASE) {
          window.location.href = `${AUTH_BASE}/login`;
        }
      }
    },
  });
}

/**
 * Hook to add a new role to user
 * @returns React Query mutation for adding a role
 */
export function useAddRole() {
  const queryClient = useQueryClient();

  return useMutation<AddRoleResponse, Error, AddRoleRequest>({
    mutationFn: async (payload) => {
      console.log('🔍 useAddRole: Calling API with payload:', payload);
      const response = await apiFetch(
        "auth/phone/add-role",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include', // Include cookies for authentication
        }
      );
      console.log('🔍 useAddRole: API response:', response);
      return response.data;
    },
    onSuccess: async (response) => {
      // Invalidate user profile queries to refetch updated profile with new role
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });

      // Also invalidate any other user-related queries that might be affected
      await queryClient.invalidateQueries({ queryKey: ["user"] });

      // You can also add a success callback here if needed
      console.log(`Successfully added role: ${response.addedRole}`);
      console.log(`Available roles: ${response.availableRoles.join(', ')}`);
    },
    onError: (error) => {
      console.error('🔍 useAddRole: Error occurred:', error);
    },
  });
}

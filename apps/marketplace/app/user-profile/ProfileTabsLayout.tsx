"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileTabsLayout as SharedProfileTabsLayout, ProfileTabsLayoutProps } from "@repo/ui/components/profile/ProfileTabsLayout";
import { useGetSavedVehiclePosts, useUnsaveVehiclePostShared, useGetSavedJobPosts, useUnsaveJobPostShared } from "@repo/hooks";
import { useAuthMe } from "@repo/hooks";
import { useUserProfile, useAddRole } from "~/hooks/query/useUserProfile";
import CarListingCard from "~/components/CarListingCard";
import { toast } from "sonner";

interface MarketplaceProfileTabsLayoutProps {
  isEditing?: boolean;
  userData?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
  };
  onSaveProfile?: (data: { // eslint-disable-line no-unused-vars
    fullName: string;
    email: string;
    phone: string;
    city: string;
  }) => void;
  onCancelEdit?: () => void;
  isLoading?: boolean;
  error?: string | null;
  navigateToSellerRoute?: (route: string, customErrorMessage?: string) => void; // eslint-disable-line no-unused-vars
  activeListingCount?: number;
}

export function ProfileTabsLayout({
  isEditing = false,
  userData,
  onSaveProfile,
  onCancelEdit,
  isLoading = false,
  error = null,
  navigateToSellerRoute,
  activeListingCount = 0
}: MarketplaceProfileTabsLayoutProps) {
  const router = useRouter();
  const [shouldFetchSavedPosts, setShouldFetchSavedPosts] = useState(false);

  // Check authentication status
  const { status: authStatus } = useAuthMe();

  // Get user profile data for documents
  const { data: userProfile } = useUserProfile();

  // Add role mutation
  const addRoleMutation = useAddRole();

  // Use the hook only when needed and user is authenticated
  const {
    data: savedPostsData,
    isLoading: isLoadingSavedPosts,
    error: savedPostsError,
    refetch: refetchSavedPosts
  } = useGetSavedVehiclePosts(
    userData?.id || '',
    1,
    10,
    shouldFetchSavedPosts && authStatus === 'authenticated' && !!userData?.id
  );

  const { mutate: unsavePost } = useUnsaveVehiclePostShared();

  // Saved Jobs in marketplace profile
  const [shouldFetchSavedJobs, setShouldFetchSavedJobs] = useState(false);
  const {
    data: savedJobsData,
    isLoading: isLoadingSavedJobs,
    error: savedJobsError,
    refetch: refetchSavedJobs
  } = useGetSavedJobPosts(
    userData?.id || '',
    1,
    10,
    shouldFetchSavedJobs && authStatus === 'authenticated' && !!userData?.id
  );

  const { mutate: unsaveJob } = useUnsaveJobPostShared();

  const handleFetchSavedPosts = () => {
    console.log('🔍 Fetching saved posts, auth status:', authStatus, 'userId:', userData?.id);
    setShouldFetchSavedPosts(true);
  };

  const handleRemoveSavedPost = (postId: string) => {
    unsavePost(postId, {
      onSuccess: () => {
        refetchSavedPosts(); // Refresh the list
      }
    });
  };

  const handleFetchSavedJobs = () => {
    setShouldFetchSavedJobs(true);
  };

  const handleRemoveSavedJob = (jobId: string) => {
    unsaveJob(jobId, {
      onSuccess: () => {
        refetchSavedJobs();
      }
    });
  };

  const handleNavigateToListings = () => {
    router.push('/posts'); // Navigate to listings page
  };

  // Navigation handlers for profile overview
  const handleViewApplications = () => {
    // Navigate to driver jobs applications
    window.location.href = 'http://localhost:3004/driver-jobs/applications';
  };

  const handleViewListings = async () => {
    // Use role-based navigation for listings
    await navigateToSellerRoute?.('/posts/user-posts');
  };

  // Document operation handlers
  const handleViewDocument = (documentId: string) => {
    console.log("View document:", documentId);
    // TODO: Implement document viewing logic
    // This could open a modal, navigate to a document viewer, or open in new tab
  };

  const handleDeleteDocument = (documentId: string) => {
    console.log("Delete document:", documentId);
    // TODO: Implement document deletion logic
    // This should show a confirmation dialog and call an API to delete the document
  };

  const handleUploadAdditional = (formData: any) => {
    console.log("Upload additional documents with data:", formData);

    if (!userData?.id) {
      toast.error("User ID not found. Please try again.");
      return;
    }

    // Determine the role based on the form data
    let roleToAdd: "BUYER" | "DRIVER" | "SELLER" | null = null;

    if (formData.licenseNumber && formData.licenseCategory && formData.licenseFrontImage) {
      roleToAdd = "DRIVER";
    } else if (formData.aadhaarNumber && formData.aadhaarCardImage && formData.panNumber && formData.panCardImage) {
      roleToAdd = "SELLER";
    } else if (formData.aadhaarNumber && formData.aadhaarCardImage) {
      roleToAdd = "BUYER";
    }

    if (!roleToAdd) {
      toast.error("Incomplete form data. Please fill all required fields.");
      return;
    }

    // Prepare the payload for the API
    const payload = {
      userId: userData.id,
      ...formData
    };

    // Call the add role mutation
    addRoleMutation.mutate(payload, {
      onSuccess: (response) => {
        console.log("Role added successfully:", response);
        toast.success(`Successfully added ${response.addedRole} role!`);
        // The useAddRole hook will automatically invalidate queries and refresh the profile
      },
      onError: (error: any) => {
        console.error("Failed to add role:", error);
        toast.error(error.message || "Failed to add role. Please try again.");
      }
    });
  };

  return (
    <SharedProfileTabsLayout
      isEditing={isEditing}
      userData={userData ? {
        ...userData,
        location: userData.city // Map city to location for shared component
      } : undefined}
      onSaveProfile={onSaveProfile ? (formData) => {
        // Map location back to city when saving
        onSaveProfile({
          ...formData,
          city: formData.location
        });
      } : undefined}
      onCancelEdit={onCancelEdit}
      isLoading={isLoading}
      error={error}
      onViewApplications={handleViewApplications}
      onViewListings={handleViewListings}
      activeListingCount={activeListingCount}
      showDocumentsTab={true}
      documents={userProfile?.documents}
      onViewDocument={handleViewDocument}
      onDeleteDocument={handleDeleteDocument}
      onUploadAdditional={handleUploadAdditional}
      isSubmitting={addRoleMutation.isPending}
      userId={userData?.id}
      userRoles={userProfile?.role}
      // Pass saved posts data and handlers
      savedPosts={savedPostsData?.items || []}
      isLoadingSavedPosts={isLoadingSavedPosts}
      savedPostsError={savedPostsError}
      onFetchSavedPosts={handleFetchSavedPosts}
      onRemoveSavedPost={handleRemoveSavedPost}
      onNavigateToListings={handleNavigateToListings}
      CarListingCardComponent={CarListingCard}
      // Saved jobs wiring
      savedJobs={(savedJobsData?.items || []).map((j) => ({
        id: j.id,
        title: j.title,
        company: j.companyName,
        location: j.location,
        type: j.jobType,
        salary: j.minSalary != null || j.maxSalary != null
          ? `₹${new Intl.NumberFormat('en-IN').format(j.minSalary || 0)} - ₹${new Intl.NumberFormat('en-IN').format(j.maxSalary || 0)}`
          : 'Salary not disclosed',
        experience: j.experience != null ? `${j.experience} yrs exp` : '',
        postedDate: new Date(j.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        tags: [] as string[],
      }))}
      isLoadingSavedJobs={isLoadingSavedJobs}
      savedJobsError={savedJobsError}
      onFetchSavedJobs={handleFetchSavedJobs}
      onRemoveSavedJob={handleRemoveSavedJob}
    />
  );
}

// Export the shared interface for compatibility
export type { ProfileTabsLayoutProps };

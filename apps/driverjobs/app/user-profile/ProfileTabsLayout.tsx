"use client";

import { ProfileTabsLayout as SharedProfileTabsLayout } from "@repo/ui/components/profile/ProfileTabsLayout";
import { useUserProfile, useAddRole, useGetSavedVehiclePosts, useUnsaveVehiclePostShared, useGetSavedJobPosts, useUnsaveJobPostShared } from "@repo/hooks";
import { toast } from "sonner";

interface DriverJobsProfileTabsLayoutProps {
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
  activeListingCount?: number;
}

export function ProfileTabsLayout({
  isEditing = false,
  userData,
  onSaveProfile,
  onCancelEdit,
  isLoading = false,
  error = null,
  activeListingCount = 0
}: DriverJobsProfileTabsLayoutProps) {
  // Get user profile data for documents
  const { data: userProfile } = useUserProfile();

  // Add role mutation
  const addRoleMutation = useAddRole();

  // Saved jobs state via hook (lazy fetch when user opens tab)
  const {
    data: savedJobsData,
    isLoading: isLoadingSavedJobs,
    error: savedJobsError,
    refetch: refetchSavedJobs
  } = useGetSavedJobPosts(userData?.id || '', 1, 10, !!userData?.id);

  const { mutate: unsaveJob } = useUnsaveJobPostShared();

  const handleFetchSavedJobs = () => {
    if (userData?.id) refetchSavedJobs();
  };

  // Saved vehicles in driverjobs profile
  const [shouldFetchSavedPosts, setShouldFetchSavedPosts] = (function(){
    const ReactRef = require('react');
    return ReactRef.useState(false);
  })();
  const {
    data: savedPostsData,
    isLoading: isLoadingSavedPosts,
    error: savedPostsError,
    refetch: refetchSavedPosts
  } = useGetSavedVehiclePosts(userData?.id || '', 1, 10, shouldFetchSavedPosts && !!userData?.id);

  const { mutate: unsavePost } = useUnsaveVehiclePostShared();

  const handleFetchSavedPosts = () => {
    setShouldFetchSavedPosts(true);
  };

  const handleRemoveSavedPost = (postId: string) => {
    unsavePost(postId, {
      onSuccess: () => {
        refetchSavedPosts();
      }
    });
  };

  const handleRemoveSavedJob = (jobId: string) => {
    unsaveJob(jobId, {
      onSuccess: () => {
        refetchSavedJobs();
      }
    });
  };

  // Navigation handlers for profile overview
  const handleViewApplications = () => {
    // Navigate to driver jobs applications
    window.location.href = '/driver-jobs/applications';
  };

  const handleViewListings = () => {
    // Navigate to marketplace user posts
    window.location.href = 'http://localhost:3002/posts/user-posts';
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
      onSaveProfile={onSaveProfile ? (data) => {
        // Map location back to city when saving
        onSaveProfile({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          city: data.location
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
      // Saved jobs wiring to shared tabs component
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
      // Saved products wiring
      savedPosts={savedPostsData?.items || []}
      isLoadingSavedPosts={isLoadingSavedPosts}
      savedPostsError={savedPostsError}
      onFetchSavedPosts={handleFetchSavedPosts}
      onRemoveSavedPost={handleRemoveSavedPost}
    />
  );
}

// Export the interface for compatibility
export type { DriverJobsProfileTabsLayoutProps as ProfileTabsLayoutProps };

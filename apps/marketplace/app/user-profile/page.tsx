"use client";
import React, { useState } from "react";
import { UserDetailsCard } from "@repo/ui/components/profile/UserDetailsCard";
import { ProfileTabsLayout } from "./ProfileTabsLayout";
import { useUserProfile, useUpdateUserProfile, useLogout } from "~/hooks/query/useUserProfile";
import { toast } from "sonner";
import { PageLoader } from "@repo/ui/components/common/UnifiedLoader";
import BackButton from "@repo/ui/components/login/BackButton";
import { useRouter } from "next/navigation";
import { useRoleBasedNavigation } from "~/hooks/useRoleBasedNavigation";
import { useLazyAuthAction } from "~/hooks/useAuthAction";

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { showAuthDialog, setShowAuthDialog } = useLazyAuthAction();
  const { renderRoleAccessDialog, showRoleDialog, navigateToSellerRoute } = useRoleBasedNavigation({
    showAuthDialog,
    setShowAuthDialog
  });



  // Fetch user profile data from backend
  const { data: userProfile, isLoading, error } = useUserProfile();

  // Update profile mutation
  const updateProfileMutation = useUpdateUserProfile();

  // Logout mutation
  const logoutMutation = useLogout();

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = (data: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
  }) => {
    // Transform data to match API expectations
    const updatePayload = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
    };

    updateProfileMutation.mutate(updatePayload, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update profile");
        // Stay in edit mode on error
      }
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Show loading state while fetching profile data
  if (isLoading) {
    return <PageLoader message="Loading profile..." />;
  }

  // Show error state if profile fetch failed
  if (error) {
    return (
      <div className="container bg-[#FAFAFB] py-4 sm:py-6 lg:py-10 h-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Failed to Load Profile</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show profile content when data is loaded
  if (!userProfile) {
    return (
      <div className="container bg-[#FAFAFB] py-4 sm:py-6 lg:py-10 h-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Profile Data</h2>
            <p className="text-gray-500">Unable to load user profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract initials from full name
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role display name for single role
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'BUYER':
        return 'Buyer';
      case 'DRIVER':
        return 'Driver';
      case 'SELLER':
        return 'Seller';
      default:
        return role;
    }
  };

  // Convert array of roles to display names
  const getDisplayRoles = (userRoles: string | string[]) => {
    // Ensure we always work with an array
    const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
    return rolesArray.map(role => getRoleDisplayName(role));
  };

  return (
    <div className="container bg-[#FAFAFB] py-4 sm:py-6 lg:py-10 h-auto">
      {/* Back Button */}
      <div className="mb-6">
        <BackButton
          isOtpStep={true}
          onBackClick={() => router.back()}
          buttonText="Back to posts"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Left: User Details Card */}
        <div className="w-full md:w-1/3 lg:w-1/3">
          <UserDetailsCard
            initials={getInitials(userProfile.fullName)}
            name={userProfile.fullName}
            role={getDisplayRoles(userProfile.role)}
            verified={userProfile.isVerified}
            location={userProfile.city}
            phone={userProfile.phone}
            email={userProfile.email || "No email provided"}
            memberSince={`Member since ${new Date(userProfile.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}`}
            onEditProfile={handleEditProfile}
            onLogout={handleLogout}
          />
        </div>

        {/* Right: Tabs Layout */}
        <div className="w-full md:w-2/3 lg:w-2/3">
          <ProfileTabsLayout
            isEditing={isEditing}
            userData={{
              id: userProfile.id,
              fullName: userProfile.fullName,
              email: userProfile.email,
              phone: userProfile.phone,
              city: userProfile.city
            }}
            onSaveProfile={handleSaveProfile}
            onCancelEdit={handleCancelEdit}
            isLoading={updateProfileMutation.isPending}
            error={updateProfileMutation.error?.message || null}
            navigateToSellerRoute={navigateToSellerRoute}
            activeListingCount={userProfile.activeListingCount}
          />
        </div>
      </div>

      {/* Role Access Dialog */}
      {renderRoleAccessDialog()}
    </div>
  );
}

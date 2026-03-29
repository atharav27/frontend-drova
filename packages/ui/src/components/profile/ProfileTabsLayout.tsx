"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/ui/tabs";
import React from "react";
import { ProfileOverviewTab } from "@repo/ui/components/profile/ProfileOverviewTab";
import { ProfileSavedTab } from "@repo/ui/components/profile/ProfileSavedTab";
import { ProfileDocumentsTab } from "@repo/ui/components/profile/ProfileDocumentsTab";

export interface ProfileTabsLayoutProps {
  isEditing?: boolean;
  userData?: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  onSaveProfile?: (_data: { // eslint-disable-line no-unused-vars
    fullName: string;
    email: string;
    phone: string;
    location: string;
  }) => void;
  onCancelEdit?: () => void;
  // Loading and error states
  isLoading?: boolean;
  error?: string | null;
  // Navigation handlers
  onViewApplications?: () => void;
  onViewListings?: () => void;
  // Active listing count
  activeListingCount?: number;
  // Documents tab configuration
  showDocumentsTab?: boolean;
  documents?: {
    aadhaarNumber: string | null;
    aadhaarCardImage: string | null;
    panNumber: string | null;
    panCardImage: string | null;
    licenseNumber: string | null;
    licenseCategory: string | null;
    licenseFrontImage: string | null;
  };
  onViewDocument?: (_documentId: string) => void; // eslint-disable-line no-unused-vars
  onDeleteDocument?: (_documentId: string) => void; // eslint-disable-line no-unused-vars
  onUploadAdditional?: (_formData: any) => void; // eslint-disable-line no-unused-vars
  userId?: string;
  userRoles?: ('BUYER' | 'DRIVER' | 'SELLER')[];
  isSubmitting?: boolean;
  // Saved posts props
  savedPosts?: any[];
  isLoadingSavedPosts?: boolean;
  savedPostsError?: any;
  onFetchSavedPosts?: () => void;
  onRemoveSavedPost?: (postId: string) => void; // eslint-disable-line no-unused-vars
  onNavigateToListings?: () => void;
  // CarListingCard component for saved products
  CarListingCardComponent?: React.ComponentType<any>;
  // Saved jobs props
  savedJobs?: any[];
  isLoadingSavedJobs?: boolean;
  savedJobsError?: any;
  onFetchSavedJobs?: () => void;
  onRemoveSavedJob?: (jobId: string) => void; // eslint-disable-line no-unused-vars
}

export function ProfileTabsLayout({
  isEditing = false,
  userData,
  onSaveProfile,
  onCancelEdit,
  isLoading = false,
  error = null,
  onViewApplications,
  onViewListings,
  activeListingCount = 0,
  showDocumentsTab = false,
  documents,
  onViewDocument,
  onDeleteDocument,
  onUploadAdditional,
  userId,
  userRoles,
  isSubmitting = false,
  savedPosts,
  isLoadingSavedPosts,
  savedPostsError,
  onFetchSavedPosts,
  onRemoveSavedPost,
  onNavigateToListings,
  CarListingCardComponent
  ,
  // jobs props
  savedJobs,
  isLoadingSavedJobs,
  savedJobsError,
  onFetchSavedJobs,
  onRemoveSavedJob
}: ProfileTabsLayoutProps)  {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full flex bg-primary/10 rounded-lg mb-4 md:mb-6 gap-1 md:gap-20 ">
        <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-textdark text-textdark/50 text-base md:text-lg py-1">
          Overview
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-textdark text-textdark/50 text-base md:text-lg py-1">
          Documents
        </TabsTrigger>
        <TabsTrigger value="saved" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-textdark text-textdark/50 text-base md:text-lg py-1">
          Saved
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ProfileOverviewTab
          isEditing={isEditing}
          userData={userData}
          onSaveProfile={onSaveProfile}
          onCancelEdit={onCancelEdit}
          isLoading={isLoading}
          error={error}
          onViewApplications={onViewApplications}
          onViewListings={onViewListings}
          activeListingCount={activeListingCount}
        />
      </TabsContent>

      <TabsContent value="documents">
        {showDocumentsTab ? (
          <ProfileDocumentsTab
            isEditing={isEditing}
            documents={documents}
            onViewDocument={onViewDocument}
            onDeleteDocument={onDeleteDocument}
            onUploadAdditional={onUploadAdditional}
            userId={userId}
            userRoles={userRoles}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="text-center py-8 text-textdark/60">
            Documents section coming soon
          </div>
        )}
      </TabsContent>

      <TabsContent value="saved">
        <ProfileSavedTab
          savedPosts={savedPosts}
          isLoadingSavedPosts={isLoadingSavedPosts}
          savedPostsError={savedPostsError}
          onFetchSavedPosts={onFetchSavedPosts}
          onRemoveSavedPost={onRemoveSavedPost}
          onNavigateToListings={onNavigateToListings}
          CarListingCardComponent={CarListingCardComponent}
          // jobs
          savedJobs={savedJobs}
          isLoadingSavedJobs={isLoadingSavedJobs}
          savedJobsError={savedJobsError}
          onFetchSavedJobs={onFetchSavedJobs}
          onRemoveSavedJob={onRemoveSavedJob}
        />
      </TabsContent>
    </Tabs>
  );
}

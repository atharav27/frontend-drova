"use client";

import { ProfileTabsLayout as SharedProfileTabsLayout, ProfileTabsLayoutProps } from "@repo/ui/components/profile/ProfileTabsLayout";
import { useAuthMe } from "@repo/hooks";

interface DriverJobsProfileTabsLayoutProps {
  isEditing?: boolean;
  userData?: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  onSaveProfile?: (data: { // eslint-disable-line no-unused-vars
    fullName: string;
    email: string;
    phone: string;
    location: string;
  }) => void;
  onCancelEdit?: () => void;
}

export function ProfileTabsLayout({
  isEditing = false,
  userData,
  onSaveProfile,
  onCancelEdit
}: DriverJobsProfileTabsLayoutProps) {
  // Get user profile data from auth
  const { data: authData } = useAuthMe();

  // Extract document data from auth response
  const documents = authData?.documents;

  // Document operation handlers
  const handleViewDocument = (documentId: string) => {
    console.log("View document:", documentId);
    // TODO: Implement document viewing logic for driver jobs
    // This could open a modal, navigate to a document viewer, or open in new tab
  };

  const handleDeleteDocument = (documentId: string) => {
    console.log("Delete document:", documentId);
    // TODO: Implement document deletion logic for driver jobs
    // This should show a confirmation dialog and call an API to delete the document
  };

  const handleUploadAdditional = () => {
    console.log("Upload additional documents");
    // TODO: Implement document upload logic for driver jobs
    // This could open a file picker or navigate to an upload page
  };

  // Navigation handlers for profile overview
  const handleViewApplications = () => {
    // Navigate to driver jobs applications
    window.location.href = '/driver-jobs/applications';
  };

  const handleViewListings = () => {
    // Navigate to marketplace user posts
    window.location.href = 'http://localhost:3002/user-posts';
  };

  return (
    <SharedProfileTabsLayout
      isEditing={isEditing}
      userData={userData}
      onSaveProfile={onSaveProfile}
      onCancelEdit={onCancelEdit}
      onViewApplications={handleViewApplications}
      onViewListings={handleViewListings}
      showDocumentsTab={true}
      documents={documents}
      onViewDocument={handleViewDocument}
      onDeleteDocument={handleDeleteDocument}
      onUploadAdditional={handleUploadAdditional}
    />
  );
}

// Export the shared interface for compatibility
export type { ProfileTabsLayoutProps };

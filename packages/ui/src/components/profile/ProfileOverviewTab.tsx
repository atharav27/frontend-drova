"use client";

import { Card } from "@repo/ui/components/ui/card";
import { ArrowRight, Box, Briefcase } from "lucide-react";
import React from "react";
import { EditProfile } from "@repo/ui/components/profile/EditProfile";

export interface ProfileOverviewTabProps {
  isEditing?: boolean;
  userData?: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  onSaveProfile?: (_data: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  }) => void;
  onCancelEdit?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onViewApplications?: () => void;
  onViewListings?: () => void;
  activeListingCount?: number;
}

export function ProfileOverviewTab({
  isEditing = false,
  userData,
  onSaveProfile,
  onCancelEdit,
  isLoading = false,
  error = null,
  onViewApplications,
  onViewListings,
  activeListingCount = 0
}: ProfileOverviewTabProps) {

  // If in edit mode, show EditProfile component
  if (isEditing && userData && onSaveProfile && onCancelEdit) {
    return (
      <EditProfile
        initialData={userData}
        onSave={onSaveProfile}
        onCancel={onCancelEdit}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Class variables for reuse
  const cardBase = "flex-1 p-4 md:p-8 flex flex-col items-start justify-between border-none bg-primary/5";
  const cardTitle = "font-medium text-base md:text-lg text-textdark";
  const cardButton = "text-primary text-sm md:text-md font-semibold flex items-center gap-1 hover:underline cursor-pointer";


  return (
    <div className="space-y-8 md:space-y-12 bg-white rounded-lg p-6 md:p-10 border border-[#1E293B14]/10 shadow-sm">
      <div className="mb-2">
        <h2 className="text-xl md:text-2xl font-semibold text-textdark">Profile Overview</h2>
        <p className="text-textdark/70 text-base md:text-lg mt-1">View your profile details and recent activity.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6  md:gap-4 lg:gap-10  px-2 md:px-0   lg:px-8 pt-3">
        {/* Recent Jobs */}
        <Card className={cardBase + " p-4 md:px-4 md:py-8 lg:px-8 lg:py-8"}>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-textdark" />
            <span className={cardTitle}>Recent Jobs</span>
          </div>
          <div className="text-textdark/70 text-sm md:text-md mb-3">You have 2 active job applications.</div>
          <button
            type="button"
            onClick={onViewApplications || (() => {})}
            className={cardButton}
          >
            View all Applications <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </Card>
        {/* Buy & Sell */}
        <Card className={cardBase + " p-4 md:px-4 md:py-8 lg:px-8 lg:py-8"}>
          <div className="flex items-center gap-2 mb-2">
            <Box className="h-5 w-5 md:h-6 md:w-6 text-textdark" />
            <span className={cardTitle}>Buy & Sell</span>
          </div>
          <div className="text-textdark/70 text-sm md:text-md mb-3">
            {activeListingCount === 0
              ? "You have no active listings."
              : `You have ${activeListingCount} active listing${activeListingCount === 1 ? '' : 's'}.`
            }
          </div>
          <button
            type="button"
            onClick={onViewListings || (() => {})}
            className={cardButton}
          >
            View Your Listing <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </Card>
      </div>
      {/* Profile Completion */}
      <Card className="mt-4 p-4 md:p-8 mx-2 md:mx-0 lg:mx-8 shadow-none border border-gray-200">
        <h3 className="text-xl md:text-2xl font-semibold text-textdark mb-4">Profile Completion</h3>
        <div className="space-y-4 md:space-y-6">
          <div>
            <div className="flex justify-between text-xs md:text-sm font-medium text-textdark mb-2">
              <span>Basic Info</span>
              <span>Completed</span>
            </div>
            <div className="w-full h-2 bg-[#FFCF51]/10 rounded-full mb-2">
              <div className="h-2 bg-[#FFCF51] rounded-full w-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs md:text-sm font-medium text-textdark mb-2">
              <span>Documents</span>
              <span>75% complete</span>
            </div>
            <div className="w-full h-2 bg-[#FFCF51]/10 rounded-full">
              <div className="h-2 bg-[#FFCF51] rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

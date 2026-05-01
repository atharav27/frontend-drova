"use client"
import { Calendar, UserRound, BadgeCheck, Share2, Bookmark } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import { PostActionButtons } from "~/components/PostActionButtons";
import { useLazyAuthAction } from "~/hooks/useAuthAction";
import { AuthDialog } from "@repo/ui/components/common/AuthDialog";
import { useGetContactDetails, useSaveVehiclePost, useUnsaveVehiclePost, useGetSavedStatus, useUpdateVehiclePostStatus } from "~/hooks/query/useVehiclePosts";
import { useState, useEffect } from "react";
import { useAuthMe } from "@repo/hooks";
import { toast } from "sonner";
import { ButtonLoader } from "@repo/ui/components/common/UnifiedLoader";
import { UseMutationResult } from "@tanstack/react-query";

interface PostSummaryCardProps {
  contactName: string;
  contactNumber: string;
  createdAt: string;
  isOwner?: boolean;
  postId?: string;
  onUpdate?: () => void;
  postStatus?: string;
  isSaved?: boolean;
  activeListingCount?: number;
  currentStatus?: "DRAFT" | "PUBLISHED" | "SOLD";
  updatePostStatus?: UseMutationResult<any, Error, { id: string; status: "DRAFT" | "PUBLISHED" | "SOLD" }, unknown>;
  setActiveTab?: (_tab: "drafts" | "sold" | "published") => void; // eslint-disable-line no-unused-vars
}

export default function PostSummaryCard({
  contactName = "Rajesh Kumar",
  contactNumber: _contactNumber = "+91 9876543210", // eslint-disable-line no-unused-vars
  createdAt,
  isOwner = false,
  postId,
  onUpdate: _onUpdate, // eslint-disable-line no-unused-vars
  isSaved: postIsSaved,
  activeListingCount = 0,
  currentStatus,
  updatePostStatus,
  setActiveTab,
}: PostSummaryCardProps) {
  const { executeWithAuth, showAuthDialog, setShowAuthDialog, handleSignIn, handleRegister, closeDialog } = useLazyAuthAction();

  // Check current authentication status
  const { status } = useAuthMe();
  const isAuthenticated = status === 'authenticated';

  // State for managing contact details fetching
  const [shouldFetchContact, setShouldFetchContact] = useState(false);

  // LOCAL STATE: Track the current save status for immediate UI updates
  const [isSaved, setIsSaved] = useState(postIsSaved);

  // Hooks for saving and unsaving vehicle post
  const { mutate: savePost, isPending: isSaving } = useSaveVehiclePost();
  const { mutate: unsavePost, isPending: isUnsaving } = useUnsaveVehiclePost();

  // Hook for updating post status (if not provided as prop)
  const updatePostStatusHook = useUpdateVehiclePostStatus();
  const finalUpdatePostStatus = updatePostStatus || updatePostStatusHook;

  // Hook to get contact details (only fetch when enabled)
  const { data: contactDetails, isLoading: isLoadingContact, error: contactError } = useGetContactDetails(
    postId || '',
    shouldFetchContact && !!postId
  );

  // Hook to get saved status from dedicated API endpoint
  const { data: savedStatusData, isLoading: isLoadingSavedStatus, error: savedStatusError } = useGetSavedStatus(
    postId || '',
    isAuthenticated && !!postId
  );

  // Handle contact fetch error
  if (contactError) {
    console.error('Failed to fetch contact details:', contactError);
  }

  // Handle saved status fetch error
  if (savedStatusError) {
    console.error('Failed to fetch saved status:', savedStatusError);
  }

  // Reset contact fetching state when user becomes unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setShouldFetchContact(false);
    }
  }, [isAuthenticated]);

  // SYNC WITH BACKEND: Use dedicated saved status API as the source of truth
  useEffect(() => {
    if (savedStatusData !== undefined) {
      setIsSaved(savedStatusData.isSaved);
    }
  }, [savedStatusData]);

  // Fallback: If dedicated API is not available, use prop value
  useEffect(() => {
    if (savedStatusData === undefined && postIsSaved !== undefined) {
      setIsSaved(postIsSaved);
    }
  }, [postIsSaved, savedStatusData]);

  // Calculate days ago from createdAt
  const daysAgo = createdAt
    ? Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24))
    : 2;

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    executeWithAuth(() => {
      // User is authenticated, fetch contact details
      setShouldFetchContact(true);

    });
  };

  const handleShare = () => {
    executeWithAuth(() => {
      // Implement share functionality
      navigator.share?.({
        title: `Contact ${contactName}`,
        url: window.location.href
      }) || alert("Share functionality");
    });
  };

  const handleSaveToggle = () => {
    executeWithAuth(() => {
      if (!postId) {
        toast.error("Post ID not available");
        return;
      }

      if (isSaved) {
        // Currently Saved → trigger unsave API, set local state to false
        unsavePost(postId, {
          onSuccess: (data) => {
            setIsSaved(false); // Update local state immediately
            toast.success(data.message || "Post removed from your favorites!");
          },
          onError: (error: any) => {
            toast.error(error.message || "Failed to unsave post. Please try again.");
          }
        });
      } else {
        // Currently Save → trigger save API, set local state to true
        savePost(postId, {
          onSuccess: (data) => {
            setIsSaved(true); // Update local state immediately
            toast.success(data.message || "Post saved to your favorites!");
          },
          onError: (error: any) => {
            // If it's already saved, show info message
            if (typeof error?.message === 'string' && error.message.toLowerCase().includes('already saved')) {
              setIsSaved(true); // Update local state to match backend
              toast.info("Already saved in your bookmarks");
              return;
            }
            toast.error(error.message || "Failed to save post. Please try again.");
          }
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Seller Info */}
      <Card className="rounded-xl border shadow-sm relative">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4 ">
            <Avatar className="h-16 w-16">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#FFCF5112]/10 text-[#FFCF51]">
                <UserRound className="h-6 w-6 " />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div>
                  <h3 className="font-semibold text-textdark text-lg sm:text-xl md:text-2xl ">
                    {(isAuthenticated && contactDetails?.contactName) || contactName}
                  </h3>
                  <div className="flex items-center gap-1 text-lg text-textdark/60">
                    <Calendar className="h-5 w-5 text-textdark/60" />
                    <span>{daysAgo} days ago</span>
                  </div>
                </div>
                <div className="bg-[#6AD072] text-white text-xs px-4 py-2 rounded-l-full absolute top-12 right-0">
                  <BadgeCheck className="h-5 w-5" />
                </div>
              </div>

            </div>
          </div>


          <Badge variant="secondary" className="bg-primary/15 text-textdark/70 px-5 py-2 mt-4 text-sm font-medium rounded-full border border-textdark/10">
            {activeListingCount} Active Listing{activeListingCount !== 1 ? 's' : ''}
          </Badge>


          <Button
            onClick={handleContactSeller}
            disabled={isLoadingContact}
            className="w-full bg-primary text-white text-base mb-6 hover:bg-primary/90 mt-12 py-3"
          >
            {isLoadingContact
              ? <ButtonLoader message="Loading" />
              : (isAuthenticated && contactDetails)
                ? `Call ${contactDetails.contactNumber}`
                : 'Show Contact Number'
            }
          </Button>

          <div className="flex gap-12 justify-center pt-4 border-t-2 border-gray-200">
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 text-lg font-normal hover:bg-transparent p-0"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleSaveToggle}
              variant="ghost"
              size="sm"
              disabled={isSaving || isUnsaving || isLoadingSavedStatus}
              className="text-primary text-lg font-normal hover:text-primary/80 hover:bg-transparent p-0"
            >
              <Bookmark
                className={`h-5 w-5 mr-2 ${isSaved
                    ? 'fill-primary'
                    : ''
                  }`}
              />
              {isLoadingSavedStatus
                ? 'Loading...'
                : isSaving
                  ? 'Saving...'
                  : isUnsaving
                    ? 'Unsaving...'
                    : isSaved
                      ? 'Saved'
                      : 'Save'
              }
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Owner Actions */}
      {isOwner && postId && (
        <div className="space-y-4">
          <PostActionButtons
            postId={postId}
            currentStatus={currentStatus}
            updatePostStatus={finalUpdatePostStatus}
            setActiveTab={setActiveTab}
            hideViewButton={true}
            className="grid grid-cols-3 gap-3"
          />
        </div>
      )}

      {/* Safety Tips */}
      <div className="bg-primary/10 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4 text-[#3B4973]">
          <span className="text-lg">*</span>
          <h3 className="font-medium text-xl  md:text-2xl text-[#3B4973] ">Safety Tips</h3>
        </div>
        <ul className="space-y-2 text-base md:text-xl text-[#3B4973] font-normal">
          <li>• Meet in a safe, public location</li>
          <li>• Inspect the vehicle thoroughly</li>
          <li>• Verify all documentation</li>
          <li>• Don't pay in advance</li>
        </ul>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={closeDialog}
        onSignIn={handleSignIn}
        onRegister={handleRegister}
      />
    </div>
  );
}

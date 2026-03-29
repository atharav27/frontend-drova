"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Info, Bookmark, CheckCircle, Trash2, Upload } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteVehiclePost } from "~/hooks/query/useVehiclePosts";
import { ConfirmationDialog } from "@repo/ui/components/common/ConfirmationDialog";
import { UseMutationResult } from "@tanstack/react-query";
import { ButtonLoader } from "@repo/ui/components/common/UnifiedLoader";
import { useState } from "react";

interface PostActionButtonsProps {
  /** Post ID for navigation and actions */
  postId: string;
  /** Current status of the post */
  currentStatus?: "DRAFT" | "PUBLISHED" | "SOLD";
  /** Function to refetch posts after operations */
  refetchPosts?: () => void;
  /** Hide the view button (useful when already on the post page) */
  hideViewButton?: boolean;
  /** Hook for updating post status */
  updatePostStatus?: UseMutationResult<any, Error, { id: string; status: "DRAFT" | "PUBLISHED" | "SOLD" }, unknown>;
  /** Function to change active tab */
  setActiveTab?: (tab: "drafts" | "sold" | "published") => void; // eslint-disable-line no-unused-vars
  className?: string;
}

interface ButtonConfig {
  icon: React.ReactNode;
  label: string | React.ReactNode;
  onClick: () => void;
  variant: "primary" | "danger";
  disabled?: boolean;
}

export function PostActionButtons({
  postId,
  currentStatus,
  refetchPosts,
  hideViewButton = false,
  updatePostStatus,
  setActiveTab,
  className,
}: PostActionButtonsProps) {
  const router = useRouter();

  // Track which specific operation is in progress
  const [operationInProgress, setOperationInProgress] = useState<string | null>(null);

  // Delete hook with integrated functionality
  const { mutate: deletePost, isPending: isDeleting } = useDeleteVehiclePost();

  const handleView = () => {
    router.push(`/posts/${postId}`);
  };

  const handleDraft = () => {
    if (!updatePostStatus) {
      toast.error("Update functionality not available");
      return;
    }

    setOperationInProgress("draft");
    updatePostStatus.mutate(
      { id: postId, status: "DRAFT" },
      {
        onSuccess: () => {
          toast.success("Post moved to draft!");
          refetchPosts?.();
          setActiveTab?.("drafts");
          setOperationInProgress(null);
        },
        onError: (error: any) => {
          toast.error(`Failed to move post to draft: ${error?.message || 'Unknown error'}`);
          setOperationInProgress(null);
        },
      }
    );
  };

  const handlePublish = () => {
    if (!updatePostStatus) {
      toast.error("Update functionality not available");
      return;
    }

    setOperationInProgress("publish");
    updatePostStatus.mutate(
      { id: postId, status: "PUBLISHED" },
      {
        onSuccess: () => {
          toast.success("Post published successfully!");
          refetchPosts?.();
          setActiveTab?.("published");
          setOperationInProgress(null);
        },
        onError: (error: any) => {
          toast.error(`Failed to publish post: ${error?.message || 'Unknown error'}`);
          setOperationInProgress(null);
        },
      }
    );
  };

  const handleMarkAsSold = () => {
    if (!updatePostStatus) {
      toast.error("Update functionality not available");
      return;
    }

    setOperationInProgress("sold");
    updatePostStatus.mutate(
      { id: postId, status: "SOLD" },
      {
        onSuccess: () => {
          toast.success("Post marked as sold!");
          refetchPosts?.();
          setActiveTab?.("sold");
          setOperationInProgress(null);
        },
        onError: (error: any) => {
          toast.error(`Failed to mark post as sold: ${error?.message || 'Unknown error'}`);
          setOperationInProgress(null);
        },
      }
    );
  };

  const handleDelete = () => {
    deletePost(postId, {
      onSuccess: () => {
        toast.success("Post deleted successfully!");
        refetchPosts?.();
        router.push("/posts/user-posts");
      },
      onError: () => {
        toast.error("Failed to delete post. Please try again.");
      },
    });
  };
  // Button configuration based on current status
  const buttonConfig: ButtonConfig[] = [
    // Conditionally include View button
    ...(hideViewButton ? [] : [{
      icon: <Info className="h-5 w-5" />,
      label: "View",
      onClick: handleView,
      variant: "primary" as const
    }]),

    // Only show Draft button if not SOLD and not already DRAFT
    ...(currentStatus !== "SOLD" && currentStatus !== "DRAFT" ? [{
      icon: <Bookmark className="h-5 w-5" />,
      label: operationInProgress === "draft" ? <ButtonLoader message="Moving" /> : "Draft",
      onClick: handleDraft,
      variant: "primary" as const,
      disabled: operationInProgress === "draft" || isDeleting
    }] : []),

    // Only show Publish button if status is DRAFT
    ...(currentStatus === "DRAFT" ? [{
      icon: <Upload className="h-5 w-5" />,
      label: operationInProgress === "publish" ? <ButtonLoader message="Publishing" /> : "Publish",
      onClick: handlePublish,
      variant: "primary" as const,
      disabled: operationInProgress === "publish" || isDeleting
    }] : []),

    // Only show Mark as Sold button if not already SOLD and not DRAFT
    ...(currentStatus !== "SOLD" && currentStatus !== "DRAFT" ? [{
      icon: <CheckCircle className="h-5 w-5" />,
      label: operationInProgress === "sold" ? <ButtonLoader message="Updating" /> : "Mark as Sold",
      onClick: handleMarkAsSold,
      variant: "primary" as const,
      disabled: operationInProgress === "sold" || isDeleting
    }] : []),

    // Always show Delete button
    {
      icon: <Trash2 className="h-5 w-5" />,
      label: isDeleting ? <ButtonLoader message="Deleting" /> : "Delete",
      onClick: handleDelete,
      variant: "danger" as const,
      disabled: isDeleting
    }
  ];

  return (
    <div className={cn(" ", className)}>
      {buttonConfig.map((btn, index) => {
        if (btn.label === "Delete") {
          return (
            <ConfirmationDialog
              key={index}
              trigger={
                <Button
                  variant="outline"
                  disabled={btn.disabled}
                  className={cn(
                    "flex items-center justify-center px-3 sm:px-4 lg:px-6 text-sm sm:text-base lg:text-lg py-2 sm:py-3 lg:py-3 gap-1 w-full",
                    "bg-white border-[#C84B47] text-[#C84B47] hover:bg-white hover:text-[#C84B47]/90 hover:border-[#C84B47]/90"
                  )}
                >
                  {btn.icon}
                  <span>{btn.label}</span>
                </Button>
              }
              title="Are you sure you want to delete this listing?"
              description="Once deleted, this listing will be permanently removed and cannot be recovered."
              onConfirm={handleDelete}
              confirmText="Delete"
              cancelText="Cancel"
              isLoading={isDeleting}
              loadingText="Deleting..."
            />
          );
        }

        return (
          <Button
            key={index}
            variant="outline"
            onClick={btn.onClick}
            disabled={btn.disabled}
            className={cn(
              "flex items-center justify-center px-3 sm:px-4 lg:px-6 text-sm sm:text-base lg:text-lg py-2 sm:py-3 lg:py-3 gap-1 w-full",
              btn.variant === "primary"
                ? "border-primary bg-white text-primary hover:bg-white hover:text-primary/90 hover:border-primary/90"
                : "bg-white border-[#C84B47] text-[#C84B47] hover:bg-white hover:text-[#C84B47]/90 hover:border-[#C84B47]/90"
            )}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

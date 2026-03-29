"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/ui/tabs";
import { useUserVehiclePosts, VehiclePost, useUpdateVehiclePostStatus } from "~/hooks/query/useVehiclePosts";
import { useUserProfile } from "~/hooks/query/useUserProfile";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { CarListingCardPost } from "./CarListingCardPost";
import { useRouter } from "next/navigation";
import { CirclePlus, Search } from "lucide-react";
import BackButton from '@repo/ui/components/login/BackButton';
import AuthGuard from '~/components/AuthGuard';
import { CardLoader } from "@repo/ui/components/common/UnifiedLoader";
import { EmptyState } from "@repo/ui/components/common/EmptyState";
import { useRoleBasedNavigation } from "~/hooks/useRoleBasedNavigation";
import { useLazyAuthAction } from "~/hooks/useAuthAction";

const ITEMS_PER_PAGE = 10;
type TabType = "drafts" | "sold" | "published";

export default function MyPostsPage() {
  const router = useRouter();
  const { showAuthDialog, setShowAuthDialog } = useLazyAuthAction();
  const { navigateToSellerRoute } = useRoleBasedNavigation({
    showAuthDialog,
    setShowAuthDialog
  });

  const { data: userProfile } = useUserProfile()
  const userId = userProfile?.id ?? "";
  const [currentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("drafts");
  const {
    data,
    isError,
    isLoading,
    refetch
  } = useUserVehiclePosts(userId ?? "", currentPage, ITEMS_PER_PAGE);

  // Hook for updating post status
  const updatePostStatus = useUpdateVehiclePostStatus();

  useEffect(() => {
    if (isError) toast.error("Error fetching posts");
  }, [isError]);

  const filterByStatus = (status: string): VehiclePost[] => {
    return data?.items?.filter((post) => post.status === status) ?? [];
  };

    const getPosts = (): VehiclePost[] => {
    switch (activeTab) {
      case "drafts":
        return filterByStatus("DRAFT");
      case "sold":
        return filterByStatus("SOLD");
      case "published":
        return filterByStatus("PUBLISHED");
      default:
        return [];
    }
  };

  // Get dynamic counts for each tab
  const getTabCounts = () => {
    const draftsCount = filterByStatus("DRAFT").length;
    const publishedCount = filterByStatus("PUBLISHED").length;
    const soldCount = filterByStatus("SOLD").length;

    return {
      drafts: draftsCount,
      sold: soldCount,
      published: publishedCount
    };
  };

  const tabCounts = getTabCounts();

  const posts = getPosts();

  return (
    <AuthGuard role="SELLER">
      <main className="container py-4 sm:py-6 lg:py-10 ">
        {/* Header Section */}
        <div className="space-y-5 sm:space-y-6 mb-6 sm:mb-8">
          {/* Back Button */}
          <BackButton
            isOtpStep={true}
            onBackClick={() => router.back()}
            buttonText="Back to Profile Overview"
          />

          {/* Title and Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-textdark">My Listings</h1>
              <p className="text-lg lg:text-xl text-textdark/70 mt-1">Manage your vehicle and equipment listings</p>
            </div>
            <Button
              onClick={async () => await navigateToSellerRoute("/posts/create")}
              className=" w-full sm:w-auto bg-textdark text-white hover:bg-textdark/90 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-1 sm:gap-2 font-semibold self-start sm:self-auto text-base lg:text-lg"
            >
              <CirclePlus className="h-5 w-5" />
              <span >Create New Listing</span>

            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-textdark/70" />
            <Input
              type="text"
              placeholder="Search Your Listings....."
              className="pl-3 sm:pl-5 pr-10 sm:pr-12 py-3 sm:py-4 lg:py-6 w-full border text-textdark/70 text-sm sm:text-base lg:text-xl placeholder:text-textdark/70 placeholder:text-sm sm:placeholder:text-base lg:placeholder:text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabType)}>
          <TabsList className="w-full h-full gap-4 sm:gap-8 md:gap-16 lg:gap-28 px-2 py-1 sm:py-2 flex justify-center items-center mb-1">
            <TabsTrigger className="py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base" value="published">
              <span className="hidden sm:inline">Published({tabCounts.published})</span>
              <span className="sm:hidden">Pub({tabCounts.published})</span>
            </TabsTrigger>
            <TabsTrigger className="py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base" value="sold">
              <span className="hidden sm:inline">Sold({tabCounts.sold})</span>
              <span className="sm:hidden">Sold({tabCounts.sold})</span>
            </TabsTrigger>
            <TabsTrigger className="py-1 sm:py-2 px-2 sm:px-4 text-sm sm:text-base" value="drafts">
              <span className="hidden sm:inline">Drafts({tabCounts.drafts})</span>
              <span className="sm:hidden">Draft({tabCounts.drafts})</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="w-full border-t border-slate-400 py-6 relative">
            {isLoading ? (
              <CardLoader message="Loading your posts..." />
            ) : posts.length === 0 ? (
              <EmptyState
                icon={CirclePlus}
                title={
                  activeTab === 'drafts' ? 'No Draft Listings' :
                  activeTab === 'published' ? 'No Published Listings' :
                  'No Sold Listings'
                }
                description={
                  activeTab === 'drafts' ? 'You don\'t have any draft listings. Create a new listing and save it as draft to get started.' :
                  activeTab === 'published' ? 'You don\'t have any published listings. Publish your listings to make them visible to buyers.' :
                  'You don\'t have any sold listings yet. Once you mark a listing as sold, it will appear here.'
                }
                actionLabel={
                  activeTab === 'drafts' ? 'Create Draft Listing' :
                  activeTab === 'published' ? 'Create New Listing' :
                  undefined
                }
                onAction={activeTab !== 'sold' ? async () => await navigateToSellerRoute("/posts/create") : undefined}
                showAction={activeTab !== 'sold'}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
                  {Array.isArray(posts) && posts.map((car) => (
                    <CarListingCardPost
                      key={car.id}
                      {...car}
                      refetchPosts={refetch}
                      updatePostStatus={updatePostStatus}
                      setActiveTab={setActiveTab}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </AuthGuard>
  );
}

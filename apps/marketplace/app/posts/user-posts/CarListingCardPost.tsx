"use client";

import Image from "next/image";
import { Card } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import { VehiclePost } from "~/hooks/query/useVehiclePosts";
import { UseMutationResult } from "@tanstack/react-query";
import carImg from "@repo/ui/assets/images/car.png";
// import { useQueryClient } from "@tanstack/react-query";
// import { useUserProfile } from "~/hooks/query/useUserProfile";
import { Edit } from "lucide-react";

import { PostActionButtons } from "~/components/PostActionButtons";

interface CarListingCardProps extends VehiclePost {
  refetchPosts?: () => void;
  updatePostStatus?: UseMutationResult<any, Error, { id: string; status: "DRAFT" | "PUBLISHED" | "SOLD" }, unknown>;
  setActiveTab?: (tab: "drafts" | "sold" | "published") => void; // eslint-disable-line no-unused-vars
}

// Reusable stats component
interface StatItemProps {
  label: string;
  value: string | number;
}

const StatItem = ({ label, value }: StatItemProps) => (
  <div className="text-center px-2 sm:px-4 md:px-5 lg:px-10 py-2 sm:py-3 bg-[#F8F8F8] flex-1 md:flex-initial min-w-0">
    <p className="text-xs sm:text-sm text-textdark/60 mb-1">{label}</p>
    <p className="text-sm sm:text-base md:text-lg font-medium text-textdark">{value}</p>
  </div>
);

interface VehicleStatsProps {
  views?: number;
  inquiries?: number;
  postedDate?: string;
}

const VehicleStats = ({ views = 200, inquiries = 12, postedDate = "15 May" }: VehicleStatsProps) => (
  <div className="flex gap-3 sm:gap-4 md:gap-2 lg:gap-3 border-b border-textdark/30 pb-4 sm:pb-5 lg:pb-6 w-full min-w-0 overflow-hidden">
    <StatItem label="Views" value={views} />
    <StatItem label="Inquiries" value={inquiries} />
    <StatItem label="Posted" value={postedDate} />
  </div>
);

export const CarListingCardPost = ({
  id,
  vehicleName,
  price,
  status,
  refetchPosts,
  updatePostStatus,
  setActiveTab
}: CarListingCardProps) => {
  const router = useRouter();

  return (
    <Card className="w-full overflow-hidden border shadow-sm rounded-lg p-0">
      <div className="flex flex-col md:flex-row">
        {/* Left side - Image */}
        <div className="relative aspect-[3/2] w-full md:w-1/2 lg:w-1/2 xl:w-1/3 flex-shrink-0">
          <Image src={carImg.src} alt={vehicleName} fill className="object-fill rounded-t-lg md:rounded-l-lg md:rounded-tr-none" />
          {/* Verified Seller Badge */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#6AD072] text-white text-xs px-2 py-1 sm:px-3 sm:py-1 rounded-full">
            Verified Seller
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-w-0">
          {/* Header with Edit Icon */}
          <div className="flex justify-between items-start mb-4 sm:mb-6 lg:mb-8">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-textdark mb-1 sm:mb-2 truncate">{vehicleName}</h3>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                ₹{price?.toLocaleString()}
                <span className="text-base sm:text-lg lg:text-xl font-normal text-primary ml-1">+taxes</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/posts/update-post/${id}`)}
              className="text-primary hover:text-primary/90 py-2 sm:py-3 lg:py-5 px-2 bg-primary/10 rounded-md flex-shrink-0"
            >
              <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </Button>
          </div>

          {/* Stats Section */}
          <VehicleStats views={200} inquiries={12} postedDate="15 May" />

          {/* Action Buttons */}
          <PostActionButtons
            postId={id}
            currentStatus={status as "DRAFT" | "PUBLISHED" | "SOLD"}
            refetchPosts={refetchPosts}
            updatePostStatus={updatePostStatus}
            setActiveTab={setActiveTab}
            className="grid grid-cols-2 lg:grid-cols-2 xl:flex gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-5 lg:mt-6"
          />
        </div>
      </div>
    </Card>
  );
};

'use client';

import { notFound, useRouter } from 'next/navigation';
import { useGetVehiclePostById, useUpdateVehiclePostStatus } from '~/hooks/query/useVehiclePosts';
import { PostImageGallery } from '../components/post-image-gallery';
import { PostDetailsTabs } from '../components/post-details-tabs';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@repo/ui/components/ui/button';
import carImg from "@repo/ui/assets/images/car.png";
import type { Profile } from '~/hooks/query/useUserProfile';
import PostSummaryCard from '../components/PostSummaryCard';

import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import BackButton from '@repo/ui/components/login/BackButton';
import { PageLoader } from "@repo/ui/components/common/UnifiedLoader";



export default function SinglePostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: post, isLoading, error, isError } = useGetVehiclePostById(params.id);
  const userProfile = queryClient.getQueryData<Profile>(["user-profile"]);
  const updatePostStatus = useUpdateVehiclePostStatus();

  useEffect(() => {
    if (isError) {
      toast.error("Error fetching post: " + (error as Error).message);
    }
  }, [isError, error]);

  if (!params.id) {
    return notFound();
  }

  if (isLoading) {
    return <PageLoader message="Loading post details..." />;
  }

  if (isError || !post) {
    return (
      <div className="container py-4 sm:py-6 lg:py-10">
        <div className="my-4">
          <BackButton
            isOtpStep={true}
            onBackClick={() => router.back()}
            buttonText="Back"
          />
        </div>

        <div className="flex flex-col items-center justify-center p-10">
          <h3 className="text-xl font-semibold text-red-600">Post Not Found</h3>
          <p className="mt-2">The post you're looking for may have been removed or doesn't exist.</p>
          <Button
            className="mt-6 bg-blue-600 hover:bg-blue-500"
            onClick={() => router.push('/posts')}
          >
            View All Posts
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = post.userId === userProfile?.id;

  function getOrdinal(n: number): string {
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return n + "th";
    }

    switch (lastDigit) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
      default:
        return n + "th";
    }
  }



  const handleUpdate = () => {
    router.push(`/posts/update-post/${params.id}`);
  };

  const vehicleSpecifications = [
    { label: "Year", value: post.yearOfManufacture },
    { label: "Fuel Type", value: post.fuelType },
    { label: "Kilometers", value: `${post.kmsDriven.toLocaleString()} km` },
    { label: "Transmission", value: post.transmission }
  ];

  // Use actual post images or fallback to default
  const postImages = post.images && post.images.length > 0
    ? post.images.map(img => typeof img === 'string' ? img : carImg.src)
    : [carImg.src, carImg.src, carImg.src, carImg.src];

  return (
    <div className="container py-4 sm:py-6 lg:py-10 space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Back Button */}
      <BackButton
        isOtpStep={true}
        onBackClick={() => router.back()}
        buttonText="Back to Listings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Image Gallery */}
          <PostImageGallery images={postImages} title={post.vehicleName} />

          {/* Vehicle Title and Basic Info */}
          <div className="space-y-2 pt-2 sm:pt-4 relative">
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-textdark leading-tight">{post.vehicleName}</h1>
              <div className="bg-[#6AD072] text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0">
                <span>Verified Seller</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-lg">
              <MapPin className='h-5 w-5 text-textdark/60' />
              <span className='text-lg text-textdark/60'>{post.location} <span>• Posted 2 days ago</span></span>
            </div>
          </div>

          {/* Price Section */}
          <div className="pt-2 sm:pt-4">
            <div className="flex items-end gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-primary">₹{post.price.toLocaleString()}</span>
              <span className="text-primary font-normal text-lg sm:text-xl">+taxes</span>
            </div>
          </div>
          {/* Description */}
          {post.description && (
            <div className="pt-2">
              <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl text-textdark mb-2">Description</h3>
              <p className="text-base sm:text-lg lg:text-xl text-textdark/70 leading-relaxed">{post.description}</p>
            </div>
          )}
          {/* Vehicle Specifications */}
          <div className="rounded-xl py-4 sm:py-6 mt-4 sm:mt-6 lg:mt-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
              {vehicleSpecifications.map((spec, index) => (
                <div key={index} className="text-center bg-[#F5F5F5] py-3 sm:py-4 lg:py-5 shadow-sm px-3 sm:px-4 lg:px-5">
                  <p className="text-sm sm:text-base lg:text-lg text-textdark/60 mb-1">{spec.label}</p>
                  <p className="text-base sm:text-lg lg:text-xl font-normal text-textdark">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Seller Info and Actions */}
        <div className="space-y-4 sm:space-y-6">
          <PostSummaryCard
            contactName={post.contactName}
            contactNumber={post.contactNumber}
            createdAt={post.createdAt}
            isOwner={isOwner}
            postId={params.id}
            onUpdate={handleUpdate}
            isSaved={post.isSaved}
            activeListingCount={post.activeListingCount}
            currentStatus={post.status as "DRAFT" | "PUBLISHED" | "SOLD"}
            updatePostStatus={updatePostStatus}
          />


        </div>

      </div>


      {/* Detailed Tabs */}
      <PostDetailsTabs post={post} getOrdinal={getOrdinal} />
    </div>
  );
}

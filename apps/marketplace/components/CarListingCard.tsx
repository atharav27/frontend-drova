"use client"
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { VehiclePost } from "~/hooks/query/useVehiclePosts";
import carImg from "@repo/ui/assets/images/car.png";
import { Profile } from "~/hooks/query/useUserProfile";

type CardVariant = "default" | "compact";

interface CarListingCardProps extends VehiclePost {
  userProfile?: Profile;
  variant?: CardVariant;
  onClose?: () => void;
  showCloseButton?: boolean;
  postedDate?: string;
}

const CarListingCard = ({
  id,
  vehicleName,
  yearOfManufacture,
  fuelType,
  price,
  kmsDriven,
  description,
  variant = "default",
  onClose,
  showCloseButton = false,
  postedDate = "10 May 2025",
}: CarListingCardProps) => {
  const router = useRouter();
  const isVerifiedSeller = true; // You can add logic to determine if seller is verified

    // Compact variant
  if (variant === "compact") {
    return (
      <Card className="w-full overflow-hidden border py-0 border-[#1E293B14]/20 shadow-sm bg-white relative">
        {/* Close Button */}
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
          >
            <X className="h-4 w-4 text-textdark/60" />
          </button>
        )}

        <div className="flex flex-col sm:flex-row">
          {/* Car Image */}
          <div className="relative aspect-[3/2] w-full sm:w-80 sm:aspect-[4/3] flex-shrink-0">
            <Image
              src={carImg.src}
              alt={vehicleName}
              fill
              className="object-fill rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
            />
            {isVerifiedSeller && (
              <Badge className="absolute bottom-3 left-3 bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs font-medium rounded-full">
                Verified Seller
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between min-w-0">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-semibold text-textdark mb-2">
                {vehicleName}
              </h3>

              <p className="text-xl sm:text-2xl font-bold text-primary">
                ₹{price?.toLocaleString('en-IN')}
                <span className="text-base font-normal text-primary ml-1">+taxes</span>
              </p>
            </div>

            {/* Car Details Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center bg-[#F8F8F8] rounded-sm p-3">
                <p className="text-xs font-medium text-textdark/50 mb-1">Year</p>
                <p className="text-sm font-normal text-textdark">{yearOfManufacture}</p>
              </div>
              <div className="text-center bg-[#F8F8F8] rounded-sm p-3">
                <p className="text-xs font-medium text-textdark/50 mb-1">Fuel</p>
                <p className="text-sm font-normal text-textdark">{fuelType}</p>
              </div>
              <div className="text-center bg-[#F8F8F8] rounded-sm p-3">
                <p className="text-xs font-medium text-textdark/50 mb-1">Distance</p>
                <p className="text-sm font-normal text-textdark">{kmsDriven?.toLocaleString('en-IN')} km</p>
              </div>
            </div>

            {/* Bottom section with date and button */}
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-sm text-textdark/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                <span>{postedDate}</span>
              </div>

              <Button
                onClick={() => router.push(`/posts/${id}`)}
                className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 font-medium rounded-md transition-colors text-sm sm:text-base"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="w-full pt-0 overflow-hidden border border-[#1E293B14]/20 shadow-sm bg-white flex flex-col h-full">
      {/* Car Image with Verified Seller Badge */}
      <div className="relative w-full aspect-[8/5]">
        <Image
          src={carImg.src}
          alt={vehicleName}
          fill
          className="object-fill"
        />
        {isVerifiedSeller && (
          <Badge className="absolute bottom-4 right-6 bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs font-medium rounded-full">
            Verified Seller
          </Badge>
        )}
      </div>

      <CardContent className="px-6 flex-1 flex flex-col">
        {/* Car Title */}
        <h3 className="text-2xl font-semibold text-textdark mb-3">
          {vehicleName}
        </h3>

        {/* Price */}
        <div className="mb-6">
          <p className="text-xl font-semibold text-primary">
            ₹{price?.toLocaleString('en-IN')}
            <span className="text-base font-normal text-primary ml-1">+taxes</span>
          </p>
        </div>

        {/* Car Details Grid */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-center bg-[#F8F8F8] rounded-sm  p-4">
            <p className="text-sm  font-medium text-textdark/50 mb-1">Year</p>
            <p className=" font-normal text-textdark text-base ">{yearOfManufacture}</p>
          </div>
          <div className="text-center bg-[#F8F8F8] rounded-sm p-4">
            <p className="text-sm  font-medium text-textdark/50 mb-1">Fuel</p>
            <p className=" font-normal text-textdark text-base">{fuelType}</p>
          </div>
          <div className="text-center bg-[#F8F8F8] rounded-sm p-4">
            <p className="text-sm  font-medium text-textdark/50 mb-1">Distance</p>
            <p className=" font-normal text-textdark text-base">{kmsDriven?.toLocaleString('en-IN')} km</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-base text-textdark/70 leading-relaxed flex-1">
          {description || 'No description available'}
        </p>
      </CardContent>

      {/* View Details Button */}
      <CardFooter className="px-6 pt-0 mt-auto">
        <Button
          onClick={() => router.push(`/posts/${id}`)}
          className="w-full bg-primary text-lg hover:bg-primary/90 text-white py-3 font-medium rounded-md"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarListingCard;

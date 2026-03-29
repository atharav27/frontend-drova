"use client";

import React, { useState } from "react";
import { Card } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Briefcase, ShoppingCart, MapPin, Clock, X } from "lucide-react";
import BackButton from "@repo/ui/components/login/BackButton";
// CarListingCard component type for props
interface CarListingCardProps {
  id: string;
  vehicleName: string;
  price: number;
  yearOfManufacture: number;
  fuelType: string;
  kmsDriven: number;
  description?: string;
  postedDate?: string;
  variant?: "default" | "compact";
  showCloseButton?: boolean;
  onClose?: () => void;
  [key: string]: any; // Allow additional props
}

// Types
type ViewState = "selection" | "jobs" | "products";

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  postedDate: string;
  tags: string[];
}


interface ProfileSavedTabProps {
  // Saved posts data and state
  savedPosts?: any[];
  isLoadingSavedPosts?: boolean;
  savedPostsError?: any;

  // Handlers
  onFetchSavedPosts?: () => void;
  onRemoveSavedPost?: (postId: string) => void; // eslint-disable-line no-unused-vars
  onNavigateToListings?: () => void;

  // CarListingCard component
  CarListingCardComponent?: React.ComponentType<CarListingCardProps>;

  // Saved jobs data and handlers
  savedJobs?: SavedJob[];
  isLoadingSavedJobs?: boolean;
  savedJobsError?: any;
  onFetchSavedJobs?: () => void;
  onRemoveSavedJob?: (jobId: string) => void; // eslint-disable-line no-unused-vars
}

// Sample data
const sampleJobs: SavedJob[] = [
  {
    id: "1",
    title: "Delivery Driver",
    company: "Fastrack Logistics",
    location: "Bangalore, India",
    type: "Full-Time",
    salary: "₹25,000 - ₹35,000",
    experience: "2-5 years exp",
    postedDate: "10 May 2025",
    tags: ["LMV License", "Food & Accommodation Provided"]
  },
  {
    id: "2",
    title: "Delivery Driver",
    company: "SwiftMove Express",
    location: "Mumbai, India",
    type: "Full-Time",
    salary: "₹28,000 - ₹38,000",
    experience: "1-3 years exp",
    postedDate: "8 May 2025",
    tags: ["LMV License", "Flexible Hours"]
  }
];


// Job Card Component for Saved Jobs
function SavedJobCard({ job, onRemove }: { job: SavedJob; onRemove: () => void }) {
  return (
    <Card className="w-full overflow-hidden border border-[#1E293B14]/20 shadow-sm bg-white relative">
      {/* Close Button */}
      <button
        onClick={onRemove}
        className="absolute top-4 right-4 z-10 p-1 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
      >
        <X className="h-4 w-4 text-textdark/60" />
      </button>

      <div className="flex flex-col sm:flex-row">
        {/* Job Info */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between min-w-0">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-textdark mb-2">
              {job.title}
            </h3>
            <p className="text-lg text-textdark/80 mb-2">{job.company}</p>
            <p className="text-xl sm:text-2xl font-bold text-primary">
              {job.salary}
              <span className="text-base font-normal text-primary ml-1">• {job.experience}</span>
            </p>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-textdark/70">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <Badge className="text-sm bg-primary/10 text-primary border border-primary/20">
              {job.type}
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-textdark px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom section with date and button */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 text-sm text-textdark/50">
              <Clock className="w-4 h-4" />
              <span>{job.postedDate}</span>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 font-medium rounded-md transition-colors text-sm sm:text-base">
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}


export function ProfileSavedTab({
  savedPosts = [],
  isLoadingSavedPosts = false,
  savedPostsError = null,
  onFetchSavedPosts,
  onRemoveSavedPost,
  onNavigateToListings,
  CarListingCardComponent,
  savedJobs = sampleJobs,
  isLoadingSavedJobs = false,
  savedJobsError = null,
  onFetchSavedJobs,
  onRemoveSavedJob
}: ProfileSavedTabProps = {}) {
  const [currentView, setCurrentView] = useState<ViewState>("selection");
  const [selectedOption, setSelectedOption] = useState<"jobs" | "products" | null>(null);
  const [jobs, setJobs] = useState(sampleJobs);

  // Sync jobs from props if provided
  React.useEffect(() => {
    if (savedJobs && Array.isArray(savedJobs)) {
      setJobs(savedJobs);
    }
  }, [savedJobs]);

  // Convert API posts to CarListingCard format
  const savedProducts = savedPosts.map((post: any) => ({
    id: post.id,
    vehicleName: post.vehicleName || 'Unknown Vehicle',
    price: post.price,
    yearOfManufacture: post.yearOfManufacture,
    fuelType: post.fuelType,
    kmsDriven: post.kmsDriven,
    description: post.description,
    postedDate: new Date(post.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }),
    // Add other required VehiclePost fields with defaults
    vehicleCategory: post.vehicleCategory || 'Car',
    location: post.location || 'Unknown Location',
    seatingCapacity: post.seatingCapacity || 5,
    engineDisplacement: post.engineDisplacement || 0,
    mileage: post.mileage || 0,
    maxPower: post.maxPower || 0,
    features: post.features || [],
    images: post.images || [],
    contactName: post.contactName || 'Unknown',
    contactNumber: post.contactNumber || '',
    transmission: post.transmission || 'Manual',
    status: post.status || 'active',
    autoPublish: post.autoPublish || false,
    userId: post.userId || '',
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  }));

  const handleRemoveJob = (jobId: string) => {
    if (onRemoveSavedJob) {
      onRemoveSavedJob(jobId);
    } else {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  const handleRemoveProduct = (productId: string) => {
    onRemoveSavedPost?.(productId);
  };

  const handleBackToSelection = () => {
    setCurrentView("selection");
  };

  const handleJobsClick = () => {
    setSelectedOption("jobs");
    setCurrentView("jobs");
    onFetchSavedJobs?.();
  };

  const handleProductsClick = () => {
    setSelectedOption("products");
    setCurrentView("products");
    onFetchSavedPosts?.(); // Trigger API call via prop
  };

    // Selection View - Show radio button cards
  if (currentView === "selection") {
  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-12 bg-white rounded-lg p-4 sm:p-6 md:p-10 border border-[#1E293B14]/10 shadow-sm">
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-textdark">Saved Listings</h2>
          <p className="text-textdark/70 text-sm sm:text-base md:text-lg mt-1">View all your saved jobs & products in one organised space.</p>
      </div>

        {/* Radio Button Selection */}
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {/* Saved Jobs */}
          <Card className={`p-4 sm:p-6 md:p-8 border rounded-2xl sm:rounded-3xl md:rounded-3xl shadow-sm transition-all ${
            selectedOption === "jobs"
              ? "border-primary/30 bg-primary/10"
              : "border-primary/20"
          }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#4D619D] mb-1 sm:mb-2 md:mb-0 lg:mb-3">
                  Saved Jobs
                </h3>
                <p className="text-sm sm:text-base block md:hidden lg:block md:text-lg text-[#4D619D]/80 leading-relaxed">
                  Easily revisit job opportunities you've shown interest in.
                  <span className="hidden sm:inline"><br />Apply when ready and track your preferences.</span>
                </p>
              </div>
            </div>
              <button
                onClick={handleJobsClick}
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full border-2 border-primary/20 bg-white flex justify-center items-center ml-2 sm:ml-4 hover:border-primary/40 transition-colors cursor-pointer"
              >
                {selectedOption === "jobs" && (
                  <div className="w-3 h-3 sm:w-3 sm:h-3 lg:w-5 lg:h-5 rounded-full bg-primary flex-shrink-0"></div>
                )}
              </button>
          </div>
          <p className="text-sm sm:text-base hidden md:block lg:hidden md:text-lg text-[#4D619D]/80 leading-relaxed">
            Easily revisit job opportunities you've shown interest in.
            <span className="hidden sm:inline"><br />Apply when ready and track your preferences.</span>
          </p>
        </Card>

        {/* Saved Products */}
          <Card className={`p-4 sm:p-6 md:p-8 border rounded-2xl sm:rounded-3xl md:rounded-3xl shadow-sm transition-all ${
            selectedOption === "products"
              ? "border-primary/30 bg-primary/10"
              : "border-primary/20"
          }`}>
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <div className="flex-1">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#4D619D] mb-1 sm:mb-2 md:mb-0 lg:mb-3">
                  Saved Products
                </h3>
                  <p className="text-sm sm:text-base md:text-lg block md:hidden lg:block text-[#4D619D]/80 leading-relaxed">
                  Keep track of vehicles you have saved. Compare listings
                  <span className="hidden sm:inline"><br />or connect with sellers whenever you're ready.</span>
                </p>
              </div>
            </div>
              <button
                onClick={handleProductsClick}
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full border-2 border-primary/20 bg-white flex justify-center items-center ml-2 sm:ml-4 hover:border-primary/40 transition-colors cursor-pointer"
              >
                {selectedOption === "products" && (
              <div className="w-3 h-3 sm:w-3 sm:h-3 lg:w-5 lg:h-5 rounded-full bg-primary flex-shrink-0"></div>
                )}
              </button>
            </div>
            <p className="text-sm sm:text-base md:text-lg hidden md:block lg:hidden text-[#4D619D]/80 leading-relaxed">
            Keep track of vehicles you have saved. Compare listings
            <span className="hidden sm:inline"><br />or connect with sellers whenever you're ready.</span>
          </p>
        </Card>
      </div>
    </div>
  );
  }

  // Jobs View - Show saved jobs list
  if (currentView === "jobs") {
    return (
      <div className="space-y-6 bg-white rounded-lg p-4 sm:p-6 md:p-10 border border-[#1E293B14]/10 shadow-sm">
        {/* Back Button and Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <BackButton
            isOtpStep={true}
            onBackClick={handleBackToSelection}
            buttonText="Back"
            className="flex items-center text-textdark font-medium hover:text-gray-800 transition-colors"
          />
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-textdark mt-4">Saved Jobs</h2>
          <p className="text-textdark/70 text-sm sm:text-base md:text-lg mt-1">View all your saved jobs in one organised space.</p>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {isLoadingSavedJobs ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-textdark/60">Loading saved jobs...</p>
            </div>
          ) : savedJobsError ? (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600">Failed to load saved jobs</p>
              <p className="text-sm text-textdark/40">{savedJobsError.message}</p>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <SavedJobCard
                key={job.id}
                job={job}
                onRemove={() => handleRemoveJob(job.id)}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-textdark mb-3">
                  No saved jobs yet
                </h3>

                {/* Description */}
                <p className="text-textdark/60 mb-6 leading-relaxed">
                  Discover exciting job opportunities and save your favorites here.
                  Start exploring to find your perfect career move!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Products View - Show saved products list
  if (currentView === "products") {
    return (
      <div className="space-y-6 bg-white rounded-lg p-4 sm:p-6 md:p-10 border border-[#1E293B14]/10 shadow-sm">
        {/* Back Button and Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <BackButton
            isOtpStep={true}
            onBackClick={handleBackToSelection}
            buttonText="Back"
            className="flex items-center text-textdark font-medium hover:text-gray-800 transition-colors"
          />
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-textdark mt-4">Saved Products</h2>
          <p className="text-textdark/70 text-sm sm:text-base md:text-lg mt-1">View all your saved products in one organised space.</p>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {isLoadingSavedPosts ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-textdark/60">Loading saved products...</p>
            </div>
          ) : savedPostsError ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-600">Failed to load saved products</p>
              <p className="text-sm text-textdark/40">{savedPostsError.message}</p>
            </div>
          ) : savedProducts.length > 0 ? (
            CarListingCardComponent ? (
              savedProducts.map((product) => (
                <CarListingCardComponent
                  key={product.id}
                  {...product}
                  variant="compact"
                  showCloseButton={true}
                  onClose={() => handleRemoveProduct(product.id)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-textdark/60">CarListingCard component not provided</p>
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-10 h-10 text-primary" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-textdark mb-3">
                  No saved vehicles yet
                </h3>

                {/* Description */}
                <p className="text-textdark/60 mb-6 leading-relaxed">
                  Discover amazing vehicle listings and save your favorites here.
                  Start exploring to find your perfect ride!
                </p>

                {/* Action Button */}
                {onNavigateToListings && (
                  <Button
                    onClick={onNavigateToListings}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 font-medium rounded-lg transition-colors"
                  >
                    Explore Vehicle Listings
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

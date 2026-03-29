'use client';

import { CheckCircle } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { useRouter } from 'next/navigation';

interface ListingCreatedProps {
  onViewListing?: () => void;
  listingId?: string;
}

export default function ListingCreated({ onViewListing, listingId }: ListingCreatedProps) {
  const router = useRouter();

  const handleViewListing = () => {
    if (onViewListing) {
      onViewListing();
    } else if (listingId) {
      router.push(`/posts/${listingId}`);
    } else {
      router.push('/posts/user-posts');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-gray-900 mb-3">
          Listing Created
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Your listing has been successfully created and is now live.
        </p>

        {/* Action Button */}
        <Button
          onClick={handleViewListing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          View Created Listing →
        </Button>
      </div>
    </div>
  );
}

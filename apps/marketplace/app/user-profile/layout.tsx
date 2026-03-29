'use client';

import React from "react";
import { useAuthMe } from '@repo/hooks';
import { PageLoader } from "@repo/ui/components/common/UnifiedLoader";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuthMe();

  // Show loading while checking authentication
  if (status === 'loading' || status === 'idle') {
    return <PageLoader message="Loading profile..." />;
  }

  // Redirect to login if not authenticated
  if (status === 'unauthorized') {
    const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    if (typeof window !== 'undefined') {
      window.location.href = `${authBase}/login`;
    }
    return <PageLoader message="Redirecting to login..." />;
  }

  // Show error state if authentication failed
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-4">There was an issue verifying your authentication.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated, show profile content
  return (
    <div className="min-h-screen bg-[#FAFAFB]">{children}</div>
  );
}

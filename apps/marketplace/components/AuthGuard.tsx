'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthMe } from '@repo/hooks';
import { PageLoader } from "@repo/ui/components/common/UnifiedLoader";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
  role?: string; // Optional role prop - only used for seller protection
}

export default function AuthGuard({
  children,
  redirectTo,
  role
}: AuthGuardProps) {
  const { status, data: userData } = useAuthMe();

  const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const target = redirectTo || `${authBase}/login`;

  useEffect(() => {
    if (status === 'unauthorized') {
      window.location.href = target;
    }
  }, [status, target]);

  // Show loading while checking authentication
  if (status === 'loading' || status === 'idle') {
    return <PageLoader message="Checking authentication..." />;
  }

  // Don't render if unauthorized
  if (status === 'unauthorized') {
    return <PageLoader message="Redirecting to login..." />;
  }

  // Additional layer: Check role only if role prop is provided (for seller routes)
  if (role && status === 'authenticated' && userData) {
    const userRoles = userData.data?.roles || [];
    const hasRequiredRole = userRoles.includes(role);

    if (!hasRequiredRole) {
      return (
        <div className="container py-6 sm:py-8 lg:py-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                This page is only accessible to {role.toLowerCase()}s.
                Please switch to {role.toLowerCase()} account to access this feature.
              </p>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Render children if authenticated (and has required role if specified)
  return <>{children}</>;
}

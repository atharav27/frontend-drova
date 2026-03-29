'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthMe } from '@repo/hooks';

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  redirectTo
}: AuthGuardProps) {
  const router = useRouter();
  const { status } = useAuthMe(); // No roles needed - backend auto-detects

  const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
  const target = redirectTo || `${authBase}/login`;

  useEffect(() => {
    if (status === 'unauthorized') {
      router.replace(target);
    }
  }, [status, router, target]);

  // Show loading while checking authentication
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="container py-6 sm:py-8 lg:py-10">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if unauthorized
  if (status === 'unauthorized') {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}

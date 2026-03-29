'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import getLocalStorageValue from './useLocalStorage';

type GuardMode = 'guest' | 'protected';

/**
 * Redirect users based on auth status:
 * - guest mode: blocks logged-in users (e.g. /login)
 * - protected mode: blocks unauthenticated users (e.g. /profile)
 */
export const useAuthRedirect = (mode: GuardMode): boolean => {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const accessToken = getLocalStorageValue("accessToken");
    const refreshToken = getLocalStorageValue("refreshToken");


    const isAuthenticated = !!(accessToken || refreshToken);

    if (mode === 'guest' && isAuthenticated) {
      router.replace('/');
      return;
    }
    if (mode === 'protected' && !isAuthenticated) {
      router.replace('/');
      return;
    }

    setChecking(false);
  }, [mode, router, pathname]);

  return checking;
};

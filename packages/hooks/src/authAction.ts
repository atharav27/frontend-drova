"use client";

import { useState } from "react";
import { useAuthMe } from "./auth";
import { apiFetch } from "@repo/lib/apiFetch";

/**
 * Hook for handling authentication-required actions
 * Provides immediate auth status checking and auth dialog management
 */
export function useAuthAction() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { status } = useAuthMe();

  const executeWithAuth = (action: () => void) => {
    if (status === 'authenticated') {
      // User is logged in, execute the action
      action();
    } else if (status === 'unauthorized' || status === 'error') {
      // User is not logged in, show auth dialog
      setShowAuthDialog(true);
    }
    // For 'loading' and 'idle' states, do nothing (wait for auth check to complete)
  };

  const handleSignIn = () => {
    setShowAuthDialog(false);
    const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    if (!authBase) {
      console.error('NEXT_PUBLIC_AUTH_BASE_URL is not set');
      return;
    }
    window.location.href = `${authBase}/login`;
  };

  const handleRegister = () => {
    setShowAuthDialog(false);
    const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    if (!authBase) {
      console.error('NEXT_PUBLIC_AUTH_BASE_URL is not set');
      return;
    }
    window.location.href = `${authBase}/signup`;
  };

  const closeDialog = () => {
    setShowAuthDialog(false);
  };

  return {
    executeWithAuth,
    showAuthDialog,
    handleSignIn,
    handleRegister,
    closeDialog,
    isAuthenticated: status === 'authenticated'
  };
}

/**
 * Lazy auth action hook - only checks auth when executeWithAuth is called
 * Useful for performance optimization when auth status is not immediately needed
 */
export function useLazyAuthAction() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const executeWithAuth = async (action: () => void) => {
    try {
      // Check if user is authenticated using the same endpoint as useAuthMe
      await apiFetch('auth/phone/me', {
        method: 'GET',
        credentials: 'include',
      });

      // User is authenticated, execute the action
      action();
    } catch (error) {
      // User is not authenticated or error occurred, show auth dialog
      setShowAuthDialog(true);
    }
  };

  const handleSignIn = () => {
    setShowAuthDialog(false);
    const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    if (!authBase) {
      console.error('NEXT_PUBLIC_AUTH_BASE_URL is not set');
      return;
    }
    window.location.href = `${authBase}/login`;
  };

  const handleRegister = () => {
    setShowAuthDialog(false);
    const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    if (!authBase) {
      console.error('NEXT_PUBLIC_AUTH_BASE_URL is not set');
      return;
    }
    window.location.href = `${authBase}/signup`;
  };

  const closeDialog = () => {
    setShowAuthDialog(false);
  };

  return {
    executeWithAuth,
    showAuthDialog,
    setShowAuthDialog,
    handleSignIn,
    handleRegister,
    closeDialog
  };
}

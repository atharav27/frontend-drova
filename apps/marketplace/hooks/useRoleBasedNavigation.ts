"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useAuthMe } from "@repo/hooks";
import { useLazyAuthAction } from "./useAuthAction";
import { RoleAccessDialog } from "@repo/ui/components/common/RoleAccessDialog";

export function useRoleBasedNavigation(authDialogHandlers?: {
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
}): {
  navigateToRoleRoute: (route: string, requiredRole?: string, customErrorMessage?: string) => void;
  navigateToSellerRoute: (route: string, customErrorMessage?: string) => void;
  navigateToBuyerRoute: (route: string, customErrorMessage?: string) => void;
  hasRole: (role: string) => boolean;
  isSeller: () => boolean;
  isBuyer: () => boolean;
  getUserRoles: () => string[];
  userData: any;
  showRoleDialog: boolean;
  closeRoleDialog: () => void;
  renderRoleAccessDialog: () => React.ReactElement;
} {
  const { executeWithAuth } = useLazyAuthAction();
  const { data: userData } = useAuthMe();
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [currentRequiredRole, setCurrentRequiredRole] = useState<string>('SELLER');
  const [customMessage, setCustomMessage] = useState<string | undefined>();


  /**
   * Navigate to a route that requires a specific role
   * @param route - The route to navigate to
   * @param requiredRole - The role required to access the route (default: 'SELLER')
   * @param customErrorMessage - Custom error message to show if user doesn't have the required role
   */
  const navigateToRoleRoute = async (
    route: string,
    requiredRole: string = 'SELLER',
    customErrorMessage?: string
  ) => {
    // Use custom auth check if handlers are provided, otherwise use the hook's executeWithAuth
    if (authDialogHandlers) {
      try {
        // Import apiFetch here to avoid circular dependency
        const { apiFetch } = await import('@repo/lib/apiFetch');
        await apiFetch('auth/phone/me', {
          method: 'GET',
          credentials: 'include',
        });

        // User is authenticated, check role
        if (userData?.data?.roles?.includes(requiredRole)) {
          window.location.href = route;
        } else {
          setCurrentRequiredRole(requiredRole);
          setCustomMessage(customErrorMessage);
          setShowRoleDialog(true);
        }
      } catch (error) {
        authDialogHandlers.setShowAuthDialog(true);
      }
    } else {
      // Fallback to original behavior
      await executeWithAuth(() => {
        // Check if user has the required role
        if (userData?.data?.roles?.includes(requiredRole)) {
          window.location.href = route;
        } else {
          // Show role access dialog instead of toast
          setCurrentRequiredRole(requiredRole);
          setCustomMessage(customErrorMessage);
          setShowRoleDialog(true);
        }
      });
    }
  };

  /**
   * Navigate to seller-specific routes
   * @param route - The route to navigate to
   * @param customErrorMessage - Custom error message to show if user is not a seller
   */
  const navigateToSellerRoute = async (route: string, customErrorMessage?: string) => {
    await navigateToRoleRoute(route, 'SELLER', customErrorMessage);
  };

  /**
   * Navigate to buyer-specific routes
   * @param route - The route to navigate to
   * @param customErrorMessage - Custom error message to show if user is not a buyer
   */
  const navigateToBuyerRoute = async (route: string, customErrorMessage?: string) => {
    await navigateToRoleRoute(route, 'BUYER', customErrorMessage);
  };

  /**
   * Check if the current user has a specific role
   * @param role - The role to check for
   * @returns boolean indicating if user has the role
   */
  const hasRole = (role: string): boolean => {
    return userData?.data?.roles?.includes(role) || false;
  };

  /**
   * Check if the current user is a seller
   * @returns boolean indicating if user is a seller
   */
  const isSeller = (): boolean => {
    return hasRole('SELLER');
  };

  /**
   * Check if the current user is a buyer
   * @returns boolean indicating if user is a buyer
   */
  const isBuyer = (): boolean => {
    return hasRole('BUYER');
  };

  /**
   * Get the current user's roles
   * @returns array of user roles or empty array
   */
  const getUserRoles = (): string[] => {
    return userData?.data?.roles || [];
  };

  /**
   * Close the role access dialog
   */
  const closeRoleDialog = () => {
    setShowRoleDialog(false);
    setCustomMessage(undefined);
  };

  /**
   * Handle seller registration
   */
  const handleRegisterAsSeller = () => {
    closeRoleDialog();
    // Navigate to seller registration page
    const authBase = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
    window.location.href = `${authBase}/signup`;
  };

  return {
    navigateToRoleRoute,
    navigateToSellerRoute,
    navigateToBuyerRoute,
    hasRole,
    isSeller,
    isBuyer,
    getUserRoles,
    userData,
    // Dialog state and handlers
    showRoleDialog,
    closeRoleDialog,
    renderRoleAccessDialog: () => {
      return React.createElement(RoleAccessDialog, {
        isOpen: showRoleDialog,
        onClose: closeRoleDialog,
        onRegisterAsSeller: handleRegisterAsSeller,
        requiredRole: currentRequiredRole,
        customMessage: customMessage
      });
    }
  };
}

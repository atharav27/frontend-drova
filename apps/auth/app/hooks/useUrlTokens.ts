"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Hook to handle tokens passed via URL parameters
 * This is used when users are redirected from other apps back to auth app
 */
export function useUrlTokens() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const userRole = searchParams.get("userRole");
    const userName = searchParams.get("userName");

    if (accessToken && refreshToken) {
      try {
        // Store tokens in localStorage
        localStorage.setItem("accessToken", decodeURIComponent(accessToken));
        localStorage.setItem("refreshToken", decodeURIComponent(refreshToken));

        if (userRole) {
          localStorage.setItem("userRole", decodeURIComponent(userRole));
        }

        if (userName) {
          const userProfile = {
            fullName: decodeURIComponent(userName),
            name: decodeURIComponent(userName),
          };
          localStorage.setItem("userProfile", JSON.stringify(userProfile));
        }

        // Clean URL by removing tokens from query params
        const url = new URL(window.location.href);
        url.searchParams.delete("accessToken");
        url.searchParams.delete("refreshToken");
        url.searchParams.delete("userRole");
        url.searchParams.delete("userName");

        // Replace current URL without tokens
        window.history.replaceState({}, "", url.pathname + url.search);

        console.log("Tokens stored successfully from URL");
      } catch (error) {
        console.error("Error processing tokens from URL:", error);
      }
    }
  }, [searchParams, router]);
}

export default useUrlTokens;

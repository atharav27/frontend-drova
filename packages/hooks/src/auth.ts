import { useEffect, useMemo, useState, useCallback } from "react";
import { apiFetch } from "@repo/lib/apiFetch";

type AuthMeStatus = "idle" | "loading" | "authenticated" | "unauthorized" | "error";

export interface AuthMeResult<T = any> {
  status: AuthMeStatus;
  data?: T;
  error?: unknown;
  refetch: () => Promise<void>;
}

export function useAuthMe<T = any>(): AuthMeResult<T> {
  const [status, setStatus] = useState<AuthMeStatus>("idle");
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown>(undefined);

  const fetchMe = useCallback(async () => {
    setStatus("loading");
    setError(undefined);

    try {
      const json = await apiFetch<T>(`auth/phone/me`, {
        method: "GET",
        credentials: "include",
      });

      setData(json as T);
      setStatus("authenticated");
    } catch (e: any) {
      const statusCode = e?.status || e?.response?.status;

      console.log(`[useAuthMe] ❌ Request failed:`, {
        statusCode,
        message: e?.message,
        error: e,
      });

      // Axios interceptor handles token refresh automatically
      // If we still get a 401 after interceptor, user is truly unauthorized
      if (statusCode === 401) {
        setStatus("unauthorized");
      } else {
        console.log(`[useAuthMe] ⚠️ Non-401 error, setting error state`, e);
        setError(e);
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    void fetchMe();

    // Listen for cross-app logout events to immediately reflect unauthorized state
    const handleLogout = () => {
      setStatus("unauthorized");
      setData(undefined);
      setError(undefined);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('auth:logout', handleLogout);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth:logout', handleLogout);
      }
    };
  }, [fetchMe]);

  return useMemo(
    () => ({ status, data, error, refetch: fetchMe }),
    [status, data, error, fetchMe]
  );
}

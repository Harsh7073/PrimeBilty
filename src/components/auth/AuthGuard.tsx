"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const isLoginPage = typeof window !== "undefined" && 
            (window.location.pathname === "/login" || window.location.pathname === "/register");
          const isAuthApi = error.config?.url && 
            (error.config.url.includes("/api/auth/login") || error.config.url.includes("/api/auth/register"));

          if (!isLoginPage && !isAuthApi) {
            logout();
            router.replace("/login");
            // Return a pending promise to prevent the 401 error from bubbling up or triggering unhandled promise rejection overlays
            return new Promise(() => {});
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

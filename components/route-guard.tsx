"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only check after the auth status is determined (not loading)
    if (!loading && !user) {
      // No authenticated user, redirect to login
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show nothing while loading or redirecting
  if (loading || (!loading && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-green-600 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If we get here, user is authenticated
  return <>{children}</>;
}

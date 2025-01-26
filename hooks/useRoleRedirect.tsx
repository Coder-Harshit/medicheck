"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export const useRoleRedirect = () => {
  const { user, userRole, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userRole) {
        switch (userRole.role) {
          case "doctor":
            router.push("/dashboard/doctor");
            break;
          case "nurse":
            router.push("/dashboard/nurse");
            break;
          case "admin":
            router.push("/dashboard/admin");
            break;
          default:
            console.error("Unknown user role");
        }
      }
    }
  }, [user, userRole, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }
};

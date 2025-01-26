"use client";
import { useRoleRedirect } from "@/hooks/useRoleRedirect";

export default function DashBoard() {
    useRoleRedirect();

    return <div>Dashboard</div>;
}

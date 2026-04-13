"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface DashboardHeaderProps {
  email?: string | null;
  isAuthenticated: boolean;
}

export default function DashboardHeader({
  email,
  isAuthenticated,
}: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <nav className="mb-6 bg-white rounded-3xl p-4 shadow-xl border border-slate-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isAuthenticated ? `Welcome, ${email}` : "Welcome"}
          </h2>
        </div>
        {isAuthenticated ? (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

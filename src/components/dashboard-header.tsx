"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

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
    <nav className="mb-4 md:mb-6 bg-white rounded-3xl p-2 md:p-4 shadow-xl border border-slate-200">
      <div className="flex justify-between items-center">
        {/* LEFT SIDE */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="relative w-8 md:w-10 h-8 md:h-10">
            <Image
              src="/logo-finance.svg"
              alt="Finance Logo"
              fill
              className="object-contain"
            />
          </div>

          {/* TEXT (desktop only) */}
          <h1 className="hidden md:block text-xl font-bold text-slate-800">
            Simple Finance Tracker
          </h1>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="text-xs md:text-sm font-medium text-slate-600 truncate max-w-[100px] md:max-w-none">
              {email}
            </span>

            {/* LOGOUT BUTTON (RED) */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-1.5 md:p-2 rounded-lg hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 md:h-5 w-4 md:w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 md:h-5 w-4 md:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-xs md:text-sm">Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}

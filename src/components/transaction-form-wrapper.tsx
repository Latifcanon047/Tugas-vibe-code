"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TransactionForm from "@/components/TransactionForm";

export default function TransactionFormWrapper() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const handleSubmit = async (data: {
    title: string;
    amount: number;
    type: "income" | "expense";
    date: string;
  }) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create transaction");
      }

      alert("Transaction added successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert(
        error instanceof Error ? error.message : "Failed to add transaction",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    setShowLoginPrompt(false);
    router.push("/login");
  };

  const handleCancel = () => setShowLoginPrompt(false);

  return (
    <>
      <TransactionForm onSubmit={handleSubmit} isLoading={isSubmitting} />

      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Kamu harus login terlebih dahulu
            </h2>
            <p className="text-slate-600 mb-6">Mau pindah ke halaman login?</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleCancel}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Abaikan
              </button>
              <button
                onClick={handleLogin}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ya, Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

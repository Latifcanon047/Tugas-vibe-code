"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TransactionForm from "@/components/TransactionForm";

export default function TransactionFormWrapper() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    amount: number;
    type: "income" | "expense";
    date: string;
  }) => {
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

  return <TransactionForm onSubmit={handleSubmit} isLoading={isSubmitting} />;
}

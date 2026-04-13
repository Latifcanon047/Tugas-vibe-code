"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TransactionList from "@/components/TransactionList";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdAt: string;
}

interface TransactionListWrapperProps {
  transactions: Transaction[];
}

export default function TransactionListWrapper({
  transactions,
}: TransactionListWrapperProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete transaction");
      }

      alert("Transaction deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete transaction",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TransactionList
      transactions={transactions}
      onDelete={handleDelete}
      isLoading={isDeleting}
    />
  );
}

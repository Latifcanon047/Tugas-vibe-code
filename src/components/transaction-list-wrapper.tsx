"use client";

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
  onTransactionDeleted?: () => void;
}

export default function TransactionListWrapper({
  transactions,
  onTransactionDeleted,
}: TransactionListWrapperProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus transaksi");
      }

      alert("Transaksi berhasil dihapus!");
      onTransactionDeleted?.();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert(
        error instanceof Error ? error.message : "Gagal menghapus transaksi",
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

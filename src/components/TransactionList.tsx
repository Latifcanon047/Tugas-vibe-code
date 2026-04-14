"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdAt: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

type SortOption = "date" | "createdAt";

export default function TransactionList({
  transactions,
  onDelete,
  isLoading = false,
}: TransactionListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCreatedAt = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Sort transactions based on selected option
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(sortBy === "date" ? a.date : a.createdAt);
    const dateB = new Date(sortBy === "date" ? b.date : b.createdAt);
    return dateB.getTime() - dateA.getTime(); // Descending order
  });

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center text-slate-500">
        <p className="text-lg font-medium">No transactions yet.</p>
        <p className="mt-2">
          Add your first income or expense to see the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="flex flex-col gap-4 p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Recent Activity
            </p>
            <p className="mt-1 text-base text-slate-600">
              Latest income and expense transactions in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="createdAt">Tanggal Input</option>
              <option value="date">Tanggal Transaksi</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em]">
                Title
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em]">
                Type
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.15em]">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em]">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em]">
                Created At
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em]">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b last:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-5 text-sm font-medium text-slate-900">
                  {transaction.title}
                </td>
                <td className="px-6 py-5 text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      transaction.type === "income"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {transaction.type === "income" ? "Income" : "Expense"}
                  </span>
                </td>
                <td
                  className={`px-6 py-5 text-sm font-semibold text-right ${
                    transaction.type === "income"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                  suppressHydrationWarning
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {formatCreatedAt(transaction.createdAt)}
                </td>
                <td className="px-6 py-5 text-center">
                  <button
                    onClick={() => onDelete(transaction.id)}
                    disabled={isLoading}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-red-500 hover:border-red-300 hover:text-red-700 disabled:border-slate-200 disabled:text-slate-400 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

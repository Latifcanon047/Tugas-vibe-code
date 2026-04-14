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

type FilterOption = "all" | "income" | "expense";

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
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const filterLabels: Record<FilterOption, string> = {
    all: "Semua",
    income: "Pemasukan",
    expense: "Pengeluaran",
  };

  const activeFilterClass = "bg-sky-500 text-white hover:bg-sky-600";
  const inactiveFilterClass = "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200";

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

  const filteredTransactions = transactions.filter((t) => {
    if (filterBy === "all") return true;
    return t.type === filterBy;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(sortBy === "date" ? a.date : a.createdAt);
    const dateB = new Date(sortBy === "date" ? b.date : b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="flex flex-col gap-4 p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {transactions.length > 0 ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Aktivitas Terbaru
              </p>
              <p className="mt-1 text-base text-slate-600">
                Transaksi pemasukan dan pengeluaran terbaru di satu tempat.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Transaksi
              </p>
              <p className="mt-1 text-base text-slate-600">
                Lihat dan kelola transaksi Anda.
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex rounded-2xl overflow-hidden border border-slate-200">
              {(Object.keys(filterLabels) as FilterOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setFilterBy(option)}
                  className={`px-4 py-2 text-sm font-medium transition ${filterBy === option ? activeFilterClass : inactiveFilterClass}`}
                >
                  {filterLabels[option]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Urutkan:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 w-full sm:w-auto"
              >
                <option value="createdAt">Tanggal Input</option>
                <option value="date">Tanggal Transaksi</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {filteredTransactions.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          <p className="text-lg font-medium">Tidak ada transaksi</p>
          <p className="mt-2 text-sm">
            {filterBy === "all"
              ? "Belum ada transaksi untuk periode ini."
              : `Belum ada transaksi ${filterBy === "income" ? "pemasukan" : "pengeluaran"} untuk periode ini.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em]">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em]">Judul</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em]">Tipe</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.15em]">Jumlah</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em]">Dibuat</th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.15em]">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b last:border-b-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 text-sm text-slate-600">{formatDate(transaction.date)}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-900">{transaction.title}</td>
                  <td className="px-6 py-5 text-sm">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${transaction.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}
                    </span>
                  </td>
                  <td className={`px-6 py-5 text-sm font-semibold text-right ${transaction.type === "income" ? "text-emerald-600" : "text-rose-600"}`} suppressHydrationWarning>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600">{formatCreatedAt(transaction.createdAt)}</td>
                  <td className="px-6 py-5 text-center">
                    <button onClick={() => onDelete(transaction.id)} disabled={isLoading} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-red-500 hover:border-red-300 hover:text-red-700 disabled:border-slate-200 disabled:text-slate-400 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

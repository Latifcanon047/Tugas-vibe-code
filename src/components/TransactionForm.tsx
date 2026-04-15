"use client";

import { FormEvent, useState } from "react";

interface TransactionFormProps {
  onSubmit: (data: {
    title: string;
    amount: number;
    type: "income" | "expense";
    date: string;
  }) => void;
  isLoading?: boolean;
}

export default function TransactionForm({
  onSubmit,
  isLoading = false,
}: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const formatAmountDisplay = (value: string) => {
    const onlyDigits = value.replace(/\D/g, "");
    if (!onlyDigits) return "";
    return onlyDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !amount.trim() || !date.trim()) {
      alert("Mohon isi semua kolom");
      return;
    }

    const rawAmount = amount.replace(/\./g, "");
    const numAmount = parseFloat(rawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Masukkan jumlah yang valid");
      return;
    }

    onSubmit({
      title: title.trim(),
      amount: numAmount,
      type,
      date: new Date(date).toISOString(),
    });

    setTitle("");
    setAmount("");
    setType("expense");
    setDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-xl border border-slate-200 p-3 md:p-6 mb-6"
    >
      <div className="flex flex-col gap-2 md:gap-4 mb-4 md:mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Tambah transaksi
          </p>
          <h2 className="text-lg md:text-2xl font-semibold text-slate-900">
            Masukkan data baru
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">
            Judul
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Gaji, Belanja"
            disabled={isLoading}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 md:px-4 py-2 md:py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">
            Jumlah
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(formatAmountDisplay(e.target.value))}
            placeholder="0"
            disabled={isLoading}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 md:px-4 py-2 md:py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1 md:mb-2">
            Tanggal
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isLoading}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 md:px-4 py-2 md:py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-slate-100"
          />
        </div>
      </div>

      <div className="mb-4 md:mb-6">
        <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2 md:mb-3">
          Tipe
        </label>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <label
            className={`flex cursor-pointer items-center justify-center rounded-2xl border px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition ${
              type === "income"
                ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              value="income"
              checked={type === "income"}
              onChange={(e) => setType(e.target.value as "income" | "expense")}
              disabled={isLoading}
              className="sr-only"
            />
            Pemasukan
          </label>
          <label
            className={`flex cursor-pointer items-center justify-center rounded-2xl border px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition ${
              type === "expense"
                ? "border-rose-500 bg-rose-50 text-rose-900"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              value="expense"
              checked={type === "expense"}
              onChange={(e) => setType(e.target.value as "income" | "expense")}
              disabled={isLoading}
              className="sr-only"
            />
            Pengeluaran
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-2 md:py-3 text-sm md:text-base transition"
      >
        {isLoading ? "Menambahkan..." : "Tambah Transaksi"}
      </button>
    </form>
  );
}

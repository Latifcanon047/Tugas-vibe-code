"use client";

interface Transaction {
  type: "income" | "expense";
  amount: number;
}

interface SummaryProps {
  transactions: Transaction[];
}

export default function Summary({ transactions }: SummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6">
        <span className="inline-flex rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-semibold mb-4">
          Total Pemasukan
        </span>
        <p className="text-3xl font-semibold text-slate-900">
          {formatCurrency(totalIncome)}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Semua pemasukan yang masuk.
        </p>
      </div>

      <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6">
        <span className="inline-flex rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-semibold mb-4">
          Total Pengeluaran
        </span>
        <p className="text-3xl font-semibold text-slate-900">
          {formatCurrency(totalExpense)}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Semua pengeluaran yang keluar.
        </p>
      </div>

      <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6">
        <span className="inline-flex rounded-full bg-sky-50 text-sky-700 px-3 py-1 text-xs font-semibold mb-4">
          Saldo
        </span>
        <p className="text-3xl font-semibold text-slate-900">
          {formatCurrency(balance)}
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Selisih pemasukan dan pengeluaran saat ini.
        </p>
      </div>
    </div>
  );
}

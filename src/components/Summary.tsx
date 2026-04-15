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

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatShortCurrency(amount: number) {
    if (amount >= 1_000_000_000) {
      return "Rp " + (amount / 1_000_000_000).toFixed(1) + " M";
    }
    if (amount >= 1_000_000) {
      return "Rp " + (amount / 1_000_000).toFixed(1) + " jt";
    }
    if (amount >= 1_000) {
      return "Rp " + (amount / 1_000).toFixed(1) + " rb";
    }
    return "Rp " + amount;
  }

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
      {/* Pemasukan */}
      <div className="rounded-2xl md:rounded-3xl bg-white shadow-xl border border-slate-200 p-3 md:p-6">
        <span className="inline-flex rounded-full bg-green-50 text-green-700 px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-xs font-semibold mb-2 md:mb-4">
          Pemasukan
        </span>

        <p className="text-sm md:text-3xl font-semibold text-slate-900 leading-tight">
          {/* Mobile */}
          <span className="block sm:hidden">
            {formatShortCurrency(totalIncome)}
          </span>

          {/* Desktop */}
          <span className="hidden sm:block">{formatCurrency(totalIncome)}</span>
        </p>

        <p className="mt-1 md:mt-3 text-[10px] md:text-sm text-slate-500 hidden md:block">
          Semua pemasukan yang masuk.
        </p>
      </div>

      {/* Pengeluaran */}
      <div className="rounded-2xl md:rounded-3xl bg-white shadow-xl border border-slate-200 p-3 md:p-6">
        <span className="inline-flex rounded-full bg-red-50 text-red-700 px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-xs font-semibold mb-2 md:mb-4">
          Pengeluaran
        </span>

        <p className="text-sm md:text-3xl font-semibold text-slate-900 leading-tight">
          <span className="block sm:hidden">
            {formatShortCurrency(totalExpense)}
          </span>
          <span className="hidden sm:block">
            {formatCurrency(totalExpense)}
          </span>
        </p>

        <p className="mt-1 md:mt-3 text-[10px] md:text-sm text-slate-500 hidden md:block">
          Semua pengeluaran yang keluar.
        </p>
      </div>

      {/* Saldo */}
      <div className="rounded-2xl md:rounded-3xl bg-white shadow-xl border border-slate-200 p-3 md:p-6">
        <span className="inline-flex rounded-full bg-sky-50 text-sky-700 px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-xs font-semibold mb-2 md:mb-4">
          Saldo
        </span>

        <p className="text-sm md:text-3xl font-semibold text-slate-900 leading-tight">
          <span className="block sm:hidden">
            {formatShortCurrency(balance)}
          </span>
          <span className="hidden sm:block">{formatCurrency(balance)}</span>
        </p>

        <p className="mt-1 md:mt-3 text-[10px] md:text-sm text-slate-500 hidden md:block">
          Selisih pemasukan dan pengeluaran saat ini.
        </p>
      </div>
    </div>
  );
}

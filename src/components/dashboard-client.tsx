"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard-header";
import SummaryWithData from "@/components/summary-with-data";
import TransactionChartWithData from "@/components/transaction-chart-with-data";
import TransactionFormWrapper from "@/components/transaction-form-wrapper";
import TransactionListWithData from "@/components/transaction-list-with-data";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdAt: string;
}

interface DashboardClientProps {
  initialTransactions: Transaction[];
  initialMode: "month" | "year";
  initialMonth: number;
  initialYear: number;
}

export default function DashboardClient({
  initialTransactions,
  initialMode,
  initialMonth,
  initialYear,
}: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [mode, setMode] = useState<"month" | "year">(initialMode);
  const [month, setMonth] = useState<number>(initialMonth);
  const [year, setYear] = useState<number>(initialYear);
  const [loading, setLoading] = useState(false);

  const buildQueryParams = useCallback(
    (
      currentMode: "month" | "year",
      currentMonth: number,
      currentYear: number,
    ) => {
      const params = new URLSearchParams();
      params.set("mode", currentMode);
      params.set("year", currentYear.toString());
      if (currentMode === "month") {
        params.set("month", currentMonth.toString());
      }
      return params;
    },
    [],
  );

  const fetchTransactions = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const params = buildQueryParams(mode, month, year);
      const response = await fetch(`/api/transactions?${params}`);
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((t: any) => ({
          ...t,
          date: new Date(t.date).toISOString(),
          createdAt: new Date(t.createdAt).toISOString(),
        }));
        setTransactions(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, mode, month, year, buildQueryParams]);

  const updateUrl = useCallback(() => {
    const params = buildQueryParams(mode, month, year);
    router.replace(`${pathname}?${params.toString()}`);
  }, [buildQueryParams, mode, month, year, pathname, router]);

  useEffect(() => {
    updateUrl();
    fetchTransactions();
  }, [fetchTransactions, updateUrl]);

  const handleModeChange = (newMode: "month" | "year") => {
    setMode(newMode);
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          email={session?.user?.email}
          isAuthenticated={!!session?.user}
        />

        {/* Filter Controls */}
        <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700">
                View:
              </label>
              <select
                value={mode}
                onChange={(e) =>
                  handleModeChange(e.target.value as "month" | "year")
                }
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700">
                Year:
              </label>
              <select
                value={year}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const y = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  );
                })}
              </select>
            </div>

            {mode === "month" && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">
                  Month:
                </label>
                <select
                  value={month}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleDateString("en-US", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <SummaryWithData transactions={transactions} />

        {/* Chart */}
        <TransactionChartWithData
          transactions={transactions}
          mode={mode}
          month={month}
          year={year}
        />

        {/* Form and List */}
        <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-6">
          <TransactionFormWrapper onTransactionAdded={fetchTransactions} />
          <TransactionListWithData
            transactions={transactions}
            onTransactionDeleted={fetchTransactions}
          />
        </div>
      </div>
    </main>
  );
}

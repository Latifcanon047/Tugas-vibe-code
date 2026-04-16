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
  initialMode: "month" | "year" | "week";
  initialMonth: number;
  initialYear: number;
}

const getCurrentWeekNumber = (year: number, month: number): number => {
  const now = new Date();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  const firstSunday = new Date(firstDayOfMonth);
  const dayOfWeek = firstSunday.getDay();
  firstSunday.setDate(
    firstSunday.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek),
  );

  if (now > lastDayOfMonth) {
    const totalWeeks = Math.ceil(lastDayOfMonth.getDate() / 7);
    return totalWeeks;
  }

  let weekNumber = 0;
  let weekStart = new Date(firstSunday);

  while (weekStart < now) {
    weekStart.setDate(weekStart.getDate() + 7);
    weekNumber++;
  }

  return weekNumber;
};

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
  const [mode, setMode] = useState<"month" | "year" | "week">(initialMode);
  const [month, setMonth] = useState<number>(initialMonth);
  const [year, setYear] = useState<number>(initialYear);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [weekNumber, setWeekNumber] = useState<number>(() =>
    getCurrentWeekNumber(currentYear, currentMonth),
  );

  const buildQueryParams = useCallback(
    (
      currentMode: "month" | "year" | "week",
      currentMonth: number,
      currentYear: number,
      currentWeek?: number,
    ) => {
      const params = new URLSearchParams();
      params.set("mode", currentMode);
      params.set("year", currentYear.toString());
      if (currentMode === "month") {
        params.set("month", currentMonth.toString());
      } else if (currentMode === "week") {
        params.set("month", currentMonth.toString());
        params.set(
          "week",
          currentWeek?.toString() ||
            getCurrentWeekNumber(currentYear, currentMonth).toString(),
        );
      }
      return params;
    },
    [],
  );

  const fetchTransactions = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const params = buildQueryParams(mode, month, year, weekNumber);
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
    }
  }, [session?.user?.id, mode, month, year, weekNumber, buildQueryParams]);

  const updateUrl = useCallback(() => {
    const params = buildQueryParams(mode, month, year, weekNumber);
    router.replace(`${pathname}?${params.toString()}`);
  }, [buildQueryParams, mode, month, year, weekNumber, pathname, router]);

  useEffect(() => {
    updateUrl();
    fetchTransactions();
  }, [fetchTransactions, updateUrl]);

  const handleModeChange = (newMode: "month" | "year" | "week") => {
    setMode(newMode);
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
  };

  const handleWeekChange = (newWeek: number) => {
    setWeekNumber(newWeek);
  };

  const getWeeksInMonth = (year: number, monthNum: number) => {
    const firstDay = new Date(year, monthNum - 1, 1);
    const lastDay = new Date(year, monthNum, 0);
    const weeks: { week: number; label: string; range: string }[] = [];

    const firstSunday = new Date(firstDay);
    const dayOfWeek = firstSunday.getDay();
    firstSunday.setDate(
      firstSunday.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek),
    );

    let currentWeek = 1;
    let currentDate = new Date(firstSunday);

    while (currentDate <= lastDay) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const rangeEnd = weekEnd > lastDay ? lastDay : weekEnd;
      const label = `Minggu ${currentWeek}`;
      const range = `${weekStart.getDate()}-${rangeEnd.getDate()} ${weekStart.toLocaleDateString("id-ID", { month: "short" })}`;

      weeks.push({ week: currentWeek, label, range });

      currentWeek++;
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeks;
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          username={session?.user?.username}
          isAuthenticated={!!session?.user}
        />
        <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Tampilan */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Tampilan:
              </label>
              <select
                value={mode}
                onChange={(e) =>
                  handleModeChange(e.target.value as "month" | "year" | "week")
                }
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
              >
                <option value="month">Perbulan</option>
                <option value="week">Perminggu</option>
                <option value="year">Pertahun</option>
              </select>
            </div>

            {/* Tahun */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Tahun:
              </label>
              <select
                value={year}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
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

            {/* Bulan */}
            {(mode === "month" || mode === "week") && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Bulan:
                </label>
                <select
                  value={month}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleDateString("id-ID", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Minggu */}
            {mode === "week" && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Minggu:
                </label>
                <select
                  value={weekNumber}
                  onChange={(e) => handleWeekChange(parseInt(e.target.value))}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                >
                  {getWeeksInMonth(year, month).map((w) => (
                    <option key={w.week} value={w.week}>
                      {w.label} ({w.range})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <SummaryWithData transactions={transactions} />

        <TransactionChartWithData
          transactions={transactions}
          mode={mode}
          month={month}
          year={year}
          weekNumber={weekNumber}
        />

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

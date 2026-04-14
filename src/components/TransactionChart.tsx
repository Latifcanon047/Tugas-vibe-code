"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface TransactionChartProps {
  transactions: Array<{
    id: number;
    title: string;
    amount: number;
    type: "income" | "expense";
    date: string;
  }>;
  mode?: "month" | "year" | "week";
  month?: number;
  year?: number;
  weekNumber?: number;
}

export default function TransactionChart({
  transactions,
  mode = "month",
  month,
  year,
  weekNumber,
}: TransactionChartProps) {
  const selectedYear = year ?? new Date().getFullYear();
  const selectedMonth = month ?? new Date().getMonth() + 1;

  let dailyData: Record<string, { income: number; expense: number }> = {};
  let allLabels: string[] = [];
  let dateKeys: string[] = [];

  if (mode === "week" && weekNumber) {
    const weekNum = weekNumber;
    const weekStart = new Date(
      selectedYear,
      selectedMonth - 1,
      1 + (weekNum - 1) * 7,
    );
    const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(currentDay.getDate() + i);
      const dateKey = currentDay.toISOString().split("T")[0];
      allLabels.push(dayNames[i]);
      dateKeys.push(dateKey);
      dailyData[dateKey] = { income: 0, expense: 0 };
    }

    transactions.forEach((transaction) => {
      const transDate = new Date(transaction.date);
      const transDateStr = transDate.toISOString().split("T")[0];
      if (dailyData[transDateStr]) {
        if (transaction.type === "income") {
          dailyData[transDateStr].income += transaction.amount;
        } else {
          dailyData[transDateStr].expense += transaction.amount;
        }
      }
    });
  } else if (mode === "month") {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      if (
        date.getFullYear() === selectedYear &&
        date.getMonth() + 1 === selectedMonth
      ) {
        const dateKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { income: 0, expense: 0 };
        }

        if (transaction.type === "income") {
          dailyData[dateKey].income += transaction.amount;
        } else {
          dailyData[dateKey].expense += transaction.amount;
        }
      }
    });

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      allLabels.push(dateKey);
    }
  } else {
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      if (date.getFullYear() === selectedYear) {
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}`;
        if (!dailyData[monthKey]) {
          dailyData[monthKey] = { income: 0, expense: 0 };
        }

        if (transaction.type === "income") {
          dailyData[monthKey].income += transaction.amount;
        } else {
          dailyData[monthKey].expense += transaction.amount;
        }
      }
    });

    for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
      const monthKey = `${selectedYear}-${String(monthIndex).padStart(2, "0")}`;
      allLabels.push(monthKey);
    }
  }

  // Create cumulative data
  let cumulativeIncome = 0;
  let cumulativeExpense = 0;
  const cumulativeIncomeData: number[] = [];
  const cumulativeExpenseData: number[] = [];
  const incomedata: number[] = [];
  const expensedata: number[] = [];

  const keysForLoop = mode === "week" ? dateKeys : allLabels;

  keysForLoop.forEach((key) => {
    const data = dailyData[key];
    if (data) {
      cumulativeIncome += data.income;
      cumulativeExpense += data.expense;
    }
    cumulativeIncomeData.push(cumulativeIncome);
    cumulativeExpenseData.push(cumulativeExpense);
    incomedata.push(data?.income || 0);
    expensedata.push(data?.expense || 0);
  });

  // Create labels
  const labels = allLabels.map((labelKey) => {
    if (mode === "week") {
      return labelKey;
    }
    if (mode === "month") {
      const d = new Date(labelKey);
      return d.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
    }

    const d = new Date(`${labelKey}-01`);
    return d.toLocaleDateString("id-ID", { month: "short" });
  });

  const incomeData = cumulativeIncomeData;
  const expenseData = cumulativeExpenseData;

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Pemasukan",
        data: incomeData,
        dailyData: incomedata,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.05)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
      {
        label: "Pengeluaran",
        data: expenseData,
        dailyData: expensedata,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.05)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
    ] as unknown as ChartData<"line">["datasets"],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 13,
            weight: "bold",
          },
          color: "#0f172a",
        },
      },
      title: {
        display: true,
        text:
          mode === "month"
            ? "Tren Pemasukan vs Pengeluaran (Perbulan)"
            : mode === "week"
            ? "Tren Pemasukan vs Pengeluaran (Perminggu)"
            : "Tren Pemasukan vs Pengeluaran (Pertahun)",
        color: "#0f172a",
        font: {
          size: 16,
          weight: 600,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        titleFont: { size: 13, weight: "bold" },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) => {
            const dailyValues = (context.dataset as any).dailyData as
              | number[]
              | undefined;
            const dailyValue = dailyValues?.[context.dataIndex];
            const value = dailyValue ?? context.parsed.y;
            if (value === null || value === undefined) return "";
            return `${context.dataset.label}: Rp ${value.toLocaleString("id-ID")}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "rgba(226, 232, 240, 0.3)",
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#e2e8f0",
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 12,
          },
          callback: (value) => {
            if (typeof value === "number") {
              if (value < 1000000) {
                return `${(value / 1000).toFixed(0)}rb`;
              } else if (value < 1000000000) {
                const jt = value / 1000000;
                return jt % 1 === 0
                  ? `${jt.toFixed(0)} jt`
                  : `${jt.toFixed(1)} jt`;
              } else {
                const m = value / 1000000000;
                return m % 1 === 0 ? `${m.toFixed(0)} m` : `${m.toFixed(1)} m`;
              }
            }
            return value;
          },
        },
      },
    },
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xl mb-6">
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

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
}

export default function TransactionChart({
  transactions,
}: TransactionChartProps) {
  // Group transactions by date (YYYY-MM-DD) for current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const dailyData: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);

    // Only include transactions from current month
    if (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    ) {
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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

  // Generate all dates from 1st to today in current month
  const allDates: string[] = [];
  const firstDay = new Date(currentYear, currentMonth, 1);
  const today = new Date(currentYear, currentMonth, now.getDate());

  for (let d = new Date(firstDay); d <= today; d.setDate(d.getDate() + 1)) {
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    allDates.push(dateKey);
  }

  // Create cumulative data
  let cumulativeIncome = 0;
  let cumulativeExpense = 0;
  const cumulativeIncomeData: number[] = [];
  const cumulativeExpenseData: number[] = [];
  const incomedata: number[] = [];
  const expensedata: number[] = [];

  allDates.forEach((dateKey) => {
    if (dailyData[dateKey]) {
      cumulativeIncome += dailyData[dateKey].income;
      cumulativeExpense += dailyData[dateKey].expense;
    }
    cumulativeIncomeData.push(cumulativeIncome);
    cumulativeExpenseData.push(cumulativeExpense);
    incomedata.push(dailyData[dateKey]?.income || 0);
    expensedata.push(dailyData[dateKey]?.expense || 0);
  });

  // Create labels
  const labels = allDates.map((dateKey) => {
    const d = new Date(dateKey);
    return d.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
  });

  const incomeData = cumulativeIncomeData;
  const expenseData = cumulativeExpenseData;

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Income",
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
        label: "Expense",
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
        text: "Income vs Expense Trend",
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
              return `Rp ${value.toLocaleString("id-ID")}`;
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

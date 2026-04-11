"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartData, ChartOptions } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface TransactionChartProps {
  income: number;
  expense: number;
}

export default function TransactionChart({
  income,
  expense,
}: TransactionChartProps) {
  const data: ChartData<"bar"> = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderRadius: 12,
        maxBarThickness: 48,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Income vs Expense",
        color: "#0f172a",
        font: {
          size: 16,
          weight: 600,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y ?? context.parsed;
            return `Rp ${value.toLocaleString("id-ID")}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#475569",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#e2e8f0",
        },
        ticks: {
          color: "#475569",
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
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

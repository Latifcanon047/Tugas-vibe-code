"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Summary from "@/components/Summary";
import TransactionChart from "@/components/TransactionChart";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdAt: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/transactions");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add transaction
  const handleAddTransaction = async (data: {
    title: string;
    amount: number;
    type: "income" | "expense";
    date: string;
  }) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create transaction");
      }

      const newTransaction: Transaction = await response.json();
      setTransactions([newTransaction, ...transactions]);
      alert("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert(
        error instanceof Error ? error.message : "Failed to add transaction",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete transaction");
      }

      setTransactions(transactions.filter((t) => t.id !== id));
      alert("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete transaction",
      );
    }
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((transaction) => transaction.type === filter);

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const { data: session } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-700">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      {/* Navbar */}
      <nav className="mb-6 bg-white rounded-3xl p-4 shadow-xl border border-slate-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Welcome, {session?.user?.email}
            </h2>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl">
        <div className="rounded-4xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-950 p-10 shadow-2xl text-white mb-10 overflow-hidden">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400 mb-4">
              Finance Dashboard
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold mb-3">
              Simple Finance Tracker
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-7">
              Lihat ringkasan pemasukan, pengeluaran, dan saldo Anda secara
              cepat dengan tampilan dashboard yang bersih.
            </p>
          </div>
        </div>

        <Summary transactions={transactions} />

        <TransactionChart transactions={transactions} />

        <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-6">
          <div>
            <TransactionForm
              onSubmit={handleAddTransaction}
              isLoading={isSubmitting}
            />
          </div>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5 shadow-xl border border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Filter Transactions
                </p>
                <p className="text-sm text-slate-500">
                  Pilih tipe transaksi untuk ditampilkan.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {(["all", "income", "expense"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      filter === option
                        ? "bg-slate-900 text-white shadow-lg"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {option === "all"
                      ? "All"
                      : option === "income"
                        ? "Income"
                        : "Expense"}
                  </button>
                ))}
              </div>
            </div>

            <TransactionList
              transactions={filteredTransactions}
              onDelete={handleDeleteTransaction}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

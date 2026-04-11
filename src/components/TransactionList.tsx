'use client';

import { Trash2 } from 'lucide-react';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  createdAt: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export default function TransactionList({
  transactions,
  onDelete,
  isLoading = false,
}: TransactionListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
        <p>No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-800">
                  {transaction.title}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-sm font-medium text-right ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDelete(transaction.id)}
                    disabled={isLoading}
                    className="text-red-500 hover:text-red-700 disabled:text-gray-400 transition inline-flex items-center gap-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

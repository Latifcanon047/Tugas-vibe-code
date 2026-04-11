'use client';

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
}

interface SummaryProps {
  transactions: Transaction[];
}

export default function Summary({ transactions }: SummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Income */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Total Income</h3>
        <p className="text-3xl font-bold text-green-600">
          {formatCurrency(totalIncome)}
        </p>
      </div>

      {/* Total Expense */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Total Expense</h3>
        <p className="text-3xl font-bold text-red-600">
          {formatCurrency(totalExpense)}
        </p>
      </div>

      {/* Balance */}
      <div
        className={`rounded-lg shadow-md p-6 border-l-4 ${
          balance >= 0
            ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500'
            : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-500'
        }`}
      >
        <h3 className="text-sm font-medium text-gray-600 mb-1">Balance</h3>
        <p
          className={`text-3xl font-bold ${
            balance >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}

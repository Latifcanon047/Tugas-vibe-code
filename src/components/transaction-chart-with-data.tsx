import TransactionChart from "@/components/TransactionChart";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdAt: string;
}

interface TransactionChartWithDataProps {
  transactions: Transaction[];
  mode: "month" | "year";
  month: number;
  year: number;
}

export default function TransactionChartWithData({
  transactions,
  mode,
  month,
  year,
}: TransactionChartWithDataProps) {
  return (
    <TransactionChart
      transactions={transactions}
      mode={mode}
      month={month}
      year={year}
    />
  );
}

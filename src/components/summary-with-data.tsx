import Summary from "@/components/Summary";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdAt: string;
}

interface SummaryWithDataProps {
  transactions: Transaction[];
}

export default function SummaryWithData({
  transactions,
}: SummaryWithDataProps) {
  return <Summary transactions={transactions} />;
}

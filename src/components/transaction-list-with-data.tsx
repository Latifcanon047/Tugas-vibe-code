import TransactionListWrapper from "@/components/transaction-list-wrapper";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdAt: string;
}

interface TransactionListWithDataProps {
  transactions: Transaction[];
  onTransactionDeleted?: () => void;
}

export default function TransactionListWithData({
  transactions,
  onTransactionDeleted,
}: TransactionListWithDataProps) {
  return (
    <TransactionListWrapper
      transactions={transactions}
      onTransactionDeleted={onTransactionDeleted}
    />
  );
}

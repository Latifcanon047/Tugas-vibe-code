import TransactionChart from "@/components/TransactionChart";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  createdAt: string;
}

export default async function TransactionChartWithData() {
  const session = await getServerSession(authOptions);
  const transactions = session?.user?.id
    ? await prisma.transaction.findMany({
        where: { userId: session.user.id },
      })
    : [];

  const formattedTransactions = transactions.map((t) => ({
    ...t,
    date: t.date.toISOString(),
    createdAt: t.createdAt.toISOString(),
  }));

  return <TransactionChart transactions={formattedTransactions} />;
}

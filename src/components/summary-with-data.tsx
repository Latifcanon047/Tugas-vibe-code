import Summary from "@/components/Summary";
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

export default async function SummaryWithData() {
  const session = await getServerSession(authOptions);
  const transactions = session?.user?.id
    ? await prisma.transaction.findMany({
        where: { userId: session.user.id },
      })
    : [];

  return <Summary transactions={transactions} />;
}

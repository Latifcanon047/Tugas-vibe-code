import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardClient from "@/components/dashboard-client";
import { prisma } from "@/lib/prisma";

const NavbarSkeleton = () => (
  <div className="rounded-3xl bg-white p-4 shadow-xl border border-slate-200 animate-pulse">
    <div className="flex items-center justify-between gap-4">
      <div className="h-6 w-48 rounded-full bg-slate-200"></div>
      <div className="h-10 w-24 rounded-2xl bg-slate-200"></div>
    </div>
  </div>
);

const SummarySkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="h-32 rounded-3xl bg-white border border-slate-200 p-6 shadow-xl animate-pulse"
      >
        <div className="h-6 w-2/3 rounded-full bg-slate-200 mb-4"></div>
        <div className="h-10 w-full rounded-2xl bg-slate-200"></div>
      </div>
    ))}
  </div>
);

const ChartSkeleton = () => (
  <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xl animate-pulse">
    <div className="h-8 w-1/3 rounded-full bg-slate-200 mb-6"></div>
    <div className="h-80 rounded-3xl bg-slate-200"></div>
  </div>
);

const FormSkeleton = () => (
  <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xl animate-pulse">
    <div className="h-8 w-1/2 rounded-full bg-slate-200 mb-6"></div>
    <div className="space-y-4">
      <div className="h-12 rounded-2xl bg-slate-200"></div>
      <div className="h-12 rounded-2xl bg-slate-200"></div>
      <div className="h-12 rounded-2xl bg-slate-200"></div>
      <div className="h-12 rounded-2xl bg-slate-200"></div>
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xl animate-pulse">
    <div className="h-8 w-1/2 rounded-full bg-slate-200 mb-6"></div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-12 rounded-3xl bg-slate-200" />
      ))}
    </div>
  </div>
);

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { mode?: string; month?: string; year?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const queryMode = searchParams?.mode === "year" ? "year" : "month";
  const parsedYear = parseInt(searchParams?.year ?? "", 10);
  const parsedMonth = parseInt(searchParams?.month ?? "", 10);

  const initialYear = Number.isInteger(parsedYear) ? parsedYear : currentYear;
  const initialMonth =
    queryMode === "month" && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : currentMonth + 1;

  const whereClause: any = {
    userId: session.user.id,
  };

  if (queryMode === "month") {
    const startDate = new Date(initialYear, initialMonth - 1, 1);
    const endDate = new Date(initialYear, initialMonth, 1);
    whereClause.date = {
      gte: startDate,
      lt: endDate,
    };
  } else {
    const startDate = new Date(initialYear, 0, 1);
    const endDate = new Date(initialYear + 1, 0, 1);
    whereClause.date = {
      gte: startDate,
      lt: endDate,
    };
  }

  const initialTransactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedTransactions = initialTransactions.map((t) => ({
    ...t,
    date: t.date.toISOString(),
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <NavbarSkeleton />
            <SummarySkeleton />
            <ChartSkeleton />
            <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-6">
              <FormSkeleton />
              <ListSkeleton />
            </div>
          </div>
        </main>
      }
    >
      <DashboardClient
        initialTransactions={formattedTransactions}
        initialMode={queryMode}
        initialMonth={initialMonth}
        initialYear={initialYear}
      />
    </Suspense>
  );
}

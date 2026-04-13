import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardHeader from "@/components/dashboard-header";
import SummaryWithData from "@/components/summary-with-data";
import TransactionChartWithData from "@/components/transaction-chart-with-data";
import TransactionFormWrapper from "@/components/transaction-form-wrapper";
import TransactionListWithData from "@/components/transaction-list-with-data";

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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user?.id;

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <Suspense fallback={<NavbarSkeleton />}>
        <DashboardHeader
          email={session?.user?.email}
          isAuthenticated={isAuthenticated}
        />
      </Suspense>

      <div className="mx-auto max-w-7xl space-y-6">
        <Suspense fallback={<SummarySkeleton />}>
          <SummaryWithData />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <TransactionChartWithData />
        </Suspense>

        <div className="grid grid-cols-1 xl:grid-cols-[380px_minmax(0,1fr)] gap-6">
          <Suspense fallback={<FormSkeleton />}>
            <TransactionFormWrapper />
          </Suspense>

          <Suspense fallback={<ListSkeleton />}>
            <TransactionListWithData />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

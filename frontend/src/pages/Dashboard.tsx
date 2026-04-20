import Skeleton from "@/components/shared/Skeleton";
import {
  Button,
  Card,
  EmptyState,
  StatCard,
  StatusBadge,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { dashboardAPI } from "@/services/api";
import { fmtKES, fmtKESShort, fmtPhone, fmtRelative } from "@/utils";
import { paymentStatusSchema, type TX } from "@paylink/shared";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Link2,
  Plus,
  TrendingUp,
  Activity,
  TriangleAlert,
  Ban,
} from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardAPI.get().then((r) => r.data),
    refetchInterval: 30000,
  });

  const stats = data?.stats;
  const links = data?.links;

  const recent = data?.recentTransactions || [];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <section className="animate-fade-up">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <p
            className="mb-0.5 text-sm"
            style={{ color: "var(--color-stone-400)" }}
          >
            {greeting} 👋
          </p>
          <h1 className="font-display text-2xl font-bold text-stone-900">
            {user?.businessName}
          </h1>
        </div>
        <Link to="/links">
          <Button className="btn btn-primary btn-md" icon={Plus}>
            New Link
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <StatCard
              label="Total Collected"
              value={fmtKESShort(stats?.totalCollectedPay || 0)}
              sub={`${stats?.totalCompletedPay || 0} payments`}
              icon={TrendingUp}
              accent
            />
            <StatCard
              label="Active Links"
              value={stats?.activeLinks || 0}
              sub={`${stats?.totalLinks || 0} total`}
              icon={Link2}
            />
            <StatCard
              label="Paid Links"
              value={stats?.paidLinks || 0}
              sub="Completed"
              icon={CheckCircle}
            />
            <StatCard
              label="Pending"
              value={stats?.pendingPayments || 0}
              sub={`${stats?.failedPayments || 0} failed`}
              icon={Clock}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent transactions */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-stone-900">
              Recent Transactions
            </h2>
            <Link
              to="/transactions"
              className="flex items-center gap-1 text-xs font-semibold transition-colors hover:opacity-80"
              style={{ color: "var(--color-brand-600)" }}
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <Card>
            {isLoading ? (
              <div className="divide-y divide-stone-100">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                      <Skeleton className="h-9 w-9 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
              </div>
            ) : recent.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No transactions yet"
                description="Transactions appear here once clients start paying."
              />
            ) : (
              <div className="divide-y divide-stone-100">
                {recent.map((tx: TX) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 p-4 transition-colors hover:bg-stone-50"
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: "var(--color-stone-100)",
                      }}
                    >
                      {tx.status === paymentStatusSchema.enum.Completed ? (
                        <CheckCircle
                          className="h-4 w-4"
                          style={{ color: "var(--color-brand-600)" }}
                        />
                      ) : tx.status === paymentStatusSchema.enum.Failed ? (
                        <TriangleAlert
                          className="h-4 w-4"
                          style={{
                            color: "var(--color-red-500)",
                          }}
                        />
                      ) : tx.status === paymentStatusSchema.enum.Cancelled ? (
                        <Ban
                          className="h-4 w-4"
                          style={{ color: "var(--color-yellow-500)" }}
                        />
                      ) : (
                        <Clock
                          className="h-4 w-4"
                          style={{ color: "var(--color-amber-500)" }}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-900">
                        {tx.clientName || tx.businessName || "Payment"}
                      </p>
                      <p
                        className="font-mono text-xs"
                        style={{ color: "var(--color-stone-400)" }}
                      >
                        {fmtPhone(tx.phoneNumber)} · {fmtRelative(tx.createdAt)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-sm font-bold text-stone-900">
                        {fmtKES(Number(tx.amount))}
                      </p>
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick actions */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 font-display font-bold text-stone-900">
              Quick Actions
            </h2>
            <div className="space-y-2.5">
              {[
                {
                  to: "/links",
                  icon: Plus,
                  label: "New Payment Link",
                  desc: "Create & share instantly",
                },
                {
                  to: "/transactions",
                  icon: Activity,
                  label: "All Transactions",
                  desc: "Full payment history",
                },
                {
                  to: "/settings",
                  icon: ArrowRight,
                  label: "Daraja API Setup",
                  desc: "Configure M-Pesa credentials",
                },
              ].map(({ to, icon: Icon, label, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="card-hover group flex items-center justify-between rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--color-stone-100)" }}
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{ color: "var(--color-stone-500)" }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-900">
                        {label}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-stone-400)" }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 transition-colors"
                    style={{ color: "var(--color-stone-300)" }}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Link status bars */}
          {!isLoading && links!.total > 0 && (
            <div>
              <h2 className="mb-4 font-display font-bold text-stone-900">
                Link Overview
              </h2>
              <Card className="space-y-3 p-4">
                {[
                  {
                    label: "Active",
                    count: links?.active || 0,
                    color: "var(--color-blue-500)",
                  },
                  {
                    label: "Paid",
                    count: links?.paid || 0,
                    color: "var(--color-brand-500)",
                  },
                  {
                    label: "Expired",
                    count: links?.expired || 0,
                    color: "var(--color-stone-300)",
                  },
                  {
                    label: "Cancelled",
                    count: links?.cancelled || 0,
                    color: "var(--color-stone-300)",
                  },
                ]
                  .filter((r) => r.count > 0)
                  .map(({ label, count, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span
                        className="flex-1 text-sm"
                        style={{ color: "var(--color-stone-600)" }}
                      >
                        {label}
                      </span>
                      <span className="text-sm font-bold text-stone-900">
                        {count}
                      </span>
                      <div
                        className="h-1.5 w-16 overflow-hidden rounded-full"
                        style={{ backgroundColor: "var(--color-stone-100)" }}
                      >
                        <div
                          className="rounded--full h-full"
                          style={{
                            width: `${(count / links!.total || 1) * 100}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;

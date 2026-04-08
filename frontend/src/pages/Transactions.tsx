import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { mpesaAPI } from "@/services/api";
import {
  Card,
  StatusBadge,
  EmptyState,
  PageHeader,
  Button,
  Modal,
  // type BadgeStatus,
} from "@/components/ui";
import {
  fmtKES,
  fmtDateTime,
  fmtRelative,
  fmtPhone,
  generateReceiptPDF,
} from "@/utils";
import {
  ArrowLeftRight,
  Download,
  Search,
  ChevronRight,
  Receipt,
} from "lucide-react";
import toast from "react-hot-toast";
import { paymentStatusSchema, type TX } from "@paylink/shared";

type TransactionStatus = "completed" | "failed" | "pending";

interface TxDetailProps {
  tx: TX | null;
  open: boolean;
  onClose: () => void;
}

const TxDetail = ({ tx, open, onClose }: TxDetailProps) => {
  const [downloading, setDl] = useState(false);
  const download = async () => {
    setDl(true);
    try {
      await generateReceiptPDF(tx, {
        business_name: tx?.businessName,
        client_name: tx?.clientName,
      });
      toast.success("Receipt downloaded!");
    } catch {
      toast.error("Failed to generate receipt");
    } finally {
      setDl(false);
    }
  };
  if (!tx) return null;

  const statusBg = (
    {
      completed: {
        bg: "var(--color-brand-50)",
        border: "var(--color-brand-200)",
        text: "var(--color-brand-700)",
      },
      failed: {
        bg: "var(--color-red-50)",
        border: "var(--color-red-200)",
        text: "var(--color-red-700)",
      },
      pending: {
        bg: "var(--color-amber-50)",
        border: "var(--color-amber-200)",
        text: "var(--color-amber-700)",
      },
    } as const
  )[tx.status as TransactionStatus] || {
    bg: "var(--color-stone-50)",
    border: "var(--color-stone-200)",
    text: "var(--color-stone-700)",
  };

  return (
    <Modal open={open} onClose={onClose} title="Transaction Details">
      <div className="flex flex-col gap-4">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            backgroundColor: statusBg.bg,
            border: `1px solid ${statusBg.border}`,
          }}
        >
          <StatusBadge status={tx.status} />
          <p
            className="mt-2 font-display text-3xl font-bold"
            style={{ color: statusBg.text }}
          >
            {fmtKES(Number(tx.amount))}
          </p>
        </div>
        <div className="divide-y divide-stone-100">
          {[
            ["Transaction ID", tx.id],
            ["M-Pesa Receipt", tx.mpesaRef || "—"],
            ["Phone", fmtPhone(tx.phoneNumber as string)],
            ["Business", tx.businessName || "—"],
            ["Client", tx.clientName || "—"],
            ["Initiated", fmtDateTime(tx.createdAt)],
            ["Completed", tx.updatedAt ? fmtDateTime(tx.updatedAt) : "—"],
          ].map(([label, val]) => (
            <div
              key={label}
              className="flex justify-between gap-4 py-2.5 text-sm"
            >
              <span
                style={{ color: "var(--color-stone-400)" }}
                className="shrink-0"
              >
                {label}
              </span>
              <span className="text-right font-mono text-xs font-medium break-all text-stone-900">
                {val}
              </span>
            </div>
          ))}
        </div>
        {tx.status === paymentStatusSchema.enum.Completed && (
          <Button
            variant="primary"
            size="lg"
            loading={downloading}
            onClick={download}
            className="w-full"
          >
            <Download className="h-4 w-4" /> Download PDF Receipt
          </Button>
        )}
      </div>
    </Modal>
  );
};

const TransactionsPage = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TX | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => mpesaAPI.getAll().then((r) => r.data.payments),
    refetchInterval: 15000,
  });

  const filtered = (data || []).filter((tx) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      // tx.id?.toLowerCase().includes(q) ||
      tx.mpesaRef?.toLowerCase().includes(q) ||
      tx.phoneNumber?.includes(q) ||
      tx.clientName?.toLowerCase().includes(q) ||
      tx.businessName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Transactions"
        description="All M-Pesa payment attempts and their outcomes"
      />

      <div className="relative mb-6">
        <Search
          className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
          style={{ color: "var(--color-stone-400)" }}
        />
        <input
          className="input pl-10"
          placeholder="Search by reference, phone, client name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        {isLoading ? (
          <div className="divide-y divide-stone-100">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-4 p-4"
                >
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-stone-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-40 rounded bg-stone-100" />
                    <div className="h-3 w-28 rounded bg-stone-100" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-24 rounded bg-stone-100" />
                    <div className="ml-auto h-3 w-16 rounded bg-stone-100" />
                  </div>
                </div>
              ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title={search ? "No matching transactions" : "No transactions yet"}
            description={
              search
                ? "Try a different search term."
                : "Transactions appear here once clients start paying."
            }
          />
        ) : (
          <div className="divide-y divide-stone-100">
            {filtered.map((tx) => (
              <button
                key={tx.id}
                onClick={() => setSelected(tx)}
                className="group flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-stone-50"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      tx.status === paymentStatusSchema.enum.Completed
                        ? "var(--color-brand-50)"
                        : tx.status === paymentStatusSchema.enum.Failed
                          ? "var(--color-red-50)"
                          : tx.status === paymentStatusSchema.enum.Pending
                            ? "var(--color-amber-50)"
                            : "var(--color-stone-100)",
                  }}
                >
                  <Receipt
                    className="h-4 w-4"
                    style={{
                      color:
                        tx.status === paymentStatusSchema.enum.Completed
                          ? "var(--color-brand-600)"
                          : tx.status === paymentStatusSchema.enum.Failed
                            ? "var(--color-red-500)"
                            : tx.status === paymentStatusSchema.enum.Pending
                              ? "var(--color-amber-500)"
                              : "var(--color-stone-400)",
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-stone-900">
                      {tx.clientName || tx.businessName || "Payment"}
                    </p>
                    <StatusBadge status={tx.status} />
                  </div>
                  <p
                    className="font-mono text-xs"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    {fmtPhone(tx.phoneNumber)} · {fmtRelative(tx.createdAt)}
                  </p>
                  {tx.mpesaRef && (
                    <p
                      className="mt-0.5 font-mono text-xs"
                      style={{ color: "var(--color-brand-600)" }}
                    >
                      ✓ {tx.mpesaRef}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-sm font-bold text-stone-900">
                    {fmtKES(Number(tx.amount))}
                  </p>
                  {/* <p
                    className="mt-0.5 text-xs"
                    style={{ color: "var(--color-stone-400)" }}
                  >
                    {tx.reference}
                  </p> */}
                </div>
                <ChevronRight
                  className="ml-1 h-4 w-4 shrink-0 transition-colors"
                  style={{ color: "var(--color-stone-300)" }}
                />
              </button>
            ))}
          </div>
        )}
      </Card>

      <TxDetail
        tx={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};

export default TransactionsPage;

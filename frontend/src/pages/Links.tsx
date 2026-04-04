import { PageHeader, Button, Card, EmptyState, StatusBadge, Input, Modal, Textarea } from '@/components/ui';
import { linksAPI } from '@/services/api';
import { copyToClipboard, fmtKES, cn, fmtRelative, fmtDate } from '@/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronDown, Copy, ExternalLink, Link2, Plus, Share2, Trash2, X } from 'lucide-react';
import {useState, type FC} from 'react'
import toast from 'react-hot-toast';


type ModelProps = {
  open: boolean,
  onClose: any
}

const CreateModal: FC<ModelProps> = ({ open, onClose }) => {
  const qc = useQueryClient();
  const [form, setF] = useState({
    business_name: "",
    client_name: "",
    description: "",
    amount: "",
    due_date: "",
  });
  const [errors, setE] = useState<any>({});
  const set = (k: any) => (e: any) => {
    setF((f) => ({ ...f, [k]: e.target.value }));
    setE((er: any) => ({ ...er, [k]: "" }));
  };

  const mut = useMutation({
    mutationFn: (d) => linksAPI.create(d),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["links"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Payment link created!");
      onClose(res.data.link);
    },
    onError: (err) =>
      toast.error("Failed to create link"),
  });

  const submit = (e: any) => {
    e.preventDefault();
    const errs: any = {};
    if (!form.business_name.trim()) errs.business_name = "Required";
    if (!form.amount || isNaN(Number(form?.amount)) || Number(form?.amount) < 10)
      errs.amount = "Minimum KES 10";
    if (Object.keys(errs).length) {
      setE(errs);
      return;
    }
    // mut.mutate({ ...form, amount: Number(form.amount) });
  };

  return (
    <Modal open={open} onClose={() => onClose(null)} title="New Payment Link">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input
          label="Business Name"
          required
          value={form.business_name}
          onChange={set("business_name")}
          placeholder="Kamau Graphics"
          error={errors.business_name}
        />
        <Input
          label="Client Name (optional)"
          value={form.client_name}
          onChange={set("client_name")}
          placeholder="Wanjiku Mwangi"
        />
        <Textarea
          label="Service Description (optional)"
          value={form.description}
          onChange={set("description")}
          placeholder="e.g. Logo design & brand identity package"
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount (KES)"
            type="number"
            min="10"
            value={form.amount}
            onChange={set("amount")}
            placeholder="5000"
            prefix="KES"
            error={errors.amount}
            required
          />
          <Input
            label="Due Date (optional)"
            type="date"
            value={form.due_date}
            onChange={set("due_date")}
          />
        </div>
        <div className="flex gap-3 pt-1">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => onClose(null)}
            className="flex-1"
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            loading={mut.isPending}
            className="flex-1"
            type="submit"
          >
            Generate Link
          </Button>
        </div>
      </form>
    </Modal>
  );
};

type ModelCreatedProps = {
  link: any,
  onClose: any,
}
/* ── Link Created Modal ──────────────────────────────────────────────── */
const CreatedModal = ({ link, onClose }: ModelCreatedProps) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await copyToClipboard(link.share_url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };
  const whatsapp = () => {
    const msg = encodeURIComponent(
      `Hi! Please use this link to complete your payment of ${fmtKES(link.amount)} to ${link.business_name}:\n${link.share_url}`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };
  return (
    <Modal open={!!link} onClose={onClose} title="Link Ready to Share 🎉">
      <div className="flex flex-col gap-5">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            backgroundColor: "var(--color-brand-50)",
            border: "1px solid var(--color-brand-200)",
          }}
        >
          <p
            className="mb-1 text-xs font-bold tracking-wider uppercase"
            style={{ color: "var(--color-brand-600)" }}
          >
            Payment Amount
          </p>
          <p
            className="font-display text-3xl font-bold"
            style={{ color: "var(--color-brand-700)" }}
          >
            {fmtKES(link?.amount)}
          </p>
          {link?.client_name && (
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-brand-600)" }}
            >
              For {link?.client_name}
            </p>
          )}
        </div>
        <div>
          <p className="field-label mb-2">Shareable Link</p>
          <div className="flex gap-2">
            <div
              className="flex-1 truncate rounded-lg px-3 py-2.5 font-mono text-xs"
              style={{
                background: "var(--color-stone-50)",
                border: "1px solid var(--color-stone-200)",
                color: "var(--color-stone-600)",
              }}
            >
              {link?.share_url}
            </div>
            <Button variant="primary" size="md" onClick={copy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={whatsapp}
            className="w-full"
          >
            <Share2 className="h-4 w-4" /> WhatsApp
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => window.open(link.share_url, "_blank")}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4" /> Preview
          </Button>
        </div>
        <Button
          variant="ghost"
          size="lg"
          onClick={onClose}
          className="w-full"
          style={{ color: "var(--color-stone-500)" }}
        >
          Done
        </Button>
      </div>
    </Modal>
  );
};

type LinkCardProps = {
  link: any,
  onShare: any
}

const LinkCard: FC<LinkCardProps> = ({ link, onShare }) => {
  const qc = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [expanded, setExp] = useState(false);

  const cancelMut = useMutation({
    mutationFn: () => linksAPI.update(link.id, { status: "cancelled" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["links"] });
      toast.success("Link cancelled");
    },
    onError: () => toast.error("Failed to cancel"),
  });
  const deleteMut = useMutation({
    mutationFn: () => linksAPI.remove(link.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["links"] });
      toast.success("Link deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const copy = async () => {
    await copyToClipboard(link.share_url);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-hover">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="truncate font-semibold text-stone-900">
                {link.business_name}
              </h3>
              <StatusBadge status={link.status} />
            </div>
            {link.client_name && (
              <p
                className="text-xs"
                style={{ color: "var(--color-stone-400)" }}
              >
                {link?.client_name}
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-lg font-bold text-stone-900">
              {fmtKES(link?.amount)}
            </p>
            <p
              className="font-mono text-xs"
              style={{ color: "var(--color-stone-400)" }}
            >
              {link?.reference}
            </p>
          </div>
        </div>

        {link?.description && (
          <p
            className="mb-3 line-clamp-1 text-sm"
            style={{ color: "var(--color-stone-500)" }}
          >
            {link?.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {link?.status === "active" && (
            <>
              <Button variant="primary" size="sm" onClick={copy}>
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied ? "Copied" : "Copy Link"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onShare(link)}
              >
                <Share2 className="h-3 w-3" /> Share
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(link?.share_url, "_blank")}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </>
          )}
          <button
            onClick={() => setExp((x) => !x)}
            className="ml-auto rounded-lg p-1.5 transition-colors hover:bg-stone-100"
            style={{ color: "var(--color-stone-400)" }}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                expanded && "rotate-180",
              )}
            />
          </button>
        </div>

        {expanded && (
          <div className="mt-4 animate-fade-up border-t border-stone-100 pt-4">
            <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p
                  style={{ color: "var(--color-stone-400)" }}
                  className="mb-0.5"
                >
                  Created
                </p>
                <p className="font-medium text-stone-700">
                  {fmtRelative(link?.created_at)}
                </p>
              </div>
              {link?.due_date && (
                <div>
                  <p
                    style={{ color: "var(--color-stone-400)" }}
                    className="mb-0.5"
                  >
                    Due Date
                  </p>
                  <p className="font-medium text-stone-700">
                    {fmtDate(link?.due_date)}
                  </p>
                </div>
              )}
              <div>
                <p
                  style={{ color: "var(--color-stone-400)" }}
                  className="mb-0.5"
                >
                  Transactions
                </p>
                <p className="font-medium text-stone-700">
                  {link?.total_transactions || 0} ({link?.paid_count || 0} paid)
                </p>
              </div>
            </div>
            <div
              className="mb-3 truncate rounded-lg px-3 py-2 font-mono text-xs"
              style={{
                background: "var(--color-stone-50)",
                color: "var(--color-stone-500)",
              }}
            >
              {link?.share_url}
            </div>
            <div className="flex gap-2">
              {link?.status === "active" && (
                <Button
                  variant="secondary"
                  size="sm"
                  loading={cancelMut.isPending}
                  onClick={() => cancelMut.mutate()}
                  className="flex-1"
                  style={{
                    color: "var(--color-amber-600)",
                    borderColor: "var(--color-amber-200)",
                  }}
                >
                  <X className="h-3 w-3" /> Cancel
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                loading={deleteMut.isPending}
                onClick={() => {
                  if (confirm("Delete this link?")) deleteMut.mutate();
                }}
                className="flex-1"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const LinksPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [newLink, setNewLink] = useState(null);
  const [shareLink, setShareLink] = useState(null);
  const [filter, setFilter] = useState("all");

    const { data, isLoading } = useQuery({
      queryKey: ["links"],
      queryFn: () => linksAPI.getAll().then((r) => r.data.links),
    });


  const filtered = (data || []).filter(
    (l: any) => filter === "all" || l.status === filter,
  );
  const FILTERS = ["all", "active", "paid", "expired", "cancelled"];

  const handleCreated = (link: any) => {
    setShowCreate(false);
    if (link) setNewLink(link);
  };
  
  return (
    <section className="animate-fade-up">
      <PageHeader
        title="Payment Links"
        description="Generate and share M-Pesa payment links with your clients"
        action={
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowCreate(true)}
            icon={Plus}
          >
            New Link
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap capitalize transition-all"
            style={
              filter === f
                ? { backgroundColor: "var(--color-brand-600)", color: "white" }
                : {
                    backgroundColor: "white",
                    border: "1px solid var(--color-stone-200)",
                    color: "var(--color-stone-600)",
                  }
            }
          >
            {f}
            {f !== "all" && data && (
              <span className="ml-2 text-xs opacity-60">
                {(data || []).filter((l: any) => l.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="card animate-pulse space-y-3 p-5">
                <div className="flex justify-between">
                  <div className="h-4 w-1/2 rounded bg-stone-100" />
                  <div className="h-4 w-1/4 rounded bg-stone-100" />
                </div>
                <div className="h-3 w-3/4 rounded bg-stone-100" />
                <div className="flex gap-2">
                  <div className="h-7 w-20 rounded-lg bg-stone-100" />
                </div>
              </div>
            ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Link2}
            title={
              filter === "all" ? "No payment links yet" : `No ${filter} links`
            }
            description={
              filter === "all"
                ? "Create your first link to start collecting payments."
                : `You have no ${filter} payment links.`
            }
            action={
              filter === "all" && (
                <Button variant="primary" onClick={() => setShowCreate(true)}>
                  <Plus className="h-4 w-4" /> Create first link
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((link: any) => (
            <LinkCard key={link.id} link={link} onShare={setShareLink} />
          ))}
        </div>
      )}

      <CreateModal open={showCreate} onClose={handleCreated} />
      <CreatedModal link={newLink} onClose={() => setNewLink(null)} />
      {shareLink && (
        <CreatedModal link={shareLink} onClose={() => setShareLink(null)} />
      )}
    </section>
  );
}

export default LinksPage
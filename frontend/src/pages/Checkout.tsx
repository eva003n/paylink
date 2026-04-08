import { useState, useEffect, useRef } from "react";
import { data, Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { linksAPI, mpesaAPI } from "@/services/api";
import { Button, Input, Spinner } from "@/components/ui";
import { fmtKES, fmtDateTime, fmtPhone, generateReceiptPDF, cn } from "@/utils";
import {
  Shield,
  CheckCircle,
  XCircle,
  Phone,
  Download,
  AlertTriangle,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { linkStatusSchema, type TX } from "@paylink/shared";
import type { LinkType } from "@/validators/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSTKSchema, type PaymentSTK } from "@/validators/schemas";
import { useForm, type SubmitHandler } from "react-hook-form";

interface StepBarProps {
  step: number;
}

interface STKWaitingProps {
  phone: string;
  countdown: number;
  onCancel: () => void;
}

interface Transaction {
  reference: string;
  amount: number;
  phone: string;
  mpesa_receipt?: string;
  completed_at?: string;
  created_at: string;
  status?: string;
  result_desc?: string;
}

interface Link {
  id: string;
  amount: number;
  business_name: string;
  description?: string;
  client_name?: string;
  status: string;
}

interface TxData {
  checkout_request_id: string;
  reference: string;
}

interface PaymentSuccessProps {
  transaction: TX;
  link: LinkType;
}

interface PaymentFailedProps {
  reason?: string;
  onRetry: () => void;
}

/* ── Step progress ───────────────────────────────────────────────────── */
const StepBar: React.FC<StepBarProps> = ({ step }) => {
  const steps = ["Enter details", "Done"];
  return (
    <div className="mb-8 flex items-center">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                style={{
                  backgroundColor:
                    done || active
                      ? "var(--color-brand-600)"
                      : "var(--color-stone-200)",
                  color: done || active ? "white" : "var(--color-stone-400)",
                  boxShadow: active
                    ? "0 0 0 4px color-mix(in srgb, var(--color-brand-600) 20%, transparent)"
                    : "none",
                }}
              >
                {done ? <CheckCircle className="h-4 w-4" /> : idx}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{
                  color:
                    done || active
                      ? "var(--color-brand-700)"
                      : "var(--color-stone-400)",
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="mx-2 mb-4 h-0.5 flex-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    step > idx
                      ? "var(--color-brand-600)"
                      : "var(--color-stone-200)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ── STK waiting screen ──────────────────────────────────────────────── */
const STKWaiting: React.FC<STKWaitingProps> = ({
  phone,
  countdown,
  onCancel,
}) => (
  <div className="animate-fade-up text-center">
    <div
      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
      style={{
        backgroundColor: "#0c1a10",
        animation: "var(--animate-pulse-ring)",
      }}
    >
      <Phone className="h-9 w-9" style={{ color: "var(--color-brand-400)" }} />
    </div>

    <h3 className="mb-2 font-display text-xl font-bold text-stone-900">
      Check your phone
    </h3>
    <p className="mb-2 text-sm" style={{ color: "var(--color-stone-500)" }}>
      We've sent an M-Pesa prompt to
    </p>
    <p className="mb-6 font-mono text-lg font-bold text-stone-900">
      {fmtPhone(phone)}
    </p>
    <p
      className="mx-auto mb-6 max-w-xs text-sm leading-relaxed"
      style={{ color: "var(--color-stone-500)" }}
    >
      Enter your <strong>M-Pesa PIN</strong> when prompted on your phone to
      complete payment.
    </p>

    <div
      className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2"
      style={{ backgroundColor: "var(--color-stone-100)" }}
    >
      <Clock className="h-4 w-4" style={{ color: "var(--color-stone-500)" }} />
      <span
        className="font-mono text-sm font-bold"
        style={{ color: "var(--color-stone-700)" }}
      >
        Expires in {String(Math.floor(countdown / 60)).padStart(2, "0")}:
        {String(countdown % 60).padStart(2, "0")}
      </span>
    </div>

    {/* Animated dots */}
    <div className="mb-8 flex justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: "var(--color-brand-400)",
            animation: `var(--animate-bounce-dot)`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>

    <button
      onClick={onCancel}
      className="text-sm underline underline-offset-2 transition-colors"
      style={{ color: "var(--color-stone-400)" }}
    >
      Cancel payment
    </button>
  </div>
);

/* ── Success screen ──────────────────────────────────────────────────── */
const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  transaction,
  link,
}) => {
  const [downloading, setDl] = useState(false);

  const download = async () => {
    setDl(true);
    try {
      await generateReceiptPDF(transaction, link);
      toast.success("Receipt downloaded!");
    } catch {
      toast.error("Failed to generate receipt");
    } finally {
      setDl(false);
    }
  };

  return (
    <div className="animate-fade-up text-center">
      <div
        className="mx-auto mb-6 flex h-20 w-20 animate-slide-in items-center justify-center rounded-full"
        style={{ backgroundColor: "var(--color-brand-50)" }}
      >
        <CheckCircle
          className="h-10 w-10"
          style={{ color: "var(--color-brand-600)" }}
        />
      </div>

      <h3 className="mb-2 font-display text-2xl font-bold text-stone-900">
        Payment Confirmed!
      </h3>
      <p className="mb-6 text-sm" style={{ color: "var(--color-stone-500)" }}>
        Your M-Pesa payment has been received.
      </p>

      {/* Receipt preview */}
      <div
        className="mb-6 rounded-2xl p-5 text-left"
        style={{
          backgroundColor: "var(--color-stone-50)",
          border: "1px solid var(--color-stone-200)",
        }}
      >
        <p
          className="mb-3 text-xs font-bold tracking-wider uppercase"
          style={{ color: "var(--color-stone-400)" }}
        >
          Receipt Summary
        </p>
        {[
          ["Amount Paid", fmtKES(Number(transaction.amount))],
          ["Transaction ID", transaction.id],
          ["M-Pesa Receipt", transaction.mpesaRef || "—"],
          ["Phone", fmtPhone(transaction.phoneNumber)],
          [
            "Date",
            fmtDateTime(transaction.createdAt || transaction.updatedAt),
          ],
        ].map(([label, val]) => (
          <div
            key={label}
            className="flex justify-between py-2 text-sm"
            style={{ borderBottom: "1px solid var(--color-stone-100)" }}
          >
            <span style={{ color: "var(--color-stone-400)" }}>{label}</span>
            <span className="max-w-[55%] text-right font-mono text-xs font-semibold break-all text-stone-900">
              {val}
            </span>
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        size="xl"
        loading={downloading}
        onClick={download}
      >
        <Download className="h-4 w-4" />
        Download PDF Receipt
      </Button>
    </div>
  );
};

/* ── Failed screen ───────────────────────────────────────────────────── */
const PaymentFailed: React.FC<PaymentFailedProps> = ({ reason, onRetry }) => (
  <div className="animate-fade-up text-center">
    <div
      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
      style={{ backgroundColor: "var(--color-red-50)" }}
    >
      <XCircle
        className="h-10 w-10"
        style={{ color: "var(--color-red-500)" }}
      />
    </div>
    <h3 className="mb-2 font-display text-xl font-bold text-stone-900">
      Payment Not Completed
    </h3>
    {reason && (
      <p className="mb-6 text-sm" style={{ color: "var(--color-stone-500)" }}>
        {reason}
      </p>
    )}
    <Button variant="primary" size="xl" onClick={onRetry}>
      Try Again
    </Button>
  </div>
);

/* ── Main checkout page ──────────────────────────────────────────────── */
const CheckoutPage = () => {
  const { reference } = useParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [txData, setTxData] = useState<TX | null>(null);
  const [txResult, setTxResult] = useState<TX | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [failReason, setFailRsn] = useState("");
  const pollRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSTKSchema),
  });
  useEffect(
    () => () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const {
    data: linkData,
    isLoading: linkLoading,
    error: linkError,
  } = useQuery({
    queryKey: ["link", reference],
    queryFn: () => linksAPI.getByRef(reference!).then((r) => r),
    retry: 1,
  });
  const link = linkData;

  const onPay: SubmitHandler<PaymentSTK> = async (data) => {
    setLoading(true);
    try {
      const res = await mpesaAPI.stkPush({
        ...data,
        phoneNumber: `254${data.phoneNumber}`,
      });
      setTxData(res.data);
      setStep(1);
      // startgPolling(res.data.checkout_request_id, link?.id as string);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to initiate payment");
    } finally {
      setLoading(false);
      reset();
    }
  };

  const handleCancel = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setStep(1);
    setTxData(null);
    setCountdown(60);
    toast("Payment cancelled");
  };

  const handleRetry = () => {
    setStep(1);
    setTxData(null);
    setTxResult(null);
    setFailRsn("");
    setCountdown(60);
  };

  if (linkLoading)
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--color-stone-50)" }}
      >
        <Spinner size="xl" className="text-brand-400" />
      </div>
    );

  /* Not found */
  if (linkError || !link)
    return (
      <div
        className="flex min-h-screen items-center justify-center p-6"
        style={{ backgroundColor: "var(--color-stone-50)" }}
      >
        <div className="max-w-sm text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--color-red-50)" }}
          >
            <AlertTriangle
              className="h-8 w-8"
              style={{ color: "var(--color-red-500)" }}
            />
          </div>
          <h2 className="mb-2 font-display text-xl font-bold text-stone-900">
            Link Not Found
          </h2>
          <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
            This payment link doesn't exist or has been removed.
          </p>
          <Link to="/">
            <Button className="mt-2">Back to home</Button>
          </Link>
        </div>
      </div>
    );

  /* Link not active */
  // if (link.status !== linkStatusSchema.enum.Active && step < 3)
  //   return (
  //     <div
  //       className="flex min-h-screen items-center justify-center p-6"
  //       style={{ backgroundColor: "var(--color-stone-50)" }}
  //     >
  //       <div className="max-w-sm text-center">
  //         <div
  //           className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
  //           style={{ backgroundColor: "var(--color-amber-50)" }}
  //         >
  //           <AlertTriangle
  //             className="h-8 w-8"
  //             style={{ color: "var(--color-amber-500)" }}
  //           />
  //         </div>
  //         <h2 className="mb-2 font-display text-xl font-bold text-stone-900 capitalize">
  //           Link {link.status}
  //         </h2>
  //         <p className="text-sm" style={{ color: "var(--color-stone-500)" }}>
  //           {link.status === linkStatusSchema.enum.Paid
  //             ? "This payment has already been completed."
  //             : "This payment link is no longer accepting payments."}
  //         </p>
  //       </div>
  //     </div>
  //   );

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(160deg, #0a1a0e 0%, #0c2216 50%, #071810 100%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Amount hero */}
        <div className="mb-6 animate-fade-up text-center">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Shield
              className="h-3.5 w-3.5"
              style={{ color: "var(--color-brand-400)" }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Secure M-Pesa Payment
            </span>
          </div>
          <h1 className="mb-1 font-display text-4xl font-bold text-white">
            {fmtKES(Number(link?.amount))}
          </h1>
          <p
            className="font-semibold"
            style={{ color: "var(--color-stone-300)" }}
          >
            {link.businessName}
          </p>
        </div>

        {/* Main card */}
        <div className="animate-fade-up rounded-3xl bg-white p-8 shadow-2xl animate-delay-100">
          {step < 3 && <StepBar step={step} />}

          {/* Step 1 — Phone input */}
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="mb-1.5 font-display text-xl font-bold text-stone-900">
                Enter M-Pesa number
              </h2>
              <p
                className="mb-6 text-sm"
                style={{ color: "var(--color-stone-500)" }}
              >
                You'll receive a prompt to enter your M-Pesa PIN.
              </p>

              <form
                onSubmit={handleSubmit(onPay)}
                className="mb-6 flex flex-col gap-1.5"
              >
                <label className="field-label">Safaricom phone number</label>
                <div className="flex gap-2">
                  <div
                    className="flex items-center gap-2 rounded-lg px-3.5 text-sm font-bold whitespace-nowrap"
                    style={{
                      backgroundColor: "var(--color-stone-100)",
                      border: "1.5px solid var(--color-stone-200)",
                      color: "var(--color-stone-600)",
                    }}
                  >
                    🇰🇪 +254
                  </div>
                  <Input
                    type="tel"
                    className={cn(
                      "input flex-1",
                      errors.phoneNumber?.message && "input-error",
                    )}
                    placeholder="7XX XXX XXX"
                    minLength={9}
                    maxLength={9}
                    {...register("phoneNumber")}
                    // onKeyDown={(e) => e.key === "Enter" && handleSubmit(onPay)}
                    autoFocus
                    error={errors.phoneNumber && errors.phoneNumber.message}
                  />
                </div>

                <p
                  className="text-xs"
                  style={{ color: "var(--color-stone-400)" }}
                >
                  Enter the last 9 digits of your Safaricom number.
                </p>

                <Input
                  label="Email"
                  type="email"
                  className={cn(
                    "input flex-1",
                    errors.email?.message && "input-error",
                  )}
                  placeholder="you@example.com"
                  {...register("email")}
                  // onKeyDown={(e) => e.key === "Enter" && handleSubmit(onPay)}
                  autoFocus
                  error={errors.email && errors.email.message}
                />
                <p
                  className="text-xs"
                  style={{ color: "var(--color-stone-400)" }}
                >
                  Email will be used so send a payment receipt.
                </p>
                <Button
                  type="submit"
                  // size="xl"
                  loading={loading}
                  onClick={() => {
                    setValue("token", reference as string);
                    // setValue("phoneNumber", `254${getValues("phoneNumber")}`);
                  }}
                  disabled={getValues("phoneNumber")?.length < 9}
                >
                  Pay {fmtKES(Number(link?.amount))}
                </Button>
              </form>
            </div>
          )}

          {/* Step 2 — STK waiting */}
          {step === 2 && (
            <STKWaiting
              phone={"254" + getValues("phoneNumber")}
              countdown={countdown}
              onCancel={handleCancel}
            />
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <PaymentSuccess
              transaction={txResult as TX }
              link={link}
            />
          )}

          {/* Step 4 — Failed */}
          {step === 4 && (
            <PaymentFailed reason={failReason} onRetry={handleRetry} />
          )}
        </div>

        {/* Footer */}
        <p
          className="mt-6 text-center text-xs"
          style={{ color: "var(--color-stone-600)" }}
        >
          Powered by{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--color-stone-400)" }}
          >
            PayLink
          </span>
          {" · "}
          <span style={{ color: "var(--color-stone-500)" }}>
            Safaricom M-Pesa
          </span>
        </p>
      </div>
    </div>
  );
};

export default CheckoutPage;

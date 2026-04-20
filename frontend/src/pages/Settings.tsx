import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { configAPI } from "@/services/api";
import { Card, Button, Input, PageHeader, SecretInput } from "@/components/ui";
import { cn } from "@/utils";
import {
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Save,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  configEnvSchema,
  merchantConfigSchema,
  type MerchantConfigInput,
} from "@paylink/shared";





const SettingsPage = () => {
  const {
    handleSubmit,
    reset,
    getValues,
    setValue,
    register,
    formState: { errors },
  } = useForm<MerchantConfigInput>({
    resolver: zodResolver(merchantConfigSchema),
    defaultValues: { env: configEnvSchema.enum.Sandbox },
  });

const qs = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["config"],
    queryFn: () => configAPI.get().then((r) => r.data),
  });

  useEffect(() => {
    if (data) {
    reset(() => ({
      ...getValues(),
      env: data?.env || configEnvSchema.enum.Sandbox,
      shortCode: data?.shortCode || "",
      consumerKey: data?.consumerKey || "",
      consumerSecret: data?.consumerSecret || "",
      passKey: data?.passKey || "",
      callbackUrl: data?.callbackUrl || "",
    }));
  }
  }, [data]);

  const mut = useMutation({
    mutationFn: !data ?configAPI.save: configAPI.update,
    onSuccess: () => {
      qs.invalidateQueries({queryKey: ["config"]})
      toast.success("Daraja credentials saved!")
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.error || "Failed to save config"),
  });

    const envOptions = [
      configEnvSchema.enum.Sandbox,
      configEnvSchema.enum.Production,
    ];

  const onSubmit: SubmitHandler<MerchantConfigInput> = (data) => {
    mut.mutate(data);
  };

  const hasConfig = !!data;

  return (
    <div className="max-w-2xl animate-fade-up">
      <PageHeader
        title="API Settings"
        description="Configure your Safaricom Daraja credentials"
      />

      {/* Status */}
      {!isLoading && (
        <div
          className="mb-6 flex items-start gap-3 rounded-xl p-4 text-sm"
          style={{
            backgroundColor: hasConfig
              ? "var(--color-brand-50)"
              : "var(--color-amber-50)",
            border: `1px solid ${hasConfig ? "var(--color-brand-200)" : "var(--color-amber-200)"}`,
          }}
        >
          {hasConfig ? (
            <CheckCircle
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: "var(--color-brand-600)" }}
            />
          ) : (
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: "var(--color-amber-500)" }}
            />
          )}
          <div>
            <p
              className="font-semibold"
              style={{
                color: hasConfig
                  ? "var(--color-brand-800)"
                  : "var(--color-amber-800)",
              }}
            >
              {hasConfig
                ? "Credentials configured"
                : "No credentials configured"}
            </p>
            <p
              className="mt-0.5 text-xs"
              style={{
                color: hasConfig
                  ? "var(--color-brand-600)"
                  : "var(--color-amber-600)",
              }}
            >
              {hasConfig
                ? `Running in ${data.env} mode · Last updated ${new Date(data.updatedAt).toLocaleDateString("en-KE")}`
                : "Add your Daraja credentials to start processing real payments."}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Environment */}
        <Card className="p-5">
          <h2 className="mb-1 font-display font-bold text-stone-900">
            Environment
          </h2>
          <p
            className="mb-4 text-sm"
            style={{ color: "var(--color-stone-400)" }}
          >
            Use Sandbox for testing. Switch to Production when ready for real
            payments.
          </p>
          <div
            className="flex gap-2 rounded-xl p-1"
            style={{ backgroundColor: "var(--color-stone-100)" }}
          >
            {envOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setValue("env", m, { shouldValidate: true })}
                className="flex flex-1 flex-wrap items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                style={
                  getValues("env") === m
                    ? {
                        backgroundColor:
                          m === configEnvSchema.enum.Production
                            ? "var(--color-brand-600)"
                            : "white",
                        color:
                          m === configEnvSchema.enum.Production
                            ? "white"
                            : "var(--color-stone-900)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }
                    : { color: "var(--color-stone-500)" }
                }
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      getValues("env") === m
                        ? m === configEnvSchema.enum.Production
                          ? "rgba(255,255,255,0.7)"
                          : "var(--color-amber-400)"
                        : "var(--color-stone-300)",
                  }}
                />
                {m === configEnvSchema.enum.Sandbox
                  ? "🧪 Sandbox"
                  : "🟢 Production"}
              </button>
            ))}
          </div>
          {errors.env && (
            <p className="mt-2 text-xs text-red-500">{errors.env.message}</p>
          )}
          {getValues("env") === configEnvSchema.enum.Production && (
            <div
              className="mt-3 flex items-start gap-2.5 rounded-lg p-3 text-xs"
              style={{
                backgroundColor: "var(--color-amber-50)",
                border: "1px solid var(--color-amber-200)",
                color: "var(--color-amber-700)",
              }}
            >
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--color-amber-500)" }}
              />
              <p>
                <strong>Production mode</strong> — real M-Pesa charges will be
                applied. Make sure your callback URL is publicly reachable over
                HTTPS.
              </p>
            </div>
          )}
        </Card>

        {/* Credentials */}
        <Card className="p-5">
          <h2 className="mb-1 font-display font-bold text-stone-900">
            Daraja Credentials
          </h2>
          <p
            className="mb-5 text-sm"
            style={{ color: "var(--color-stone-400)" }}
          >
            Found in your{" "}
            <a
              href="https://developer.safaricom.co.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 hover:underline"
              style={{ color: "var(--color-brand-600)" }}
            >
              Safaricom Developer Portal <ExternalLink className="h-3 w-3" />
            </a>
          </p>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <SecretInput
                label="Consumer Key"
                {...register("consumerKey")}
                error={errors.consumerKey?.message?.toString()}
                placeholder={
                  hasConfig
                    ? "Leave blank to keep existing"
                    : "Your consumer key"
                }
                autoComplete="off"
              />
              <SecretInput
                label="Consumer Secret"
                {...register("consumerSecret")}
                error={errors.consumerSecret?.message?.toString()}
                placeholder={
                  hasConfig
                    ? "Leave blank to keep existing"
                    : "Your consumer secret"
                }
                autoComplete="off"
              />
            </div>
            <Input
              label="Business Shortcode"
              {...register("shortCode")}
              error={errors.shortCode?.message?.toString()}
              placeholder={
                getValues("env") === configEnvSchema.enum.Sandbox
                  ? "174379 (sandbox default)"
                  : "Your Paybill or Till number"
              }
              hint="The Paybill or Buy Goods number customers pay to."
            />
            <SecretInput
              label="Lipa Na M-Pesa Passkey"
              {...register("passKey")}
              error={errors.passKey?.message?.toString()}
              placeholder={
                hasConfig
                  ? "Leave blank to keep existing"
                  : "Your Lipa Na M-Pesa passkey"
              }
              autoComplete="off"
            />
            <Input
              label="Callback URL"
              type="url"
              {...register("callbackUrl")}
              error={errors.callbackUrl?.message?.toString()}
              placeholder="https://yourdomain.com/api/mpesa/callback"
              hint="Must be public HTTPS. Safaricom POSTs payment results here."
            />
          </div>
        </Card>

        <Button
          type="submit"
          variant="primary"
          size="xl"
          loading={mut.isPending}
        >
          <Save className="h-4 w-4" /> Save Configuration
        </Button>
      </form>

      {/* Guide */}
      <Card className="mt-8 p-5">
        <div className="mb-5 flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--color-blue-50)" }}
          >
            <Info
              className="h-4 w-4"
              style={{ color: "var(--color-blue-600)" }}
            />
          </div>
          <h2 className="font-display font-bold text-stone-900">Setup Guide</h2>
        </div>
        <div>
          {[
            [
              "Register on Daraja",
              <>
                Visit{" "}
                <a
                  href="https://developer.safaricom.co.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-brand-600)" }}
                  className="hover:underline"
                >
                  developer.safaricom.co.ke
                </a>
                , create an account, and register a new app.
              </>,
            ],
            [
              "Get your credentials",
              "Copy your Consumer Key and Consumer Secret from your app dashboard.",
            ],
            [
              "Enable Lipa Na M-Pesa",
              "Enable the Lipa Na M-Pesa Online product and copy the Passkey from the portal.",
            ],
            [
              "Set your callback URL",
              <span>
                Deploy a server endpoint to receive confirmations. For local
                dev, use{" "}
                <code
                  className="rounded px-1.5 py-0.5 font-mono text-xs"
                  style={{ background: "var(--color-stone-100)" }}
                >
                  ngrok http 5000
                </code>{" "}
                and paste the HTTPS URL above.
              </span>,
            ],
            [
              "Go live",
              "Toggle to Production above, enter your live credentials, and you're live.",
            ],
          ].map(([title, body], i, arr) => (
            <div
              key={i}
              className={cn(
                "flex gap-4 pb-5",
                i < arr.length - 1 && "mb-5 border-b border-stone-100",
              )}
            >
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-brand-50)" }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--color-brand-700)" }}
                >
                  {i + 1}
                </span>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-semibold text-stone-900">
                  {title}
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-stone-500)" }}
                >
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;

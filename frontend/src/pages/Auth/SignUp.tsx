import AuthShell from "@/components/shared/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { merchantSignUPSchema, type MerchantSignUpAuth } from "@paylink/shared";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Button } from "@/components/ui";

const SignUpPage = () => {
  const { registerUser, loading, setLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MerchantSignUpAuth>({
    // frontend validation using zod schema
    resolver: zodResolver(merchantSignUPSchema),
  });

  const onSubmit: SubmitHandler<MerchantSignUpAuth> = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      toast.success(res.message);
      navigate("/sign-in");
    } catch (error) {
      toast.error("Authentication failed");
      console.log(error);
    } finally {
      // setTimeout(() => setLoading(false), 1000);
      setLoading(false);
    }
  };

  const fieldClass =
    "w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all";
  const lblClass =
    "block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5";
  return (
    <AuthShell>
      <div className="animate-fade-up">
        <h2 className="mb-1 font-display text-2xl font-bold text-white">
          Create account
        </h2>
        <p className="mb-8 text-sm text-stone-400">
          Start collecting M-Pesa payments today
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <div>
            <label className={lblClass}>Business Name</label>
            <Input
              minLength={5}
              maxLength={100}
              autoFocus
              {...register("businessName", { required: true })}
              placeholder="Kamau Graphics"
              className={fieldClass}
              variant={errors.businessName && "error"}
              error={errors.businessName && errors.businessName.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lblClass}>Email</label>
              <Input
                type="email"
                {...register("email", { required: true })}
                placeholder="you@example.com"
                className={fieldClass}
                variant={errors.email && "error"}
                error={errors.email && errors.email.message}
              />
            </div>
            <div>
              <label className={lblClass}>Phone (optional)</label>
              <Input
                type="tel"
                minLength={12}
                maxLength={12}
                {...register("phoneNumber")}
                placeholder="2547XX XXX XXX"
                className={fieldClass}
                variant={errors.phoneNumber && "error"}
                error={errors.phoneNumber && errors.phoneNumber.message}
              />
            </div>
          </div>
          <div>
            <label className={lblClass}>Password</label>
            <Input
              type="password"
              minLength={8}
              maxLength={72}
              {...register("password", { required: true })}
              placeholder="Min. 8 characters"
              className={fieldClass}
              variant={errors.password && "error"}
              error={errors.password && errors.password.message}
            />
          </div>
          <Button
            type="submit"
            loading={loading}
            className="btn-xl mt-2 w-full bg-brand-600 text-white shadow-lg shadow-brand-900/30 hover:bg-brand-700"
          >
            Create account <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default SignUpPage;

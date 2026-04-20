import { ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { signInSchema, type SignInAuth } from "@paylink/shared";
import AuthShell from "@/components/shared/AuthShell";
import { Button, Input, SecretInput } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const SignInPage = () => {
  const { logIn, loading, setLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInAuth>({
    // frontend validation using zod schema
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInAuth> = async (data) => {
    setLoading(true);
    try {
      const res = await logIn(data);
      navigate("/dashboard");
      toast.success(res.message);
    } catch (error) {
      toast.error("Authentication failed");
      console.log(error);
    } finally {
      // setTimeout(() => setLoading(false), 1000);

      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="animate-fade-up">
        <h2 className="mb-1 font-display text-2xl font-bold text-white">
          Welcome back
        </h2>
        <p className="mb-8 text-sm text-stone-400">
          Sign in to your PesaLink account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-stone-400 uppercase">
              Email
            </label>
            <Input
              type="email"
              autoFocus
              {...register("email", { required: true })}
              placeholder="you@example.com"
              error={errors.email && errors.email.message}
              variant={errors.email && "error"}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder-stone-500 transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
            />
          </div>
          <div className="text-stone-400">
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-stone-400 uppercase">
              Password
            </label>
            <SecretInput
            // label="Password"
              {...register("password", { required: true })}
              error={errors.password?.message?.toString()}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder-stone-500 transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/50 focus:outline-none"
              variant={errors.password && "error"}
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            loading={loading}
            className="btn-xl mt-2 w-full bg-brand-600 text-white shadow-lg shadow-brand-900/30 hover:bg-brand-700"
          >
            Sign in <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          No account?{" "}
          <Link
            to="/sign-up"
            className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
          >
            Create one free
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default SignInPage;

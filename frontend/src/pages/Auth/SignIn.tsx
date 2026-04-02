import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  signInSchema,
  type MerchantSignUpAuth,
  type SignInAuth,
} from "@shared/schemas/validators";
import AuthShell from "../../components/AuthShell";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const SignInPage = () => {
  const { logIn, loading, setLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInAuth>({
    // frontend validation using zod schema
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInAuth> = async (data) => {
    setLoading(true);
    try {
      const res = await logIn(data);
      toast.success(res.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Authentication failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = "";
  const lblClass =
    "block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5";
  return (
    <AuthShell>
      <div className="animate-fade-up">
     <h2 className="font-display text-2xl font-bold text-white mb-1">Welcome back</h2>
        <p className="text-stone-400 text-sm mb-8">Sign in to your PesaLink account</p>


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
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
            Sign in <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          No account?{" "}
          <Link
            to="/sign-up"
            className="font-semibold text-brand-400 transition-colors hover:text-brand-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default SignInPage;

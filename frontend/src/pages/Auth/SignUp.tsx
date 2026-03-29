import React, { useState } from "react";
import AuthShell from "../../components/AuthShell";
import { useAuth } from "../../context/AuthContext";
import type { MerchantSignUpAuth } from "../../../../backend/src/validators/validators";
import {useForm, type SubmitHandler} from "react-hook-form"
import { ArrowRight, Link } from "lucide-react";



const SignUpPage = () => {
  const {registerUser} = useAuth()
  const [form, setForm] = useState<MerchantSignUpAuth>({email: '', password: '', businessName: '', phoneNumber: '' })
const [loading, setLoading] = useState(false)
const {register, handleSubmit, formState: {errors}} = useForm<MerchantSignUpAuth>()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }
  const onSubmit: SubmitHandler<MerchantSignUpAuth> = async(data) => {
    e.preventDefault()
    setLoading(true)
    try {
    await registerUser(data)  

    } catch (error) {
      console.error(`Error registering merchant ${error.message}`)
    }finally {
    setLoading(false)

    }
    

  }

    const fieldClass = "w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all";
  const lblClass   = "block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5";
  return (
    <AuthShell>
       <div className="animate-fade-up">
        <h2 className="font-display text-2xl font-bold text-white mb-1">Create account</h2>
        <p className="text-stone-400 text-sm mb-8">Start collecting M-Pesa payments today</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={lblClass}>Business Name</label>
            <input required {...register("businessName", {required: true})} placeholder="Kamau Graphics" className={fieldClass} />
            {true && (<span className="text-rose-600">fdffdfddffffd</span>)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lblClass}>Email</label>
              <input type="email" required {...register("email")} placeholder="you@example.com" className={fieldClass} />
            </div>
            <div>
              <label className={lblClass}>Phone (optional)</label>
              <input type="tel" {...register("phoneNumber")} placeholder="07XX XXX XXX" className={fieldClass} />
            </div>
          </div>
          <div>
            <label className={lblClass}>Password</label>
            <input type="password" required minLength={8} {...register("password")}  placeholder="Min. 8 characters" className={fieldClass} />
          </div>
          {/* <Button type="submit" loading={loading} className="w-full btn-xl mt-2 bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-900/30">
            Create account <ArrowRight className="w-4 h-4" />
          </Button> */}
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
};

export default SignUpPage;

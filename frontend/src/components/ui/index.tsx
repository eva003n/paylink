import { Loader2 } from "lucide-react";
import { cn } from "../../utils";
import type { ClassValue } from "clsx";
import {cva} from "class-variance-authority"
import  React, {type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
export const Spinner = ({
  size = "md",
  className,
}: {
  size?: string;
  className?: ClassValue[];
}) => {
  const sizes: { [key: string]: string } = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };
  return (
    <Loader2
      className={cn("animate-spin text-white", sizes[size], className)}
    />
  );
};

const buttonClass = cva(`inline-flex items-center justify-center gap-2 font-semibold
           rounded-lg transition-all duration-150 focus:outline-none
           focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
           active:scale-[0.98]`,
    {
        variants: {
            intent: {
                primary: `bg-brand-600 hover:bg-brand-700 text-white
           focus:ring-brand-600 shadow-sm hover:shadow-md`,
           secondary: `bg-white hover:bg-stone-50 text-stone-700 border border-stone-200
           hover:border-stone-300 focus:ring-stone-400 shadow-sm`,

           ghost: `bg-transparent hover:bg-stone-100 text-stone-600
           focus:ring-stone-400`,
           danger: `btn bg-red-50 hover:bg-red-100 text-red-700 border border-red-200
           focus:ring-red-500`
            },
            compoundVariants: {
                defaultVariants: {
                    intent: "primary",
                }
            }
            
        }
    }


)

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: string;
  children?: React.ReactNode;
  loading: boolean;
  className?: ClassValue
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({children, variant = "primary", size = "md", disabled, loading, className, ...props }: ButtonProps) => {

    const sizes: {[key: string]: string} = { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', xl: 'btn-xl' };
    return (
      <button
        className={cn(buttonClass({ intent: variant }), sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner />}
        {children && children}
      </button>
    );
}

type InputProps = {
  error: string | undefined,
  children?: ReactNode,
  variant?: "primary" | "error"
} & InputHTMLAttributes<HTMLInputElement>;

const inputClass = cva("px-3.5 py-2.5 text-sm", {
  variants: {
    intent: {
      primary: `w-full px-3.5 py-2.5 bg-white/10 border border-stone-200 rounded-lg
           text-sm text-stone-900 placeholder-stone-400
           focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600
           transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed`,
      error: `border-red-400 focus:ring-red-500/20 focus:border-red-400`,
    },

    compoundVariants: {
      defaultVariants: {
        intent: "primary",
      },
    },
  },
});
export const Input = ({children, className, variant="primary", error, ...props}: InputProps) => {
  return (
    <>
      <input className={cn(inputClass({intent: variant}), className)} {...props}>
        {children}
      </input>
      <span className="text-[12px] text-red-500">
        {error}
      </span>
    </>
  );

}
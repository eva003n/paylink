import { Loader2 } from "lucide-react";
import { cn } from "../../utils";
import type { ClassValue } from "clsx";
import {cva} from "class-variance-authority"
export const Spinner = ({
  size = "md",
  className,
}: {
  size: string;
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
      className={cn("animate-spin text-green-600", sizes[size], className)}
    />
  );
};

const buttonClass = cva(
    `inline-flex items-center justify-center gap-2 font-semibold
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
            }
            
        }
    }
)
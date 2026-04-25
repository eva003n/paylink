import { Eye, EyeOff, Loader2, X, type LucideIcon } from "lucide-react";
import { cn } from "@/utils";
import type { ClassValue } from "clsx";
import React, {
  useState,
  type ButtonHTMLAttributes,
  type FC,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
export const Spinner = ({
  size = "md",
  className,
}: {
  size?: string;
  className?: ClassValue;
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

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: string;
  children?: React.ReactNode;
  loading?: boolean;
  icon?: LucideIcon;
  className?: ClassValue;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "sm",
  icon: Icon,
  disabled,
  loading,
  className,
  ...props
}: ButtonProps) => {
  const sizes: { [key: string]: string } = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
    xl: "btn-xl",
  };
  return (
    <button
      className={cn("btn", `btn-${variant}`, sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : Icon && <Icon className="h-4 w-4" />}
      {children && children}
    </button>
  );
};
Button.displayName = "Button";

type InputProps = {
  label?: string;
  error?: string;
  hint?: string;
  variant?: "primary" | "error";
  className?: ClassValue;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input: FC<InputProps> = ({
  label,
  className,
  variant = "primary",
  error,
  hint,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="field-label">{label}</label>}
      <input
        className={cn("input relative", className, error && "input-error")}
        {...props}
      />
      {/* {props.type === "password" ? (
        
        <EyeIcon className="h-4 w-4 absolute right-2 top-1.5px" onClick={() => handleClick("eyeopen")}/>
      ) : (
        <EyeClosed className="h-4 w-4"  onClick={() => handleClick("eyeclosed")} />
      )} */}
      {error && <span className="text-error">{error}</span>}
      {hint && !error && (
        <p className="mt-0.5 text-xs text-stone-400">{hint}</p>
      )}
    </div>
  );
};

Input.displayName = "Input";

type SecretInputProps = {
  label?: string;
  hint?: string;
  error?: string;
  [key: string]: any;
}
export const SecretInput: React.FC<SecretInputProps> = ({
  label,
  hint,
  error,
  ...props
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="field-label">{label}</label>}
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          className="input pr-10"
          error={error}
          {...props}
        />
        <Button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-inherit transition-colors"
          style={{ color: "var(--color-stone-400)" }}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {error ? (
        <p className="mt-0.5 text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p
          className="mt-0.5 text-xs"
          style={{ color: "var(--color-stone-400)" }}
        >
          {hint}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

SecretInput.displayName="SecretInput"


type TextareaProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: ClassValue;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

// export const Pagination: FC<PaginateProps> = ({totalPages = 1, offset = 3}) => {
//   const pages = new Array(totalPages).fill(null)
  
//   return (
//     <div>
//       {
//         for(let i = 0; i < totalPages; i++) {
//           (
//             <span></span>
//           )

//         }
//       }



//     </div>
//   )


// }
//  Textarea 
export const Textarea: FC<TextareaProps> = ({
  label,
  error,
  hint,
  className,
  ...props
}) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="field-label">{label}</label>}
    <textarea
      className={cn(
        "input min-h-20 resize-none",
        error && "input-error",
        className,
      )}
      {...props}
    />
    {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
    {hint && !error && <p className="mt-0.5 text-xs text-stone-400">{hint}</p>}
  </div>
);
Textarea.displayName = "Textarea";

type SelectProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: ClassValue;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select: FC<SelectProps> = ({
  label,
  error,
  children,
  className,
  ...props
}) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="field-label">{label}</label>}
    <select
      className={cn("input", error && "input-error", className)}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-0.5 text-xs text-red-500">{error}</p>}
  </div>
);
Select.displayName = "Select";

export type BadgeStatus =
  | "Active"
  | "Paid"
  | "Expired"
  | "Cancelled"
  | "Pending"
  | "Completed"
  | "Failed";

type StatusBadgeProps = {
  status: BadgeStatus;
};

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const map: Record<BadgeStatus, string> = {
    Active: "pill-active",
    Paid: "pill-paid",
    Expired: "pill-expired",
    Cancelled: "pill-cancelled",
    Pending: "pill-pending",
    Completed: "pill-completed",
    Failed: "pill-failed",
  };
  const dots: Record<BadgeStatus, string> = {
    Active: "bg-blue-500",
    Paid: "bg-brand-500",
    Expired: "bg-stone-400",
    Cancelled: "bg-orange-400",
    Pending: "bg-amber-500",
    Completed: "bg-brand-500",
    Failed: "bg-red-500",
  };
  return (
    <span className={cn("pill", map[status] || "pill-expired")}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          dots[status] || "bg-stone-400",
        )}
      />
      {status}
    </span>
  );
};

type CardProps = {
  children?: ReactNode;
  className?: ClassValue;
} & HTMLAttributes<HTMLDivElement>;

export const Card: FC<CardProps> = ({ children, className, ...props }) => (
  <div className={cn("card", className)} {...props}>
    {children}
  </div>
);

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
};

export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  size = "md",
}) => {
  if (!open) return null;
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  };
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full animate-slide-in rounded-2xl bg-white shadow-2xl",
          sizes[size],
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
            <h2 className="font-display text-lg font-bold text-stone-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export const EmptyState: FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && (
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
        <Icon className="h-7 w-7 text-stone-400" />
      </div>
    )}
    <h3 className="mb-1 font-semibold text-stone-700">{title}</h3>
    {description && (
      <p className="max-w-xs text-sm text-stone-400">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  accent?: boolean;
};

export const StatCard: FC<StatCardProps> = ({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}) => (
  <div
    className={cn(
      "card flex items-start gap-4 p-5",
      accent && "ring-1 ring-brand-200",
    )}
  >
    {Icon && (
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent ? "bg-brand-50" : "bg-stone-100",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            accent ? "text-brand-600" : "text-stone-500",
          )}
        />
      </div>
    )}
    <div className="min-w-0">
      <p className="mb-0.5 text-xs font-semibold tracking-wider text-stone-400 uppercase">
        {label}
      </p>
      <p
        className={cn(
          "font-display text-2xl font-bold",
          accent ? "text-brand-700" : "text-stone-900",
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-stone-400">{sub}</p>}
    </div>
  </div>
);

type DividerProps = {
  className?: ClassValue;
};

export const Divider: FC<DividerProps> = ({ className }) => (
  <hr className={cn("border-stone-100", className)} />
);

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  description,
  action,
}) => (
  <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row">
    <div>
      <h1 className="font-display text-2xl font-bold text-stone-900">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      )}
    </div>
    {action}
  </div>
);

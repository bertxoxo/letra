import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  solid:
    "bg-ink text-white hover:bg-ink/90 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
  outline:
    "bg-white text-ink border border-ink hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-ink hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2.5",
        "text-[15px] font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

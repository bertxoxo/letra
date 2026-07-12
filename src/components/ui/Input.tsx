import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-hairline bg-white px-3.5 py-2.5",
        "text-[15px] text-ink placeholder:text-slate-muted",
        "focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink/30",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

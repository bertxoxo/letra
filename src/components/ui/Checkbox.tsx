import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Checkbox = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="checkbox"
    className={cn(
      "h-5 w-5 rounded border-hairline text-ink",
      "focus:outline-none focus:ring-2 focus:ring-ink/10",
      "cursor-pointer",
      className
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";

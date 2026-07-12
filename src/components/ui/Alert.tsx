import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  title: string;
  children: ReactNode;
  variant?: "info" | "warning";
  className?: string;
}

export function Alert({ title, children, variant = "info", className }: AlertProps) {
  const styles =
    variant === "info"
      ? "bg-blue-50 border-blue-200 text-blue-900"
      : "bg-amber-50 border-amber-200 text-amber-900";

  return (
    <div className={cn("flex gap-3 rounded-md border px-4 py-3.5", styles, className)}>
      <svg
        className="mt-0.5 h-5 w-5 flex-shrink-0"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10v-3a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <div className="text-[14px] leading-relaxed">
        <p className="font-semibold text-[15px] mb-0.5">{title}</p>
        {children}
      </div>
    </div>
  );
}

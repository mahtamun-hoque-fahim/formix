"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded transition-all cursor-pointer " +
      "disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants: Record<string, string> = {
      primary:
        "text-white " +
        "bg-[--accent] hover:bg-[--accent-hover] " +
        "[--accent:var(--accent)] [--accent-hover:#4f52d4]",
      secondary:
        "border text-[--text-muted] bg-transparent " +
        "border-[--border] hover:bg-[--surface-elevated] hover:text-[--text] hover:border-[--accent]/30",
      ghost:
        "text-[--text-muted] bg-transparent hover:bg-[--surface-elevated] hover:text-[--text]",
      destructive:
        "text-white bg-[--destructive] hover:opacity-90",
    };

    const sizes: Record<string, string> = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-sm px-6 py-3",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };

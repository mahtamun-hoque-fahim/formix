"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

    const variants = {
      primary: "text-white",
      secondary: "border",
      ghost: "",
      destructive: "text-white",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-sm px-6 py-3",
    };

    const styles: Record<string, React.CSSProperties> = {
      primary: { background: "var(--accent)" },
      secondary: { borderColor: "var(--border)", color: "var(--text-muted)", background: "transparent" },
      ghost: { color: "var(--text-muted)", background: "transparent" },
      destructive: { background: "var(--destructive)" },
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(base, variants[variant], sizes[size], className)}
        style={styles[variant]}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };

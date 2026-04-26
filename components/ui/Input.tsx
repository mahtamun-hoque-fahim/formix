"use client";
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium" style={{ color: "var(--text)" }}>
            {label}
            {props.required && <span className="ml-1" style={{ color: "var(--destructive)" }}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded px-3 py-2 text-sm transition-colors outline-none",
            "focus:ring-1",
            className
          )}
          style={{
            background: "var(--surface)",
            border: `1px solid ${error ? "var(--destructive)" : "var(--border)"}`,
            color: "var(--text)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? "var(--destructive)" : "var(--accent)";
            e.currentTarget.style.boxShadow = `0 0 0 1px ${error ? "var(--destructive)" : "var(--accent)"}33`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "var(--destructive)" : "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
          {...props}
        />
        {helpText && !error && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{helpText}</span>
        )}
        {error && (
          <span className="text-xs" style={{ color: "var(--destructive)" }}>{error}</span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
export { Input };

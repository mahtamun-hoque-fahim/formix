"use client";
import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium" style={{ color: "var(--text)" }}>
            {label}
            {props.required && (
              <span className="ml-1" style={{ color: "var(--destructive)" }}>*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          rows={3}
          className={cn(
            "rounded px-3 py-2 text-sm resize-y outline-none transition-colors min-h-[80px]",
            className
          )}
          style={{
            background: "var(--surface)",
            border: `1px solid ${error ? "var(--destructive)" : "var(--border)"}`,
            color: "var(--text)",
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "var(--destructive)" : "var(--border)";
          }}
          {...props}
        />
        {helpText && !error && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{helpText}</p>
        )}
        {error && (
          <p className="text-xs" style={{ color: "var(--destructive)" }}>{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
export { Textarea };

"use client";
import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helpText, className, options, ...props }, ref) => {
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
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full appearance-none rounded px-3 py-2 text-sm outline-none transition-colors pr-8",
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
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          />
        </div>
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
Select.displayName = "Select";
export { Select };

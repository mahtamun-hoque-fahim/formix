"use client";
import { FIELD_DEFINITIONS, FIELD_CATEGORIES } from "@/lib/field-types";
import { FieldType } from "@/lib/db/schema";

interface FieldPaletteProps {
  onAddField: (type: FieldType) => void;
  disabled?: boolean;
}

export function FieldPalette({ onAddField, disabled }: FieldPaletteProps) {
  return (
    <div
      className="w-56 shrink-0 flex flex-col py-4"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      <p className="px-4 text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>
        ADD FIELD
      </p>

      <div className="flex flex-col gap-4 px-3 overflow-y-auto">
        {FIELD_CATEGORIES.map((cat) => {
          const fields = FIELD_DEFINITIONS.filter((f) => f.category === cat.id);
          return (
            <div key={cat.id}>
              <p className="text-xs mb-1.5 px-1" style={{ color: "var(--text-disabled)" }}>
                {cat.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {fields.map((def) => (
                  <button
                    key={def.type}
                    onClick={() => !disabled && onAddField(def.type)}
                    disabled={disabled}
                    className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-left w-full transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => {
                      if (!disabled) {
                        e.currentTarget.style.background = "var(--surface-elevated)";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <def.icon size={14} />
                    {def.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@/lib/db/schema";
import { getFieldDef } from "@/lib/field-types";
import { GripVertical, Trash2, Copy, Star } from "lucide-react";

interface FieldBlockProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function FieldPreview({ field }: { field: FormField }) {
  const def = getFieldDef(field.type);
  const opts = field.options as Record<string, unknown> | null;
  const choices = (opts?.choices as string[]) ?? [];

  if (field.type === "divider") {
    return <hr style={{ borderColor: "var(--border)" }} />;
  }
  if (field.type === "section_header") {
    return <div className="h-4" />;
  }
  if (field.type === "long_text") {
    return (
      <div className="rounded px-3 py-2 text-sm h-16"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-disabled)" }}>
        {field.placeholder || "Long answer..."}
      </div>
    );
  }
  if (field.type === "radio" || field.type === "checkbox") {
    const isCheckbox = field.type === "checkbox";
    return (
      <div className="flex flex-col gap-1.5">
        {choices.slice(0, 3).map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 shrink-0 ${isCheckbox ? "rounded-sm" : "rounded-full"}`}
              style={{ border: "1px solid var(--border)" }}
            />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>{c}</span>
          </div>
        ))}
        {choices.length > 3 && (
          <span className="text-xs" style={{ color: "var(--text-disabled)" }}>+{choices.length - 3} more</span>
        )}
      </div>
    );
  }
  if (field.type === "dropdown") {
    return (
      <div className="rounded px-3 py-2 text-sm flex items-center justify-between"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
        <span>{choices[0] || "Select..."}</span>
        <span>▾</span>
      </div>
    );
  }
  if (field.type === "rating") {
    const max = (opts?.max as number) ?? 5;
    return (
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <Star key={i} size={16} style={{ color: "var(--border)" }} />
        ))}
      </div>
    );
  }
  if (field.type === "yes_no") {
    return (
      <div className="flex gap-2">
        {["Yes", "No"].map((v) => (
          <div key={v} className="px-4 py-1.5 rounded text-sm"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>{v}</div>
        ))}
      </div>
    );
  }
  if (field.type === "file_upload") {
    return (
      <div className="rounded px-3 py-3 text-sm text-center"
        style={{ border: "1px dashed var(--border)", color: "var(--text-muted)" }}>
        Click or drag to upload
      </div>
    );
  }
  if (field.type === "date" || field.type === "time" || field.type === "datetime") {
    const placeholder =
      field.type === "date" ? "MM / DD / YYYY" :
      field.type === "time" ? "HH : MM" : "MM / DD / YYYY  HH : MM";
    return (
      <div className="rounded px-3 py-2 text-sm"
        style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-disabled)" }}>
        {placeholder}
      </div>
    );
  }
  return (
    <div className="rounded px-3 py-2 text-sm"
      style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-disabled)" }}>
      {field.placeholder || `${def.label}...`}
    </div>
  );
}

export function FieldBlock({ field, isSelected, onSelect, onDelete, onDuplicate }: FieldBlockProps) {
  const def = getFieldDef(field.type);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        border: `1px solid ${isSelected ? "rgba(99,102,241,0.45)" : "var(--border)"}`,
        background: isSelected ? "var(--surface-elevated)" : "var(--surface)",
        boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.5)" : undefined,
      }}
      className="rounded-md p-4 cursor-pointer transition-colors group"
      onClick={onSelect}
    >
      {/* Top bar */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-0.5 -ml-1 rounded"
            style={{ color: "var(--text-disabled)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </div>
          <def.icon size={13} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{def.label}</span>
          {field.isRequired && (
            <span className="text-xs" style={{ color: "var(--destructive)" }}>*</span>
          )}
        </div>
        {/* Actions — shown on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            title="Duplicate field"
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="p-1 rounded transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <Copy size={13} />
          </button>
          <button
            title="Delete field"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {field.type !== "divider" && (
        <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
          {field.label}
        </p>
      )}

      <FieldPreview field={field} />

      {field.helpText && (
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{field.helpText}</p>
      )}
    </div>
  );
}

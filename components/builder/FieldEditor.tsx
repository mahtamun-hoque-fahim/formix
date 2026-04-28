"use client";
import { useState, useEffect } from "react";
import { FormField } from "@/lib/db/schema";
import { getFieldDef } from "@/lib/field-types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, X } from "lucide-react";

interface FieldEditorProps {
  field: FormField;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onClose: () => void;
}

export function FieldEditor({ field, onUpdate, onClose }: FieldEditorProps) {
  const def = getFieldDef(field.type);
  const opts = field.options as Record<string, unknown> | null;

  const [label, setLabel] = useState(field.label);
  const [placeholder, setPlaceholder] = useState(field.placeholder ?? "");
  const [helpText, setHelpText] = useState(field.helpText ?? "");
  const [isRequired, setIsRequired] = useState(field.isRequired);

  // Choice fields
  const [choices, setChoices] = useState<string[]>(
    (opts?.choices as string[]) ?? ["Option 1", "Option 2"]
  );

  // Rating
  const [ratingMax, setRatingMax] = useState<number>((opts?.max as number) ?? 5);

  // Number
  const [numMin, setNumMin] = useState<string>(opts?.min != null ? String(opts.min) : "");
  const [numMax, setNumMax] = useState<string>(opts?.max != null ? String(opts.max) : "");
  const [numStep, setNumStep] = useState<string>(opts?.step != null ? String(opts.step) : "");

  // File upload
  const [maxSizeMb, setMaxSizeMb] = useState<string>(
    opts?.maxSizeMb != null ? String(opts.maxSizeMb) : "10"
  );

  // Sync when field.id changes (different field selected)
  useEffect(() => {
    const o = field.options as Record<string, unknown> | null;
    setLabel(field.label);
    setPlaceholder(field.placeholder ?? "");
    setHelpText(field.helpText ?? "");
    setIsRequired(field.isRequired);
    setChoices((o?.choices as string[]) ?? ["Option 1", "Option 2"]);
    setRatingMax((o?.max as number) ?? 5);
    setNumMin(o?.min != null ? String(o.min) : "");
    setNumMax(o?.max != null ? String(o.max) : "");
    setNumStep(o?.step != null ? String(o.step) : "");
    setMaxSizeMb(o?.maxSizeMb != null ? String(o.maxSizeMb) : "10");
  }, [field.id]);

  function save() {
    const updates: Partial<FormField> = { label, isRequired };

    if (!def.isDisplay) {
      updates.placeholder = placeholder.trim() || null;
      updates.helpText = helpText.trim() || null;
    }

    if (def.hasOptions) {
      updates.options = { choices: choices.filter(Boolean) };
    }

    if (field.type === "rating") {
      updates.options = { min: 1, max: ratingMax };
    }

    if (field.type === "number") {
      updates.options = {
        ...(numMin !== "" && { min: Number(numMin) }),
        ...(numMax !== "" && { max: Number(numMax) }),
        ...(numStep !== "" && { step: Number(numStep) }),
      };
    }

    if (field.type === "file_upload") {
      updates.options = {
        maxSizeMb: maxSizeMb ? Number(maxSizeMb) : 10,
        allowedTypes: ["image/*", "application/pdf", ".doc", ".docx", ".xlsx"],
      };
    }

    onUpdate(field.id, updates);
  }

  return (
    <div
      className="w-72 shrink-0 flex flex-col"
      style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <def.icon size={14} style={{ color: "var(--accent)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
            {def.label}
          </span>
        </div>
        <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
          <X size={14} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        {/* Display-only: section_header just edits the title */}
        {def.isDisplay && field.type === "section_header" && (
          <Input
            label="Section Title"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoFocus
          />
        )}

        {/* Display-only: divider has nothing to edit */}
        {def.isDisplay && field.type === "divider" && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Dividers are visual only and have no settings.
          </p>
        )}

        {/* All real fields */}
        {!def.isDisplay && (
          <>
            <Input
              label="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
            />

            {field.type !== "file_upload" &&
              field.type !== "rating" &&
              field.type !== "yes_no" &&
              field.type !== "radio" &&
              field.type !== "checkbox" &&
              field.type !== "dropdown" && (
                <Input
                  label="Placeholder"
                  value={placeholder}
                  onChange={(e) => setPlaceholder(e.target.value)}
                  placeholder="Optional"
                />
              )}

            <Textarea
              label="Help Text"
              value={helpText}
              onChange={(e) => setHelpText(e.target.value)}
              placeholder="Optional hint shown below the label"
              rows={2}
            />

            {/* Required toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div
                role="switch"
                aria-checked={isRequired}
                onClick={() => setIsRequired((v) => !v)}
                className="relative w-8 h-[18px] rounded-full transition-colors cursor-pointer"
                style={{
                  background: isRequired ? "var(--accent)" : "var(--surface-elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform"
                  style={{ transform: isRequired ? "translateX(13px)" : "translateX(2px)" }}
                />
              </div>
              <span className="text-sm" style={{ color: "var(--text)" }}>Required</span>
            </label>
          </>
        )}

        {/* Choice options */}
        {def.hasOptions && (
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Options</p>
            <div className="flex flex-col gap-1.5">
              {choices.map((choice, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={choice}
                    onChange={(e) => {
                      const next = [...choices];
                      next[i] = e.target.value;
                      setChoices(next);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setChoices([...choices, `Option ${choices.length + 1}`]);
                      }
                    }}
                    className="flex-1 rounded px-2.5 py-1.5 text-sm outline-none transition-colors"
                    style={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                  <button
                    onClick={() => {
                      if (choices.length > 1) setChoices(choices.filter((_, j) => j !== i));
                    }}
                    disabled={choices.length <= 1}
                    className="shrink-0 disabled:opacity-30"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setChoices([...choices, `Option ${choices.length + 1}`])}
                className="flex items-center gap-1.5 text-sm mt-1 transition-colors"
                style={{ color: "var(--accent)" }}
              >
                <Plus size={13} />
                Add option
              </button>
            </div>
          </div>
        )}

        {/* Rating max */}
        {field.type === "rating" && (
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Max Stars</p>
            <div className="flex gap-2">
              {[5, 10].map((v) => (
                <button
                  key={v}
                  onClick={() => setRatingMax(v)}
                  className="flex-1 py-1.5 rounded text-sm transition-colors"
                  style={{
                    background: ratingMax === v ? "var(--accent-dim)" : "var(--surface-elevated)",
                    color: ratingMax === v ? "var(--accent)" : "var(--text-muted)",
                    border: `1px solid ${ratingMax === v ? "rgba(99,102,241,0.3)" : "var(--border)"}`,
                  }}
                >
                  {v} stars
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Number constraints */}
        {field.type === "number" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Constraints</p>
            <div className="grid grid-cols-3 gap-2">
              <Input
                label="Min"
                type="number"
                value={numMin}
                onChange={(e) => setNumMin(e.target.value)}
                placeholder="—"
              />
              <Input
                label="Max"
                type="number"
                value={numMax}
                onChange={(e) => setNumMax(e.target.value)}
                placeholder="—"
              />
              <Input
                label="Step"
                type="number"
                value={numStep}
                onChange={(e) => setNumStep(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>
        )}

        {/* File upload settings */}
        {field.type === "file_upload" && (
          <Input
            label="Max file size (MB)"
            type="number"
            min="1"
            max="100"
            value={maxSizeMb}
            onChange={(e) => setMaxSizeMb(e.target.value)}
            helpText="Default: 10 MB"
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
        <Button onClick={save} className="w-full">Save Changes</Button>
      </div>
    </div>
  );
}

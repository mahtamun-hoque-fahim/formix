"use client";
import { useState, useEffect } from "react";
import { FormField } from "@/lib/db/schema";
import { getFieldDef } from "@/lib/field-types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, X } from "lucide-react";

interface FieldEditorProps {
  field: FormField;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onClose: () => void;
}

export function FieldEditor({ field, onUpdate, onClose }: FieldEditorProps) {
  const def = getFieldDef(field.type);
  const [label, setLabel] = useState(field.label);
  const [placeholder, setPlaceholder] = useState(field.placeholder ?? "");
  const [helpText, setHelpText] = useState(field.helpText ?? "");
  const [isRequired, setIsRequired] = useState(field.isRequired);
  const [choices, setChoices] = useState<string[]>(
    (field.options as { choices?: string[] })?.choices ?? ["Option 1", "Option 2"]
  );
  const [ratingMax, setRatingMax] = useState(
    (field.options as { max?: number })?.max ?? 5
  );

  // Sync when field changes
  useEffect(() => {
    setLabel(field.label);
    setPlaceholder(field.placeholder ?? "");
    setHelpText(field.helpText ?? "");
    setIsRequired(field.isRequired);
    setChoices((field.options as { choices?: string[] })?.choices ?? ["Option 1", "Option 2"]);
    setRatingMax((field.options as { max?: number })?.max ?? 5);
  }, [field.id]);

  function save() {
    const updates: Partial<FormField> = { label, isRequired };
    if (!def.isDisplay) {
      updates.placeholder = placeholder || null;
      updates.helpText = helpText || null;
    }
    if (def.hasOptions) {
      updates.options = { choices: choices.filter(Boolean) };
    }
    if (field.type === "rating") {
      updates.options = { min: 1, max: ratingMax };
    }
    onUpdate(field.id, updates);
  }

  return (
    <div
      className="w-72 shrink-0 flex flex-col"
      style={{ background: "var(--surface)", borderLeft: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}>
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

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {!def.isDisplay && (
          <>
            <Input
              label="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Input
              label="Placeholder"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Optional"
            />
            <Input
              label="Help Text"
              value={helpText}
              onChange={(e) => setHelpText(e.target.value)}
              placeholder="Optional hint for respondents"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="rounded"
                style={{ accentColor: "var(--accent)" }}
              />
              <span className="text-sm" style={{ color: "var(--text)" }}>Required</span>
            </label>
          </>
        )}

        {def.isDisplay && field.type === "section_header" && (
          <Input
            label="Section Title"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
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
                    className="flex-1 rounded px-2 py-1.5 text-sm outline-none transition-colors"
                    style={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                  <button
                    onClick={() => setChoices(choices.filter((_, j) => j !== i))}
                    disabled={choices.length <= 1}
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setChoices([...choices, `Option ${choices.length + 1}`])}
                className="flex items-center gap-1.5 text-sm mt-1 transition-colors"
                style={{ color: "var(--accent)" }}
              >
                <Plus size={14} />
                Add option
              </button>
            </div>
          </div>
        )}

        {/* Rating max */}
        {field.type === "rating" && (
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>Max Rating</p>
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
      </div>

      {/* Save */}
      <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
        <Button onClick={save} className="w-full">Save Changes</Button>
      </div>
    </div>
  );
}

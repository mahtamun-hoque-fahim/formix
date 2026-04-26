"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FormField, Form, FieldType } from "@/lib/db/schema";
import { FieldPalette } from "@/components/builder/FieldPalette";
import { BuilderCanvas } from "@/components/builder/BuilderCanvas";
import { FieldEditor } from "@/components/builder/FieldEditor";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { ChevronLeft, ExternalLink, Eye, Loader2, Settings, Globe } from "lucide-react";
import Link from "next/link";

interface BuilderClientProps {
  form: Form;
  initialFields: FormField[];
}

export function BuilderClient({ form: initialForm, initialFields }: BuilderClientProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(form.title);
  const [newDesc, setNewDesc] = useState(form.description ?? "");
  const [toast, setToast] = useState<string | null>(null);

  const selectedField = fields.find((f) => f.id === selectedId) ?? null;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function addField(type: FieldType) {
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${form.id}/fields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!res.ok) throw new Error();
      const field: FormField = await res.json();
      setFields((prev) => [...prev, field]);
      setSelectedId(field.id);
    } catch {
      showToast("Failed to add field");
    } finally {
      setSaving(false);
    }
  }

  async function deleteField(id: string) {
    const res = await fetch(`/api/forms/${form.id}/fields/${id}`, { method: "DELETE" });
    if (res.ok) {
      setFields((prev) => prev.filter((f) => f.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }

  const updateField = useCallback(async (id: string, updates: Partial<FormField>) => {
    // Optimistic
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    const res = await fetch(`/api/forms/${form.id}/fields/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) showToast("Failed to save field");
    else showToast("Field saved");
  }, [form.id]);

  async function reorderFields(reordered: FormField[]) {
    setFields(reordered);
    await fetch(`/api/forms/${form.id}/fields/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((f) => f.id) }),
    });
  }

  async function saveTitle() {
    if (!newTitle.trim()) return;
    const res = await fetch(`/api/forms/${form.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), description: newDesc.trim() || null }),
    });
    if (res.ok) {
      const updated = await res.json();
      setForm(updated);
      setRenameOpen(false);
      showToast("Saved");
    }
  }

  async function togglePublish() {
    setPublishing(true);
    const newStatus = form.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/forms/${form.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setForm(updated);
      showToast(newStatus === "published" ? "Form published!" : "Reverted to draft");
    }
    setPublishing(false);
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/f/${form.slug}`;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Topbar */}
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard/forms"
            className="p-1.5 rounded transition-colors"
            style={{ color: "var(--text-muted)" }}>
            <ChevronLeft size={18} />
          </Link>
          <div>
            <button
              onClick={() => setRenameOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold font-syne transition-colors"
              style={{ color: "var(--text)" }}
            >
              {form.title}
            </button>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusBadge status={form.status as "draft" | "published" | "closed"} />
              <span className="text-xs font-mono" style={{ color: "var(--text-disabled)" }}>
                {fields.length} field{fields.length !== 1 ? "s" : ""}
              </span>
              {saving && <Loader2 size={11} className="animate-spin" style={{ color: "var(--text-muted)" }} />}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {form.status === "published" && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors"
              style={{ color: "var(--accent)", background: "var(--accent-dim)" }}>
              <ExternalLink size={13} />
              View Live
            </a>
          )}
          <Link href={`/dashboard/forms/${form.id}/settings`}
            className="p-2 rounded transition-colors"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            <Settings size={15} />
          </Link>
          <Link href={`/dashboard/forms/${form.id}/responses`}
            className="p-2 rounded transition-colors"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            <Eye size={15} />
          </Link>
          <Button
            variant={form.status === "published" ? "secondary" : "primary"}
            size="sm"
            onClick={togglePublish}
            disabled={publishing}
          >
            {publishing ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
            {form.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </header>

      {/* Body: Palette | Canvas | Editor */}
      <div className="flex flex-1 overflow-hidden">
        <FieldPalette onAddField={addField} disabled={saving} />

        <BuilderCanvas
          fields={fields}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={deleteField}
          onReorder={reorderFields}
        />

        {selectedField && (
          <FieldEditor
            key={selectedField.id}
            field={selectedField}
            onUpdate={updateField}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      {/* Rename modal */}
      <Modal open={renameOpen} onClose={() => setRenameOpen(false)} title="Edit Form Info">
        <div className="flex flex-col gap-3">
          <Input label="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--text)" }}>Description</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="rounded px-3 py-2 text-sm resize-none outline-none transition-colors"
              style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--text)" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "var(--border)"}
            />
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <Button variant="secondary" size="sm" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={saveTitle}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 px-4 py-2 rounded text-sm font-medium shadow-md z-50"
          style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--text)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

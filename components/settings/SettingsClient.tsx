"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Trash2, Globe, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Form } from "@/lib/db/schema";

interface SettingsClientProps {
  form: Form;
}

export function SettingsClient({ form: initialForm }: SettingsClientProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Local editable state
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description ?? "");
  const [successMessage, setSuccessMessage] = useState(form.successMessage ?? "Thank you for your response!");
  const [redirectUrl, setRedirectUrl] = useState(form.redirectUrl ?? "");
  const [allowMultiple, setAllowMultiple] = useState(form.allowMultipleSubmissions);
  const [requireAuth, setRequireAuth] = useState(form.requireAuth);
  const [submissionLimit, setSubmissionLimit] = useState(
    form.submissionLimit ? String(form.submissionLimit) : ""
  );
  const [accentColor, setAccentColor] = useState(form.accentColor ?? "#6366f1");
  const [notifyOnSubmission, setNotifyOnSubmission] = useState(form.notifyOnSubmission);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    if (!title.trim()) {
      showToast("Title is required.", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          successMessage: successMessage.trim() || "Thank you for your response!",
          redirectUrl: redirectUrl.trim() || null,
          allowMultipleSubmissions: allowMultiple,
          requireAuth,
          submissionLimit: submissionLimit ? parseInt(submissionLimit, 10) : null,
          accentColor,
          notifyOnSubmission,
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setForm(updated);
      showToast("Settings saved.");
      router.refresh();
    } catch {
      showToast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (deleteConfirm !== form.title) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/forms/${form.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.push("/dashboard/forms");
      router.refresh();
    } catch {
      showToast("Failed to delete form.", "error");
      setDeleting(false);
    }
  }

  async function handleStatusToggle() {
    const newStatus = form.status === "closed" ? "draft" : "closed";
    const res = await fetch(`/api/forms/${form.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setForm(updated);
      showToast(newStatus === "closed" ? "Form closed." : "Form set to draft.");
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/dashboard/forms/${form.id}`}
          className="p-1.5 rounded transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-syne" style={{ color: "var(--text)" }}>
            Form Settings
          </h1>
          <p className="text-sm mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>
            /f/{form.slug}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* General */}
        <Section title="General">
          <Input
            label="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional — shown at the top of the form"
          />
        </Section>

        {/* After Submission */}
        <Section title="After Submission">
          <Textarea
            label="Success Message"
            value={successMessage}
            onChange={(e) => setSuccessMessage(e.target.value)}
            helpText="Shown to respondents after they submit. Leave redirect URL empty to use this."
          />
          <Input
            label="Redirect URL"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="https://example.com/thank-you"
            helpText="If set, respondents are redirected here instead of seeing the success message."
          />
        </Section>

        {/* Behavior */}
        <Section title="Behavior">
          <Toggle
            label="Allow multiple submissions"
            description="Respondents can submit more than once from the same browser."
            checked={allowMultiple}
            onChange={setAllowMultiple}
          />
          <Toggle
            label="Require sign-in"
            description="Respondents must be signed in to Formix to submit."
            checked={requireAuth}
            onChange={setRequireAuth}
          />
          <Toggle
            label="Email me on each submission"
            description="Receive an email notification for every new response."
            checked={notifyOnSubmission}
            onChange={setNotifyOnSubmission}
          />
          <Input
            label="Submission limit"
            type="number"
            min="1"
            value={submissionLimit}
            onChange={(e) => setSubmissionLimit(e.target.value)}
            placeholder="Unlimited"
            helpText="Stop accepting responses after this many submissions. Leave empty for unlimited."
          />
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded cursor-pointer border shrink-0"
                style={{ background: accentColor, borderColor: "var(--border)" }}
              />
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="sr-only"
                id="accentColorPicker"
              />
              <label
                htmlFor="accentColorPicker"
                className="text-sm px-3 py-1.5 rounded cursor-pointer transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                Choose color
              </label>
              <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
                {accentColor}
              </span>
              <button
                className="text-xs ml-auto"
                style={{ color: "var(--text-disabled)" }}
                onClick={() => setAccentColor("#6366f1")}
              >
                Reset
              </button>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Used for the submit button and focus rings on the public form.
            </p>
          </div>
        </Section>

        {/* Save */}
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save Settings
          </Button>
          <Button variant="secondary" onClick={() => router.push(`/dashboard/forms/${form.id}`)}>
            Cancel
          </Button>
        </div>

        {/* Danger Zone */}
        <Section title="Danger Zone">
          <div className="flex flex-col gap-3">
            {/* Close / reopen */}
            <div
              className="flex items-center justify-between rounded-md p-4"
              style={{ border: "1px solid var(--border)" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {form.status === "closed" ? "Reopen Form" : "Close Form"}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {form.status === "closed"
                    ? "Allow responses again by setting the form to draft."
                    : "Stop accepting new responses without deleting the form."}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleStatusToggle}
              >
                {form.status === "closed" ? <Globe size={13} /> : <Lock size={13} />}
                {form.status === "closed" ? "Reopen" : "Close Form"}
              </Button>
            </div>

            {/* Delete */}
            <div
              className="flex items-center justify-between rounded-md p-4"
              style={{ border: "1px solid rgba(239,68,68,0.25)", background: "var(--destructive-dim)" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--destructive)" }}>
                  Delete Form
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Permanently deletes this form and all its responses. Cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => { setDeleteConfirm(""); setDeleteOpen(true); }}
              >
                <Trash2 size={13} />
                Delete
              </Button>
            </div>
          </div>
        </Section>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Form"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 p-3 rounded-md"
            style={{ background: "var(--destructive-dim)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <AlertCircle size={16} style={{ color: "var(--destructive)" }} className="mt-0.5 shrink-0" />
            <p className="text-sm" style={{ color: "var(--text)" }}>
              This will permanently delete <strong>{form.title}</strong> and all its responses.
              This action cannot be undone.
            </p>
          </div>
          <Input
            label={`Type "${form.title}" to confirm`}
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder={form.title}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteConfirm !== form.title || deleting}
              onClick={handleDelete}
            >
              {deleting && <Loader2 size={13} className="animate-spin" />}
              Delete Form
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 px-4 py-2 rounded text-sm font-medium shadow-md z-50"
          style={{
            background: toast.type === "error" ? "var(--destructive)" : "var(--surface-elevated)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─── sub-components ──────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-4 pb-2 font-syne"
        style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}>
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 w-9 h-5 rounded-full transition-colors mt-0.5"
        style={{ background: checked ? "var(--accent)" : "var(--surface-elevated)", border: "1px solid var(--border)" }}
      >
        <span
          className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform"
          style={{ transform: checked ? "translateX(17px)" : "translateX(2px)" }}
        />
      </button>
    </div>
  );
}

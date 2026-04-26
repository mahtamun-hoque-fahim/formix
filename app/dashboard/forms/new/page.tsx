"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function NewFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate() {
    if (!title.trim()) {
      setError("Please enter a form title.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to create form.");
        return;
      }
      const form = await res.json();
      router.push(`/dashboard/forms/${form.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-xl">
      <Link
        href="/dashboard/forms"
        className="flex items-center gap-1.5 text-sm mb-8 transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        <ChevronLeft size={16} /> Back to Forms
      </Link>

      <h1 className="text-2xl font-bold font-syne mb-1" style={{ color: "var(--text)" }}>
        Create a New Form
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        Give your form a name to get started. You can change this anytime.
      </p>

      <div className="flex flex-col gap-4">
        <Input
          label="Form Title"
          placeholder="e.g. Event Registration Form"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: "var(--text)" }}>
            Description <span className="font-normal" style={{ color: "var(--text-muted)" }}>(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this form for?"
            rows={3}
            className="rounded px-3 py-2 text-sm resize-none outline-none transition-colors"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>

        {error && (
          <p className="text-sm" style={{ color: "var(--destructive)" }}>{error}</p>
        )}

        <div className="flex gap-3 mt-2">
          <Button onClick={handleCreate} disabled={loading}>
            {loading && <Loader2 size={14} className="animate-spin" />}
            Create Form
          </Button>
          <Button variant="secondary" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

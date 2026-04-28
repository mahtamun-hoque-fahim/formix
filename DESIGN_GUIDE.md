# DESIGN_GUIDE.md — Formix

> Living design system. Updated when new components or tokens are added.
> Last updated: 2026-04-28

---

## Color Tokens

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| Background | `--bg` | `#0a0a0a` | Page background |
| Surface | `--surface` | `#111111` | Cards, sidebar, table rows |
| Surface Elevated | `--surface-elevated` | `#1a1a1a` | Modals, dropdowns, hover fills, nested cards |
| Border | `--border` | `#1f1f1f` | Dividers, input outlines, table borders |
| Border Muted | `--border-muted` | `#161616` | Table row separators |
| Accent | `--accent` | `#6366f1` | CTAs, active states, focus rings, links |
| Accent Dim | `--accent-dim` | `#6366f120` | Active nav bg, selected row bg, badge bg |
| Accent Hover | `--accent-hover` | `#4f52d4` | Primary button hover |
| Text Primary | `--text` | `#f5f5f5` | All body text, headings |
| Text Muted | `--text-muted` | `#888888` | Labels, captions, secondary info |
| Text Disabled | `--text-disabled` | `#3d3d3d` | Disabled states, empty placeholders |
| Destructive | `--destructive` | `#ef4444` | Errors, delete actions |
| Destructive Dim | `--destructive-dim` | `#ef444415` | Error/delete section backgrounds |
| Success | `--success` | `#22c55e` | Published badge, yes answer, active toggle |
| Warning | `--warning` | `#f59e0b` | Draft badge, admin role badge |
| Info | `--info` | `#3b82f6` | Info tips |

---

## Typography

| Face | Font | Weights | Usage |
|---|---|---|---|
| Headings | Syne | 600, 700 | Page titles, card titles, stat numbers |
| Body | Onest | 400, 500, 600 | All body text, labels, buttons |
| Mono | JetBrains Mono | 400, 500 | Slugs, IDs, API keys, field type labels, code |

**Scale:**

| Name | Size | Weight | Font | Usage |
|---|---|---|---|---|
| `display` | 3.5rem | 700 | Syne | Landing hero |
| `h1` | 2.25rem | 700 | Syne | Page titles |
| `h2` | 1.75rem | 600 | Syne | Section headings |
| `h3` | 1.25rem | 600 | Syne | Card titles |
| `body` | 1rem | 400 | Onest | Default text |
| `small` | 0.875rem | 400 | Onest | Labels, table cells, captions |
| `xs` | 0.75rem | 500 | Onest | Badges, meta, timestamps |
| `mono` | 0.875rem | 400 | JetBrains Mono | Slugs, IDs |

---

## Spacing

Tailwind default scale. Key usages:

| Value | Usage |
|---|---|
| 1.5 (6px) | Icon + label gap, tight badge padding |
| 3 (12px) | Gap between list items, nav items |
| 4 (16px) | Card inner padding, input padding |
| 5 (20px) | Stat card padding |
| 6 (24px) | Section inner padding |
| 8 (32px) | Dashboard page padding |

---

## Border Radius

| Class | Value | Usage |
|---|---|---|
| `rounded-sm` | 4px | Badges, tags |
| `rounded` | 6px | Buttons, inputs, selects |
| `rounded-md` | 8px | Cards, field blocks, table |
| `rounded-lg` | 12px | Modals, drawers |
| `rounded-xl` | 16px | Public form card |
| `rounded-full` | 9999px | Avatars, toggle switches |

---

## Shadows

| Name | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.5)` | Card lift |
| `shadow-md` | `0 4px 16px rgba(0,0,0,0.6)` | Modals, drawers |
| Drawer | `-8px 0 32px rgba(0,0,0,0.5)` | SubmissionDrawer, AdminUserDrawer |
| `shadow-accent` | `0 0 24px rgba(99,102,241,0.2)` | Primary CTA glow |

---

## Component Patterns

### Button

Four variants — all use Tailwind hover, `active:scale-[0.98]`, `disabled:opacity-40`:

```tsx
// Primary
className="bg-[--accent] hover:bg-[--accent-hover] text-white font-medium text-sm px-4 py-2 rounded"

// Secondary
className="border border-[--border] text-[--text-muted] hover:bg-[--surface-elevated] hover:text-[--text] hover:border-[--accent]/30 text-sm px-4 py-2 rounded"

// Ghost
className="text-[--text-muted] hover:bg-[--surface-elevated] hover:text-[--text] text-sm px-4 py-2 rounded"

// Destructive
className="bg-[--destructive] hover:opacity-90 text-white font-medium text-sm px-4 py-2 rounded"

// Sizes: sm (px-3 py-1.5 text-xs), md (px-4 py-2 text-sm), lg (px-6 py-3 text-sm)
```

### Input / Textarea / Select

All share the same pattern — surface bg, border → accent on focus (via onFocus/onBlur inline style):

```tsx
style={{
  background: "var(--surface)",
  border: `1px solid ${error ? "var(--destructive)" : "var(--border)"}`,
  color: "var(--text)",
}}
onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = "var(--accent)" }}
onBlur={(e) => { e.currentTarget.style.borderColor = error ? "var(--destructive)" : "var(--border)" }}
```

### Card (hoverable)

```tsx
// Default
style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
className="rounded-md p-4"

// Hoverable (forms list, table rows)
className="transition-colors cursor-pointer"
onMouseEnter → style.background = "var(--surface-elevated)"
onMouseLeave → restore

// Active / selected (builder canvas, table row)
style={{ background: "var(--accent-dim)", border: "1px solid rgba(99,102,241,0.45)" }}
```

### Badge

```tsx
// Published
"text-xs px-2 py-0.5 rounded-sm bg-green-500/10 text-green-400 border border-green-500/20"

// Draft
"text-xs px-2 py-0.5 rounded-sm bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"

// Closed
"text-xs px-2 py-0.5 rounded-sm bg-[--surface-elevated] text-[--text-muted] border border-[--border]"

// Pro plan
"text-xs px-2 py-0.5 rounded-sm bg-[--accent-dim] text-[--accent]"

// Admin role
"text-xs px-2 py-0.5 rounded-sm bg-yellow-500/10 text-[--warning] border border-yellow-500/20"

// Active user
"text-xs px-2 py-0.5 rounded-sm bg-green-500/10 text-[--success] border border-green-500/20"
```

### Toggle Switch

```tsx
<button
  role="switch"
  style={{ background: checked ? "var(--accent)" : "var(--surface-elevated)", border: "1px solid var(--border)" }}
  className="relative w-9 h-5 rounded-full transition-colors"
>
  <span
    className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform"
    style={{ transform: checked ? "translateX(17px)" : "translateX(2px)" }}
  />
</button>
```

### Side Drawer (SubmissionDrawer / AdminUserDrawer)

```tsx
// Backdrop
<div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

// Panel
<div
  className="fixed right-0 top-0 h-full z-40 flex flex-col overflow-hidden"
  style={{ width: 400-420, background: "var(--surface)", borderLeft: "1px solid var(--border)",
           boxShadow: "-8px 0 32px rgba(0,0,0,0.5)" }}
>
  {/* Header with title + close button */}
  {/* Scrollable body */}
  {/* Optional footer with action */}
</div>
```

### Segment / Tab Switcher

```tsx
<div className="flex gap-1 p-1 rounded-md" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
  {tabs.map((t) => (
    <button style={{
      background: active === t ? "var(--surface-elevated)" : "transparent",
      color: active === t ? "var(--text)" : "var(--text-muted)",
      border: active === t ? "1px solid var(--border)" : "1px solid transparent",
    }} className="text-sm px-4 py-1.5 rounded transition-colors capitalize">
      {t}
    </button>
  ))}
</div>
```

### Filter Button Group (segmented)

```tsx
<div className="flex rounded overflow-hidden" style={{ border: "1px solid var(--border)" }}>
  {options.map((o) => (
    <button style={{
      background: active === o ? "var(--accent)" : "var(--surface)",
      color: active === o ? "white" : "var(--text-muted)",
    }} className="px-3 py-1.5 text-xs capitalize transition-colors">
      {o}
    </button>
  ))}
</div>
```

### Empty State

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center"
  style={{ border: "1px dashed var(--border)" }} className="rounded-md">
  <Icon size={28} style={{ color: "var(--text-disabled)" }} className="mb-3" />
  <p className="font-medium mb-1" style={{ color: "var(--text)" }}>Nothing here</p>
  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Helpful next action hint</p>
  {/* optional CTA button */}
</div>
```

### Table

```tsx
<table className="w-full text-sm">
  <thead>
    <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
      <th className="text-left px-4 py-3 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
        Column
      </th>
    </tr>
  </thead>
  <tbody>
    <tr style={{ borderBottom: "1px solid var(--border-muted)" }}
      className="hover:bg-[--surface-elevated] transition-colors cursor-pointer">
      <td className="px-4 py-3 text-xs" style={{ color: "var(--text)" }}>Value</td>
    </tr>
  </tbody>
</table>
```

### Sidebar

```tsx
<aside className="w-56 min-h-screen flex flex-col py-6 px-3 shrink-0"
  style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
  {/* Logo: Formix with accent on 'ix' */}
  {/* Nav items */}
  {/* Admin section separator + admin nav (role-gated) */}
  {/* UserButton at bottom */}
</aside>

// Nav item active:
style={{ color: "var(--accent)", background: "var(--accent-dim)" }}
// Nav item default:
style={{ color: "var(--text-muted)", background: "transparent" }}
```

### Toast / Notification

```tsx
<div className="fixed bottom-4 right-4 z-50 text-sm px-4 py-2 rounded"
  style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", color: "var(--text)" }}>
  {message}
</div>
// Error variant: background: "var(--destructive)", color: "white"
```

---

## Field Type Icons (Lucide)

| Type | Icon |
|---|---|
| short_text | `Type` |
| long_text | `AlignLeft` |
| email | `Mail` |
| phone | `Phone` |
| number | `Hash` |
| date | `Calendar` |
| time | `Clock` |
| datetime | `CalendarClock` |
| dropdown | `ChevronDown` |
| radio | `CircleDot` |
| checkbox | `CheckSquare` |
| rating | `Star` |
| yes_no | `ToggleLeft` |
| file_upload | `Upload` |
| section_header | `Heading` |
| divider | `Minus` |

---

## Animations

| Usage | Class |
|---|---|
| Default hover/state | `transition-colors duration-150` |
| All properties | `transition-all duration-200` |
| Transform | `transition-transform duration-200` |
| Button press | `active:scale-[0.98]` |
| Spinner | `animate-spin` (Lucide `Loader2`) |
| Star hover | `hover:scale-110 active:scale-95` |

---

## Public Form Page

The `/f/[slug]` form card uses the form's own `accentColor` (default `#6366f1`):
- Accent bar at top: `height: 4px, background: accentColor, -mt-8 -mx-8 mb-8`
- Submit button: `background: accentColor`
- Radio/checkbox selected card: `border: 1px solid ${accent}50, background: ${accent}10`
- Focus rings on inputs: `borderColor: accent`
- Rating stars filled: `color: accent`

Background: `var(--bg)` (#0a0a0a), form card: `var(--surface)` (#111111)

---

## Dark Mode Notes

- Dark-only. No light mode toggle.
- Layer order: `#0a0a0a` (bg) → `#111111` (surface) → `#1a1a1a` (elevated)
- Never use `white` — max text is `#f5f5f5`
- Accent `#6366f1` on dark has 4.5:1+ contrast on `#111111`
- All color inputs (accent color picker) preview swatch at 40×40px with border

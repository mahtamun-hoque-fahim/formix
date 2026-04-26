# DESIGN_GUIDE.md — Formix

> Living design system reference. Updated when new components or tokens are added.
> Last updated: 2026-04-25

---

## Color Tokens

| Token | CSS Variable | Hex | Usage |
|---|---|---|---|
| Background | `--bg` | `#0a0a0a` | Page background |
| Surface | `--surface` | `#111111` | Cards, panels, sidebar |
| Surface Elevated | `--surface-elevated` | `#1a1a1a` | Modals, dropdowns, nested cards |
| Border | `--border` | `#1f1f1f` | Dividers, outlines |
| Border Muted | `--border-muted` | `#161616` | Subtle separators |
| Accent | `--accent` | `#6366f1` | CTAs, active states, links, focus rings |
| Accent Dim | `--accent-dim` | `#6366f120` | Accent backgrounds, hover fills |
| Accent Hover | `--accent-hover` | `#4f52d4` | Accent button hover state |
| Text Primary | `--text` | `#f5f5f5` | Body text, headings |
| Text Muted | `--text-muted` | `#888888` | Secondary labels, captions |
| Text Disabled | `--text-disabled` | `#3d3d3d` | Disabled states |
| Destructive | `--destructive` | `#ef4444` | Errors, delete actions |
| Destructive Dim | `--destructive-dim` | `#ef444415` | Error backgrounds |
| Success | `--success` | `#22c55e` | Confirmations, published badge |
| Warning | `--warning` | `#f59e0b` | Draft badge, warnings |
| Info | `--info` | `#3b82f6` | Info badges, tips |

> **Note:** Accent is `#6366f1` (indigo) — distinct from Fahim's personal brand green to give Formix its own product identity.

---

## Typography

**Font Stack:**
- Headings: `Syne` — weights 600, 700
- Body: `Onest` — weights 400, 500, 600
- Code / Mono: `JetBrains Mono` — weights 400, 500

**Scale:**

| Name | Size | Line Height | Weight | Font | Usage |
|---|---|---|---|---|---|
| `display` | 3.5rem (56px) | 1.1 | 700 | Syne | Landing hero |
| `h1` | 2.25rem (36px) | 1.2 | 700 | Syne | Page titles |
| `h2` | 1.75rem (28px) | 1.25 | 600 | Syne | Section headings |
| `h3` | 1.25rem (20px) | 1.3 | 600 | Syne | Card titles, sidebar section |
| `body` | 1rem (16px) | 1.6 | 400 | Onest | Default text |
| `small` | 0.875rem (14px) | 1.5 | 400 | Onest | Labels, captions, table cells |
| `xs` | 0.75rem (12px) | 1.4 | 500 | Onest | Badges, metadata, timestamps |
| `mono` | 0.875rem (14px) | 1.6 | 400 | JetBrains Mono | Slugs, API keys, code |

---

## Spacing Scale

Tailwind default scale. Common usage:

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon + label gap |
| `space-2` | 8px | Button internal padding (vertical) |
| `space-3` | 12px | Default gap between list items |
| `space-4` | 16px | Card inner padding, input padding |
| `space-6` | 24px | Section inner padding |
| `space-8` | 32px | Between cards, between sections (mobile) |
| `space-12` | 48px | Dashboard page padding (desktop) |
| `space-16` | 64px | Landing page hero spacing |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 4px | Badges, small tags |
| `rounded` | 6px | Buttons, inputs, select |
| `rounded-md` | 8px | Cards, panels, field blocks |
| `rounded-lg` | 12px | Modals, large cards, form preview |
| `rounded-xl` | 16px | Feature sections, hero cards |
| `rounded-full` | 9999px | Avatars, pills, toggle |

---

## Shadows

| Name | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.5)` | Subtle lift on cards |
| `shadow-md` | `0 4px 16px rgba(0,0,0,0.6)` | Modals, elevated panels |
| `shadow-accent` | `0 0 24px rgba(99,102,241,0.2)` | Accent glow on primary CTA |
| `shadow-destructive` | `0 0 16px rgba(239,68,68,0.15)` | Error/delete button glow |

---

## Component Patterns

### Button

```tsx
// Primary (accent)
<button className="bg-[--accent] hover:bg-[--accent-hover] text-white font-semibold text-sm px-4 py-2 rounded transition-colors">
  Publish Form
</button>

// Secondary (ghost border)
<button className="border border-[--border] text-[--text] text-sm px-4 py-2 rounded hover:bg-[--surface-elevated] hover:border-[--accent]/30 transition-colors">
  Preview
</button>

// Destructive
<button className="bg-[--destructive] text-white text-sm font-semibold px-4 py-2 rounded hover:opacity-90 transition-opacity">
  Delete Form
</button>

// Icon Button (square)
<button className="p-2 rounded border border-[--border] text-[--text-muted] hover:text-[--text] hover:bg-[--surface-elevated] transition-colors">
  <Icon size={16} />
</button>

// Disabled: add opacity-40 cursor-not-allowed, remove hover styles
```

### Input

```tsx
<input
  className="bg-[--surface] border border-[--border] text-[--text] text-sm rounded px-3 py-2 w-full
    placeholder:text-[--text-muted]
    focus:outline-none focus:border-[--accent] focus:ring-1 focus:ring-[--accent]/30
    disabled:opacity-40 disabled:cursor-not-allowed
    transition-colors"
/>
```

### Textarea

```tsx
<textarea className="bg-[--surface] border border-[--border] text-[--text] text-sm rounded px-3 py-2 w-full min-h-[100px] resize-y
  placeholder:text-[--text-muted]
  focus:outline-none focus:border-[--accent] focus:ring-1 focus:ring-[--accent]/30
  transition-colors" />
```

### Select / Dropdown

```tsx
<select className="bg-[--surface] border border-[--border] text-[--text] text-sm rounded px-3 py-2 w-full
  focus:outline-none focus:border-[--accent] focus:ring-1 focus:ring-[--accent]/30
  transition-colors appearance-none" />
```

### Card

```tsx
// Default card
<div className="bg-[--surface] border border-[--border] rounded-md p-4">
  {/* content */}
</div>

// Hoverable (form list items)
<div className="bg-[--surface] border border-[--border] rounded-md p-4
  hover:border-[--accent]/30 hover:bg-[--surface-elevated] transition-colors cursor-pointer">
  {/* content */}
</div>

// Active / selected (builder field)
<div className="bg-[--surface-elevated] border border-[--accent]/40 rounded-md p-4">
  {/* content */}
</div>
```

### Badge

```tsx
// Status badges
// Published
<span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-green-500/10 text-green-400 border border-green-500/20">
  Published
</span>
// Draft
<span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
  Draft
</span>
// Closed
<span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-[--surface-elevated] text-[--text-muted] border border-[--border]">
  Closed
</span>
// Plan badges
<span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-[--accent-dim] text-[--accent]">
  Pro
</span>
```

### Modal

```tsx
// Overlay
<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  {/* Modal panel */}
  <div className="bg-[--surface] border border-[--border] rounded-lg w-full max-w-md p-6 shadow-md">
    {/* content */}
  </div>
</div>
```

### Sidebar (Dashboard)

```tsx
<aside className="w-60 min-h-screen bg-[--surface] border-r border-[--border] flex flex-col p-4 gap-1">
  {/* Logo */}
  {/* Nav items */}
  {/* User at bottom */}
</aside>

// Nav item
<a className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-[--text-muted]
  hover:text-[--text] hover:bg-[--surface-elevated] transition-colors">
  <Icon size={16} />
  Forms
</a>
// Active nav item
<a className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-[--accent] bg-[--accent-dim]">
  <Icon size={16} />
  Forms
</a>
```

### Form Field (Builder Block)

```tsx
// Draggable field in builder canvas
<div className="bg-[--surface] border border-[--border] rounded-md p-4 cursor-grab
  hover:border-[--accent]/30 transition-colors group">
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs text-[--text-muted] font-mono">{field.type}</span>
    {/* drag handle + delete icons */}
  </div>
  <label className="text-sm font-medium text-[--text]">{field.label}</label>
  {/* Field preview (disabled input/select/etc.) */}
</div>
```

### Empty State

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center gap-3">
  <div className="w-12 h-12 rounded-lg bg-[--surface-elevated] flex items-center justify-center">
    <Icon size={20} className="text-[--text-muted]" />
  </div>
  <p className="text-[--text] font-medium">No forms yet</p>
  <p className="text-sm text-[--text-muted]">Create your first form to get started</p>
  <button className="...primary button...">Create Form</button>
</div>
```

### Table (Responses view)

```tsx
<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-[--border]">
      <th className="text-left text-xs text-[--text-muted] font-medium pb-2 pr-4">Field</th>
      {/* more headers */}
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-[--border-muted] hover:bg-[--surface-elevated] transition-colors">
      <td className="py-3 pr-4 text-[--text]">Value</td>
    </tr>
  </tbody>
</table>
```

---

## Animations / Transitions

| Usage | Class |
|---|---|
| Default hover/state | `transition-colors duration-150` |
| Opacity transitions | `transition-opacity duration-150` |
| Transform / slide | `transition-transform duration-200` |
| All properties | `transition-all duration-200` |
| Builder drag feedback | `scale-[0.98] opacity-70` (while dragging) |

Keep motion minimal. No page-level animations. Micro-interactions only.

---

## Field Type Icons (Lucide)

| Field Type | Lucide Icon |
|---|---|
| `short_text` | `Type` |
| `long_text` | `AlignLeft` |
| `email` | `Mail` |
| `phone` | `Phone` |
| `number` | `Hash` |
| `date` | `Calendar` |
| `time` | `Clock` |
| `datetime` | `CalendarClock` |
| `dropdown` | `ChevronDown` |
| `radio` | `CircleDot` |
| `checkbox` | `CheckSquare` |
| `rating` | `Star` |
| `yes_no` | `ToggleLeft` |
| `file_upload` | `Upload` |
| `section_header` | `Heading` |
| `divider` | `Minus` |

---

## Dark Mode Notes

- Dark-first. No light mode.
- Background layers: `#0a0a0a` → `#111111` → `#1a1a1a` (bg → surface → elevated)
- Never use pure white — max `#f5f5f5` for text
- Accent `#6366f1` (indigo) on dark backgrounds — sufficient contrast
- Form public page can use a slightly softer background (`#0f0f0f`) with the form card on `#111111`

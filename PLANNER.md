# PLANNER.md — Formix

> Living technical document. Updated on `update repo`.
> Last updated: 2026-04-28

---

## Overview

| Field | Value |
|---|---|
| Project | **Formix** |
| Purpose | SaaS platform for creating, sharing, and managing forms for organizations and events with exportable responses |
| Target User | Organizations, event teams, clubs, and businesses that need to collect structured data |
| Key Value | Full form lifecycle: build → share → collect → export — all in one dark, clean dashboard |
| Status | 🔄 Phase 8 next (landing page) |
| Repo | `github.com/mahtamun-hoque-fahim/formix` |
| Live URL | `formix.vercel.app` |

---

## Architecture

**Stack:**
- Framework: Next.js 16 App Router (TypeScript)
- Styling: Tailwind CSS v4
- Database: Neon (PostgreSQL) via Drizzle ORM
- Auth: Clerk (publicMetadata.role for admin vs. user)
- File Storage: Cloudinary (Phase 7 — currently stores filename only)
- Email: Resend (Phase 7 — submission notifications)
- Export: xlsx (Excel), jspdf + jspdf-autotable (PDF), native (CSV, JSON)
- Deployment: Vercel

**Folder Structure:**
```
/
├── app/
│   ├── (auth)/                         # Clerk sign-in / sign-up
│   ├── (public)/f/[slug]/              # Public respondent form + thank-you
│   ├── dashboard/                      # User dashboard (Clerk-gated)
│   │   ├── page.tsx                    # Overview stats + recent activity
│   │   └── forms/
│   │       ├── page.tsx                # Forms list
│   │       ├── new/page.tsx            # Create form
│   │       └── [id]/
│   │           ├── page.tsx            # Builder (BuilderClient)
│   │           ├── responses/page.tsx  # Responses (ResponsesClient)
│   │           └── settings/page.tsx   # Settings (SettingsClient)
│   ├── admin/                          # Admin-gated
│   │   ├── page.tsx                    # Platform overview
│   │   ├── users/page.tsx              # User management
│   │   └── forms/page.tsx              # All forms audit
│   └── api/
│       ├── forms/...                   # Full CRUD + fields + reorder + status
│       ├── submissions/route.ts        # POST public submit
│       ├── export/[id]/route.ts        # GET csv|json|xlsx|pdf
│       ├── admin/users/, admin/forms/, admin/stats/
│       └── webhooks/clerk/route.ts
├── components/
│   ├── ui/          # Button, Input, Textarea, Select, Modal, Badge
│   ├── builder/     # FieldPalette, BuilderCanvas, FieldBlock, FieldEditor
│   ├── form-renderer/  # FormRenderer (16 field types)
│   ├── responses/   # ResponsesClient, SubmissionDrawer, ResponseSummary
│   ├── settings/    # SettingsClient
│   ├── admin/       # AdminUsersClient, AdminUserDrawer
│   └── dashboard/   # Sidebar
├── lib/
│   ├── db/schema/   # users, forms, form_fields, form_submissions, field_responses
│   ├── export/      # excel.ts, pdf.ts
│   ├── clerk.ts     # requireAuth, requireAdmin, getRole
│   ├── field-types.ts
│   └── utils.ts
├── middleware.ts
└── .env.example
```

---

## Roles & Permissions

| Role | Set Via | Access |
|---|---|---|
| `user` | Default on signup | Own dashboard, forms, responses |
| `admin` | Clerk Dashboard → publicMetadata → `{"role":"admin"}` | Everything + /admin/*, all users, all forms |

---

## User Flows

### Build & Publish
1. `/dashboard/forms/new` → title → form created (draft)
2. Builder → drag fields from palette → click to configure in FieldEditor
3. Publish → status: published → copy `/f/[slug]`

### Respondent Submits
1. Opens `/f/[slug]` → FormRenderer with all 16 field types
2. Client-side validation → POST `/api/submissions`
3. Server validates: published, not expired, under limit, required fields
4. Shows success message or redirects to `redirectUrl`

### View & Export
1. `/dashboard/forms/[id]/responses` → Responses tab (table) or Summary tab (charts)
2. Click row → SubmissionDrawer → view all answers + inline delete
3. Export: CSV / JSON / XLSX / PDF buttons

### Admin
1. `/admin` → platform stats + 30d/7d growth + recent signups/submissions
2. `/admin/users` → search/filter → click user → AdminUserDrawer (role/plan/active toggles)
3. `/admin/forms` → all forms with owner info + response counts

---

## DB Schema

```ts
users            id(text PK), email, name, avatarUrl, role, plan, isActive, createdAt, updatedAt
forms            id(uuid PK), userId→users, title, description, slug(unique), status, accentColor,
                 allowMultipleSubmissions, requireAuth, submissionLimit, startsAt, endsAt,
                 successMessage, redirectUrl, notifyOnSubmission, createdAt, updatedAt
form_fields      id(uuid PK), formId→forms, type, label, placeholder, helpText,
                 isRequired, order, options(jsonb), createdAt
form_submissions id(uuid PK), formId→forms, respondentId, respondentEmail, ipAddress, userAgent, submittedAt
field_responses  id(uuid PK), submissionId→form_submissions, fieldId→form_fields, value(text), createdAt
```

**options jsonb shape per field type:**
- dropdown / radio / checkbox: `{ choices: string[] }`
- rating: `{ min: 1, max: 5 }`
- number: `{ min?, max?, step? }`
- file_upload: `{ maxSizeMb: number, allowedTypes: string[] }`

**value encoding in field_responses:**
- checkbox: `JSON.stringify(string[])`
- yes_no: `"yes"` | `"no"`
- file_upload: filename (Phase 7 → Cloudinary URL)
- all others: raw string

---

## API Routes

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/forms` | User | Own forms list |
| POST | `/api/forms` | User | Create + auto-slug |
| GET/PUT/DELETE | `/api/forms/[id]` | Owner | Full form CRUD |
| PATCH | `/api/forms/[id]/status` | Owner | draft/published/closed |
| GET/POST | `/api/forms/[id]/fields` | Owner | Field list + add |
| PUT/DELETE | `/api/forms/[id]/fields/[fid]` | Owner | Edit/remove field |
| PATCH | `/api/forms/[id]/fields/reorder` | Owner | dnd-kit order sync |
| GET | `/api/forms/slug/[slug]` | Public | Published form for renderer |
| POST | `/api/submissions` | Public | Create submission + field_responses |
| DELETE | `/api/forms/[id]/submissions/[sid]` | Owner | Delete submission (cascades) |
| GET | `/api/export/[id]?format=` | Owner | csv / json / xlsx / pdf |
| POST | `/api/upload` | User | Cloudinary upload (Phase 7) |
| POST | `/api/webhooks/clerk` | Webhook | User sync |
| GET | `/api/admin/users` | Admin | All users + counts |
| PATCH | `/api/admin/users/[uid]` | Admin | role / plan / isActive |
| GET | `/api/admin/forms` | Admin | All forms + owner |
| GET | `/api/admin/stats` | Admin | Platform totals + growth |

---

## Env Vars

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | Neon pooled connection |
| `DATABASE_URL_UNPOOLED` | ✅ | Neon direct (migrations) |
| `NEXT_PUBLIC_APP_URL` | ✅ | `https://formix.vercel.app` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk pk |
| `CLERK_SECRET_KEY` | ✅ | Clerk sk |
| `CLERK_WEBHOOK_SECRET` | ✅ | Clerk webhook signing |
| `CLOUDINARY_CLOUD_NAME` | Phase 7 | |
| `CLOUDINARY_API_KEY` | Phase 7 | |
| `CLOUDINARY_API_SECRET` | Phase 7 | |
| `RESEND_API_KEY` | Phase 7 | |
| `RESEND_FROM_EMAIL` | Phase 7 | `notify@formix.app` |

---

## Phases & Timeline

| Phase | Name | Status | Key Deliverables |
|---|---|---|---|
| 1 | Foundation | ✅ | Next.js 16, 5-table Drizzle schema, Clerk auth + webhook, middleware, layouts, API stubs |
| 2 | Form Builder | ✅ | FieldPalette, BuilderCanvas (dnd-kit), FieldBlock (16 types + previews), FieldEditor, duplicate field, settings page, Button/Select/Textarea primitives |
| 3 | Public Form | ✅ | FormRenderer (all 16 types, custom radio/checkbox cards, star rating, yes_no, file zone), client + server validation, POST /api/submissions, success/redirect |
| 4 | Responses Dashboard | ✅ | ResponsesClient (Responses + Summary tabs), SubmissionDrawer (side panel, all types rendered, inline delete), ResponseSummary (bar charts, star dist, avg/min/max), copy link |
| 5 | Export Engine | ✅ | CSV + JSON (native), XLSX (SheetJS 2-sheet, frozen headers), PDF (jspdf dark theme, accent bar, page numbers) |
| 6 | Admin Dashboard | ✅ | Platform stats (30d/7d growth), Users table (search/filter/badges), AdminUserDrawer (role/plan/active toggle), All Forms audit, admin sidebar nav |
| 7 | Email + File Upload | ✅ | Resend notification on submission (dark HTML email, field preview, fire-and-forget), Cloudinary upload for file_upload field (POST /api/upload, real-time progress, error state, clickable URL) |
| 8 | Landing Page | ✅ | Hero, features, pricing (free/pro), CTA |
| 9 | Polish & Deploy | ⏳ | OG image, error boundaries, loading skeletons, rate limiting, Vercel prod |

---

## Next Steps

1. [x] ~~Install `resend`, create `lib/resend.ts`, send email on `POST /api/submissions` when `notifyOnSubmission = true`~~
2. [x] ~~Wire `POST /api/upload` → Cloudinary signed upload, update FormRenderer file_upload to POST blob and store URL~~
3. [x] ~~Build `app/page.tsx` landing — hero, features grid, pricing table (free/pro), sign-up CTA~~ — hero, features grid, pricing table (free/pro), sign-up CTA
4. [ ] Add `@vercel/og` OG image for `/f/[slug]` — form title + response count
5. [ ] Add Upstash Redis rate limiting on `POST /api/submissions` (per IP, e.g. 10/min)
6. [ ] Add Suspense + skeleton loaders to dashboard pages
7. [ ] Set all Vercel env vars, run `pnpm db:push`, configure Clerk webhook, set admin publicMetadata

---

## Key Decisions Log

| Date | Decision |
|---|---|
| 2026-04-25 | Accent `#6366f1` (indigo) — distinct from Fahim's personal green |
| 2026-04-25 | Clerk publicMetadata.role for admin/user — no extra DB middleware |
| 2026-04-25 | Field options as jsonb — flexible per type |
| 2026-04-25 | Global unique slugs for clean /f/[slug] URLs |
| 2026-04-28 | Checkbox values → JSON.stringify(string[]) in field_responses.value |
| 2026-04-28 | AdminUserDrawer patches immediately on toggle — no save button |
| 2026-04-28 | Export: SheetJS server-side XLSX, jspdf server-side PDF (no browser canvas) |

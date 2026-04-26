# PLANNER.md — Formix

> Living technical document. Updated whenever `update repo` is triggered.
> Last updated: 2026-04-25

---

## Overview

| Field | Value |
|---|---|
| Project | **Formix** |
| Purpose | SaaS platform for creating, sharing, and managing forms for organizations and events with exportable responses |
| Target User | Organizations, event teams, clubs, and businesses that need to collect structured data |
| Key Value | Full form lifecycle: build → share → collect → export — all in one dark, clean dashboard |
| Status | ⏳ Not Started |
| Repo | `github.com/mahtamun-hoque-fahim/formix` |
| Live URL | `formix.vercel.app` |

---

## Architecture

**Stack:**
- Framework: Next.js 14 App Router (TypeScript)
- Styling: Tailwind CSS
- Database: Neon (PostgreSQL) via Drizzle ORM
- Auth: Clerk (with `publicMetadata.role` for admin vs. user)
- File Storage: Cloudinary (file-type form fields)
- Email: Resend (submission notifications)
- Export: `xlsx` (Excel), `jspdf` + `jspdf-autotable` (PDF), native (CSV, JSON)
- Deployment: Vercel

**Folder Structure:**
```
/
├── app/
│   ├── (auth)/               # Clerk auth pages (sign-in, sign-up)
│   ├── (public)/
│   │   └── f/[slug]/         # Public respondent form view
│   │       └── thank-you/    # Post-submission page
│   ├── dashboard/            # User dashboard (protected)
│   │   ├── page.tsx          # Overview/stats
│   │   ├── forms/
│   │   │   ├── page.tsx      # All forms list
│   │   │   ├── new/          # Form builder
│   │   │   └── [id]/
│   │   │       ├── page.tsx  # Edit form / builder
│   │   │       ├── responses/# View & export responses
│   │   │       └── settings/ # Form config/settings
│   ├── admin/                # Super-admin dashboard (role-gated)
│   │   ├── page.tsx          # Admin overview
│   │   ├── users/            # User management
│   │   └── forms/            # All forms across users
│   └── api/
│       ├── forms/
│       ├── submissions/
│       ├── export/
│       ├── upload/
│       └── webhooks/clerk/
├── components/
│   ├── ui/                   # Primitives (Button, Input, Badge, Card, Modal, etc.)
│   ├── builder/              # Form builder components
│   │   ├── FieldPalette.tsx  # Draggable field types list
│   │   ├── BuilderCanvas.tsx # Drop zone / live form preview
│   │   └── FieldEditor.tsx   # Per-field settings panel
│   ├── form-renderer/        # Public form rendering engine
│   ├── dashboard/            # Dashboard-specific components
│   └── admin/                # Admin-specific components
├── lib/
│   ├── db/
│   │   ├── client.ts         # Drizzle + Neon client
│   │   └── schema/           # One file per table
│   ├── clerk.ts              # Clerk server helpers, role checks
│   ├── export/
│   │   ├── csv.ts
│   │   ├── excel.ts
│   │   └── pdf.ts
│   ├── cloudinary.ts
│   └── resend.ts
├── middleware.ts              # Clerk auth + role protection
├── PLANNER.md
├── DESIGN_GUIDE.md
└── README.md
```

---

## Roles & Permissions

| Role | How Set | Access |
|---|---|---|
| `user` | Default on signup (Clerk `publicMetadata.role = 'user'`) | Own dashboard, own forms, own responses |
| `admin` | Set manually in Clerk dashboard (`publicMetadata.role = 'admin'`) | All of the above + `/admin/*`, all users, all forms |

> Fahim's account gets `admin` role. Middleware checks `publicMetadata.role` on all `/admin/*` routes.

---

## User Flows

### Flow 1: User Signs Up
1. User visits landing page `/`
2. Clicks "Get Started" → `/sign-up` (Clerk hosted)
3. On completion, Clerk webhook fires → creates row in `users` table with `role = 'user'`
4. Redirected to `/dashboard`

### Flow 2: Create a Form
1. User goes to `/dashboard/forms/new`
2. Sets form title, description, slug, settings
3. Adds fields from the Field Palette (drag/click to add)
4. Configures each field (label, placeholder, required, options)
5. Publishes → form status changes to `published`
6. Gets shareable link: `formix.vercel.app/f/[slug]`

### Flow 3: Respondent Fills Form
1. Respondent visits `/f/[slug]`
2. Form fields rendered from `form_fields` table
3. On submit → POST `/api/submissions` creates `form_submission` + `field_responses`
4. Optional: email notification sent to form owner via Resend
5. Respondent sees success message or is redirected

### Flow 4: User Views & Exports Responses
1. User goes to `/dashboard/forms/[id]/responses`
2. Sees table of all submissions with timestamps
3. Can filter by date, search by any field value
4. Exports via: CSV / XLSX / PDF / JSON buttons
5. File downloads immediately in browser

### Flow 5: Admin Manages Platform
1. Admin (Fahim) visits `/admin`
2. Sees total users, total forms, total submissions stats
3. Can view `/admin/users` → list all users, see their plan, form count, disable account
4. Can view `/admin/forms` → all forms across all users, view any form's responses
5. Can also use the platform as a regular user via `/dashboard`

---

## DB Schema

> Drizzle ORM format. All tables in PostgreSQL via Neon.

```ts
// schema/users.ts
export const users = pgTable('users', {
  id: text('id').primaryKey(),                    // Clerk user ID
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  role: text('role').default('user').notNull(),    // 'user' | 'admin'
  plan: text('plan').default('free').notNull(),    // 'free' | 'pro'
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// schema/forms.ts
export const forms = pgTable('forms', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),           // URL-safe, user-defined or auto-generated
  status: text('status').default('draft').notNull(), // 'draft' | 'published' | 'closed'
  coverImageUrl: text('cover_image_url'),
  accentColor: text('accent_color').default('#6366f1'),
  allowMultipleSubmissions: boolean('allow_multiple_submissions').default(true).notNull(),
  requireAuth: boolean('require_auth').default(false).notNull(),
  submissionLimit: integer('submission_limit'),    // null = unlimited
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  successMessage: text('success_message').default('Thank you for your response!'),
  redirectUrl: text('redirect_url'),               // null = show success message
  notifyOnSubmission: boolean('notify_on_submission').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// schema/form_fields.ts
export const formFields = pgTable('form_fields', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  // Field types:
  // 'short_text' | 'long_text' | 'email' | 'phone' | 'number'
  // 'date' | 'time' | 'datetime'
  // 'dropdown' | 'radio' | 'checkbox'
  // 'rating' | 'yes_no' | 'file_upload'
  // 'section_header' | 'divider'  (display-only, not collected)
  label: text('label').notNull(),
  placeholder: text('placeholder'),
  helpText: text('help_text'),
  isRequired: boolean('is_required').default(false).notNull(),
  order: integer('order').notNull(),               // display order in form
  options: jsonb('options'),
  // For dropdown/radio/checkbox: string[] of option labels
  // For rating: { min: 1, max: 5, labels: ['Poor', 'Excellent'] }
  // For file_upload: { maxSizeMb: 5, allowedTypes: ['image/*', '.pdf'] }
  // For number: { min: number, max: number, step: number }
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// schema/form_submissions.ts
export const formSubmissions = pgTable('form_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  formId: uuid('form_id').notNull().references(() => forms.id, { onDelete: 'cascade' }),
  respondentId: text('respondent_id'),             // Clerk ID if auth required, null if anonymous
  respondentEmail: text('respondent_email'),        // captured if email field present
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

// schema/field_responses.ts
export const fieldResponses = pgTable('field_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').notNull().references(() => formSubmissions.id, { onDelete: 'cascade' }),
  fieldId: uuid('field_id').notNull().references(() => formFields.id, { onDelete: 'cascade' }),
  value: text('value'),
  // For text/email/phone/date/time: raw string
  // For number/rating: stringified number
  // For dropdown/radio: selected option label
  // For checkbox: JSON.stringify(string[])
  // For yes_no: 'yes' | 'no'
  // For file_upload: Cloudinary URL
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const formsRelations = relations(forms, ({ one, many }) => ({
  user: one(users, { fields: [forms.userId], references: [users.id] }),
  fields: many(formFields),
  submissions: many(formSubmissions),
}));

export const formSubmissionsRelations = relations(formSubmissions, ({ one, many }) => ({
  form: one(forms, { fields: [formSubmissions.formId], references: [forms.id] }),
  fieldResponses: many(fieldResponses),
}));

export const fieldResponsesRelations = relations(fieldResponses, ({ one }) => ({
  submission: one(formSubmissions, { fields: [fieldResponses.submissionId], references: [formSubmissions.id] }),
  field: one(formFields, { fields: [fieldResponses.fieldId], references: [formFields.id] }),
}));
```

---

## API Routes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/forms` | User | List own forms |
| POST | `/api/forms` | User | Create new form |
| GET | `/api/forms/[id]` | User (owner) | Get form with fields |
| PUT | `/api/forms/[id]` | User (owner) | Update form metadata |
| DELETE | `/api/forms/[id]` | User (owner) | Delete form |
| PATCH | `/api/forms/[id]/status` | User (owner) | Publish / close form |
| GET | `/api/forms/[id]/fields` | User (owner) | Get all fields |
| POST | `/api/forms/[id]/fields` | User (owner) | Add a field |
| PUT | `/api/forms/[id]/fields/[fid]` | User (owner) | Update a field |
| DELETE | `/api/forms/[id]/fields/[fid]` | User (owner) | Delete a field |
| PATCH | `/api/forms/[id]/fields/reorder` | User (owner) | Reorder fields |
| GET | `/api/forms/slug/[slug]` | Public | Get published form for rendering |
| POST | `/api/submissions` | Public | Submit a form response |
| GET | `/api/forms/[id]/submissions` | User (owner) | List all submissions |
| GET | `/api/forms/[id]/submissions/[sid]` | User (owner) | Single submission detail |
| DELETE | `/api/forms/[id]/submissions/[sid]` | User (owner) | Delete a submission |
| GET | `/api/export/[id]` | User (owner) | Export responses (`?format=csv\|xlsx\|pdf\|json`) |
| POST | `/api/upload` | User | Upload file to Cloudinary |
| POST | `/api/webhooks/clerk` | Webhook | Sync user from Clerk |
| GET | `/api/admin/users` | Admin | List all users |
| PATCH | `/api/admin/users/[id]` | Admin | Update user (role, plan, active) |
| GET | `/api/admin/forms` | Admin | List all forms |
| GET | `/api/admin/stats` | Admin | Platform-wide stats |

---

## Env Vars

| Variable | Required | Description | Example |
|---|---|---|---|
| `DATABASE_URL` | ✅ | Neon pooled connection string | `postgresql://...?sslmode=require` |
| `DATABASE_URL_UNPOOLED` | ✅ | Neon direct connection (for migrations) | `postgresql://...` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL | `https://formix.vercel.app` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key | `pk_live_...` |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key | `sk_live_...` |
| `CLERK_WEBHOOK_SECRET` | ✅ | Clerk webhook signing secret | `whsec_...` |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name | `formix` |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret | `abc...` |
| `RESEND_API_KEY` | ✅ | Resend email API key | `re_...` |
| `RESEND_FROM_EMAIL` | ✅ | Sender email address | `notify@formix.app` |

---

## Phases & Timeline

| Phase | Name | Status | Key Tasks |
|---|---|---|---|
| 1 | Foundation | ⏳ | Repo init, Neon + Drizzle setup, Clerk auth, middleware, DB schema, webhook |
| 2 | Form Builder | ⏳ | Field palette, builder canvas, field editor, drag reorder, save/publish flow |
| 3 | Public Form | ⏳ | Slug-based form renderer, all field types, submission API, thank-you page |
| 4 | Responses Dashboard | ⏳ | Submissions table, filters, single submission view, delete |
| 5 | Export Engine | ⏳ | CSV, XLSX, PDF, JSON export endpoints + download UI |
| 6 | Admin Dashboard | ⏳ | Stats overview, user list, all forms view, role/plan management |
| 7 | Email Notifications | ⏳ | Resend integration, submission notification email template |
| 8 | Landing Page | ⏳ | Marketing page, features, pricing (free/pro), CTA |
| 9 | Polish & Deploy | ⏳ | SEO, OG image, loading states, error boundaries, Vercel deploy |

---

## Next Steps

> Start here. Ordered by priority.

1. [ ] Create GitHub repo `formix`, initialize Next.js 14 + TypeScript + Tailwind
2. [ ] Set up Neon database, configure Drizzle, push initial schema
3. [ ] Set up Clerk, configure middleware, handle webhook → `users` table sync
4. [ ] Scaffold folder structure and base layouts (dashboard + admin)
5. [ ] Build Form Builder UI (Phase 2)

---

## Notes / Decisions Log

- **2026-04-25** — Chose Clerk for auth (supports `publicMetadata.role` for admin/user split without extra tables)
- **2026-04-25** — Export engine uses `xlsx` (npm) for Excel, `jspdf` + `jspdf-autotable` for PDF, native for CSV/JSON
- **2026-04-25** — Field options stored as `jsonb` in `form_fields.options` (flexible per field type)
- **2026-04-25** — Submissions are anonymous by default; auth can be required per-form via `requireAuth` flag
- **2026-04-25** — Slug is unique across all forms (not per-user) for clean public URLs

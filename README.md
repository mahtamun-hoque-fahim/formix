# Formix

Form SaaS — create, share, collect, and export form responses for organizations and events.

---

## Tech Stack

- **Framework:** Next.js 14 App Router (TypeScript)
- **Styling:** Tailwind CSS
- **Database:** Neon (PostgreSQL) + Drizzle ORM
- **Auth:** Clerk
- **File Storage:** Cloudinary
- **Email:** Resend
- **Export:** `xlsx`, `jspdf`, `jspdf-autotable`
- **Deployment:** Vercel

---

## Prerequisites

- Node.js 18+
- pnpm (or npm)
- Neon account
- Clerk account
- Cloudinary account
- Resend account

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/mahtamun-hoque-fahim/formix.git
cd formix

# 2. Install dependencies
pnpm install

# 3. Copy env file
cp .env.example .env.local
# Fill in all variables (see Env Vars below)

# 4. Push database schema
pnpm db:push

# 5. Run dev server
pnpm dev
```

---

## Env Vars

See `PLANNER.md` → Env Vars section for full descriptions.

```
DATABASE_URL
DATABASE_URL_UNPOOLED
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL
```

---

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm db:push      # Push schema to Neon (uses DATABASE_URL_UNPOOLED)
pnpm db:studio    # Drizzle Studio GUI
pnpm lint         # ESLint check
```

---

## Folder Structure

```
/
├── app/            # Routes and layouts
├── components/     # UI + feature components
├── lib/            # DB client, utilities, export logic
├── public/         # Static assets
├── PLANNER.md      # Full technical blueprint
├── DESIGN_GUIDE.md # Design system
└── README.md
```

---

## Admin Access

Set `publicMetadata.role = 'admin'` on your Clerk user via the Clerk dashboard.
All `/admin/*` routes are role-gated in middleware.

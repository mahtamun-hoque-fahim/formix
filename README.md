# Formix

Form SaaS — create, share, collect, and export form responses for organizations and events.

---

## Tech Stack

- **Framework:** Next.js 16 App Router (TypeScript)
- **Styling:** Tailwind CSS v4
- **Database:** Neon (PostgreSQL) + Drizzle ORM
- **Auth:** Clerk
- **Export:** xlsx (SheetJS), jspdf + jspdf-autotable
- **File Storage:** Cloudinary (Phase 7)
- **Email:** Resend (Phase 7)
- **Deployment:** Vercel

---

## Prerequisites

- Node.js 18+
- pnpm (or npm)
- Neon database
- Clerk application
- (Phase 7) Cloudinary account, Resend account

---

## Local Setup

```bash
# 1. Clone
git clone https://github.com/mahtamun-hoque-fahim/formix.git
cd formix

# 2. Install
npm install

# 3. Copy env
cp .env.example .env.local
# Fill in all required variables

# 4. Push schema to Neon
npx drizzle-kit push

# 5. Dev server
npm run dev
```

---

## Env Vars

See `PLANNER.md → Env Vars` for full descriptions.

**Required now:**
```
DATABASE_URL
DATABASE_URL_UNPOOLED
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
```

**Required Phase 7:**
```
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL
```

---

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run start        # Production server
npx drizzle-kit push # Push schema to Neon (uses DATABASE_URL_UNPOOLED)
npx drizzle-kit studio  # Drizzle Studio GUI
npm run lint         # ESLint
```

---

## Post-Deploy Checklist

1. Set all env vars in Vercel
2. Run `npx drizzle-kit push` against production Neon DB
3. Add Clerk webhook: `https://your-domain.com/api/webhooks/clerk` → events: `user.created`, `user.updated`, `user.deleted`
4. Set your Clerk user's `publicMetadata` to `{"role":"admin"}` via Clerk Dashboard

---

## Folder Structure

```
app/          Routes and API handlers
components/   UI + feature components
lib/          DB client, export utils, clerk helpers, field types
public/       Static assets
PLANNER.md    Full technical blueprint
DESIGN_GUIDE.md  Design system spec
```

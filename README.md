# ASCEND – Life Operating System

> Reduce overwhelm. Focus on 3 things. Build momentum.

A production-ready, full-stack web application built with Next.js 14, Prisma, PostgreSQL, and Framer Motion.

---

## ✦ Features

- **Today Dashboard** — Greeting, mood tracker, energy level, focus score, and top 3 smart-selected tasks
- **Life Pillars** — 6 pre-configured life categories with progress tracking
- **Task Management** — Add tasks with priority, deadline, pillar, and estimated time
- **Prioritization Engine** — Auto-selects top 3 tasks based on deadline, priority, and staleness
- **Momentum Tracker** — 14-day streak visualization, weekly stats, and consistency chart
- **Identity System** — Define who you're becoming; check in daily
- **Night Reflection** — Log wins, difficulties, mood, and task count each night
- **Overwhelm Reset** — Rule-based calming response when feeling lost

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL (local or Supabase)
- pnpm / npm / yarn

### Step 1 — Clone and install

```bash
git clone <your-repo>
cd ascend
npm install
```

### Step 2 — Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/ascend?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"   # generate: openssl rand -base64 32
```

### Step 3 — Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# OR use migrations (production-recommended)
npm run db:migrate

# Seed with demo data (optional)
npm run db:seed
```

### Step 4 — Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

Demo account (after seeding): `demo@ascend.app` / `demo1234`

---

## ☁️ Deploy to Vercel + Supabase

### Step 1 — Create Supabase Database

1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **Project Settings → Database → Connection string → URI**
3. Copy the URI. Replace `[YOUR-PASSWORD]` with your DB password.

### Step 2 — Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add **Environment Variables** in Vercel:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Supabase PostgreSQL URI + `?pgbouncer=true&connection_limit=1` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |

4. Click **Deploy**

### Step 3 — Run migrations on Supabase

After first deploy, run from your local machine (with prod DATABASE_URL set):

```bash
DATABASE_URL="your-supabase-url" npm run db:push
DATABASE_URL="your-supabase-url" npm run db:seed   # optional
```

> ⚡ **Tip**: For Supabase with Prisma, use the **Session Mode** connection string (port 5432), not the Transaction Mode pooler (port 6543).

---

## 📁 Folder Structure

```
ascend/
├── app/
│   ├── (app)/                    # Authenticated app pages
│   │   ├── dashboard/            # Today view
│   │   ├── pillars/              # Life pillars tracker
│   │   ├── tasks/                # Task management
│   │   ├── momentum/             # Streak & charts
│   │   ├── identity/             # Identity system
│   │   ├── reflect/              # Night reflection
│   │   └── reset/                # Overwhelm reset
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth + register
│   │   ├── tasks/                # Tasks CRUD
│   │   ├── pillars/              # Pillars API
│   │   ├── mood/                 # Mood entries
│   │   ├── reflections/          # Night reflections
│   │   ├── identities/           # Identity tracking
│   │   ├── momentum/             # Streak data
│   │   ├── top-three/            # Prioritization engine
│   │   └── reset/                # Overwhelm reset
│   ├── login/                    # Login page
│   ├── register/                 # Register page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Redirect handler
│   └── globals.css               # Global styles
├── components/
│   ├── AppShell.tsx              # Sidebar + mobile nav
│   ├── Providers.tsx             # NextAuth provider
│   └── dashboard/
│       ├── DashboardClient.tsx   # Main Today view
│       ├── MoodWidget.tsx        # Mood + energy input
│       └── OverwhelmButton.tsx   # Reset modal
├── lib/
│   ├── auth.ts                   # Session helpers
│   ├── engine.ts                 # Prioritization logic
│   ├── prisma.ts                 # DB singleton
│   └── utils.ts                  # Helpers + constants
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Demo data seeder
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#FFF9EC` (cream) |
| Primary | `#F45C43` (coral) |
| Accent | `#EEC84A` (gold) |
| Success | `#8DB485` (sage) |
| Font Display | Playfair Display |
| Font Body | DM Sans |
| Font Mono | DM Mono |

---

## 🧠 Prioritization Engine

Tasks are scored and top 3 are selected using:

1. **Priority weight** — CRITICAL (100), GROWTH (50), LIGHT (10)
2. **Deadline urgency** — Overdue (+150), <24h (+80), <3d (+40), <7d (+20)
3. **Staleness boost** — Not touched in 7+ days (+30), 3+ days (+15)
4. **Pillar diversity** — Tries to show tasks from different pillars

---

## 📜 License

MIT — build freely, ascend daily.

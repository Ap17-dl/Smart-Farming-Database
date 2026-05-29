# Smart Farming Management System (Redis + Supabase)

A full-stack Smart Farming Management System built with Next.js, Redis, and Supabase authentication.

## Features

- Dashboard analytics (farmers, crops, sales, sensors, revenue)
- Farmer Management (CRUD + name/phone search)
- Crop Management (CRUD)
- Sales Management (CRUD + automatic `revenue = quantity x price`)
- Sensor Management (sensor registry + reading history)
- Additional modules: Lands, Plantings, Markets
- Supabase email/password authentication
- Redis-backed backend with real-time API-driven updates

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js Route Handlers
- Auth: Supabase (`@supabase/ssr`)
- Database: Redis (`ioredis`)

## Prerequisites

- Node.js 18+
- Redis server (local or remote)
- Supabase project

## Setup

1. Install dependencies

```bash
pnpm install
```

2. Configure environment variables

```bash
cp .env.example .env.local
```

Set values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

3. Start Redis (if local)

```bash
redis-server
```

4. Run app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `GET/POST /api/[entity]`
- `GET/PUT/DELETE /api/[entity]/[id]`
- `GET /api/dashboard`

Supported entities:

- `farmers`
- `lands`
- `crops`
- `plantings`
- `sensors`
- `sensor_data`
- `markets`
- `sales`

All API routes require authenticated Supabase user session.

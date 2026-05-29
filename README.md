# Smart Farming Management System (Supabase PostgreSQL)

A full-stack Smart Farming Management System built with Next.js and Supabase (Auth + PostgreSQL).

## Features

- Dashboard analytics (farmers, crops, sales, sensors, revenue)
- Farmer Management (CRUD + name/phone search)
- Crop Management (CRUD)
- Sales Management (CRUD + automatic `revenue = quantity x price`)
- Sensor Management (sensor registry + reading history)
- Additional modules: Lands, Plantings, Markets
- Supabase email/password authentication
- Supabase PostgreSQL-backed API routes

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js Route Handlers
- Auth: Supabase (`@supabase/ssr`)
- Database: Supabase PostgreSQL

## Prerequisites

- Node.js 18+
- Supabase project

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
```

3. Create database schema in Supabase

- Open Supabase SQL Editor.
- Run the SQL from [`supabase_schema.sql`](./supabase_schema.sql).

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

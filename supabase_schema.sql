create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$;

create table if not exists public.farmers (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  location text
);

create table if not exists public.crops (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  name text not null,
  season text not null,
  variety text
);

create table if not exists public.markets (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "marketName" text not null,
  city text not null
);

create table if not exists public.sensors (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  name text not null,
  "sensorType" text not null,
  unit text not null,
  location text
);

create table if not exists public.lands (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "farmerId" uuid not null references public.farmers(id) on delete cascade,
  "landName" text not null,
  acreage numeric not null,
  "soilType" text
);

create table if not exists public.plantings (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "farmerId" uuid not null references public.farmers(id) on delete cascade,
  "landId" uuid not null references public.lands(id) on delete cascade,
  "cropId" uuid not null references public.crops(id) on delete cascade,
  "plantedOn" date not null,
  "expectedHarvestOn" date
);

create table if not exists public.sensor_data (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "sensorId" uuid not null references public.sensors(id) on delete cascade,
  reading numeric not null,
  "recordedAt" date not null
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "farmerId" uuid not null references public.farmers(id) on delete cascade,
  "cropId" uuid not null references public.crops(id) on delete cascade,
  "marketId" uuid references public.markets(id) on delete set null,
  quantity numeric not null,
  price numeric not null,
  "saleDate" date not null,
  revenue numeric not null default 0
);

create or replace function public.update_sales_revenue()
returns trigger
language plpgsql
as $$
begin
  new.revenue = new.quantity * new.price;
  return new;
end;
$$;

drop trigger if exists trg_sales_revenue on public.sales;
create trigger trg_sales_revenue
before insert or update on public.sales
for each row
execute function public.update_sales_revenue();

do $$
declare
  t text;
begin
  foreach t in array array['farmers','crops','markets','sensors','lands','plantings','sensor_data','sales']
  loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%I', t, t);
    execute format('create trigger trg_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end;
$$;

alter table public.farmers enable row level security;
alter table public.crops enable row level security;
alter table public.markets enable row level security;
alter table public.sensors enable row level security;
alter table public.lands enable row level security;
alter table public.plantings enable row level security;
alter table public.sensor_data enable row level security;
alter table public.sales enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['farmers','crops','markets','sensors','lands','plantings','sensor_data','sales']
  loop
    execute format('drop policy if exists "Authenticated full access" on public.%I', t);
    execute format('create policy "Authenticated full access" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

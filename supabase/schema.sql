-- =====================================================================
--  KineVida · Esquema de base de datos (PostgreSQL / Supabase)
--  Ejecutar en el SQL Editor de Supabase.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type role as enum ('admin', 'kinesiologo', 'paciente');
exception when duplicate_object then null; end $$;

do $$ begin
  create type appointment_status as enum ('pendiente', 'confirmada', 'cancelada', 'realizada');
exception when duplicate_object then null; end $$;

do $$ begin
  create type treatment_status as enum ('activo', 'pausado', 'finalizado');
exception when duplicate_object then null; end $$;

-- ---------- users (perfil ligado a auth.users de Supabase) ----------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role role not null default 'paciente',
  professional_id uuid,
  patient_id uuid,
  created_at timestamptz not null default now()
);

-- ---------- services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  duration_min int not null default 45,
  price_clp int not null default 0,
  icon text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- professionals ----------
create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text,
  specialties text[] default '{}',
  bio text,
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- patients ----------
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  rut text unique,
  birth_date date,
  address text,
  reason text,
  created_at timestamptz not null default now()
);

-- ---------- appointments ----------
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  professional_id uuid not null references public.professionals(id),
  service_id uuid not null references public.services(id),
  date date not null,
  time text not null,
  status appointment_status not null default 'pendiente',
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists idx_appointments_date on public.appointments(date);
create index if not exists idx_appointments_patient on public.appointments(patient_id);

-- ---------- treatment_plans ----------
create table if not exists public.treatment_plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  professional_id uuid not null references public.professionals(id),
  diagnosis text not null,
  objective text,
  status treatment_status not null default 'activo',
  sessions_planned int not null default 1,
  start_date date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------- treatment_sessions ----------
create table if not exists public.treatment_sessions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.treatment_plans(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  professional_id uuid not null references public.professionals(id),
  date date not null default current_date,
  pain_level int check (pain_level between 1 and 10),
  exercises_done text,
  observations text,
  progress_note text,
  next_recommendation text,
  attachments text[] default '{}',
  created_at timestamptz not null default now()
);

-- ---------- exercises ----------
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  body_area text,
  default_sets int default 3,
  default_reps int default 10,
  video_url text
);

-- ---------- patient_exercises ----------
create table if not exists public.patient_exercises (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  plan_id uuid references public.treatment_plans(id) on delete cascade,
  sets int default 3,
  reps int default 10,
  frequency text,
  notes text,
  assigned_at timestamptz not null default now()
);

-- ---------- notifications ----------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  type text default 'sistema',
  created_at timestamptz not null default now()
);

-- =====================================================================
--  Row Level Security (esquema base; ajusta según tus políticas)
-- =====================================================================
alter table public.appointments enable row level security;
alter table public.patients enable row level security;
alter table public.treatment_plans enable row level security;
alter table public.treatment_sessions enable row level security;
alter table public.patient_exercises enable row level security;
alter table public.notifications enable row level security;

-- Helper: rol del usuario autenticado
create or replace function public.current_role() returns role
language sql stable as $$
  select role from public.users where id = auth.uid()
$$;

-- Staff (admin/kinesiologo) ve y gestiona todo
create policy "staff_all_appointments" on public.appointments
  for all using (public.current_role() in ('admin','kinesiologo'));
create policy "staff_all_patients" on public.patients
  for all using (public.current_role() in ('admin','kinesiologo'));
create policy "staff_all_plans" on public.treatment_plans
  for all using (public.current_role() in ('admin','kinesiologo'));
create policy "staff_all_sessions" on public.treatment_sessions
  for all using (public.current_role() in ('admin','kinesiologo'));

-- Paciente: solo sus propios datos (lectura)
create policy "patient_own_appointments" on public.appointments
  for select using (
    patient_id = (select patient_id from public.users where id = auth.uid())
  );
create policy "patient_own_sessions" on public.treatment_sessions
  for select using (
    patient_id = (select patient_id from public.users where id = auth.uid())
  );
create policy "patient_own_exercises" on public.patient_exercises
  for select using (
    patient_id = (select patient_id from public.users where id = auth.uid())
  );
create policy "user_own_notifications" on public.notifications
  for select using (user_id = auth.uid());

-- services / professionals son públicos para lectura
alter table public.services enable row level security;
alter table public.professionals enable row level security;
create policy "public_read_services" on public.services for select using (true);
create policy "public_read_professionals" on public.professionals for select using (true);

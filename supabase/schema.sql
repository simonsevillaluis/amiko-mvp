create schema if not exists private;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text check (role in ('parent', 'caregiver', 'professional')),
  auth_provider text,
  onboarding_completed boolean not null default false,
  is_premium boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age integer not null check (age between 1 and 21),
  school_grade text not null,
  support_level text not null check (support_level in ('bajo', 'medio', 'alto')),
  visual_preferences text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  title text not null,
  subject text,
  original_text text not null,
  adult_notes text,
  status text not null default 'draft' check (status in ('draft', 'adapted', 'in_progress', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.adapted_tasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  simple_summary text not null,
  steps jsonb not null default '[]'::jsonb,
  emotional_support text,
  difficulty_level text not null check (difficulty_level in ('bajo', 'medio', 'alto')),
  model text,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.progress_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid not null references public.student_profiles(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  adapted_task_id uuid references public.adapted_tasks(id) on delete set null,
  step_number integer,
  event_type text not null check (event_type in ('step_completed', 'help_requested', 'frustration_reported')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.student_profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.adapted_tasks enable row level security;
alter table public.progress_events enable row level security;
 
grant usage on schema public to authenticated;
grant select, insert, update, delete on
  public.profiles,
  public.student_profiles,
  public.tasks,
  public.adapted_tasks,
  public.progress_events
to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "student_profiles_select_own" on public.student_profiles;
drop policy if exists "student_profiles_insert_own" on public.student_profiles;
drop policy if exists "student_profiles_update_own" on public.student_profiles;
drop policy if exists "student_profiles_delete_own" on public.student_profiles;
drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;
drop policy if exists "adapted_tasks_select_own" on public.adapted_tasks;
drop policy if exists "adapted_tasks_insert_own" on public.adapted_tasks;
drop policy if exists "adapted_tasks_update_own" on public.adapted_tasks;
drop policy if exists "adapted_tasks_delete_own" on public.adapted_tasks;
drop policy if exists "progress_events_select_own" on public.progress_events;
drop policy if exists "progress_events_insert_own" on public.progress_events;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "student_profiles_select_own"
on public.student_profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "student_profiles_insert_own"
on public.student_profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "student_profiles_update_own"
on public.student_profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "student_profiles_delete_own"
on public.student_profiles for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "tasks_select_own"
on public.tasks for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "tasks_insert_own"
on public.tasks for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.student_profiles
    where student_profiles.id = tasks.student_id
      and student_profiles.user_id = (select auth.uid())
  )
);

create policy "tasks_update_own"
on public.tasks for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.student_profiles
    where student_profiles.id = tasks.student_id
      and student_profiles.user_id = (select auth.uid())
  )
);

create policy "tasks_delete_own"
on public.tasks for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "adapted_tasks_select_own"
on public.adapted_tasks for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "adapted_tasks_insert_own"
on public.adapted_tasks for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.tasks
    where tasks.id = adapted_tasks.task_id
      and tasks.user_id = (select auth.uid())
  )
);

create policy "adapted_tasks_update_own"
on public.adapted_tasks for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.tasks
    where tasks.id = adapted_tasks.task_id
      and tasks.user_id = (select auth.uid())
  )
);

create policy "adapted_tasks_delete_own"
on public.adapted_tasks for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "progress_events_select_own"
on public.progress_events for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "progress_events_insert_own"
on public.progress_events for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.student_profiles
    where student_profiles.id = progress_events.student_id
      and student_profiles.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.tasks
    where tasks.id = progress_events.task_id
      and tasks.user_id = (select auth.uid())
  )
);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, auth_provider, onboarding_completed, is_premium)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    case
      when new.raw_user_meta_data ->> 'role' in ('parent', 'caregiver', 'professional')
        then new.raw_user_meta_data ->> 'role'
      else null
    end,
    coalesce(new.raw_app_meta_data ->> 'provider', 'email'),
    new.raw_user_meta_data ->> 'role' in ('parent', 'caregiver', 'professional'),
    false
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    auth_provider = coalesce(public.profiles.auth_provider, excluded.auth_provider),
    updated_at = now();

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

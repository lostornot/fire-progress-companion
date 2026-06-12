-- FIRE Progress Companion Schema
-- Run this in Supabase SQL Editor

-- 1. Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default '',
  avatar_url text not null default '',
  preferred_language text not null default 'zh',
  preferred_currency text not null default 'CNY',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2. Fire plans table
create table public.fire_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  annual_spending numeric not null default 0,
  withdrawal_rate numeric not null default 0.04,
  target_amount numeric not null default 0,
  currency text not null default 'CNY',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fire_plans enable row level security;

create policy "Users can view own plans"
  on public.fire_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on public.fire_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.fire_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete own plans"
  on public.fire_plans for delete
  using (auth.uid() = user_id);

-- 3. Checkins table
create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.fire_plans on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  checkin_date date not null,
  current_net_worth numeric not null default 0,
  annual_spending numeric not null default 0,
  note text not null default '',
  created_at timestamptz not null default now()
);

alter table public.checkins enable row level security;

create policy "Users can view own checkins"
  on public.checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own checkins"
  on public.checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkins"
  on public.checkins for update
  using (auth.uid() = user_id);

create policy "Users can delete own checkins"
  on public.checkins for delete
  using (auth.uid() = user_id);

-- 4. Auto-create profile on signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  insert into public.fire_plans (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Indexes
create index idx_fire_plans_user_id on public.fire_plans(user_id);
create index idx_checkins_user_id on public.checkins(user_id);
create index idx_checkins_plan_id on public.checkins(plan_id);
create index idx_checkins_date on public.checkins(checkin_date desc);

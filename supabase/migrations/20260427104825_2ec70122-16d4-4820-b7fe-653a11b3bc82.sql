-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- CHECK INS
create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  level int not null check (level between 0 and 10),
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.check_ins enable row level security;

create policy "check_ins_select_own" on public.check_ins for select to authenticated using (auth.uid() = user_id);
create policy "check_ins_insert_own" on public.check_ins for insert to authenticated with check (auth.uid() = user_id);
create policy "check_ins_update_own" on public.check_ins for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "check_ins_delete_own" on public.check_ins for delete to authenticated using (auth.uid() = user_id);

create index check_ins_user_date_idx on public.check_ins (user_id, date desc);

-- JOURNAL ENTRIES
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

create policy "journal_select_own" on public.journal_entries for select to authenticated using (auth.uid() = user_id);
create policy "journal_insert_own" on public.journal_entries for insert to authenticated with check (auth.uid() = user_id);
create policy "journal_update_own" on public.journal_entries for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "journal_delete_own" on public.journal_entries for delete to authenticated using (auth.uid() = user_id);

create index journal_user_created_idx on public.journal_entries (user_id, created_at desc);
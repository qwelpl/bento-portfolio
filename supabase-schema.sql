create table portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  username text unique not null,
  display_name text,
  tiles jsonb default '[]',
  layout jsonb default '[]',
  theme text default 'dark',
  accent text default '#7c3aed',
  updated_at timestamptz default now()
);

alter table portfolios enable row level security;

create policy "users can read any portfolio"
  on portfolios for select using (true);

create policy "users can insert own portfolio"
  on portfolios for insert with check (auth.uid() = user_id);

create policy "users can update own portfolio"
  on portfolios for update using (auth.uid() = user_id);

create policy "users can delete own portfolio"
  on portfolios for delete using (auth.uid() = user_id);

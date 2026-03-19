-- Censly Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- BEFORE RUNNING:
-- 1. Go to Authentication → Users → Add user → create a test user
-- 2. Copy that user's UUID
-- 3. Replace '00000000-0000-0000-0000-000000000001' below with that UUID

-- 1. Categories table
create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  icon text not null default '📦',
  color text not null default '#A3A3A3',
  type text not null check (type in ('income', 'expense')),
  sort_order integer default 0,
  is_deleted boolean default false,
  created_at timestamptz default now()
);

-- 2. Transactions table
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  amount bigint not null,
  note text,
  date date not null default current_date,
  receipt_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Auto-update updated_at on transactions
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger transactions_updated_at
  before update on transactions
  for each row execute function update_updated_at();

-- 4. Enable RLS
alter table categories enable row level security;
alter table transactions enable row level security;

-- 5. RLS policies
create policy "users manage own categories"
  on categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users manage own transactions"
  on transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Storage bucket for receipts
insert into storage.buckets (id, name, public)
  values ('receipts', 'receipts', false);

create policy "users manage own receipts"
  on storage.objects for all
  using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);

-- 7. Seed default categories
-- IMPORTANT: Replace the user_id below with your actual Supabase user UUID
-- Get it from: Authentication → Users → your test user → copy the UUID
do $$
declare
  dev_user_id uuid := '00000000-0000-0000-0000-000000000001'; -- REPLACE THIS
begin
  insert into categories (user_id, name, icon, color, type, sort_order) values
    (dev_user_id, 'Makan',     '🍜', '#F87171', 'expense', 1),
    (dev_user_id, 'Transport', '🚗', '#FB923C', 'expense', 2),
    (dev_user_id, 'Belanja',   '🛍️', '#A78BFA', 'expense', 3),
    (dev_user_id, 'Tagihan',   '💡', '#60A5FA', 'expense', 4),
    (dev_user_id, 'Kesehatan', '💊', '#34D399', 'expense', 5),
    (dev_user_id, 'Hiburan',   '🎮', '#F472B6', 'expense', 6),
    (dev_user_id, 'Lainnya',   '📦', '#A3A3A3', 'expense', 7),
    (dev_user_id, 'Gaji',      '💰', '#4ADE80', 'income',  1),
    (dev_user_id, 'Freelance', '💻', '#4ADE80', 'income',  2),
    (dev_user_id, 'Lainnya',   '📦', '#A3A3A3', 'income',  3);
end $$;

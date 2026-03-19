-- Censly Database Schema v2
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
--
-- This schema uses a two-table approach for categories:
-- 1. categories_default: System default categories (read-only for users)
-- 2. categories_custom: User custom categories (CRUD by owner)
--
-- Transactions reference either table via category_id + category_source

-- ============================================================
-- STEP 1: Create categories_default table (system defaults)
-- ============================================================
CREATE TABLE categories_default (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL DEFAULT '📦',
  color text NOT NULL DEFAULT '#A3A3A3',
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- RLS: All authenticated users can read default categories
ALTER TABLE categories_default ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated users can read default categories"
  ON categories_default FOR SELECT
  TO authenticated
  USING (true);

-- Seed default categories
INSERT INTO categories_default (name, icon, color, type, sort_order) VALUES
  -- Expense categories
  ('Makan',     '🍜', '#F87171', 'expense', 1),
  ('Transport', '🚗', '#FB923C', 'expense', 2),
  ('Belanja',   '🛍️', '#A78BFA', 'expense', 3),
  ('Tagihan',   '💡', '#60A5FA', 'expense', 4),
  ('Kesehatan', '💊', '#34D399', 'expense', 5),
  ('Hiburan',   '🎮', '#F472B6', 'expense', 6),
  ('Lainnya',   '📦', '#A3A3A3', 'expense', 7),
  -- Income categories
  ('Gaji',      '💰', '#4ADE80', 'income',  1),
  ('Freelance', '💻', '#4ADE80', 'income',  2),
  ('Investasi', '📈', '#34D399', 'income',  3),
  ('Lainnya',   '📦', '#A3A3A3', 'income',  4);

-- ============================================================
-- STEP 3: Create categories custom table (user custom categories)
-- ============================================================

CREATE TABLE categories_custom (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT '📦',
  color text NOT NULL DEFAULT '#A3A3A3',
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  sort_order integer DEFAULT 100, -- Start at 100 to come after defaults
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS: Users manage their own categories
ALTER TABLE categories_custom ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own categories"
  ON categories_custom FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- STEP 4: Create transactions table
-- ============================================================

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid, -- References either categories_default or categories_custom (no FK constraint)
  category_source text NOT NULL DEFAULT 'default' CHECK (category_source IN ('default', 'custom')),
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount bigint NOT NULL,
  note text,
  date date NOT NULL DEFAULT current_date,
  receipt_url text,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: Users manage their own transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users manage own transactions"
  ON transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- STEP 5: Storage bucket for receipts
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policy if exists and recreate
DROP POLICY IF EXISTS "users manage own receipts" ON storage.objects;

CREATE POLICY "users manage own receipts"
  ON storage.objects FOR ALL
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

export type TransactionType = "income" | "expense";
export type CategorySource = "default" | "custom";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  created_at: string;
}

// Default category (system-wide, from categories_default table)
export interface CategoryDefault {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  sort_order: number;
  created_at: string;
}

// User custom category (from categories table)
export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  sort_order: number;
  is_deleted: boolean;
  created_at: string;
}

// Combined category for UI (used in selectors and display)
export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  sort_order: number;
  source: CategorySource;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  category_source: CategorySource;
  type: TransactionType;
  amount: number;
  note: string | null;
  date: string;
  receipt_url: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  category?: CategoryItem;
}

// Input types for mutations
export type CreateCategoryInput = Pick<
  Category,
  "name" | "icon" | "color" | "type"
> & {
  sort_order?: number;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface CreateTransactionInput {
  category_id: string | null;
  category_source: CategorySource;
  type: TransactionType;
  amount: number;
  date: string;
  note?: string | null;
  receipt_url?: string | null;
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>;

// Filter types for queries
export interface TransactionFilters {
  type?: TransactionType;
  category_id?: string;
  startDate?: string;
  endDate?: string;
}

export interface MonthlySummary {
  month: string;
  total_income: number;
  total_expense: number;
  balance: number;
  transaction_count: number;
}

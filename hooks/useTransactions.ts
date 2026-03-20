import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase";
import type {
  Transaction,
  TransactionFilters,
  CreateTransactionInput,
  UpdateTransactionInput,
  CategoryItem,
  TransactionType,
} from "../types";

// Query keys
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters: TransactionFilters) =>
    [...transactionKeys.lists(), filters] as const,
  monthly: (year: number, month: number) =>
    [...transactionKeys.lists(), "monthly", { year, month }] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

// Helper: Fetch all categories from both tables and create a lookup map
async function fetchCategoryMap(): Promise<Map<string, CategoryItem>> {
  const [defaultResult, customResult] = await Promise.all([
    supabase.from("categories_default").select("*"),
    supabase.from("categories_custom").select("*").eq("is_deleted", false),
  ]);

  const map = new Map<string, CategoryItem>();

  // Add default categories
  (defaultResult.data ?? []).forEach((c) => {
    map.set(c.id, {
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      type: c.type as TransactionType,
      sort_order: c.sort_order,
      source: "default",
      created_at: c.created_at,
    });
  });

  // Add custom categories
  (customResult.data ?? []).forEach((c) => {
    map.set(c.id, {
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      type: c.type as TransactionType,
      sort_order: c.sort_order,
      source: "custom",
      created_at: c.created_at,
    });
  });

  return map;
}

// Fetch transactions with optional filters
async function fetchTransactions(
  filters: TransactionFilters = {}
): Promise<Transaction[]> {
  let query = supabase
    .from("transactions")
    .select("*")
    .eq("is_deleted", false)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.type) {
    query = query.eq("type", filters.type);
  }

  if (filters.category_id) {
    query = query.eq("category_id", filters.category_id);
  }

  if (filters.startDate) {
    query = query.gte("date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("date", filters.endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[useTransactions] fetchTransactions error:", error);
    throw error;
  }

  // Fetch category map and attach category to each transaction
  const categoryMap = await fetchCategoryMap();

  const transactions: Transaction[] = (data ?? []).map((t) => ({
    ...t,
    type: t.type as TransactionType,
    category_source: t.category_source as "default" | "custom",
    category: t.category_id ? categoryMap.get(t.category_id) : undefined,
  }));

  return transactions;
}

// Fetch transactions for a specific month
async function fetchMonthlyTransactions(
  year: number,
  month: number
): Promise<Transaction[]> {
  // month is 1-indexed (1 = January)
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]; // Last day of month

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("is_deleted", false)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[useTransactions] fetchMonthlyTransactions error:", error);
    throw error;
  }

  // Fetch category map and attach category to each transaction
  const categoryMap = await fetchCategoryMap();

  const transactions: Transaction[] = (data ?? []).map((t) => ({
    ...t,
    type: t.type as TransactionType,
    category_source: t.category_source as "default" | "custom",
    category: t.category_id ? categoryMap.get(t.category_id) : undefined,
  }));

  return transactions;
}

// Fetch single transaction
async function fetchTransaction(id: string): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[useTransactions] fetchTransaction error:", error);
    throw error;
  }

  // Fetch category map and attach category
  const categoryMap = await fetchCategoryMap();

  const transaction: Transaction = {
    ...data,
    type: data.type as TransactionType,
    category_source: data.category_source as "default" | "custom",
    category: data.category_id ? categoryMap.get(data.category_id) : undefined,
  };

  return transaction;
}

// Create transaction
async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      category_id: input.category_id,
      category_source: input.category_source,
      type: input.type,
      amount: input.amount,
      date: input.date,
      note: input.note ?? null,
      receipt_url: input.receipt_url ?? null,
      is_deleted: false,
    })
    .select()
    .single();

  if (error) {
    console.error("[useTransactions] createTransaction error:", error);
    throw error;
  }

  // Fetch category map and attach category
  const categoryMap = await fetchCategoryMap();

  const transaction: Transaction = {
    ...data,
    type: data.type as TransactionType,
    category_source: data.category_source as "default" | "custom",
    category: data.category_id ? categoryMap.get(data.category_id) : undefined,
  };

  return transaction;
}

// Update transaction
async function updateTransaction({
  id,
  ...input
}: UpdateTransactionInput & { id: string }): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[useTransactions] updateTransaction error:", error);
    throw error;
  }

  // Fetch category map and attach category
  const categoryMap = await fetchCategoryMap();

  const transaction: Transaction = {
    ...data,
    type: data.type as TransactionType,
    category_source: data.category_source as "default" | "custom",
    category: data.category_id ? categoryMap.get(data.category_id) : undefined,
  };

  return transaction;
}

// Soft delete transaction
async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from("transactions")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) {
    console.error("[useTransactions] deleteTransaction error:", error);
    throw error;
  }

}

// ============ HOOKS ============

/**
 * Fetch transactions with optional filters
 */
export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => fetchTransactions(filters),
  });
}

/**
 * Fetch transactions for a specific month
 * @param year - Full year (e.g., 2024)
 * @param month - 1-indexed month (1 = January, 12 = December)
 */
export function useMonthlyTransactions(year: number, month: number) {
  return useQuery({
    queryKey: transactionKeys.monthly(year, month),
    queryFn: () => fetchMonthlyTransactions(year, month),
    enabled: year > 0 && month >= 1 && month <= 12,
  });
}

/**
 * Fetch a single transaction by ID
 */
export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => fetchTransaction(id),
    enabled: !!id,
  });
}

/**
 * Create a new transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
    onError: (error) => {
      console.error("[useCreateTransaction] onError:", error);
    },
  });
}

/**
 * Update an existing transaction
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: transactionKeys.detail(data.id),
      });
    },
    onError: (error) => {
      console.error("[useUpdateTransaction] onError:", error);
    },
  });
}

/**
 * Soft delete a transaction (sets is_deleted = true)
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
    },
    onError: (error) => {
      console.error("[useDeleteTransaction] onError:", error);
    },
  });
}

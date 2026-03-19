import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase";
import type {
  Transaction,
  TransactionFilters,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../types";
import { categoryKeys } from "./useCategories";

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

// Fetch transactions with optional filters
async function fetchTransactions(
  filters: TransactionFilters = {}
): Promise<Transaction[]> {
  let query = supabase
    .from("transactions")
    .select("*, category:categories(*)")
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

  console.log("[useTransactions] fetchTransactions result:", data);
  return data as Transaction[];
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
    .select("*, category:categories(*)")
    .eq("is_deleted", false)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[useTransactions] fetchMonthlyTransactions error:", error);
    throw error;
  }

  console.log("[useTransactions] fetchMonthlyTransactions result:", data);
  return data as Transaction[];
}

// Fetch single transaction
async function fetchTransaction(id: string): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[useTransactions] fetchTransaction error:", error);
    throw error;
  }

  console.log("[useTransactions] fetchTransaction result:", data);
  return data as Transaction;
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
      ...input,
      user_id: user.id,
      is_deleted: false,
    })
    .select("*, category:categories(*)")
    .single();

  if (error) {
    console.error("[useTransactions] createTransaction error:", error);
    throw error;
  }

  console.log("[useTransactions] createTransaction result:", data);
  return data as Transaction;
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
    .select("*, category:categories(*)")
    .single();

  if (error) {
    console.error("[useTransactions] updateTransaction error:", error);
    throw error;
  }

  console.log("[useTransactions] updateTransaction result:", data);
  return data as Transaction;
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

  console.log("[useTransactions] deleteTransaction success, id:", id);
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
    onSuccess: (data) => {
      console.log("[useCreateTransaction] onSuccess:", data);
      // Invalidate all transaction lists (including monthly)
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
      console.log("[useUpdateTransaction] onSuccess:", data);
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
      console.log("[useDeleteTransaction] onSuccess, id:", id);
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });
    },
    onError: (error) => {
      console.error("[useDeleteTransaction] onError:", error);
    },
  });
}

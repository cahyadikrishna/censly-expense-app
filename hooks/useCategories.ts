import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase";
import type {
  Category,
  TransactionType,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

// Query keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: { type?: TransactionType }) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Fetch all categories (non-deleted)
async function fetchCategories(type?: TransactionType): Promise<Category[]> {
  let query = supabase
    .from("categories")
    .select("*")
    .eq("is_deleted", false)
    .order("sort_order", { ascending: true });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[useCategories] fetchCategories error:", error);
    throw error;
  }

  console.log("[useCategories] fetchCategories result:", data);
  return data as Category[];
}

// Fetch single category
async function fetchCategory(id: string): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[useCategories] fetchCategory error:", error);
    throw error;
  }

  console.log("[useCategories] fetchCategory result:", data);
  return data as Category;
}

// Create category
async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("categories")
    .insert({
      ...input,
      user_id: user.id,
      is_deleted: false,
    })
    .select()
    .single();

  if (error) {
    console.error("[useCategories] createCategory error:", error);
    throw error;
  }

  console.log("[useCategories] createCategory result:", data);
  return data as Category;
}

// Update category
async function updateCategory({
  id,
  ...input
}: UpdateCategoryInput & { id: string }): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[useCategories] updateCategory error:", error);
    throw error;
  }

  console.log("[useCategories] updateCategory result:", data);
  return data as Category;
}

// Soft delete category
async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) {
    console.error("[useCategories] deleteCategory error:", error);
    throw error;
  }

  console.log("[useCategories] deleteCategory success, id:", id);
}

// ============ HOOKS ============

/**
 * Fetch all non-deleted categories, optionally filtered by type
 */
export function useCategories(type?: TransactionType) {
  return useQuery({
    queryKey: categoryKeys.list({ type }),
    queryFn: () => fetchCategories(type),
  });
}

/**
 * Fetch a single category by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategory(id),
    enabled: !!id,
  });
}

/**
 * Create a new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      console.log("[useCreateCategory] onSuccess:", data);
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error) => {
      console.error("[useCreateCategory] onError:", error);
    },
  });
}

/**
 * Update an existing category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      console.log("[useUpdateCategory] onSuccess:", data);
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(data.id),
      });
    },
    onError: (error) => {
      console.error("[useUpdateCategory] onError:", error);
    },
  });
}

/**
 * Soft delete a category (sets is_deleted = true)
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (_data, id) => {
      console.log("[useDeleteCategory] onSuccess, id:", id);
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) });
    },
    onError: (error) => {
      console.error("[useDeleteCategory] onError:", error);
    },
  });
}

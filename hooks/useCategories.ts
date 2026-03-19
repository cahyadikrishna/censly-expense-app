import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lib/supabase";
import type {
  CategoryDefault,
  Category,
  CategoryItem,
  TransactionType,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types";

// Query keys
export const categoryKeys = {
  all: ["categories_custom"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: { type?: TransactionType }) =>
    [...categoryKeys.lists(), filters] as const,
  defaults: () => [...categoryKeys.all, "defaults"] as const,
  custom: () => [...categoryKeys.all, "custom"] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Fetch all categories (defaults + user custom, combined)
async function fetchCategories(type?: TransactionType): Promise<CategoryItem[]> {
  // Fetch default categories
  let defaultQuery = supabase
    .from("categories_default")
    .select("*")
    .order("sort_order", { ascending: true });

  if (type) {
    defaultQuery = defaultQuery.eq("type", type);
  }

  // Fetch user custom categories
  let customQuery = supabase
    .from("categories_custom")
    .select("*")
    .eq("is_deleted", false)
    .order("sort_order", { ascending: true });

  if (type) {
    customQuery = customQuery.eq("type", type);
  }

  // Execute both queries in parallel
  const [defaultResult, customResult] = await Promise.all([
    defaultQuery,
    customQuery,
  ]);

  if (defaultResult.error) {
    console.error("[useCategories] fetchDefaultCategories error:", defaultResult.error);
    throw defaultResult.error;
  }

  if (customResult.error) {
    console.error("[useCategories] fetchCustomCategories error:", customResult.error);
    throw customResult.error; 
  }

  // Transform and combine results with source indicator
  const defaults: CategoryItem[] = (defaultResult.data ?? []).map(
    (c: CategoryDefault) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      type: c.type as TransactionType,
      sort_order: c.sort_order,
      source: "default" as const,
      created_at: c.created_at,
    })
  );

  const custom: CategoryItem[] = (customResult.data ?? []).map(
    (c: Category) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      type: c.type as TransactionType,
      sort_order: c.sort_order,
      source: "custom" as const,
      created_at: c.created_at,
    })
  );

  // Defaults first (sort_order 1-99), then custom (sort_order 100+)
  const combined = [...defaults, ...custom];
  
  console.log("[useCategories] fetchCategories result:", combined);
  return combined;
}

// Fetch single category by ID (checks both tables)
async function fetchCategory(id: string): Promise<CategoryItem | null> {
  // Try default categories first
  const { data: defaultData, error: defaultError } = await supabase
    .from("categories_default")
    .select("*")
    .eq("id", id)
    .single();

  if (defaultData) {
    const item: CategoryItem = {
      id: defaultData.id,
      name: defaultData.name,
      icon: defaultData.icon,
      color: defaultData.color,
      type: defaultData.type as TransactionType,
      sort_order: defaultData.sort_order,
      source: "default",
      created_at: defaultData.created_at,
    };
    console.log("[useCategories] fetchCategory (default) result:", item);
    return item;
  }

  // If not found in defaults, try custom categories
  const { data: customData, error: customError } = await supabase
    .from("categories_custom")
    .select("*")
    .eq("id", id)
    .single();

  if (customData) {
    const item: CategoryItem = {
      id: customData.id,
      name: customData.name,
      icon: customData.icon,
      color: customData.color,
      type: customData.type as TransactionType,
      sort_order: customData.sort_order,
      source: "custom",
      created_at: customData.created_at,
    };
    console.log("[useCategories] fetchCategory (custom) result:", item);
    return item;
  }

  console.error("[useCategories] fetchCategory not found:", id);
  return null;
}

// Create custom category (only in categories table)
async function createCategory(input: CreateCategoryInput): Promise<Category> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("categories_custom")
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

// Update custom category (only in categories_custom table)
async function updateCategory({
  id,
  ...input
}: UpdateCategoryInput & { id: string }): Promise<Category> {
  const { data, error } = await supabase
    .from("categories_custom")
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

// Soft delete custom category (only in categories_custom table)
async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from("categories_custom")
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
 * Fetch all categories (defaults + user custom), optionally filtered by type
 */
export function useCategories(type?: TransactionType) {
  return useQuery({
    queryKey: categoryKeys.list({ type }),
    queryFn: () => fetchCategories(type),
  });
}

/**
 * Fetch a single category by ID (checks both tables)
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategory(id),
    enabled: !!id,
  });
}

/**
 * Create a new custom category
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
 * Update an existing custom category
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
 * Soft delete a custom category (sets is_deleted = true)
 * Note: Default categories cannot be deleted
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

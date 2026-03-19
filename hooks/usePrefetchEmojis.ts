import { useEffect } from "react";
import { extractUniqueEmojis, prefetchEmojis } from "@lib/emojiCache";
import { useCategories } from "@hooks/useCategories";
import { useTransactions } from "@hooks/useTransactions";

export function usePrefetchEmojis() {
  const { data: categories } = useCategories("expense");
  const { data: categoriesIncome } = useCategories("income");
  const { data: transactions } = useTransactions({});

  useEffect(() => {
    const allCategories = [...(categories || []), ...(categoriesIncome || [])];
    const categoryEmojis = allCategories.map((c) => c.icon);
    const transactionEmojis = (transactions || []).map(
      (t) => t.category?.icon
    );

    const uniqueEmojis = extractUniqueEmojis([
      ...categoryEmojis,
      ...transactionEmojis,
      "📦",
    ]);

    prefetchEmojis(uniqueEmojis);
  }, [categories, categoriesIncome, transactions]);
}

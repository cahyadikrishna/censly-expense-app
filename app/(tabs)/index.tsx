import React, { useMemo, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { formatIDR } from "@lib/currency";
import { useTransactions } from "@hooks/useTransactions";
import { usePrefetchEmojis } from "@hooks/usePrefetchEmojis";
import FAB from "@components/FAB";
import EmojiText from "@components/EmojiText";
import type { Transaction } from "../../types";

export default function Home() {
  const router = useRouter();

  usePrefetchEmojis();

  const { data: transactions, isLoading } = useTransactions({});
  const recentTransactions = transactions?.slice(0, 5) ?? [];

  const totalIncome = useMemo(
    () =>
      transactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0) ?? 0,
    [transactions]
  );

  const totalExpense = useMemo(
    () =>
      transactions
        ?.filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0) ?? 0,
    [transactions]
  );

  const balance = totalIncome - totalExpense;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hari ini";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Kemarin";
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const handleTransactionPress = useCallback(
    (transaction: Transaction) => {
      router.push(`/transaction/${transaction.id}`);
    },
    [router]
  );

  const renderTransactionItem = useCallback(
    (transaction: Transaction, isLast: boolean) => (
      <TouchableOpacity
        key={transaction.id}
        className={`flex-row items-center p-4 ${!isLast ? "border-b border-gray-200" : ""}`}
        onPress={() => handleTransactionPress(transaction)}
        activeOpacity={0.7}
      >
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: (transaction.category?.color || "#A3A3A3") + "20" }}
        >
          <EmojiText
            text={transaction.category?.icon || "📦"}
            size={20}
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-medium">
            {transaction.category?.name || "Tanpa Kategori"}
          </Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            {formatDate(transaction.date)}
            {transaction.note ? ` • ${transaction.note}` : ""}
          </Text>
        </View>
        <Text
          className={`font-semibold ${
            transaction.type === "income"
              ? "text-accent-green"
              : "text-accent-red"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatIDR(transaction.amount)}
        </Text>
      </TouchableOpacity>
    ),
    [handleTransactionPress]
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="text-gray-900 text-2xl font-bold mb-6">Censly</Text>

        <View className="bg-surface rounded-2xl p-5 mb-6">
          <Text className="text-gray-500 text-sm mb-1">Saldo Total</Text>
          <Text className={`text-3xl font-bold ${balance >= 0 ? "text-gray-900" : "text-accent-red"}`}>
            {formatIDR(balance)}
          </Text>

          <View className="flex-row mt-4 gap-4">
            <View className="flex-1">
              <Text className="text-gray-500 text-xs mb-1">Pemasukan</Text>
              <Text className="text-accent-green text-lg font-semibold">
                {formatIDR(totalIncome)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-xs mb-1">Pengeluaran</Text>
              <Text className="text-accent-red text-lg font-semibold">
                {formatIDR(totalExpense)}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-900 text-lg font-semibold">
            Transaksi Terakhir~
          </Text>
          {transactions && transactions.length > 5 && (
            <TouchableOpacity onPress={() => router.push("/(tabs)/transactions")}>
              <Text className="text-accent-green text-sm">Lihat Semua</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View className="bg-surface rounded-2xl p-5 items-center py-10">
            <ActivityIndicator color="#22C55E" />
            <Text className="text-gray-500 text-sm mt-2">Tunggu bentar ya~</Text>
          </View>
        ) : recentTransactions.length > 0 ? (
          <View className="bg-surface rounded-2xl overflow-hidden">
            {recentTransactions.map((transaction, index) =>
              renderTransactionItem(transaction, index === recentTransactions.length - 1)
            )}
          </View>
        ) : (
          <View className="bg-surface rounded-2xl p-5 items-center py-10">
            <Text className="text-gray-500 text-base">
              Belum ada transaksi nih~
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              Tekan tombol + buat nambahin ya~
            </Text>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>

      <FAB />
    </SafeAreaView>
  );
}

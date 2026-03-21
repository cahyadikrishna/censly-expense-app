import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { formatIDR } from "@lib/currency";
import { useTransactions } from "@hooks/useTransactions";
import { usePrefetchEmojis } from "@hooks/usePrefetchEmojis";
import FAB from "@components/FAB";
import TransactionItem from "@components/TransactionItem";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="text-black text-2xl font-bold mb-6 tracking-tight">
          Censly
        </Text>

        <Card variant="elevated" padding="lg" className="mb-6">
          <Text className="text-sm font-semibold text-gray mb-1">
            Saldo Total
          </Text>
          <Text
            className={`text-3xl font-bold tracking-tight ${
              balance >= 0 ? "text-black" : "text-accent-red"
            }`}
          >
            {formatIDR(balance)}
          </Text>

          <View className="flex-row mt-4 gap-4">
            <View className="flex-1">
              <Text className="text-xs font-semibold text-gray mb-1">
                Pemasukan
              </Text>
              <Text className="text-lg font-semibold text-accent-green">
                {formatIDR(totalIncome)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-gray mb-1">
                Pengeluaran
              </Text>
              <Text className="text-lg font-semibold text-accent-red">
                {formatIDR(totalExpense)}
              </Text>
            </View>
          </View>
        </Card>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-black text-lg font-semibold">
            Transaksi Terakhir~
          </Text>
          {transactions && transactions.length > 5 && (
            <Button
              label="Lihat Semua"
              onPress={() => router.push("/(tabs)/transactions")}
              variant="secondary"
              size="sm"
            />
          )}
        </View>

        {isLoading ? (
          <Card variant="elevated" padding="lg" className="items-center">
            <ActivityIndicator color="#000000" />
            <Text className="text-gray text-sm mt-2">Tunggu bentar ya~</Text>
          </Card>
        ) : recentTransactions.length > 0 ? (
          <Card variant="default" padding="none" style={{borderColor: "transparent", gap: 8}}>
            {recentTransactions.map((transaction, index) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={handleTransactionPress}
                showNote
              />
            ))}
          </Card>
        ) : (
          <Card variant="elevated" padding="lg" className="items-center">
            <Text className="text-gray text-base">
              Belum ada transaksi nih~
            </Text>
            <Text className="text-light-gray text-sm mt-1">
              Tekan tombol + buat nambahin ya~
            </Text>
          </Card>
        )}

        <View className="h-20" />
      </ScrollView>

      <FAB />
    </SafeAreaView>
  );
}

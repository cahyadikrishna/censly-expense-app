import { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SectionList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "@hooks/useTransactions";
import { formatIDR } from "@lib/currency";
import TransactionItem from "@components/TransactionItem";
import FAB from "@components/FAB";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import type { Transaction, TransactionType } from "../../types";

type FilterType = "all" | TransactionType;

export default function Transactions() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: transactions, isLoading } = useTransactions({});

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    if (filter === "all") return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  const sections = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};

    filteredTransactions.forEach((transaction) => {
      const date = transaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });

    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, data]) => ({
        title: formatSectionDate(date),
        data,
      }));
  }, [filteredTransactions]);

  function formatSectionDate(dateStr: string): string {
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
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  const getDailyTotal = useCallback((data: Transaction[]) => {
    const income = data
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = data
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
  }, []);

  const handleTransactionPress = useCallback((transaction: Transaction) => {
    router.push(`/transaction/${transaction.id}`);
  }, [router]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string; data: Transaction[] } }) => {
      const dailyTotal = getDailyTotal(section.data);
      return (
        <View className="flex-row items-center justify-between py-3 bg-white">
          <Text className="text-sm font-medium text-gray">{section.title}</Text>
          <Text
            className={`text-sm font-medium ${
              dailyTotal >= 0 ? "text-accent-green" : "text-accent-red"
            }`}
          >
            {dailyTotal >= 0 ? "+" : ""}
            {formatIDR(dailyTotal)}
          </Text>
        </View>
      );
    },
    [getDailyTotal]
  );

  const renderTransaction = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionItem
        transaction={item}
        onPress={handleTransactionPress}
        showNote
      />
    ),
    [handleTransactionPress]
  );

  const FilterButton = ({
    filterType,
    label,
  }: {
    filterType: FilterType;
    label: string;
  }) => {
    const isActive = filter === filterType;
    return (
      <TouchableOpacity
        className={`px-4 py-2 rounded-lg mr-2 border-2 ${
          isActive ? "bg-black border-black" : "bg-white border-black"
        }`}
        onPress={() => setFilter(filterType)}
      >
        <Text
          className={`font-medium ${isActive ? "text-white" : "text-black"}`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-black text-2xl font-bold mb-4 tracking-tight">
          Transaksi
        </Text>

        <View className="flex-row mb-4">
          <FilterButton filterType="all" label="Semua" />
          <FilterButton filterType="expense" label="Pengeluaran" />
          <FilterButton filterType="income" label="Pemasukan" />
        </View>

        {isLoading ? (
          <Card variant="elevated" padding="lg" className="flex-1 items-center justify-center">
            <ActivityIndicator color="#000000" size="large" />
            <Text className="text-gray text-sm mt-4">Loading transaksi nih~</Text>
          </Card>
        ) : sections.length > 0 ? (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            renderSectionHeader={renderSectionHeader}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ItemSeparatorComponent={() => (
              <View className="h-px bg-black mx-4" />
            )}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        ) : (
          <Card variant="elevated" padding="lg" className="flex-1 items-center justify-center">
            <Ionicons name="receipt-outline" size={64} color="#000000" />
            <Text className="text-gray text-base mt-4">
              Belum ada transaksi nih~
            </Text>
            <Text className="text-light-gray text-sm mt-1">
              {filter !== "all"
                ? `Gada transaksi ${filter} sih`
                : "Transaksi kamu bakalan muncul di sini~"}
            </Text>
            <Button
              label="Tambah Transaksi"
              onPress={() => router.push("/transaction/add")}
              variant="primary"
              size="md"
              className="mt-6"
            />
          </Card>
        )}
      </View>

      <FAB />
    </SafeAreaView>
  );
}

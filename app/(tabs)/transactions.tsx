import { useState, useMemo } from "react";
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
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  const getDailyTotal = (data: Transaction[]) => {
    const income = data
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = data
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
  };

  const handleTransactionPress = (transaction: Transaction) => {
    router.push(`/transaction/${transaction.id}`);
  };

  const renderFilterButton = (type: FilterType, label: string) => (
    <TouchableOpacity
      className={`px-4 py-2 rounded-lg mr-2 ${
        filter === type ? "bg-accent-green" : "bg-surface"
      }`}
      onPress={() => setFilter(type)}
    >
      <Text
        className={`font-medium ${
          filter === type ? "text-white" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      className="flex-row items-center py-3"
      onPress={() => handleTransactionPress(item)}
      activeOpacity={0.7}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: (item.category?.color || "#A3A3A3") + "20" }}
      >
        <Text className="text-lg">{item.category?.icon || "📦"}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-medium">
          {item.category?.name || "Uncategorized"}
        </Text>
        {item.note && (
          <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
            {item.note}
          </Text>
        )}
      </View>
      <Text
        className={`font-semibold ${
          item.type === "income" ? "text-accent-green" : "text-accent-red"
        }`}
      >
        {item.type === "income" ? "+" : "-"}
        {formatIDR(item.amount)}
      </Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; data: Transaction[] };
  }) => {
    const dailyTotal = getDailyTotal(section.data);
    return (
      <View className="flex-row items-center justify-between py-3 bg-background">
        <Text className="text-gray-500 text-sm font-medium">
          {section.title}
        </Text>
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
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-gray-900 text-2xl font-bold mb-4">Transactions</Text>

        <View className="flex-row mb-4">
          {renderFilterButton("all", "All")}
          {renderFilterButton("expense", "Expense")}
          {renderFilterButton("income", "Income")}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#22C55E" size="large" />
            <Text className="text-gray-500 text-sm mt-4">
              Loading transactions...
            </Text>
          </View>
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
              <View className="h-px bg-gray-200" />
            )}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="receipt-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-base mt-4">
              No transactions yet
            </Text>
            <Text className="text-gray-400 text-sm mt-1">
              {filter !== "all"
                ? `No ${filter} transactions found`
                : "Your transactions will appear here"}
            </Text>
            <TouchableOpacity
              className="mt-6 bg-accent-green px-6 py-3 rounded-xl"
              onPress={() => router.push("/transaction/add")}
            >
              <Text className="text-white font-semibold">Add Transaction</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

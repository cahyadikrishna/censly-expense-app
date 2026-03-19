import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import EmojiText from "./EmojiText";
import { formatIDR } from "@lib/currency";
import type { Transaction } from "../types";

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
  showNote?: boolean;
}

function TransactionItem({ transaction, onPress, showNote = false }: TransactionItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center py-3"
      onPress={() => onPress(transaction)}
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
          {transaction.category?.name || "Uncategorized"}
        </Text>
        {showNote && transaction.note && (
          <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
            {transaction.note}
          </Text>
        )}
      </View>
      <Text
        className={`font-semibold ${
          transaction.type === "income" ? "text-accent-green" : "text-accent-red"
        }`}
      >
        {transaction.type === "income" ? "+" : "-"}
        {formatIDR(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

export default memo(TransactionItem);

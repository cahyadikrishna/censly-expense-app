import React, { memo, useCallback, useState } from "react";
import { View, Text, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import EmojiText from "./EmojiText";
import { formatIDR } from "@lib/currency";
import type { Transaction } from "../types";

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
  showNote?: boolean;
  className?: string;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const NOTION_COLORS = {
  borderDefault: "#E0E0E0",
  borderHover: "#D0D0D0",
  bgDefault: "#FFFFFF",
  bgHover: "#F9F9F9",
  bgPressed: "#F5F5F5",
  bgIcon: "#F5F5F5",
  title: "#1A1A1A",
  subtitle: "#757575",
  expense: "#E63946",
  income: "#2E7D32",
};

function TransactionItem({
  transaction,
  onPress,
  showNote = false,
  className = "",
  style,
}: TransactionItemProps) {
  const scale = useSharedValue(1);
  const [isPressed, setIsPressed] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = useCallback(() => {
    "worklet";
    scale.value = withTiming(0.98, { duration: 100 });
    setIsPressed(true);
  }, []);

  const handlePressOut = useCallback(() => {
    "worklet";
    scale.value = withTiming(1, { duration: 150 });
    setIsPressed(false);
  }, []);

  const handlePress = useCallback(() => {
    scale.value = withTiming(1, { duration: 150 });
    setIsPressed(false);
    onPress(transaction);
  }, [transaction, onPress]);

  const isIncome = transaction.type === "income";
  const amountColor = isIncome ? NOTION_COLORS.income : NOTION_COLORS.expense;

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      className={`${className}`}
      style={[
        animatedStyle,
        {
          backgroundColor: isPressed
            ? NOTION_COLORS.bgPressed
            : NOTION_COLORS.bgDefault,
          borderColor: isPressed
            ? NOTION_COLORS.borderHover
            : NOTION_COLORS.borderDefault,
          borderWidth: 2,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isPressed ? 0.06 : 0.04,
          shadowRadius: isPressed ? 8 : 4,
          elevation: isPressed ? 3 : 2,
        },
        style,
      ]}
    >
      <View className="flex-row items-center p-4 gap-4">
        <View
          className="w-14 h-14 rounded-xl items-center justify-center flex-shrink-0 border-2"
          style={{
            backgroundColor: NOTION_COLORS.bgIcon,
            borderColor: NOTION_COLORS.borderHover,
          }}
        >
          <EmojiText
            text={transaction.category?.icon || "📦"}
            size={32}
          />
        </View>

        <View className="flex-1 gap-1 min-w-0">
          <Text
            className="text-base font-semibold text-gray-900"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {transaction.category?.name || "Tanpa Kategori"}
          </Text>
          {showNote && transaction.note && (
            <Text
              className="text-sm font-normal text-gray-600"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {transaction.note}
            </Text>
          )}
        </View>

        <View className="flex-shrink-0">
          <Text
            className="text-lg font-semibold text-right"
            style={{ color: amountColor }}
            numberOfLines={1}
          >
            {isIncome ? "+" : "-"}
            {formatIDR(transaction.amount)}
          </Text>
        </View>
      </View>
    </AnimatedTouchable>
  );
}

export default memo(TransactionItem);

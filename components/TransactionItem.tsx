import React, { memo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    setIsPressed(true);
  }, []);

  const handlePressOut = useCallback(() => {
    "worklet";
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    setIsPressed(false);
  }, []);

  const handlePress = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    setIsPressed(false);
    onPress(transaction);
  }, [transaction, onPress]);

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      className={`
        flex-row items-center py-3 px-4
        ${className}
      `}
      style={[
        animatedStyle,
        isPressed && { backgroundColor: "#F9F9F9" },
        style,
      ]}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-3 border border-black"
        style={{
          backgroundColor: (transaction.category?.color || "#000000") + "15",
        }}
      >
        <EmojiText text={transaction.category?.icon || "📦"} size={20} />
      </View>
      <View className="flex-1">
        <Text className="text-black font-medium">
          {transaction.category?.name || "Tanpa Kategori"}
        </Text>
        {showNote && transaction.note && (
          <Text className="text-gray text-xs mt-0.5" numberOfLines={1}>
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
    </AnimatedTouchable>
  );
}

export default memo(TransactionItem);

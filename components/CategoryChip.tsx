import React, { memo, useCallback } from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import EmojiText from "./EmojiText";
import type { CategoryItem } from "../types";

interface CategoryChipProps {
  category: CategoryItem;
  isSelected: boolean;
  onPress: (category: CategoryItem) => void;
  className?: string;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function CategoryChip({
  category,
  isSelected,
  onPress,
  className = "",
  style,
}: CategoryChipProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = useCallback(() => {
    "worklet";
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, []);

  const handlePressOut = useCallback(() => {
    "worklet";
    scale.value = withSpring(1.01, { damping: 15, stiffness: 400 });
  }, []);

  const handlePress = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    onPress(category);
  }, [category, onPress]);

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      className={`
        mr-3 mb-3 px-4 py-3
        rounded-lg
        flex-row items-center
        border-2 border-black
        bg-white
        ${className}
      `}
      style={[
        animatedStyle,
        isSelected && { borderColor: category.color },
        !isSelected && {
          shadowColor: "#000",
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 4,
        },
        style,
      ]}
    >
      <EmojiText text={category.icon} size={20} />
      <Text className="text-black font-medium ml-2">{category.name}</Text>
    </AnimatedTouchable>
  );
}

export default memo(CategoryChip);

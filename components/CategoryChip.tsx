import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import EmojiText from "./EmojiText";
import type { CategoryItem } from "../types";

interface CategoryChipProps {
  category: CategoryItem;
  isSelected: boolean;
  onPress: (category: CategoryItem) => void;
}

function CategoryChip({ category, isSelected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      className={`mr-3 px-4 py-3 rounded-xl flex-row items-center bg-surface ${
        isSelected ? "border-2" : ""
      }`}
      style={[
        isSelected && { borderColor: category.color },
      ]}
      onPress={() => onPress(category)}
    >
      <EmojiText text={category.icon} size={20} />
      <Text className="text-gray-900 font-medium ml-2">
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

export default memo(CategoryChip);

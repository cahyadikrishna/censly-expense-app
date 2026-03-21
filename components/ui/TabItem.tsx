import React from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import type { ReactNode } from "react";

interface TabItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const COLORS = {
  active: "#1A1A1A",
  inactive: "#BDBDBD",
};

export function TabItem({
  icon,
  label,
  isActive,
  onPress,
  style,
}: TabItemProps) {
  const iconColor = isActive ? COLORS.active : COLORS.inactive;
  const textColor = isActive ? "text-gray-900" : "text-gray-400";
  const textWeight = isActive ? "font-medium" : "font-normal";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex flex-col items-center gap-1 flex-1 py-2"
      style={style}
    >
      {icon}
      <Text
        className={`text-xs transition-colors duration-150 ${textColor} ${textWeight}`}
      >
        {label}
      </Text>
      <View
        className={`w-1 h-1 bg-black rounded-full transition-opacity duration-150 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
    </TouchableOpacity>
  );
}

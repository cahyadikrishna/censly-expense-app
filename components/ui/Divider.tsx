import React, { memo } from "react";
import { View, ViewStyle } from "react-native";

type DividerVariant = "horizontal" | "vertical";

interface DividerProps {
  variant?: DividerVariant;
  className?: string;
  style?: ViewStyle;
}

export const Divider = memo<DividerProps>(
  ({ variant = "horizontal", className = "", style }) => {
    return (
      <View
        className={`
          bg-black
          ${variant === "vertical" ? "w-px h-12" : "w-full h-px"}
          ${className}
        `}
        style={style}
      />
    );
  }
);

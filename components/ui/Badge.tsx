import React, { ReactNode } from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type BadgeVariant = "default" | "success" | "error" | "warning";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
  style?: ViewStyle;
}

interface BadgeStyles {
  container: string;
  text: string;
  border: string;
  textColor: string;
}

const variantStyles: Record<BadgeVariant, BadgeStyles> = {
  default: {
    container: "bg-white",
    text: "text-black",
    border: "border-black",
    textColor: "#000000",
  },
  success: {
    container: "bg-badge-success-bg",
    text: "text-badge-success",
    border: "border-badge-success",
    textColor: "#4CAF50",
  },
  error: {
    container: "bg-badge-error-bg",
    text: "text-badge-error",
    border: "border-badge-error",
    textColor: "#FF6B6B",
  },
  warning: {
    container: "bg-badge-warning-bg",
    text: "text-badge-warning",
    border: "border-badge-warning",
    textColor: "#FFD93D",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5",
  md: "px-3 py-1.5",
  lg: "px-4 py-2",
};

const fontSizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Badge = React.memo<BadgeProps>(
  ({ label, variant = "default", size = "md", icon, className = "", style }) => {
    const scale = useSharedValue(1);
    const shadowOpacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
      "worklet";
      return {
        transform: [{ scale: scale.value }],
        shadowOpacity: shadowOpacity.value,
      };
    });

    const handlePressIn = () => {
      "worklet";
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    };

    const handlePressOut = () => {
      "worklet";
      scale.value = withSpring(1.05, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withSpring(1, { damping: 15, stiffness: 400 });
    };

    const handlePressCancel = () => {
      "worklet";
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      shadowOpacity.value = withSpring(0, { damping: 15, stiffness: 400 });
    };

    const { container, border, textColor } = variantStyles[variant];

    return (
      <AnimatedTouchable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePressCancel}
        activeOpacity={1}
        className={`
          inline-flex
          flex-row
          items-center
          gap-1
          border-2
          ${border}
          ${container}
          ${sizeStyles[size]}
          rounded-full
          ${className}
        `}
        style={[
          animatedStyle,
          {
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowRadius: 1,
            elevation: 4,
          },
          style,
        ]}
      >
        {icon}
        <Text
          className={`
            ${fontSizeStyles[size]}
            font-semibold
          `}
          style={{
            color: textColor,
          }}
        >
          {label}
        </Text>
      </AnimatedTouchable>
    );
  }
);

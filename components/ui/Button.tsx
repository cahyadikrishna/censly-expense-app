import React, { ReactNode, useCallback } from "react";
import { Text, TouchableOpacity, ViewStyle, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const variantStyles: Record<ButtonVariant, { container: string; text: string }> = {
  primary: {
    container: "bg-black border-black",
    text: "text-white",
  },
  secondary: {
    container: "bg-white border-black",
    text: "text-black",
  },
  outline: {
    container: "bg-white border-black",
    text: "text-black",
  },
};

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
  sm: {
    container: "px-4 py-2",
    text: "text-sm",
  },
  md: {
    container: "px-6 py-3.5",
    text: "text-base",
  },
  lg: {
    container: "px-8 py-4",
    text: "text-lg",
  },
};

export const Button = React.memo<ButtonProps>(
  ({
    label,
    onPress,
    disabled = false,
    loading = false,
    variant = "primary",
    size = "md",
    icon,
    className = "",
    style,
  }) => {
    const scale = useSharedValue(1);

    const animatedContainerStyle = useAnimatedStyle(() => {
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
      scale.value = withSpring(1.02, { damping: 15, stiffness: 400 });
    }, []);

    const handlePress = useCallback(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      onPress();
    }, [onPress]);

    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={disabled || loading ? undefined : handlePressIn}
        onPressOut={disabled || loading ? undefined : handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        className={`
          ${variantStyles[variant].container}
          ${sizeStyles[size].container}
          flex-row items-center justify-center gap-2
          border-[3px] rounded-lg
          ${disabled || loading ? "opacity-50" : ""}
          ${className}
        `}
        style={[
          animatedContainerStyle,
          !disabled && !loading && variant !== "primary" && {
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 8,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variantStyles[variant].text.replace("text-", "") === "white" ? "#FFFFFF" : "#000000"}
            size="small"
          />
        ) : (
          <>
            {icon}
            <Text
              className={`
                ${variantStyles[variant].text}
                ${sizeStyles[size].text}
                font-bold tracking-tight
              `}
            >
              {label}
            </Text>
          </>
        )}
      </AnimatedTouchable>
    );
  }
);

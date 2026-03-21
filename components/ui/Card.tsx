import React, { ReactNode, useCallback } from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type CardVariant = "default" | "elevated" | "interactive";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  style?: ViewStyle;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Card = React.memo<CardProps>(
  ({
    children,
    onPress,
    variant = "default",
    padding = "lg",
    className = "",
    style,
  }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      "worklet";
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePressIn = useCallback(() => {
      "worklet";
      if (variant === "interactive" || variant === "elevated") {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
      }
    }, [variant]);

    const handlePressOut = useCallback(() => {
      "worklet";
      if (variant === "interactive") {
        scale.value = withSpring(1.01, { damping: 15, stiffness: 400 });
      } else if (variant === "elevated") {
        scale.value = withSpring(1.01, { damping: 15, stiffness: 400 });
      }
    }, [variant]);

    const handlePress = useCallback(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      onPress?.();
    }, [onPress]);

    const hasShadow = variant === "elevated" || variant === "interactive";

    const content = (
      <Animated.View
        className={`
          ${paddingStyles[padding]}
          border-2 border-black
          rounded-xl
          bg-white
          ${className}
        `}
        style={[
          animatedStyle,
          hasShadow && {
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 8,
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    );

    if (onPress) {
      return (
        <AnimatedTouchable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={variant === "default"}
        >
          {content}
        </AnimatedTouchable>
      );
    }

    return content;
  }
);

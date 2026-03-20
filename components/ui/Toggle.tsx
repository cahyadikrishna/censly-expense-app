import React, { useCallback } from "react";
import { TouchableOpacity, ViewStyle, Easing } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

interface ToggleProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: ViewStyle;
}

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const DOT_SIZE = 20;
const BORDER_WIDTH = 2;
const DOT_OFFSET = 3;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Toggle = React.memo<ToggleProps>(
  ({ isActive, onToggle, disabled = false, className = "", style }) => {
    const progress = useSharedValue(isActive ? 1 : 0);
    const shadowOpacity = useSharedValue(0);

    const toggle = useCallback(() => {
      if (!disabled) {
        const newValue = !isActive;
        progress.value = withTiming(newValue ? 1 : 0, {
          duration: 200,
          easing: Easing.out(Easing.ease),
        });
        onToggle(newValue);
      }
    }, [isActive, disabled, onToggle]);

    const handlePressIn = useCallback(() => {
      if (!disabled) {
        shadowOpacity.value = withTiming(1, { duration: 150 });
      }
    }, [disabled]);

    const handlePressOut = useCallback(() => {
      if (!disabled) {
        shadowOpacity.value = withTiming(0, { duration: 200 });
      }
    }, [disabled]);

    const animatedTrackStyle = useAnimatedStyle(() => {
      "worklet";
      return {
        backgroundColor: interpolateColor(
          progress.value,
          [0, 1],
          ["#FFFFFF", "#000000"]
        ),
      };
    });

    const animatedDotStyle = useAnimatedStyle(() => {
      "worklet";
      const leftPosition = DOT_OFFSET;
      const rightPosition = TRACK_WIDTH - DOT_SIZE - DOT_OFFSET;
      const translateX = leftPosition + progress.value * (rightPosition - leftPosition);

      return {
        transform: [{ translateX }],
        backgroundColor: interpolateColor(
          progress.value,
          [0, 1],
          ["#000000", "#FFFFFF"]
        ),
      };
    });

    const animatedContainerStyle = useAnimatedStyle(() => {
      "worklet";
      return {
        shadowOpacity: shadowOpacity.value,
      };
    });

    return (
      <AnimatedTouchable
        onPress={toggle}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={1}
        className={`
          relative
          border-2 border-black
          ${disabled ? "opacity-50" : ""}
          ${className}
        `}
        style={[
          animatedContainerStyle,
          {
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: 14,
          },
          {
            shadowColor: "#000",
            shadowOffset: { width: 3, height: 3 },
            shadowRadius: 1,
            elevation: 4,
          },
          animatedTrackStyle,
          style,
        ]}
      >
        <Animated.View
          style={[
            animatedDotStyle,
            {
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              top: (TRACK_HEIGHT - DOT_SIZE - BORDER_WIDTH * 2) / 2,
            },
          ]}
        />
      </AnimatedTouchable>
    );
  }
);

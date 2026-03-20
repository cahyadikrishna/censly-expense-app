import React, { useCallback } from "react";
import { TextInput, TextInputProps, View, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

type InputVariant = "default" | "error" | "success";

interface InputFieldProps extends Omit<TextInputProps, "style"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: InputVariant;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
  style?: ViewStyle;
}

const variantColors: Record<InputVariant, string> = {
  default: "#000000",
  error: "#FF6B6B",
  success: "#4CAF50",
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const InputField = React.memo<InputFieldProps>(
  ({
    value,
    onChangeText,
    placeholder = "Enter text...",
    disabled = false,
    variant = "default",
    multiline = false,
    numberOfLines = 1,
    className = "",
    style,
    ...props
  }) => {
    const borderColor = useSharedValue(variantColors[variant]);
    const ringOpacity = useSharedValue(0);
    const bgOpacity = useSharedValue(0);
    const shadowOpacity = useSharedValue(0);

    const animatedContainerStyle = useAnimatedStyle(() => {
      "worklet";
      return {
        borderColor: borderColor.value,
        backgroundColor:
          bgOpacity.value === 0 ? "#FFFFFF" : "#F9F9F9",
        shadowOpacity: shadowOpacity.value,
      };
    });

    const animatedRingStyle = useAnimatedStyle(() => {
      "worklet";
      return {
        opacity: ringOpacity.value,
      };
    });

    const handleFocus = useCallback(() => {
      "worklet";
      borderColor.value = withTiming(variantColors[variant], {
        duration: 150,
      });
      ringOpacity.value = withTiming(1, { duration: 150 });
      shadowOpacity.value = withTiming(1, { duration: 200 });
      bgOpacity.value = withTiming(1, { duration: 200 });
    }, [variant]);

    const handleBlur = useCallback(() => {
      "worklet";
      borderColor.value = withTiming(variantColors[variant], {
        duration: 150,
      });
      ringOpacity.value = withTiming(0, { duration: 150 });
      shadowOpacity.value = withTiming(0, { duration: 200 });
      bgOpacity.value = withTiming(0, { duration: 200 });
    }, [variant]);

    const borderColorHex = variantColors[variant];

    return (
      <View className="w-full">
        <Animated.View
          className={`
            relative
            w-full
            ${disabled ? "opacity-50" : ""}
            ${className}
          `}
          style={[
            animatedContainerStyle,
            {
              borderWidth: 2,
              borderRadius: 8,
            },
            !disabled && {
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 4 },
              shadowRadius: 2,
              elevation: 8,
            },
            style,
          ]}
        >
          <Animated.View
            className="absolute -inset-1 rounded-lg"
            style={[
              animatedRingStyle,
              {
                borderWidth: 2,
                borderColor: borderColorHex,
              },
            ]}
          />

          <AnimatedTextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="#999999"
            editable={!disabled}
            multiline={multiline}
            numberOfLines={numberOfLines}
            textAlignVertical={multiline ? "top" : "center"}
            className={`
              w-full
              px-4 py-3
              text-base text-black
              ${multiline ? `min-h-[${numberOfLines * 24}]` : ""}
            `}
            style={[
              multiline && {
                minHeight: numberOfLines * 24,
                paddingTop: 12,
                paddingBottom: 12,
              },
            ]}
            {...props}
          />
        </Animated.View>
      </View>
    );
  }
);

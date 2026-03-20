import React, { useCallback, useRef } from "react";
import { TextInput, TextInputProps, View, ViewStyle, Animated } from "react-native";

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
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}

const variantColors: Record<InputVariant, string> = {
  default: "#000000",
  error: "#FF6B6B",
  success: "#4CAF50",
};

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
    onFocus,
    onBlur,
    ...props
  }) => {
    // Use a ref for the container view so we can imperatively update styles
    // without triggering a React re-render (which causes the focus reset)
    const containerRef = useRef<View>(null);
    const borderColor = variantColors[variant];

    const handleFocus = useCallback((e: any) => {
      containerRef.current?.setNativeProps({
        style: {
          backgroundColor: "#F9F9F9",
          shadowColor: "#000",
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 8,
        },
      });
      onFocus?.(e);
    }, [onFocus]);

    const handleBlur = useCallback((e: any) => {
      containerRef.current?.setNativeProps({
        style: {
          backgroundColor: "#FFFFFF",
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
      });
      onBlur?.(e);
    }, [onBlur]);

    return (
      <View className="w-full">
        <View
          ref={containerRef}
          className={`
            relative w-full
            ${disabled ? "opacity-50" : ""}
            ${className}
          `}
          style={[
            {
              borderWidth: 2,
              borderRadius: 8,
              borderColor: borderColor,
              backgroundColor: "#FFFFFF",
            },
            style,
          ]}
        >
          <TextInput
            {...props}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="#999999"
            editable={!disabled}
            multiline={multiline}
            numberOfLines={numberOfLines}
            className={`
              px-4
              ${multiline ? "py-3" : "h-11"}
              text-base text-black
            `}
            style={
              multiline
                ? {
                    minHeight: numberOfLines * 24,
                    paddingTop: 12,
                    paddingBottom: 12,
                    textAlignVertical: "top" as const,
                  }
                : {
                    height: 44,
                    textAlignVertical: "center" as const,
                  }
            }
          />
        </View>
      </View>
    );
  }
);
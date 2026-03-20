import React, { useState, useCallback } from "react";
import { TextInput, TextInputProps, View, ViewStyle } from "react-native";

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
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback((e: any) => {
      setIsFocused(true);
      props.onFocus?.(e);
    }, [props]);

    const handleBlur = useCallback((e: any) => {
      setIsFocused(false);
      props.onBlur?.(e);
    }, [props]);

    const borderColor = variantColors[variant];
    const showFocusRing = isFocused;

    return (
      <View className="w-full">
        <View
          className={`
            relative
            w-full
            ${disabled ? "opacity-50" : ""}
            ${className}
          `}
          style={[
            {
              borderWidth: 2,
              borderRadius: 8,
              borderColor: borderColor,
              backgroundColor: isFocused ? "#F9F9F9" : "#FFFFFF",
            },
            isFocused && {
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 1,
              shadowRadius: 0,
              elevation: 8,
            },
            style,
          ]}
        >
          {showFocusRing && (
            <View
              className="absolute -inset-1 rounded-lg"
              style={{
                borderWidth: 2,
                borderColor: borderColor,
              }}
            />
          )}

          <TextInput
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
        </View>
      </View>
    );
  }
);

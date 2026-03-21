import React from "react";
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
    const borderColor = variantColors[variant];

    return (
      <View
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
    );
  }
);

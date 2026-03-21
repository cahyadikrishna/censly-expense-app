import React from "react";
import { Text, View, StyleSheet, Pressable, ViewStyle } from "react-native";
import type { TabTriggerSlotProps } from "expo-router/ui";

const COLORS = {
  active: "#1A1A1A",
  inactive: "#BDBDBD",
};

interface TabButtonProps extends TabTriggerSlotProps {
  label: string;
  icon: React.ReactNode;
}

export function TabButton({ label, icon, isFocused, ...props }: TabButtonProps) {
  const iconColor = isFocused ? COLORS.active : COLORS.inactive;
  
  const coloredIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, { color: iconColor })
    : icon;

  return (
    <Pressable {...props} style={styles.tab}>
      <View style={styles.iconContainer}>{coloredIcon}</View>
      <Text
        style={[
          styles.label,
          isFocused ? styles.labelActive : styles.labelInactive,
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.dot,
          isFocused ? styles.dotActive : styles.dotInactive,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
  labelActive: {
    color: COLORS.active,
    fontWeight: "500",
  },
  labelInactive: {
    color: COLORS.inactive,
    fontWeight: "400",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  dotActive: {
    backgroundColor: "#1A1A1A",
    opacity: 1,
  },
  dotInactive: {
    backgroundColor: "#1A1A1A",
    opacity: 0,
  },
});

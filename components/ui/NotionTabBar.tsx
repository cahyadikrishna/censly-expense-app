import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter, usePathname } from "expo-router";
import type { Tab } from "./TabBar";

const COLORS = {
  active: "#1A1A1A",
  inactive: "#BDBDBD",
};

export function NotionTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const label = options.tabBarLabel ?? options.title ?? route.name;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
            >
              {typeof options.tabBarIcon === "function" ? (
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? COLORS.active : COLORS.inactive,
                  size: 24,
                })
              ) : (
                <View style={styles.iconPlaceholder} />
              )}
              <Text
                style={[
                  styles.label,
                  isFocused ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {typeof label === "string" ? label : ""}
              </Text>
              <View
                style={[
                  styles.dot,
                  isFocused ? styles.dotActive : styles.dotInactive,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
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

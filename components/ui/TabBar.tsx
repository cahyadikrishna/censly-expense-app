import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabItem } from "./TabItem";
import type { ReactNode } from "react";

export interface Tab {
  key: string;
  label: string;
  icon: (color: string) => ReactNode;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (key: string) => void;
}

const COLORS = {
  active: "#1A1A1A",
  inactive: "#BDBDBD",
};

export function TabBar({ tabs, activeTab, onTabPress }: TabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} className="bg-white border-t border-gray-200">
      <View className="flex flex-row justify-around items-end pt-3 pb-5 px-0">
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            icon={tab.icon(activeTab === tab.key ? COLORS.active : COLORS.inactive)}
            label={tab.label}
            isActive={activeTab === tab.key}
            onPress={() => onTabPress(tab.key)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

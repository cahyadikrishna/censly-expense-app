import { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface FABMenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function FAB() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: FABMenuItem[] = [
    {
      label: "Add Transaction",
      icon: "add-circle-outline",
      onPress: () => {
        setIsOpen(false);
        router.push("/transaction/add");
      },
    },
    {
      label: "Scan Invoice",
      icon: "scan-outline",
      onPress: () => {
        setIsOpen(false);
        // TODO: Implement scan invoice
        console.log("Scan invoice - not implemented yet");
      },
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <Pressable
          className="absolute inset-0 bg-black/50"
          onPress={() => setIsOpen(false)}
        />
      )}

      {/* FAB Container */}
      <View className="absolute bottom-24 right-5">
        {/* Menu Items */}
        {isOpen && (
          <View className="mb-3">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-end mb-3"
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View className="bg-surface px-4 py-2 rounded-lg mr-3">
                  <Text className="text-white font-medium">{item.label}</Text>
                </View>
                <View className="w-12 h-12 rounded-full bg-surface items-center justify-center">
                  <Ionicons name={item.icon} size={24} color="#4ADE80" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Main FAB Button */}
        <TouchableOpacity
          className={`w-14 h-14 rounded-full items-center justify-center self-end ${
            isOpen ? "bg-surface" : "bg-accent-green"
          }`}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isOpen ? "close" : "add"}
            size={28}
            color={isOpen ? "#F87171" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

import { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Pressable,
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
        console.log("Scan invoice - not implemented yet");
      },
    },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <Pressable
          className="absolute inset-0 bg-black/20"
          onPress={() => setIsOpen(false)}
        />
      )}

      <View className="absolute bottom-24 right-5">
        {isOpen && (
          <View className="mb-3">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-end mb-3"
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View className="bg-white px-4 py-2 rounded-lg mr-3 shadow-sm">
                  <Text className="text-gray-900 font-medium">{item.label}</Text>
                </View>
                <View className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-md">
                  <Ionicons name={item.icon} size={24} color="#22C55E" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          className={`w-14 h-14 rounded-full items-center justify-center self-end shadow-lg ${
            isOpen ? "bg-gray-100" : "bg-accent-green"
          }`}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isOpen ? "close" : "add"}
            size={28}
            color={isOpen ? "#EF4444" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

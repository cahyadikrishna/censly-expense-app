import { useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface FABMenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function FAB() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuScale = useSharedValue(1);
  const mainScale = useSharedValue(1);

  const menuItems: FABMenuItem[] = [
    {
      label: "Tambah Transaksi",
      icon: "add-circle-outline",
      onPress: () => {
        setIsOpen(false);
        router.push("/transaction/add");
      },
    },
    {
      label: "Scan Invoice",
      icon: "scan-outline",
      onPress: async () => {
        setIsOpen(false);

        Alert.alert("Scan Struk", "Pilih sumber struk:", [
          {
            text: "Ambil Foto",
            onPress: async () => {
              const { status } = await ImagePicker.requestCameraPermissionsAsync();
              if (status !== "granted") {
                Alert.alert(
                  "Izin Diperlukan",
                  "Censly butuh akses kamera buat scan struk."
                );
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"],
                quality: 0.8,
                allowsEditing: true,
              });

              if (!result.canceled && result.assets[0]) {
                router.push({
                  pathname: "/transaction/scan-result",
                  params: { uri: result.assets[0].uri },
                });
              }
            },
          },
          {
            text: "Pilih dari Galeri",
            onPress: async () => {
              const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== "granted") {
                Alert.alert(
                  "Izin Diperlukan",
                  "Censly butuh akses galeri buat pilih struk."
                );
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 0.8,
                allowsEditing: true,
              });

              if (!result.canceled && result.assets[0]) {
                router.push({
                  pathname: "/transaction/scan-result",
                  params: { uri: result.assets[0].uri },
                });
              }
            },
          },
          { text: "Batal", style: "cancel" },
        ]);
      },
    },
  ];

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      menuScale.value = withSpring(1, { damping: 15, stiffness: 400 });
      mainScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  }, [isOpen]);

  const handleMainPressIn = useCallback(() => {
    mainScale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  }, []);

  const handleMainPressOut = useCallback(() => {
    if (!isOpen) {
      mainScale.value = withSpring(1.02, { damping: 15, stiffness: 400 });
    }
  }, [isOpen]);

  const animatedMainStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ scale: mainScale.value }],
    };
  });

  const animatedMenuStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ scale: menuScale.value }],
    };
  });

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
          <Animated.View className="mb-3 items-end" style={animatedMenuStyle}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-end mb-3"
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <View className="bg-white px-4 py-2 rounded-lg mr-3 border-2 border-black">
                  <Text className="text-black font-medium">{item.label}</Text>
                </View>
                <View style={styles.menuItemShadow}>
                  <Ionicons name={item.icon} size={24} color="#000000" />
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        <View className="flex-row justify-end">
          <AnimatedTouchable
            className="w-14 h-14 rounded-full items-center justify-center border-[3px] border-black"
            onPress={toggleMenu}
            onPressIn={handleMainPressIn}
            onPressOut={handleMainPressOut}
            activeOpacity={1}
            style={[
              animatedMainStyle,
              isOpen ? { backgroundColor: "#FFFFFF" } : { backgroundColor: "#000000" }
            ]}
          >
            <Ionicons
              name={isOpen ? "close" : "add"}
              size={28}
              color={isOpen ? "#000000" : "#FFFFFF"}
            />
          </AnimatedTouchable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  menuItemShadow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
});

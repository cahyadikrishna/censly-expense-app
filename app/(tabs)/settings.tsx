import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@stores/authStore";

interface MenuRowProps {
  icon: string;
  label: string;
  value?: string;
  badge?: string;
  showChevron?: boolean;
  onPress?: () => void;
}

function MenuRow({ icon, label, value, badge, showChevron = false, onPress }: MenuRowProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center py-4 px-1"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center mr-3">
        <Ionicons name={icon as any} size={18} color="#6B7280" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 text-base">{label}</Text>
      </View>
      {value && <Text className="text-gray-500 text-sm mr-2">{value}</Text>}
      {badge && (
        <View className="bg-accent-green/10 px-2 py-0.5 rounded-full mr-2">
          <Text className="text-accent-green text-xs font-medium">{badge}</Text>
        </View>
      )}
      {showChevron && <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />}
    </TouchableOpacity>
  );
}

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
}

function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2 ml-1">
        {title}
      </Text>
      <View className="bg-surface rounded-2xl px-4">{children}</View>
    </View>
  );
}

export default function Settings() {
  const { user, signOut } = useAuthStore();

  const displayName = (user?.user_metadata?.full_name as string) || "User";
  const email = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text className="text-gray-900 text-2xl font-bold mb-6">Pengaturan</Text>

        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={require("../../assets/icon.png")}
              className="w-20 h-20 rounded-2xl"
              resizeMode="cover"
            />
            <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent-green rounded-full items-center justify-center border-2 border-background">
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
          </View>
          <Text className="text-gray-900 text-lg font-semibold mt-3">{displayName}</Text>
          <Text className="text-gray-500 text-sm mt-0.5">{email}</Text>
        </View>

        <MenuSection title="Akun">
          <MenuRow icon="person-outline" label="Profil" showChevron />
          <View className="h-px bg-gray-200 mx-1" />
          <MenuRow icon="mail-outline" label="Email" value={email} />
        </MenuSection>

        <MenuSection title="Preferensi">
          <MenuRow icon="color-palette-outline" label="Tema" badge="Segera" />
          <View className="h-px bg-gray-200 mx-1" />
          <MenuRow icon="notifications-outline" label="Notifikasi" badge="Segera" />
        </MenuSection>

        <MenuSection title="Tentang">
          <MenuRow icon="information-circle-outline" label="Versi App" value="1.0.0" />
          <View className="h-px bg-gray-200 mx-1" />
          <MenuRow icon="shield-checkmark-outline" label="Kebijakan Privasi" showChevron />
          <View className="h-px bg-gray-200 mx-1" />
          <MenuRow icon="document-text-outline" label="Syarat & Ketentuan" showChevron />
        </MenuSection>

        <TouchableOpacity
          onPress={signOut}
          className="bg-accent-red/10 rounded-2xl py-4 items-center mt-6"
          activeOpacity={0.7}
        >
          <Text className="text-accent-red text-base font-semibold">Keluar</Text>
        </TouchableOpacity>

        <View className="mt-auto pt-6 pb-2 items-center">
          <Text className="text-gray-400 text-xs">Censly v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

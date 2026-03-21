import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@stores/authStore";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { Badge } from "@components/ui/Badge";
import { Divider } from "@components/ui/Divider";

interface MenuRowProps {
  icon: string;
  label: string;
  value?: string;
  badge?: string;
  showChevron?: boolean;
  onPress?: () => void;
}

function MenuRow({
  icon,
  label,
  value,
  badge,
  showChevron = false,
  onPress,
}: MenuRowProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center py-4 px-1"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View className="w-8 h-8 rounded-lg bg-off-white items-center justify-center mr-3 border border-black">
        <Ionicons name={icon as any} size={18} color="#000000" />
      </View>
      <View className="flex-1">
        <Text className="text-black text-base font-medium">{label}</Text>
      </View>
      {value && (
        <Text className="text-gray text-sm mr-2">{value}</Text>
      )}
      {badge && (
        <Badge label={badge} size="sm" className="mr-2" />
      )}
      {showChevron && (
        <Ionicons name="chevron-forward" size={16} color="#666666" />
      )}
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
      <Text className="text-xs font-semibold text-gray uppercase tracking-wider mb-2 ml-1">
        {title}
      </Text>
      <Card padding="none" className="px-4">{children}</Card>
    </View>
  );
}

export default function Settings() {
  const { user, signOut } = useAuthStore();

  const displayName =
    (user?.user_metadata?.full_name as string) || "User";
  const email = user?.email || "";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-black text-2xl font-bold mb-6 tracking-tight">
          Pengaturan
        </Text>

        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={require("../../assets/icon.png")}
              className="w-20 h-20 rounded-2xl border-2 border-black"
              resizeMode="cover"
            />
            <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-black rounded-full items-center justify-center border-2 border-white">
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            </View>
          </View>
          <Text className="text-black text-lg font-semibold mt-3">
            {displayName}
          </Text>
          <Text className="text-gray text-sm mt-0.5">{email}</Text>
        </View>

        <MenuSection title="Akun">
          <MenuRow icon="person-outline" label="Profil" showChevron />
          <Divider className="mx-1" />
          <MenuRow icon="mail-outline" label="Email" value={email} />
        </MenuSection>

        <MenuSection title="Preferensi">
          <MenuRow icon="color-palette-outline" label="Tema" badge="Segera" />
          <Divider className="mx-1" />
          <MenuRow
            icon="notifications-outline"
            label="Notifikasi"
            badge="Segera"
          />
        </MenuSection>

        <MenuSection title="Tentang">
          <MenuRow icon="information-circle-outline" label="Versi App" value="1.0.0" />
          <Divider className="mx-1" />
          <MenuRow icon="shield-checkmark-outline" label="Kebijakan Privasi" showChevron />
          <Divider className="mx-1" />
          <MenuRow
            icon="document-text-outline"
            label="Syarat & Ketentuan"
            showChevron
          />
        </MenuSection>

        <Button
          label="Keluar"
          onPress={signOut}
          variant="outline"
          size="lg"
          className="mt-6"
        />

        <View className="mt-auto pt-6 pb-2 items-center">
          <Text className="text-light-gray text-xs">Censly v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

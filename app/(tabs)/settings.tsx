import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@stores/authStore";

export default function Settings() {
  const { user, signOut } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-white text-2xl font-bold mb-6">Settings</Text>

        {user && (
          <View className="bg-surface rounded-2xl p-5 mb-4">
            <Text className="text-white text-base font-semibold">
              {user.user_metadata?.full_name ?? "User"}
            </Text>
            <Text className="text-gray-400 text-sm mt-1">{user.email}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={signOut}
          className="bg-accent-red/20 rounded-2xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-accent-red text-base font-semibold">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

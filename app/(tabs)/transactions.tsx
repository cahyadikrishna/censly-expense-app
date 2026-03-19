import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Transactions() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pt-4">
        <Text className="text-white text-2xl font-bold mb-6">
          Transactions
        </Text>

        <View className="bg-surface rounded-2xl p-5 items-center py-10">
          <Text className="text-gray-400 text-base">
            No transactions yet
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Your transactions will appear here
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

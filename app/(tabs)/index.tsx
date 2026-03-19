import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatIDR } from "@lib/currency";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="text-white text-2xl font-bold mb-6">Censly</Text>

        {/* Balance Card */}
        <View className="bg-surface rounded-2xl p-5 mb-6">
          <Text className="text-gray-400 text-sm mb-1">Total Balance</Text>
          <Text className="text-white text-3xl font-bold">
            {formatIDR(15000000)}
          </Text>

          <View className="flex-row mt-4 gap-4">
            <View className="flex-1">
              <Text className="text-gray-400 text-xs mb-1">Income</Text>
              <Text className="text-accent-green text-lg font-semibold">
                {formatIDR(20000000)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-xs mb-1">Expenses</Text>
              <Text className="text-accent-red text-lg font-semibold">
                {formatIDR(5000000)}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <Text className="text-white text-lg font-semibold mb-4">
          Recent Transactions
        </Text>
        <View className="bg-surface rounded-2xl p-5 items-center py-10">
          <Text className="text-gray-400 text-base">
            No transactions yet
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Start tracking your expenses
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

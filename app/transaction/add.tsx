import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useCategories } from "@hooks/useCategories";
import { useCreateTransaction } from "@hooks/useTransactions";
import { formatIDRInput, parseIDR } from "@lib/currency";
import CategoryChip from "@components/CategoryChip";
import type { TransactionType, CategoryItem } from "../../types";

export default function AddTransaction() {
  const router = useRouter();
  const createTransaction = useCreateTransaction();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(
    null
  );
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useCategories(type);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setSelectedCategory(null);
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatIDRInput(text);
    setAmount(formatted);
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDisplayDate = (d: Date) => {
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isValid = parseIDR(amount) > 0 && selectedCategory !== null;

  const handleSubmit = () => {
    if (!isValid || !selectedCategory) return;

    createTransaction.mutate(
      {
        type,
        amount: parseIDR(amount),
        category_id: selectedCategory.id,
        category_source: selectedCategory.source,
        date: date.toISOString().split("T")[0],
        note: note.trim() || null,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
          <View className="flex-row bg-surface rounded-xl p-1 mt-4">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${
                type === "expense" ? "bg-accent-red" : ""
              }`}
              onPress={() => handleTypeChange("expense")}
            >
              <Text
                className={`text-center font-semibold ${
                  type === "expense" ? "text-white" : "text-gray-500"
                }`}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${
                type === "income" ? "bg-accent-green" : ""
              }`}
              onPress={() => handleTypeChange("income")}
            >
              <Text
                className={`text-center font-semibold ${
                  type === "income" ? "text-white" : "text-gray-500"
                }`}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <Text className="text-gray-500 text-sm mb-2">Amount</Text>
            <View className="flex-row items-center bg-surface rounded-xl px-4 py-3">
              <Text className="text-gray-900 text-2xl font-bold mr-2">Rp</Text>
              <TextInput
                className="flex-1 text-gray-900 text-2xl font-bold"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
              />
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-gray-500 text-sm mb-2">Category</Text>
            {categoriesLoading ? (
              <View className="bg-surface rounded-xl p-4 items-center">
                <ActivityIndicator color="#22C55E" />
              </View>
            ) : categories && categories.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {categories.map((category) => (
                  <CategoryChip
                    key={category.id}
                    category={category}
                    isSelected={selectedCategory?.id === category.id}
                    onPress={setSelectedCategory}
                  />
                ))}
              </ScrollView>
            ) : (
              <View className="bg-surface rounded-xl p-4 items-center">
                <Text className="text-gray-500">No categories available</Text>
              </View>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-gray-500 text-sm mb-2">Date</Text>
            <TouchableOpacity
              className="bg-surface rounded-xl px-4 py-4"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-gray-900 text-base">
                {formatDisplayDate(date)}
              </Text>
            </TouchableOpacity>
            {(showDatePicker || Platform.OS === "ios") && (
              <View
                className={`${
                  Platform.OS === "ios" ? "mt-2" : ""
                } bg-surface rounded-xl overflow-hidden`}
              >
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              </View>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-gray-500 text-sm mb-2">Note (Optional)</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-4 text-gray-900 text-base"
              placeholder="Add a note..."
              placeholderTextColor="#9CA3AF"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View className="h-24" />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 bg-background">
          <TouchableOpacity
            className={`py-4 rounded-xl ${
              isValid && !createTransaction.isPending
                ? type === "expense"
                  ? "bg-accent-red"
                  : "bg-accent-green"
                : "bg-gray-300"
            }`}
            onPress={handleSubmit}
            disabled={!isValid || createTransaction.isPending}
          >
            {createTransaction.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Add Transaction
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

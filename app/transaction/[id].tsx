import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "@hooks/useCategories";
import {
  useTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@hooks/useTransactions";
import { formatIDRInput, parseIDR, formatIDR } from "@lib/currency";
import type { TransactionType, CategoryItem } from "../../types";

export default function EditTransaction() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch existing transaction
  const { data: transaction, isLoading: transactionLoading } = useTransaction(
    id || ""
  );
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

  // Form state
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(
    null
  );
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch categories based on selected type
  const { data: categories, isLoading: categoriesLoading } = useCategories(type);

  // Initialize form with transaction data
  useEffect(() => {
    if (transaction && !isInitialized) {
      setType(transaction.type);
      setAmount(formatIDRInput(transaction.amount.toString()));
      setDate(new Date(transaction.date));
      setNote(transaction.note || "");
      setIsInitialized(true);
    }
  }, [transaction, isInitialized]);

  // Set selected category when categories load and transaction is available
  useEffect(() => {
    if (
      transaction &&
      categories &&
      categories.length > 0 &&
      !selectedCategory
    ) {
      const category = categories.find((c) => c.id === transaction.category_id);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [transaction, categories, selectedCategory]);

  // Reset selected category when type changes (only after initialization)
  const handleTypeChange = (newType: TransactionType) => {
    if (newType !== type) {
      setType(newType);
      setSelectedCategory(null);
    }
  };

  // Handle amount input with IDR formatting
  const handleAmountChange = (text: string) => {
    const formatted = formatIDRInput(text);
    setAmount(formatted);
  };

  // Handle date change
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

  // Format date for display
  const formatDisplayDate = (d: Date) => {
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Validate form
  const isValid = parseIDR(amount) > 0 && selectedCategory !== null;

  // Handle form submission
  const handleSubmit = () => {
    if (!isValid || !selectedCategory || !id) return;

    updateTransaction.mutate(
      {
        id,
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

  // Handle delete
  const handleDelete = () => {
    if (!id) return;

    deleteTransaction.mutate(id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.back();
      },
    });
  };

  // Loading state
  if (transactionLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator color="#4ADE80" size="large" />
        <Text className="text-gray-400 mt-4">Loading transaction...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (!transaction && !transactionLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-5">
        <Ionicons name="alert-circle-outline" size={64} color="#F87171" />
        <Text className="text-white text-lg font-semibold mt-4">
          Transaction not found
        </Text>
        <TouchableOpacity
          className="mt-6 bg-surface px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
          {/* Type Toggle */}
          <View className="flex-row bg-surface rounded-xl p-1 mt-4">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg ${
                type === "expense" ? "bg-accent-red" : ""
              }`}
              onPress={() => handleTypeChange("expense")}
            >
              <Text
                className={`text-center font-semibold ${
                  type === "expense" ? "text-white" : "text-gray-400"
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
                  type === "income" ? "text-white" : "text-gray-400"
                }`}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View className="mt-6">
            <Text className="text-gray-400 text-sm mb-2">Amount</Text>
            <View className="flex-row items-center bg-surface rounded-xl px-4 py-3">
              <Text className="text-white text-2xl font-bold mr-2">Rp</Text>
              <TextInput
                className="flex-1 text-white text-2xl font-bold"
                placeholder="0"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                value={amount}
                onChangeText={handleAmountChange}
              />
            </View>
          </View>

          {/* Category Selection */}
          <View className="mt-6">
            <Text className="text-gray-400 text-sm mb-2">Category</Text>
            {categoriesLoading ? (
              <View className="bg-surface rounded-xl p-4 items-center">
                <ActivityIndicator color="#4ADE80" />
              </View>
            ) : categories && categories.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className={`mr-3 px-4 py-3 rounded-xl flex-row items-center ${
                      selectedCategory?.id === category.id
                        ? "bg-surface border-2"
                        : "bg-surface"
                    }`}
                    style={{
                      borderColor:
                        selectedCategory?.id === category.id
                          ? category.color
                          : "transparent",
                    }}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text className="text-xl mr-2">{category.icon}</Text>
                    <Text className="text-white font-medium">
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <View className="bg-surface rounded-xl p-4 items-center">
                <Text className="text-gray-400">No categories available</Text>
              </View>
            )}
          </View>

          {/* Date Picker */}
          <View className="mt-6">
            <Text className="text-gray-400 text-sm mb-2">Date</Text>
            <TouchableOpacity
              className="bg-surface rounded-xl px-4 py-4"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-white text-base">
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
                  themeVariant="dark"
                />
              </View>
            )}
          </View>

          {/* Note Input */}
          <View className="mt-6">
            <Text className="text-gray-400 text-sm mb-2">Note (Optional)</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-4 text-white text-base"
              placeholder="Add a note..."
              placeholderTextColor="#6B7280"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            className="mt-8 py-4 rounded-xl border border-accent-red"
            onPress={() => setShowDeleteModal(true)}
          >
            <Text className="text-accent-red text-center font-semibold text-base">
              Delete Transaction
            </Text>
          </TouchableOpacity>

          {/* Spacer for bottom button */}
          <View className="h-24" />
        </ScrollView>

        {/* Submit Button */}
        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 bg-background">
          <TouchableOpacity
            className={`py-4 rounded-xl ${
              isValid && !updateTransaction.isPending
                ? type === "expense"
                  ? "bg-accent-red"
                  : "bg-accent-green"
                : "bg-gray-700"
            }`}
            onPress={handleSubmit}
            disabled={!isValid || updateTransaction.isPending}
          >
            {updateTransaction.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className="flex-1 bg-black/70 items-center justify-center px-5">
          <View className="bg-surface rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-accent-red/20 items-center justify-center mb-4">
                <Ionicons name="trash-outline" size={32} color="#F87171" />
              </View>
              <Text className="text-white text-xl font-bold text-center">
                Delete Transaction?
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                This action cannot be undone. The transaction will be
                permanently removed.
              </Text>
            </View>

            {transaction && (
              <View className="bg-background rounded-xl p-4 mb-6">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className="text-xl mr-2">
                      {transaction.category?.icon || "📦"}
                    </Text>
                    <Text className="text-white font-medium">
                      {transaction.category?.name || "Unknown"}
                    </Text>
                  </View>
                  <Text
                    className={`font-bold ${
                      transaction.type === "income"
                        ? "text-accent-green"
                        : "text-accent-red"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatIDR(transaction.amount)}
                  </Text>
                </View>
              </View>
            )}

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 py-3 rounded-xl bg-gray-700"
                onPress={() => setShowDeleteModal(false)}
                disabled={deleteTransaction.isPending}
              >
                <Text className="text-white text-center font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 rounded-xl bg-accent-red"
                onPress={handleDelete}
                disabled={deleteTransaction.isPending}
              >
                {deleteTransaction.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Delete
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

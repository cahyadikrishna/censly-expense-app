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
import EmojiText from "@components/EmojiText";
import CategoryChip from "@components/CategoryChip";
import { Button } from "@components/ui/Button";
import { InputField } from "@components/ui/InputField";
import { Card } from "@components/ui/Card";
import { HeaderBackButton } from "@components/ui/HeaderBackButton";
import type { TransactionType, CategoryItem } from "../../types";

export default function EditTransaction() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: transaction, isLoading: transactionLoading } =
    useTransaction(id || "");
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();

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

  const { data: categories, isLoading: categoriesLoading } = useCategories(type);

  useEffect(() => {
    if (transaction && !isInitialized) {
      setType(transaction.type);
      setAmount(formatIDRInput(transaction.amount.toString()));
      setDate(new Date(transaction.date));
      setNote(transaction.note || "");
      setIsInitialized(true);
    }
  }, [transaction, isInitialized]);

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

  const handleTypeChange = (newType: TransactionType) => {
    if (newType !== type) {
      setType(newType);
      setSelectedCategory(null);
    }
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

  const handleDelete = () => {
    if (!id) return;

    deleteTransaction.mutate(id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        router.back();
      },
    });
  };

  if (transactionLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator color="#000000" size="large" />
        <Text className="text-gray mt-4">Loading nih~</Text>
      </SafeAreaView>
    );
  }

  if (!transaction && !transactionLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-5">
        <Card variant="elevated" padding="lg" className="items-center">
          <Ionicons name="alert-circle-outline" size={64} color="#000000" />
          <Text className="text-black text-lg font-semibold mt-4">
            Transaksi ga ketemu nih~
          </Text>
          <Button
            label="Kembali"
            onPress={() => router.back()}
            variant="primary"
            size="md"
            className="mt-6"
          />
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      <HeaderBackButton />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row bg-white rounded-lg p-1 mt-4 border-2 border-black">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-md ${
                type === "expense" ? "bg-black" : ""
              }`}
              onPress={() => handleTypeChange("expense")}
            >
              <Text
                className={`text-center font-semibold ${
                  type === "expense" ? "text-white" : "text-black"
                }`}
              >
                Pengeluaran
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-md ${
                type === "income" ? "bg-black" : ""
              }`}
              onPress={() => handleTypeChange("income")}
            >
              <Text
                className={`text-center font-semibold ${
                  type === "income" ? "text-white" : "text-black"
                }`}
              >
                Pemasukan
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <Text className="text-sm font-semibold text-black mb-2">
              Nominal
            </Text>
            <Card variant="interactive" padding="md" className="px-4">
              <View className="flex-row items-center">
                <Text className="text-black text-2xl font-bold mr-2">Rp</Text>
                <TextInput
                  className="flex-1 text-black text-2xl font-bold h-12"
                  placeholder="0"
                  placeholderTextColor="#999999"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={handleAmountChange}
                  style={{ height: 48 }}
                />
              </View>
            </Card>
          </View>

          <View className="mt-6">
            <Text className="text-sm font-semibold text-black mb-2">
              Kategori
            </Text>
            {categoriesLoading ? (
              <Card padding="md">
                <View className="items-center py-4">
                  <ActivityIndicator color="#000000" />
                </View>
              </Card>
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
              <Card padding="md">
                <View className="items-center py-4">
                  <Text className="text-gray">Gada kategori nih~</Text>
                </View>
              </Card>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-sm font-semibold text-black mb-2">
              Tanggal
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Card variant="interactive" padding="md" className="px-4">
                <Text className="text-black text-base">
                  {formatDisplayDate(date)}
                </Text>
              </Card>
            </TouchableOpacity>
            {(showDatePicker || Platform.OS === "ios") && (
              <View className={`${Platform.OS === "ios" ? "mt-2" : ""}`}>
                <Card padding="md">
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                </Card>
              </View>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-sm font-semibold text-black mb-2">
              Catatan
            </Text>
            <InputField
              value={note}
              onChangeText={setNote}
              placeholder="Tambah catatan..."
              multiline
              numberOfLines={3}
            />
          </View>

          <Button
            label="Hapus Transaksi"
            onPress={() => setShowDeleteModal(true)}
            variant="outline"
            size="md"
            className="mt-8"
          />

          <View className="h-24" />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 bg-white">
          <Button
            label="Simpan"
            onPress={handleSubmit}
            disabled={!isValid || updateTransaction.isPending}
            variant={
              isValid && !updateTransaction.isPending ? "primary" : "secondary"
            }
            size="lg"
          />
          {updateTransaction.isPending && (
            <View className="items-center mt-4">
              <ActivityIndicator color="#000000" />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-5">
          <Card variant="elevated" padding="lg" className="w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-off-white items-center justify-center mb-4 border-2 border-black">
                <Ionicons name="trash-outline" size={32} color="#000000" />
              </View>
              <Text className="text-black text-xl font-bold text-center tracking-tight">
                Hapus Transaksi?
              </Text>
              <Text className="text-gray text-center mt-2">
                Ga bisa dibalikin lagi nih. Transaksi bakalan kehapus permanen.
              </Text>
            </View>

            {transaction && (
              <View className="bg-off-white rounded-lg p-4 mb-6 border border-black">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <EmojiText
                      text={transaction.category?.icon || "📦"}
                      size={20}
                    />
                    <Text className="text-black font-medium ml-2">
                      {transaction.category?.name || "Ga tau nih~"}
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
              <Button
                label="Batal"
                onPress={() => setShowDeleteModal(false)}
                variant="secondary"
                size="md"
                className="flex-1"
              />
              <Button
                label="Hapus"
                onPress={handleDelete}
                variant="primary"
                size="md"
                className="flex-1"
                disabled={deleteTransaction.isPending}
              />
            </View>
            {deleteTransaction.isPending && (
              <View className="items-center mt-4">
                <ActivityIndicator color="#000000" />
              </View>
            )}
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

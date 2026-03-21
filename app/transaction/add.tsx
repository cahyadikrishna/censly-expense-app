import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
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
import { Button } from "@components/ui/Button";
import { InputField } from "@components/ui/InputField";
import { Card } from "@components/ui/Card";
import { HeaderBackButton } from "@components/ui/HeaderBackButton";
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
                <Text className="text-black text-2xl font-bold mr-2">
                  Rp
                </Text>
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
                  <Text className="text-gray">Loading...</Text>
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
              <View
                className={`${Platform.OS === "ios" ? "mt-2" : ""}`}
              >
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

          <View className="h-24" />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 bg-white">
          <Button
            label="Tambah Transaksi"
            onPress={handleSubmit}
            loading={createTransaction.isPending}
            disabled={!isValid}
            variant={isValid ? "primary" : "secondary"}
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

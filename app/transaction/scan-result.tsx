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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useCategories } from "@hooks/useCategories";
import { useCreateTransaction } from "@hooks/useTransactions";
import { useScanReceipt } from "@hooks/useScanReceipt";
import { formatIDR, formatIDRInput, parseIDR } from "@lib/currency";
import CategoryChip from "@components/CategoryChip";
import type { TransactionType, CategoryItem } from "../../types";
import type { ScanResult } from "@hooks/useScanReceipt";

export default function ScanResult() {
  const router = useRouter();
  const params = useLocalSearchParams<{ uri: string }>();

  const createTransaction = useCreateTransaction();
  const scanReceipt = useScanReceipt();

  const [scanData, setScanData] = useState<ScanResult | null>(null);
  const [imagePath, setImagePath] = useState<string>("");
  const [isScanning, setIsScanning] = useState(true);
  const [scanError, setScanError] = useState<string | null>(null);

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(
    null
  );
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useCategories(type);

  useEffect(() => {
    if (params.uri) {
      scanReceipt.mutate(params.uri, {
        onSuccess: (data) => {
          setScanData(data.extracted);
          setImagePath(data.imagePath);

          if (data.extracted.total_amount) {
            setAmount(formatIDRInput(String(data.extracted.total_amount)));
          }

          if (data.extracted.date) {
            const parsed = parseReceiptDate(data.extracted.date);
            if (parsed) setDate(parsed);
          }

          if (data.extracted.store_name) {
            setNote(data.extracted.store_name);
          }

          setIsScanning(false);
        },
        onError: (error) => {
          setScanError("Gagal memindai struk. Coba lagi ya~");
          setIsScanning(false);
        },
      });
    }
  }, [params.uri]);

  function parseReceiptDate(dateStr: string): Date | null {
    try {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        let year = parseInt(parts[2], 10);
        year = year < 50 ? 2000 + year : 1900 + year;
        return new Date(year, month, day);
      }
    } catch {
      return null;
    }
    return null;
  }

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
        receipt_url: imagePath || null,
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  const handleRescan = () => {
    router.back();
  };

  if (isScanning) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#22C55E" />
        <Text className="text-gray-500 mt-4">Menganalisis struk...</Text>
      </SafeAreaView>
    );
  }

  if (scanError) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-5">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-gray-900 text-lg font-semibold mt-4">
          {scanError}
        </Text>
        <TouchableOpacity
          className="mt-6 bg-accent-green px-8 py-3 rounded-xl"
          onPress={handleRescan}
        >
          <Text className="text-white font-semibold">Coba Lagi</Text>
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
          <View className="mt-4 mb-2">
            <Text className="text-gray-900 text-xl font-bold">Hasil Scan</Text>
            <Text className="text-gray-500 text-sm mt-1">
              Periksa dan edit data sebelum disimpan
            </Text>
          </View>

          {scanData?.store_name && (
            <View className="bg-surface rounded-xl p-4 mt-2">
              <Text className="text-gray-500 text-xs mb-1">Toko</Text>
              <Text className="text-gray-900 font-semibold">
                {scanData.store_name}
              </Text>
            </View>
          )}

          {scanData?.items && scanData.items.length > 0 && (
            <View className="bg-surface rounded-xl p-4 mt-3">
              <Text className="text-gray-500 text-xs mb-2">Item ({scanData.items.length})</Text>
              {scanData.items.slice(0, 5).map((item, index) => (
                <View key={index} className="flex-row justify-between py-1.5">
                  <Text className="text-gray-700 text-sm flex-1" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-gray-500 text-sm ml-2">
                    {formatIDR(item.price)}
                  </Text>
                </View>
              ))}
              {scanData.items.length > 5 && (
                <Text className="text-gray-400 text-xs mt-1">
                  +{scanData.items.length - 5} item lainnya
                </Text>
              )}
            </View>
          )}

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
                Pengeluaran
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
                Pemasukan
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <Text className="text-gray-500 text-sm mb-2">Nominal</Text>
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
            <Text className="text-gray-500 text-sm mb-2">Kategori</Text>
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
                <Text className="text-gray-500">Gada kategori nih~</Text>
              </View>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-gray-500 text-sm mb-2">Tanggal</Text>
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
            <Text className="text-gray-500 text-sm mb-2">Catatan</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-4 text-gray-900 text-base"
              placeholder="Tambah catatan..."
              placeholderTextColor="#9CA3AF"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            className="mt-4 flex-row items-center justify-center"
            onPress={handleRescan}
          >
            <Ionicons name="camera-outline" size={18} color="#22C55E" />
            <Text className="text-accent-green text-sm font-medium ml-1.5">
              Scan Ulang
            </Text>
          </TouchableOpacity>

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
                Simpan Transaksi
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

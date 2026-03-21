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
import { Button } from "@components/ui/Button";
import { InputField } from "@components/ui/InputField";
import { Card } from "@components/ui/Card";
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
        onError: () => {
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
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000000" />
        <Text className="text-gray mt-4">Menganalisis struk...</Text>
      </SafeAreaView>
    );
  }

  if (scanError) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-5">
        <Card variant="elevated" padding="lg" className="items-center">
          <Ionicons name="alert-circle-outline" size={64} color="#000000" />
          <Text className="text-black text-lg font-semibold mt-4">
            {scanError}
          </Text>
          <Button
            label="Coba Lagi"
            onPress={handleRescan}
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mt-4 mb-6">
            <Text className="text-black text-xl font-bold tracking-tight">
              Hasil Scan
            </Text>
            <Text className="text-gray text-sm mt-1">
              Periksa dan edit data sebelum disimpan
            </Text>
          </View>

          {scanData?.store_name && (
            <Card variant="interactive" padding="md" className="mt-2">
              <Text className="text-xs font-semibold text-gray mb-1">Toko</Text>
              <Text className="text-black font-semibold">
                {scanData.store_name}
              </Text>
            </Card>
          )}

          {scanData?.items && scanData.items.length > 0 && (
            <Card variant="interactive" padding="md" className="mt-3">
              <Text className="text-xs font-semibold text-gray mb-2">
                Item ({scanData.items.length})
              </Text>
              {scanData.items.slice(0, 5).map((item, index) => (
                <View
                  key={index}
                  className="flex-row justify-between py-1.5"
                >
                  <Text
                    className="text-black text-sm flex-1"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-gray text-sm ml-2">
                    {formatIDR(item.price)}
                  </Text>
                </View>
              ))}
              {scanData.items.length > 5 && (
                <Text className="text-light-gray text-xs mt-1">
                  +{scanData.items.length - 5} item lainnya
                </Text>
              )}
            </Card>
          )}

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

          <TouchableOpacity
            className="mt-4 flex-row items-center justify-center py-2"
            onPress={handleRescan}
          >
            <Ionicons name="camera-outline" size={18} color="#000000" />
            <Text className="text-black text-sm font-medium ml-1.5">
              Scan Ulang
            </Text>
          </TouchableOpacity>

          <View className="h-24" />
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 px-5 pb-5 bg-white">
          <Button
            label="Simpan Transaksi"
            onPress={handleSubmit}
            disabled={!isValid || createTransaction.isPending}
            variant={
              isValid && !createTransaction.isPending ? "primary" : "secondary"
            }
            size="lg"
          />
          {createTransaction.isPending && (
            <View className="items-center mt-4">
              <ActivityIndicator color="#000000" />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

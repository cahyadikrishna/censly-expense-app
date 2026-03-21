import { View, Text, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Card } from "@components/ui/Card";
import { Button } from "@components/ui/Button";

interface ModalDatePickerProps {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onDateChange: (date: Date) => void;
  maximumDate?: Date;
}

export function ModalDatePicker({
  visible,
  value,
  onClose,
  onDateChange,
  maximumDate,
}: ModalDatePickerProps) {
  const handleChange = (_event: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-5">
        <Card variant="default" padding="lg" className="w-full">
          <Text className="text-black text-lg font-bold text-center mb-4">
            Pilih Tanggal
          </Text>
          <DateTimePicker
            value={value}
            mode="date"
            display="spinner"
            onValueChange={handleChange}
            maximumDate={maximumDate}
            textColor="#000000"
          />
          <Button
            label="Tutup"
            onPress={onClose}
            variant="primary"
            size="md"
            className="mt-4"
          />
        </Card>
      </View>
    </Modal>
  );
}
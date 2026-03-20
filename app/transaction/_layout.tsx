import { Stack } from "expo-router";

export default function TransactionLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTintColor: "#374151",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Stack.Screen
        name="add"
        options={{
          title: "Tambah Transaksi",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Edit Transaksi",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="scan-result"
        options={{
          title: "Scan Struk",
          presentation: "modal",
          headerBackTitle: "Batal",
        }}
      />
    </Stack>
  );
}

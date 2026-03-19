import { Stack } from "expo-router";

export default function TransactionLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1A1A1A",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: "#0F0F0F",
        },
      }}
    >
      <Stack.Screen
        name="add"
        options={{
          title: "Add Transaction",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Edit Transaction",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

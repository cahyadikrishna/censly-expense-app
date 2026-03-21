import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabButton } from "@components/ui/TabButton";
import { HomeIcon, TransactionIcon, SettingsIcon } from "@components/ui/icons";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <Tabs>
        <TabSlot />

        <TabList style={styles.tabBarContainer}>
          <TabTrigger name="index" href="/" asChild>
            <TabButton label="Beranda" icon={<HomeIcon color="#BDBDBD" size={24} />} />
          </TabTrigger>

          <TabTrigger name="transactions" href="/transactions" asChild>
            <TabButton label="Transaksi" icon={<TransactionIcon color="#BDBDBD" size={24} />} />
          </TabTrigger>
          
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton label="Pengaturan" icon={<SettingsIcon color="#BDBDBD" size={24} />} />
          </TabTrigger>
        </TabList>
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",

  },
});

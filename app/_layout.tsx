import "../global.css";

import { useEffect } from "react";
import { Image, View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { supabase } from "@lib/supabase";
import { useAuthStore } from "@stores/authStore";

const queryClient = new QueryClient();

function SplashScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Image
        source={require("../assets/icon.png")}
        className="w-24 h-24 rounded-2xl mb-4"
        resizeMode="contain"
      />
      <ActivityIndicator size="small" color="#22C55E" />
    </View>
  );
}

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { session, setSession, setUser } = useAuthStore();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (session) {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    } else {
      if (!inAuthGroup) {
        router.replace("/(auth)/sign-in");
      }
    }
  }, [session, segments]);

  if (!session && segments[0] !== "(auth)") {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SplashScreen />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Slot />
        <StatusBar style="dark" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

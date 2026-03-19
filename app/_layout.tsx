import "../global.css";

import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { supabase } from "@lib/supabase";
import { useAuthStore } from "@stores/authStore";
import { ActivityIndicator, View } from "react-native";

const queryClient = new QueryClient();

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
      // User is authenticated
      if (inAuthGroup) {
        // Redirect from auth to tabs
        router.replace("/(tabs)");
      }
    } else {
      // User is not authenticated
      if (!inAuthGroup) {
        // Redirect to auth screen
        router.replace("/(auth)/sign-in");
      }
    }
  }, [session, segments]);

  // Show loading screen while checking auth
  if (!session && segments[0] !== "(auth)") {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 bg-background items-center justify-center">
          <ActivityIndicator size="large" color="#4ADE80" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Slot />
        <StatusBar style="light" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;
        Alert.alert("Success", "Account created! Please check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;
      }
    } catch (error: any) {
      Alert.alert(isSignUp ? "Sign Up Error" : "Sign In Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ justifyContent: "center", flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10">
            <Text className="text-gray-900 text-4xl font-bold mb-2">Censly</Text>
            <Text className="text-gray-500 text-lg">
              Track your expenses
            </Text>
          </View>

          {/* Email/Password Form */}
          <View className="bg-surface rounded-2xl p-5 mb-4">
            <Text className="text-gray-500 text-sm mb-2">Email</Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-gray-900 mb-4 border border-gray-200"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text className="text-gray-500 text-sm mb-2">Password</Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3 text-gray-900 mb-4 border border-gray-200"
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              className={`py-3 rounded-xl items-center ${
                isLoading ? "bg-gray-300" : "bg-accent-green"
              }`}
              onPress={handleEmailSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-semibold">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 py-2 items-center"
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text className="text-accent-green text-sm">
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="text-gray-400 text-sm mx-4">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Sign-In (Disabled - Coming Soon) */}
          <TouchableOpacity
            disabled
            className="rounded-2xl py-4 items-center bg-gray-200"
            activeOpacity={1}
          >
            <Text className="text-gray-400 text-base font-semibold">
              Continue with Google (Coming Soon)
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

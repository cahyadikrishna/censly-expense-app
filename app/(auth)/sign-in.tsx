import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@lib/supabase";
import { Button } from "@components/ui/Button";
import { InputField } from "@components/ui/InputField";
import { Card } from "@components/ui/Card";
import { Divider } from "@components/ui/Divider";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Isi email sama password dulu dong~");
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
        Alert.alert(
          "Success",
          "Akun berhasil dibuat! Cek email kamu buat konfirmasi ya~"
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;
      }
    } catch (error: any) {
      Alert.alert(
        isSignUp ? "Error Daftar" : "Error Masuk",
        error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{
            justifyContent: "center",
            flexGrow: 1,
            paddingVertical: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10">
            <Text className="text-black text-4xl font-bold mb-2 tracking-tight">
              Censly
            </Text>
            <Text className="text-gray text-md">Jangan males, catet pengeluaran pke AI~</Text>
          </View>

          <Card variant="elevated" padding="lg" className="mb-6">
            <Text className="text-sm font-semibold text-black mb-2">Email</Text>
            <InputField
              value={email}
              onChangeText={setEmail}
              placeholder="Ketik email kamu"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="mb-4"
            />

            <Text className="text-sm font-semibold text-black mb-2">
              Password
            </Text>
            <InputField
              value={password}
              onChangeText={setPassword}
              placeholder="Ketik password kamu"
              secureTextEntry
              className="mb-4"
            />

            <Button
              label={isSignUp ? "Daftar" : "Masuk"}
              onPress={handleEmailSignIn}
              disabled={isLoading}
              variant="primary"
              size="lg"
              className="mt-2"
            />

            {isLoading && (
              <View className="items-center mt-4">
                <ActivityIndicator color="#000000" />
              </View>
            )}

            <TouchableOpacity
              className="mt-4 py-2 items-center"
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text className="text-black text-sm font-medium">
                {isSignUp
                  ? "Udah punya akun? Masuk sini"
                  : "Belum punya akun? Daftar dulu"}
              </Text>
            </TouchableOpacity>
          </Card>

          <Divider className="my-6" />

          <TouchableOpacity
            disabled
            className="rounded-lg py-4 items-center bg-white border-2 border-black opacity-50"
            activeOpacity={1}
          >
            <Text className="text-black text-base font-semibold">
              Lanjut dengan Google (Coming Soon~)
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

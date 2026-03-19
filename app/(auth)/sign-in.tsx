import { View, Text, TouchableOpacity, Alert } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@lib/supabase";

GoogleSignin.configure({
  scopes: ["email", "profile"],
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export default function SignIn() {
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error("No ID token returned from Google Sign-In");
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) throw error;
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
      Alert.alert("Sign-In Error", error.message);
    }
  };

  return (
    <View className="flex-1 bg-background items-center justify-center px-8">
      <Text className="text-white text-4xl font-bold mb-2">Censly</Text>
      <Text className="text-gray-400 text-lg mb-12">
        Track your expenses
      </Text>

      <TouchableOpacity
        onPress={handleGoogleSignIn}
        className="bg-white rounded-2xl py-4 px-8 w-full items-center"
        activeOpacity={0.8}
      >
        <Text className="text-gray-900 text-base font-semibold">
          Sign in with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}

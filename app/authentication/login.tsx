import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { supabase } from "@/config/SupabaseConfiguration";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { OrDivider } from "@/components/OrDivider";
import { GoogleButton } from "@/components/GoogleButton";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!email || !password) {
        Alert.alert("Error", "Please enter email and password.");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      Alert.alert("Success", "Logged in successfully!");
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();

      if (!signInResult.data?.idToken)
        throw new Error("No ID token present in Google Sign-In result");

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: signInResult.data.idToken,
      });

      if (error) throw error;

      console.log("User signed in:", data.user);
      router.replace("/");
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("User cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Operation is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Play services not available or outdated");
      } else {
        console.error("Other error:", error);
        Alert.alert("Error", "An error occurred during Google sign in");
      }
    }
  };

  const handleForgotPassword = () => {
    console.log("handle reset password here");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Row 1: Heading */}
      <View style={styles.headingRow}>
        <Text style={styles.appName}>APP NAME</Text>
      </View>

      {/* Row 2: Main Content / Form */}
      <View style={styles.mainRow}>
        <Text style={styles.title}>Log In</Text>
        {/* TODO: Cofigure and test */}
        {/* <GoogleButton onPress={handleGoogleLogin} text="Login with Google" /> */}
        {/* <OrDivider /> */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/authentication/signup")}
        >
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  headingRow: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#000",
  },
  mainRow: {
    flex: 0.85,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: "-20%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
  },
  forgotPasswordContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  forgotPassword: {
    color: "#3897f0",
    fontSize: 14,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#3897f0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a6cbef",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  link: {
    color: "#3897f0",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
});

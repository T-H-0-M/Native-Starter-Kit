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
import { useRouter } from "expo-router";
import { OrDivider } from "@/components/OrDivider";
import { GoogleButton } from "@/components/GoogleButton";

const SignUpScreen: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setLoading(true);
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        Alert.alert("Error", "Please fill out all fields.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
        },
      });

      Alert.alert(
        "Success",
        "Registration successful! Please check your email for verification.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/authentication/login"),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert("Sign-Up Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setGoogleLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          scopes: "email profile",
        },
      });
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      Alert.alert("Error", "An error occurred during Google sign in");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headingRow}>
        <Text style={styles.appName}>APP NAME</Text>
      </View>

      <View style={styles.mainRow}>
        <Text style={styles.title}>Sign Up</Text>
        {/* TODO: Cofigure and test */}
        {/* <GoogleButton */}
        {/*   onPress={handleGoogleSignup} */}
        {/*   text={googleLoading ? "Connecting..." : "Sign Up with Google"} */}
        {/*   disabled={googleLoading} */}
        {/* /> */}
        {/* <OrDivider /> */}
        <View style={styles.nameRow}>
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="First Name"
            placeholderTextColor="#888"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            style={[styles.input, styles.nameInput]}
            placeholder="Last Name"
            placeholderTextColor="#888"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
        </View>

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

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/authentication/login")}
        >
          <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
  },
  nameInput: {
    flex: 1,
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

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { supabase } from "@/config/SupabaseConfiguration";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { Colours } from "@/constants/Colours";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const themeColors = Colours[colorScheme ?? "light"]; // Fallback to light theme
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get current user details when the component mounts
    const getCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      if (user) {
        setUserEmail(user.email);
        // Get the user's name from metadata if available
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.user_metadata?.first_name
            ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim()
            : null;
        setUserName(fullName);
      }
    };

    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      Alert.alert("Logged Out", "You have been successfully logged out.");
      router.replace("/authentication/login");
    } catch (error: any) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>
        Welcome to the App!
      </Text>
      <Text style={[styles.subtitle, { color: themeColors.secondaryText }]}>
        {userName
          ? `Logged in as ${userName}`
          : userEmail
            ? `Logged in as ${userEmail}`
            : "You're logged in"}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: themeColors.buttonBackground },
        ]}
        onPress={handleLogout}
      >
        <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "80%",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default HomeScreen;

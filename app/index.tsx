import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { supabase } from "@/config/SupabaseConfiguration";
import { useRouter } from "expo-router";

const IndexPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Get the current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error checking auth state:", error);
          router.replace("/authentication/login");
          return;
        }

        if (session) {
          router.replace("/home");
        } else {
          router.replace("/authentication/login");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        router.replace("/authentication/login");
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/home");
      } else {
        router.replace("/authentication/login");
      }
      setLoading(false);
    });

    // Initial check
    checkAuthState();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3897f0" />
      </View>
    );
  }

  return null;
};

export default IndexPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

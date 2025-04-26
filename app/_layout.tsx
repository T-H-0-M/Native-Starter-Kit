import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";
// import { Provider } from "react-redux";
// import { store } from "../redux/Store";
import { supabase } from "@/config/SupabaseConfiguration";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { fadeTransition } from "@/config/Transitions";

export function useProtectedRoute(session: any | null | undefined) {
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) {
      return;
    }

    if (!session) {
      router.replace("/authentication/login");
    } else {
      router.replace("/home");
    }
  }, [session, router]);
}

export default function RootLayout() {
  const [session, setSession] = useState<any | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    // Set up Supabase auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
    });

    // Initial session check
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getInitialSession();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useProtectedRoute(session);

  const handleSignOut = async () => {
    try {
      // If using Google Sign-In, sign out from Google as well
      await GoogleSignin.signOut().catch((error) => {
        console.log("Google Sign-Out error (non-fatal):", error);
      });

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      console.log("Signed out successfully!");
      router.push("/authentication/login");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out");
    }
  };

  return (
    <View style={styles.view}>
      <SafeAreaProvider>
        {/* <Provider store={store}> */}
        <View style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "white" },
              ...fadeTransition,
              presentation: "card",
              fullScreenGestureEnabled: true,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="home" />
            <Stack.Screen name="standalone" />
            <Stack.Screen name="authentication" />
          </Stack>
        </View>
        {/* </Provider> */}
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

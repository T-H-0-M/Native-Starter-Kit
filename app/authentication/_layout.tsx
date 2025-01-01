import { Stack } from "expo-router";
import { fadeTransition } from "@/config/transitions";

export default function AuthenticationLayoutFunction() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
        ...fadeTransition,
        presentation: "card",
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}

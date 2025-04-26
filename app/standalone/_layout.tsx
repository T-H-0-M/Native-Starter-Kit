import { Stack } from "expo-router";
import { fadeTransition } from "@/config/Transitions";

export default function StandAloneLayout() {
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
      <Stack.Screen name="under_construction" />
    </Stack>
  );
}

import { Platform } from "react-native";

export const fadeTransition = {
  gestureEnabled: Platform.OS === "ios",
  animation: "fade" as const,
  animationDuration: 300,
  animationEasing: "ease",
};

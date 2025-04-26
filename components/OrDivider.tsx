import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const OrDivider: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>OR</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },
});

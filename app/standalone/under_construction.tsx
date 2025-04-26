import React from "react";
import { Text, Image } from "react-native";
import { StyleSheet, View } from "react-native";

const UnderConstruction = (): React.JSX.Element => {
  return (
    <View testID="under-construction-container" style={styles.container}>
      <Image
        testID="under-construction-image"
        source={require("../../assets/images/under-construction.png")}
        style={styles.image}
      />
      <Text testID="under-construction-title" style={styles.title}>
        Under Construction
      </Text>
      <Text testID="under-construction-message" style={styles.message}>
        We're working hard to bring you something amazing. Please check back
        soon!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
export default UnderConstruction;

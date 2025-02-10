import { useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@react-native-material/core";

export default function AboutScreen({ navigation, route }) {

  const { name } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About s {name}</Text>
      <Button
        title="Update the name"
        onPress={() => navigation.setParams({ name: "Codevolution" })}
      />
      <Button
        title="Go back with data"
        onPress={() => {
          navigation.navigate("Home", { result: "Data from About" });
        }}
      />

          <Button title="Click Me" onPress={() => alert("🎉🎉🎉")}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

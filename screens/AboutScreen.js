import { useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@react-native-material/core";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AboutScreen({ navigation, route }) {

  const { name } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);
  return (
    <View style={styles.container}>
    <Button style={styles.button} onPress={() => AsyncStorage.removeItem("@user")}>
      Déconnexion
    </Button>
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

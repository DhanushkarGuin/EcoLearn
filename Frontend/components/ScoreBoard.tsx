import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

type Props = {
  score: number;
  onRestart: () => void;
};

const ScoreBoard: React.FC<Props> = ({ score, onRestart }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Round Over!</Text>
      <Text style={styles.score}>Final Score: {score}</Text>
      <Button title="Play Again" onPress={onRestart} />
    </View>
  );
};

export default ScoreBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  score: {
    fontSize: 22,
    marginBottom: 30,
  },
});

import React, { useState } from "react";
import { SafeAreaView, View, Text, Button, StyleSheet } from "react-native";
import GameArena from "../components/GameArena";
import ScoreBoard from "../components/ScoreBoard";

export default function App() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleEndGame = () => {
    setGameOver(true);
  };

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!gameOver ? (
        <GameArena score={score} setScore={setScore} onEndGame={handleEndGame} />
      ) : (
        <ScoreBoard score={score} onRestart={handleRestart} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d6f5d6",
  },
});

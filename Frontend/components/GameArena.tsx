import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

// Types for objects
type GameObject = {
  id: string;
  type: "car" | "coal" | "tree"; // tree is neutral
  converted: boolean;
};

type Props = {
  onEndGame: (score: number) => void;
};

const GameArena: React.FC<Props> = ({ onEndGame }) => {
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute round

  // Spawn city objects at start
  useEffect(() => {
    const cityObjects: GameObject[] = Array.from({ length: 12 }).map((_, i) => ({
      id: String(i),
      type: i % 3 === 0 ? "car" : i % 3 === 1 ? "coal" : "tree",
      converted: false,
    }));
    setObjects(cityObjects);
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onEndGame(score);
      return;
    }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  // Handle tapping objects
  const handleTap = (obj: GameObject) => {
    if (obj.type === "tree") return; // neutral, no effect

    if (!obj.converted) {
      // correct switch
      setScore(score + 10);
      setObjects(objects.map(o => o.id === obj.id ? { ...o, converted: true } : o));
    } else {
      // wrong switch back
      setScore(score - 5);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏱ {timeLeft}s</Text>
      <Text style={styles.score}>Score: {score}</Text>

      {/* Grid of city objects */}
      <FlatList
        data={objects}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.object,
              item.converted && { backgroundColor: "#4CAF50" },
            ]}
            onPress={() => handleTap(item)}
          >
            <Text style={styles.icon}>
              {item.type === "car" ? (item.converted ? "🚲" : "🚗") :
               item.type === "coal" ? (item.converted ? "☀️" : "🏭") :
               "🌳"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default GameArena;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, alignItems: "center" },
  timer: { fontSize: 22, fontWeight: "bold" },
  score: { fontSize: 18, marginBottom: 20 },
  object: {
    width: 90,
    height: 90,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#ddd",
  },
  icon: { fontSize: 28 },
});

import React from "react";
import { View, StyleSheet } from "react-native";
import { useRole } from "../RoleContext";
import StudentHomeScreen from "./StudentPage";
import TeacherHomeScreen from "./Teacher";
import SchoolHomeScreen from "./School";

export default function HomeTab() {
  const { role } = useRole();

  const renderHome = () => {
    switch (role) {
      case "student":
        return <StudentHomeScreen />;
      case "teacher":
        return <TeacherHomeScreen />;
      case "school":
        return <SchoolHomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderHome()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },        // full screen
  content: { flex: 1 },          // takes all space above the tab bar
});

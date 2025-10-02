import React from "react";
import { View, Text } from "react-native";
import { useRole } from "../RoleContext";

// Import role-based dashboards
import StudentHome from "./StudentPage";
import TeacherHome from "./Teacher";
import SchoolHomeScreen from "./School";

export default function HomeScreen() {
  const { role } = useRole();

  if (role === "student") {
    return <StudentHome />;
  }
  if (role === "teacher") {
    return <TeacherHome />;
  }
  if (role === "school") {
    return <SchoolHomeScreen />;
  }

  // fallback if no role selected
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Please select your role first</Text>
    </View>
  );
}

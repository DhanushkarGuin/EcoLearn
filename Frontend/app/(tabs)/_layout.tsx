import React, { useState } from "react";
import { Tabs, useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function TabsLayout() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const tabs = [
    { name: "home", icon: "home", label: "Home" },
    { name: "notifications", icon: "bell", label: "Notifications" },
    { name: "profile", icon: "user", label: "Profile" },
  ];

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const styles = getStyles(theme);

  return (
    <View style={{ flex: 1 }}>
      {/* Tabs Outlet */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }
        }}
      >
        <Tabs.Screen name="notifications" />
        <Tabs.Screen name="profile" />
      </Tabs>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.tabBarContainer}>
      {tabs.map((tab) => (
<TouchableOpacity
          key={tab.name}
          style={styles.tabItem}
          // Use explicit string instead of template literal
          onPress={() => router.push(`/${tab.name}` as "/home" | "/notifications" | "/profile")}
        >
    <FontAwesome
      name={tab.icon as any} // cast to any to satisfy TypeScript
      size={28}
      color={styles.icon.color}
    />
    <Text style={styles.tabLabel}>{tab.label}</Text>
  </TouchableOpacity>
))}

{/* Theme Toggle */}
      </View>
    </View>
  );
}

const getStyles = (theme: "dark" | "light") =>
  StyleSheet.create({
    tabBarContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#1E1E1E" : "#F5F5F5",
      borderTopWidth: 1,
      borderTopColor: theme === "dark" ? "#2E2E2E" : "#E0E0E0",
      paddingTop: 10,
      paddingBottom: Platform.OS === "ios" ? 30 : 15,
    },
    tabItem: {
      alignItems: "center",
    },
    icon: {
      color: theme === "dark" ? "#FFFFFF" : "#121212",
    },
    tabLabel: {
      color: theme === "dark" ? "#AEB6BF" : "#566573",
      fontSize: 12,
      marginTop: 5,
      fontFamily: "Poppins-Regular",
    },
  });

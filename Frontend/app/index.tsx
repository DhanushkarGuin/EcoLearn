// app/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Wait until router is mounted, then redirect
    const timer = setTimeout(() => {
      router.replace("/continueAs"); // 👈 safe redirect
    }, 100); // small delay ensures layout is ready

    return () => clearTimeout(timer);
  }, [router]);

  // While redirecting, show loading
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

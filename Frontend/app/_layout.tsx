import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 1. Load the fonts
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf')
  });

  // 2. Hide the splash screen only when the fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 3. Don't render the layout until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // 4. Render the stack navigator
  return (
    <Stack screenOptions={{ headerShown: false }}>
    </Stack>
  );
}
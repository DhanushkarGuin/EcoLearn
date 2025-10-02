import { useEffect } from "react";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    router.replace("/continueAs"); // Redirects to ContinueAs page
  }, []);

  return null; // Or you can show a splash/loading screen here
}

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/AuthContext";
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="salas" />
        <Stack.Screen name="reservar/[id]" />
        <Stack.Screen name="reservas" />
      </Stack>
    </AuthProvider>
  );
}

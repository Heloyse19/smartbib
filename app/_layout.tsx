import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { connectMQTT } from "@/services/mqtt";
import "./global.css";

export default function RootLayout() {
  useEffect(() => {
    connectMQTT().catch(console.error);
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="salas" />
        <Stack.Screen name="reservar/[id]" />
        <Stack.Screen name="reservas" />
      </Stack>
    </>
  );
}

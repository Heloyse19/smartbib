import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { myReservations, Reservation } from "@/data/mockData";
import { sendCommand } from "@/services/mqtt";

export default function ReservasScreen() {
  const router = useRouter();
  const [reservations, setReservations] =
    useState<Reservation[]>(myReservations);

  const handleLiberar = (reservation: Reservation) => {
    Alert.alert(
      "Liberar Sala",
      `Deseja liberar a ${reservation.roomName} (${reservation.date}, ${reservation.time})?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Liberar",
          style: "destructive",
          onPress: () => {
            sendCommand("liberar");

            setReservations((prev) =>
              prev.filter((r) => r.id !== reservation.id)
            );

            Alert.alert(
              "Sala Liberada!",
              `${reservation.roomName} foi liberada. O LED verde será aceso na sala.`
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xs text-gray-500 uppercase tracking-wider">
            Minhas reservas
          </Text>
          <Text className="text-xl font-bold text-gray-900">
            Gerenciar Reservas
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {reservations.length === 0 ? (
          <View className="items-center justify-center mt-24">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="calendar-outline" size={36} color="#d1d5db" />
            </View>
            <Text className="text-gray-500 text-base text-center">
              Você não tem reservas ativas.
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-sm text-gray-500 mt-4 mb-3">
              {reservations.length} reserva{reservations.length !== 1 ? "s" : ""}
            </Text>
            {reservations.map((reservation) => (
              <View
                key={reservation.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 mb-3"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View className="w-11 h-11 bg-primary-50 rounded-xl items-center justify-center">
                      <Ionicons name="calendar" size={20} color="#0ea5e9" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-base font-semibold text-gray-900">
                        {reservation.roomName}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {reservation.date} · {reservation.time}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      reservation.status === "confirmada"
                        ? "bg-green-100"
                        : "bg-amber-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        reservation.status === "confirmada"
                          ? "text-green-700"
                          : "text-amber-700"
                      }`}
                    >
                      {reservation.status === "confirmada"
                        ? "Confirmada"
                        : "Pendente"}
                    </Text>
                  </View>
                </View>

                {/* Liberar Button */}
                <TouchableOpacity
                  className="mt-3 bg-red-50 border border-red-200 rounded-xl py-3 items-center flex-row justify-center gap-2"
                  onPress={() => handleLiberar(reservation)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="lock-open" size={18} color="#ef4444" />
                  <Text className="text-red-600 font-semibold text-base">
                    Liberar Sala
                  </Text>
                </TouchableOpacity>
                <Text className="text-gray-400 text-xs text-center mt-1">
                  Envia comando 'liberar' via MQTT
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

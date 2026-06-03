import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getReservas, cancelReserva, type Reserva } from "@/services/api";

export default function ReservasScreen() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<Reserva | null>(null);
  const [liberando, setLiberando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setLoading(true);
          const data = await getReservas();
          setReservations(data);
        } catch {
          Alert.alert("Erro", "Nao foi possivel carregar suas reservas");
        } finally {
          setLoading(false);
        }
      })();
    }, [])
  );

  const doLiberar = async (reservation: Reserva) => {
    setLiberando(true);
    try {
      await cancelReserva(reservation.id);
      setReservations((prev) => prev.filter((r) => r.id !== reservation.id));
      Alert.alert(
        "Sala Liberada!",
        `${reservation.roomName} foi liberada.`
      );
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao liberar sala");
    } finally {
      setLiberando(false);
      setConfirming(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
        {loading ? (
          <View className="items-center mt-20">
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text className="text-gray-500 mt-3">Carregando reservas...</Text>
          </View>
        ) : reservations.length === 0 ? (
          <View className="items-center justify-center mt-24">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="calendar-outline" size={36} color="#d1d5db" />
            </View>
            <Text className="text-gray-500 text-base text-center">
              Voce nao tem reservas ativas.
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
                        : reservation.status === "cancelada"
                        ? "bg-red-100"
                        : "bg-amber-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        reservation.status === "confirmada"
                          ? "text-green-700"
                          : reservation.status === "cancelada"
                          ? "text-red-700"
                          : "text-amber-700"
                      }`}
                    >
                      {reservation.status === "confirmada"
                        ? "Confirmada"
                        : reservation.status === "cancelada"
                        ? "Cancelada"
                        : "Pendente"}
                    </Text>
                  </View>
                </View>

                {reservation.status !== "cancelada" && (
                  <TouchableOpacity
                    className="mt-3 bg-red-50 border border-red-200 rounded-xl py-3 items-center flex-row justify-center gap-2"
                    onPress={() => setConfirming(reservation)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="lock-open" size={18} color="#ef4444" />
                    <Text className="text-red-600 font-semibold text-base">
                      Liberar Sala
                    </Text>
                  </TouchableOpacity>
                )}
                <Text className="text-gray-400 text-xs text-center mt-1">
                  Reserva #{reservation.id}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <Modal
        visible={confirming !== null}
        transparent
        animationType="fade"
        onRequestClose={() => !liberando && setConfirming(null)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-4 mx-auto">
              <Ionicons name="warning" size={24} color="#ef4444" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center mb-2">
              Liberar Sala
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
              Deseja liberar a {confirming?.roomName} ({confirming?.date},{" "}
              {confirming?.time})?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
                onPress={() => setConfirming(null)}
                disabled={liberando}
              >
                <Text className="text-gray-700 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-xl py-3 items-center flex-row justify-center gap-2"
                onPress={() => confirming && doLiberar(confirming)}
                disabled={liberando}
              >
                {liberando ? (
                  <ActivityIndicator color="white" size="small" />
                ) : null}
                <Text className="text-white font-semibold">
                  {liberando ? "Liberando..." : "Liberar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

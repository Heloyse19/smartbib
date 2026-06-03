import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getSalas, getRoomSlots, createReserva, type Sala, type RoomSlot } from "@/services/api";

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  users: "people",
  presentation: "easel",
  video: "videocam",
  briefcase: "briefcase",
};

const iconColors: Record<string, string> = {
  users: "#0ea5e9",
  presentation: "#8b5cf6",
  video: "#f59e0b",
  briefcase: "#22c55e",
};

export default function ReservarScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const salaId = Number(id);

  const [room, setRoom] = useState<Sala | null>(null);
  const [slots, setSlots] = useState<RoomSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const today = new Date().toISOString().split("T")[0];
          const [salas, roomSlots] = await Promise.all([
            getSalas(),
            getRoomSlots(salaId, today),
          ]);
          const found = salas.find((s) => s.id === salaId);
          if (found) setRoom(found);
          setSlots(roomSlots);
        } catch {
          Alert.alert("Erro", "Não foi possível carregar os dados");
        } finally {
          setLoading(false);
        }
      })();
    }, [salaId])
  );

  const handleConfirm = async () => {
    if (!selectedSlot || !room) return;

    setSaving(true);
    try {
      const [horaInicio] = selectedSlot.split(" - ");
      const horaFim = selectedSlot.split(" - ")[1];
      const today = new Date().toISOString().split("T")[0];

      await createReserva(salaId, today, horaInicio, horaFim);

      setConfirmed(true);

      Alert.alert(
        "Reserva Confirmada!",
        `${room.nome} reservada para ${selectedSlot}.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Erro ao confirmar reserva");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaView>
    );
  }

  if (!room) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 text-lg">Sala não encontrada.</Text>
        <TouchableOpacity
          className="mt-4 bg-primary-500 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xs text-gray-500 uppercase tracking-wider">
            Reservar Sala
          </Text>
          <Text className="text-xl font-bold text-gray-900">{room.nome}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="bg-gray-50 rounded-2xl p-4 mt-4 flex-row items-center">
          <View
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: (iconColors[room.icon] || "#0ea5e9") + "20" }}
          >
            <Ionicons
              name={iconMap[room.icon] || "people"}
              size={28}
              color={iconColors[room.icon] || "#0ea5e9"}
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-gray-900">{room.nome}</Text>
            <Text className="text-sm text-gray-500">
              {room.capacidade} pessoas · {room.andar}º andar
            </Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              {room.recursos.map((f) => (
                <View key={f} className="bg-primary-50 px-3 py-1 rounded-full">
                  <Text className="text-primary-700 text-xs font-medium">{f}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mt-6 mb-4">
          <Text className="text-sm text-gray-500 uppercase tracking-wider mb-1">
            Data
          </Text>
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar" size={20} color="#0ea5e9" />
            <Text className="text-lg font-semibold text-gray-900 capitalize">
              {today}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-gray-500 uppercase tracking-wider mb-3">
          Horários disponíveis
        </Text>
        {slots.length > 0 && slots.every((s) => !s.available) && (
          <Text className="text-red-500 text-sm mb-3">
            Todos os horários estão reservados para hoje.
          </Text>
        )}
        <View className="flex-row flex-wrap gap-3 mb-6">
          {slots.map((slot) => (
            <TouchableOpacity
              key={slot.label}
              disabled={!slot.available || confirmed || saving}
              onPress={() => setSelectedSlot(slot.label)}
              className={`px-4 py-3 rounded-xl border ${
                !slot.available
                  ? "bg-gray-100 border-gray-200 opacity-50"
                  : selectedSlot === slot.label
                  ? "bg-primary-500 border-primary-500"
                  : "bg-white border-gray-300"
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-medium ${
                  !slot.available
                    ? "text-gray-400 line-through"
                    : selectedSlot === slot.label
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {slot.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mb-8 ${
            confirmed ? "bg-green-500" : "bg-primary-500"
          } ${!selectedSlot && !confirmed ? "opacity-60" : ""}`}
          onPress={handleConfirm}
          disabled={confirmed || !selectedSlot || saving}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center gap-2">
            {saving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons
                name={confirmed ? "checkmark-circle" : "lock-closed"}
                size={20}
                color="white"
              />
            )}
            <Text className="text-white text-lg font-semibold">
              {saving ? "Reservando..." : confirmed ? "Reserva Confirmada" : "Confirmar Reserva"}
            </Text>
          </View>
          {!confirmed && !saving && (
            <Text className="text-white/70 text-xs mt-1">
              Envia reserva para o servidor
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

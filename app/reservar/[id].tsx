import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { rooms, timeSlots, Room } from "@/data/mockData";
import { sendCommand } from "@/services/mqtt";

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
  const room: Room | undefined = rooms.find((r: Room) => r.id === Number(id));

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selectedSlot) {
      Alert.alert("Aviso", "Selecione um horário disponível.");
      return;
    }

    setConfirmed(true);

    sendCommand("ocupar");

    Alert.alert(
      "Reserva Confirmada!",
      `${room?.name} reservada para ${selectedSlot}. O LED vermelho será aceso na sala.`,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

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
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xs text-gray-500 uppercase tracking-wider">
            Reservar Sala
          </Text>
          <Text className="text-xl font-bold text-gray-900">{room.name}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Room Info Card */}
        <View className="bg-gray-50 rounded-2xl p-4 mt-4 flex-row items-center">
          <View
            className="w-14 h-14 rounded-2xl items-center justify-center"
            style={{ backgroundColor: iconColors[room.icon] + "20" }}
          >
            <Ionicons
              name={iconMap[room.icon]}
              size={28}
              color={iconColors[room.icon]}
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-gray-900">{room.name}</Text>
            <Text className="text-sm text-gray-500">
              {room.capacity} pessoas · {room.floor}
            </Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              {room.features.map((f: string) => (
                <View
                  key={f}
                  className="bg-primary-50 px-3 py-1 rounded-full"
                >
                  <Text className="text-primary-700 text-xs font-medium">
                    {f}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Date */}
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

        {/* Time Slots */}
        <Text className="text-sm text-gray-500 uppercase tracking-wider mb-3">
          Horários disponíveis
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {timeSlots.map((slot: typeof timeSlots[number]) => (
            <TouchableOpacity
              key={slot.time}
              disabled={!slot.available || confirmed}
              onPress={() => setSelectedSlot(slot.time)}
              className={`px-4 py-3 rounded-xl border ${
                !slot.available
                  ? "bg-gray-100 border-gray-200 opacity-50"
                  : selectedSlot === slot.time
                  ? "bg-primary-500 border-primary-500"
                  : "bg-white border-gray-300"
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-medium ${
                  !slot.available
                    ? "text-gray-400 line-through"
                    : selectedSlot === slot.time
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mb-8 ${
            confirmed ? "bg-green-500" : "bg-primary-500"
          } ${!selectedSlot && !confirmed ? "opacity-60" : ""}`}
          onPress={handleConfirm}
          disabled={confirmed || !selectedSlot}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={confirmed ? "checkmark-circle" : "lock-closed"}
              size={20}
              color="white"
            />
            <Text className="text-white text-lg font-semibold">
              {confirmed ? "Reserva Confirmada" : "Confirmar Reserva"}
            </Text>
          </View>
          {!confirmed && (
            <Text className="text-white/70 text-xs mt-1">
              Envia comando 'ocupar' via MQTT
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { rooms, Room } from "@/data/mockData";

const iconMap: Record<Room["icon"], keyof typeof Ionicons.glyphMap> = {
  users: "people",
  presentation: "easel",
  video: "videocam",
  briefcase: "briefcase",
};

const iconColors: Record<Room["icon"], string> = {
  users: "#0ea5e9",
  presentation: "#8b5cf6",
  video: "#f59e0b",
  briefcase: "#22c55e",
};

export default function SalasScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = rooms.filter((r: Room) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">
              Olá, Estudante
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Salas disponíveis para reserva
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center">
              <Ionicons name="person" size={20} color="#0ea5e9" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3">
          <Ionicons name="search" size={18} color="#9ca3af" />
          <TextInput
            className="flex-1 py-3 px-2 text-base text-gray-900"
            placeholder="Buscar sala..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Dropdown Menu - rendered outside ScrollView so it appears on top */}
      {menuOpen && (
        <View
          className="absolute top-24 right-5 bg-white rounded-xl border border-gray-200 py-2 w-48"
          style={{ elevation: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }}
        >
          <TouchableOpacity
            className="px-4 py-3 flex-row items-center gap-3"
            onPress={() => {
              setMenuOpen(false);
              router.push("/reservas");
            }}
          >
            <Ionicons name="calendar" size={18} color="#6b7280" />
            <Text className="text-gray-700 text-sm">
              Gerenciar reservas
            </Text>
          </TouchableOpacity>
          <View className="h-px bg-gray-100" />
          <TouchableOpacity
            className="px-4 py-3 flex-row items-center gap-3"
            onPress={() => {
              setMenuOpen(false);
              router.push("/");
            }}
          >
            <Ionicons name="log-out" size={18} color="#ef4444" />
            <Text className="text-red-500 text-sm">Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Room List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-sm font-medium text-gray-500 mb-3">
          {filtered.length} salas encontradas
        </Text>

        {filtered.map((room: Room) => (
          <TouchableOpacity
            key={room.id}
            className="bg-white border border-gray-200 rounded-2xl p-4 mb-3 flex-row items-center active:bg-gray-50"
            onPress={() => router.push(`/reservar/${room.id}`)}
            activeOpacity={0.7}
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: iconColors[room.icon] + "20" }}
            >
              <Ionicons
                name={iconMap[room.icon]}
                size={22}
                color={iconColors[room.icon]}
              />
            </View>
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-gray-900">
                {room.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {room.capacity} pessoas · {room.floor}
              </Text>
            </View>
            <View className="items-end">
              {room.available ? (
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 text-xs font-medium">
                    Disponível
                  </Text>
                </View>
              ) : (
                <View className="bg-amber-100 px-3 py-1 rounded-full">
                  <Text className="text-amber-700 text-xs font-medium">
                    Livre em {room.hoursUntilFree}h
                  </Text>
                </View>
              )}
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#d1d5db"
                style={{ marginTop: 8 }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
